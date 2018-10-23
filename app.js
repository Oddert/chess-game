const express           = require('express')
    , app               = express()
    , bodyParser        = require('body-parser')
    , cookieParser      = require('cookie-parser')
    , path              = require('path')
    , mongoose          = require('mongoose')
    , socketio          = require('socket.io')
    , http              = require('http').Server(app)

    , passport          = require('passport')
    , LocalStrategy     = require('passport-local')
    , passportSocketIo  = require('passport.socketio')

    , session           = require('express-session')
    // , sessionStore      = new session.MemoryStore()
    , MongoStore        = require('connect-mongo')(session)

const Game              = require('./models/Game')
    , User              = require('./models/User')
    , Request           = require('./models/Request')

const convertPoints     = require('./utils/convertPoints')
    , toPGN             = require('./utils/toPGN')

require('dotenv').config()

app.use(require('cors')())

mongoose.connect(process.env.DATABASE)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(express.static(path.join(__dirname + '/client/build')))


const sessionStore = new MongoStore({ url: mongoose.connection.client.s.url })


const io = socketio(http)

const onAuthorizeSuccess = (data, accept) => {
  console.log('!!!!!! app.js onAuthorizeSuccess:')
  // console.log('Successful connection to socket io')
  accept(null, true)
}

const onAuthorizeFail = (data, message, error, accept) => {
  console.log('app.js onAuthorizeFail:')
  if (error)
    throw new Error(message)
  console.log('Failed to connect. Reason: ', message)
  console.log(error)
  accept(null, false)
}

io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  key:          'connect.sid',
  secret:       process.env.SECRET,
  store:        sessionStore,
  success:      onAuthorizeSuccess,
  fail:         onAuthorizeFail
}));


app.use(session({
  secret:             process.env.SECRET,
  resave:             true,
  saveUninitialized:  true,
  key:                'connect.sid',
  store:              sessionStore,
  cookie: {
    secure:   false,
    httpOnly: false,
    maxAge: 1000 * 60 * 60 * 3
  }
}))


app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


const PORT = process.env.PORT || 5000
var server = http.listen(
  PORT,
  () => console.log(
    `${new Date().toLocaleTimeString('en-GB')}: Server initialised on PORT: ${PORT}...`
  )
)


