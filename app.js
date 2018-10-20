const express           = require('express')
    , app               = express()
    , bodyParser        = require('body-parser')
    , cookieParser      = require('cookie-parser')
    , path              = require('path')
    , mongoose          = require('mongoose')
    , socketio          = require('socket.io')

    , passport          = require('passport')
    , LocalStrategy     = require('passport-local')
    , passportSocketIo  = require('passport.socketio')

    , session           = require('express-session')
    , sessionStore      = new session.MemoryStore()
    , MongoStore        = require('connect-mongo')(session)

const Game              = require('./models/Game')
    , User              = require('./models/User')

const convertPoints     = require('./utils/convertPoints')
    , toPGN             = require('./utils/toPGN')

require('dotenv').config()

app.use(require('cors')())

mongoose.connect(process.env.DATABASE)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(express.static(path.join(__dirname + '/client/build')))

// console.log('###############################')
// console.log(mongoose.connection.client.s.url)
const testSessionStore = new MongoStore({ url: mongoose.connection.client.s.url })

const http = require('http').Server(app)



const io = socketio(http)

const onAuthorizeSuccess = (data, accept) => {
  console.log('!!!!!! app.js onAuthorizeSuccess:')
  console.log('Successful connection to socket io')
  accept(null, true)
}

const onAuthorizeFail = (data, message, error, accept) => {
  console.log('app.js onAuthorizeFail:')
  if (error)
    throw new Error(message)
  console.log('Failed to connect. Reason: ', message)
  // console.log(data)
  // console.log(data.headers.cookie)
  console.log(error)
  accept(null, false)
}

io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  key:          'connect.sid',
  secret:       process.env.SECRET,
  store:        testSessionStore,
  success:      onAuthorizeSuccess,
  fail:         onAuthorizeFail
}));


app.use(session({
  secret:             process.env.SECRET,
  resave:             true,
  saveUninitialized:  true,
  key:                'connect.sid',
  store:              testSessionStore,
  cookie: {
    secure:   false,
    httpOnly: false
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

  console.log(socket.handshake.xdomain ? 'Cross origin connection' : 'Same origin connection')
  console.log(socket.handshake.headers.cookie)
  console.log('===========================')

  socket.on(`join-game`, payload => {
    console.log(`User ${socket.client.id} joining room: ${payload}`)
    console.log('socket.handshake.user:', socket.handshake.user)
    console.log('socket.request.user:', socket.request.user)
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
        else console.log(`Game saved ok!`)
        socket.emit(`move-piece`, payload)
        socket.broadcast.to(socket.room).emit(`move-piece`, payload)
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

  socket.on(`disconnect`, () => {
    socket.leave(socket.room)
    console.log(`User ${socket.client.id} disconnecting`)
  })

})




// const seed = require('./utils/seed')

app.use('/api/auth/', require('./routes/auth'))

app.route('/api/games/public')
  .get((req, res) => {
    console.log(req.headers['x-forwarded-for'].split(',')[0])
    Game.find({}, (err, games) => {
      if (err) console.log(err)
      else res.status(200).json({ games })
    })
  })


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'))
})