io.on(`connection`, socket => {
  console.log(`${new Date().toLocaleTimeString('en-GB')}: User ${socket.client.id} has connected.`)

  // console.log(socket.handshake.xdomain ? 'Cross origin connection' : 'Same origin connection')
  // console.log(socket.handshake.headers.cookie)

  // console.log(socket.request.user)
  console.log('===========================')


  socket.join(socket.request.user._id)

  socket.on(`join-game`, payload => {
    console.log(`User ${socket.client.id} joining room: ${payload}`)
    console.log('socket.handshake.user:', socket.handshake.user)
    console.log('socket.request.user:', socket.request.user)
    console.log('socket.request.isAuthenticated():', socket.request.isAuthenticated())
    if (socket.room) socket.leave(socket.room)
    socket.join(payload)
    socket.room = payload
    socket.emit(`join-game-confirm`, true)
  })

  socket.on(`move-piece`, payload => {
    Game.findById(socket.room)
    .exec((err, foundGame) => {
      if (err) console.log(err)
      else console.log(`foundGame: `, !!foundGame)

      const fromRow = payload.from.row
      const fromCol = payload.from.col
      const toRow = payload.to.row
      const toCol = payload.to.col

      const clientTeam = payload.team === 0 ? 'black' : 'white'
      const targetCellType = foundGame.board[toRow][toCol].type


      if (payload.takePiece) {
        foundGame[clientTeam].score += convertPoints(targetCellType)
        foundGame[clientTeam].takenPieces.push(targetCellType)
      }

      if (payload.team === 0) {
        foundGame.moves[foundGame.moves.length-1].b = toPGN(payload.piece, fromRow, fromCol, payload.piece, toRow, toCol, payload.takePiece)
      } else {
        console.log({ w : toPGN(payload.piece, fromRow, fromCol, payload.piece, toRow, toCol, payload.takePiece) })
        foundGame.moves.push({ w : toPGN(payload.piece, fromRow, fromCol, payload.piece, toRow, toCol, payload.takePiece) })
        console.log(foundGame.moves)
      }

      foundGame.board[fromRow][fromCol] = { type: "empty", team: null }
      foundGame.board[toRow][toCol] = { type: payload.piece, team: Number(payload.team) }
      foundGame.markModified('board')
      // foundGame.markModified('moves')
      foundGame.lastMove = payload.team === 0 ? 1 : 0

      console.log(foundGame)

      foundGame.save((err, game) => {
        if (err) console.log(err)
        else {
          console.log(`Game saved ok!`)
          socket.emit(`move-piece`, payload)
          socket.broadcast.to(socket.room).emit(`move-piece`, payload)
        }
      })
    })
  })

  socket.on('change-meta', payload => {
    console.log(socket.room)
    console.log(payload)
    Game.findOneAndUpdate({_id: socket.room}, payload, (err, game) => {
      if (err) console.log(err)
      else socket.broadcast.to(socket.room).emit('change-meta', payload)
    })
  })

  socket.on('chat-message', payload => {
    console.log('New chat message')
    console.log(payload)
    Game.findById(socket.room, (err, foundGame) => {
      if (err) console.log(err)
      else {
        console.log('Game lookup ok')
        foundGame.chat = [...foundGame.chat, payload]
        foundGame.save((err, game) => {
          if (err) console.log(err)
          else {
            console.log('game save ok')
            socket.broadcast.to(socket.room).emit('chat-message', payload)
            socket.emit('chat-message', payload)
          }
        })
      }
    })
  })

  socket.on('new-request', payload => {
    console.log('Request to create a new game offer:')
    console.log(socket.request.user.username)
    console.log(payload)
    if (payload.targetUser) socket.broadcast.to(payload.targetUser).emit('dev', payload)
    User.findById(socket.request.user._id, (err, user) => {
      if (err) console.log(err)
      else {
        let newRequest = {
          message: payload.message,
          author: {
            username: user.username,
            id: user._id
          },
          open: payload.openRequest,
          target: payload.openRequest ? null : payload.targetUser
        }
        console.log(newRequest)
        Request.create(newRequest, (err, request) => {
          if (err) console.log(err)
          else console.log('Request made successfully!')
        })
      }
    })
  })

  socket.on(`disconnect`, () => {
    socket.leave(socket.room)
    socket.leave(socket.request.user._id)
    console.log(`User ${socket.client.id} disconnecting`)
  })

})




// const seed = require('./utils/seed')

app.use('/api/auth/', require('./routes/auth'))

app.get('/api/games/public', (req, res) => {
    // console.log(req.headers['x-forwarded-for'].split(',')[0])
    Game.find({}, (err, games) => {
      if (err) console.log(err)
      else res.status(200).json({ games })
    })
  })

app.get('/api/users/public', (req, res) => {
    User.find({}, (err, users) => {
      if (err) console.log(err)
      else res.status(200).json({ users })
    })
  })

app.get('/api/users/friends', (req, res) => {
  // PLACEHOLDER for friends adding functionality
    User.find({}, (err, users) => {
      if (err) console.log(err)
      else res.status(200).json({ users: users.sort((a, b) => a.username < b.username ? 1 : -1) })
    })
  })

app.post('/api/requests', (req, res) => {
  console.log(req.body)
  res.json({ server: 'res ok' })
})

app.route('/api/requests/public')
  .get((req, res) => {
    Request.find({ open: true, accepted: false }, (err, requests) => {
      if (err) console.log(err)
      else {
        console.log('public', requests)
        res.json({ requests })
      }
    })
  })

app.get('/api/requests/inbound', (req, res) => {
    Request.find({}, (err, requests) => {
      if (err) console.log(err)
      else {
        console.log('inbound', requests)
        res.status(200).json({ requests: [] })
      }
    })
  })

app.get('/api/requests/outbound', (req, res) => {
    Request.find({}, (err, requests) => {
      if (err) console.log(err)
      else {
        console.log('outbound', requests)
        res.status(200).json({ requests: [] })
      }
    })
  })

app.post('/api/requests/accept', (req, res) => {
  console.log('# USer wants to accept request!')
  // Set old req to accepted true;
  // Create new game instance;
  //
  res.json({ message: 'Server res to accept request OK' })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'))
})
