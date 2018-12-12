const express             = require('express')
    , app                 = express()
    , bodyParser          = require('body-parser')
    , cookieParser        = require('cookie-parser')
    , path                = require('path')
    , mongoose            = require('mongoose')
    , socketio            = require('socket.io')
    , http                = require('http').Server(app)

    , passport            = require('passport')
    , LocalStrategy       = require('passport-local')
    , passportSocketIo    = require('passport.socketio')

    , session             = require('express-session')
    // , sessionStore      = new session.MemoryStore()
    , MongoStore          = require('connect-mongo')(session)

const Game                = require('./models/Game')
    , User                = require('./models/User')
    , Request             = require('./models/Request')
    , Notification        = require('./models/Notification')

const convertPoints       = require('./utils/convertPoints')
    , toPGN               = require('./utils/toPGN')
    , createDefaultBoard  = require('./utils/createDefaultBoard')

require('dotenv').config()

app.use(require('cors')())

mongoose.connect(process.env.DATABASE)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(express.static(path.join(__dirname, '/client/build')))


const sessionStore = new MongoStore({ url: mongoose.connection.client.s.url })


const io = socketio(http)

const onAuthorizeSuccess = (data, accept) => {
  console.log('!!!!!! app.js onAuthorizeSuccess:')
  // console.log('Successful connection to socket io')
  accept(null, true)
}

const onAuthorizeFail = (data, message, error, accept) => {
  console.log('app.js onAuthorizeFail:')
  if (error) {
    console.log('Error onAuthorizeFail:')
    console.log({ error, message })
  }
  // console.log('Failed to connect. Reason: ', message)
  // console.log(error)
  accept(null, true)
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


function testSocketError (err, socket, event, message, room) {
  console.log('Test socket err')
  console.log(err)
  socket.emit(event, {
    err,
    message: message ? message : null
  })
  if (room) socket.broadcast.to(room).emit(event, {
    err,
    message: message ? message : null
  })
  console.log('end test error handler, how\'d it do?')
}


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
  console.log('===========================')
  console.log(`Testing for socket.request: `, !!socket.request)

  // This might break things; there was an issue with non auth users not being able to interact with socekts
  // even once accept(null, false) was changed to accpet(null, true) in onAuthorizeFail
  if (socket.request && socket.request.isAuthenticated()) socket.join(socket.request.user._id)
  // if (socket.request.isAuthenticated()) socket.join(socket.request.user._id)

  socket.on('tester', payload => {
    console.log(`=== Test connection from user: ${payload}`)
    console.log('sending res')
    socket.emit('tester', payload)
    console.log('...sent')
  })

  socket.on(`join-game`, payload => {
    console.log(`User ${socket.client.id} joining room: ${payload}`)
    // console.log('socket.handshake.user:', socket.handshake.user)
    // console.log('socket.request.user:', socket.request.user)
    // console.log('socket.request.isAuthenticated():', socket.request.isAuthenticated())
    if (socket.room) socket.leave(socket.room)
    socket.join(payload)
    socket.room = payload
    socket.emit(`join-game-confirm`, true)
  })

  socket.on(`move-piece`, payload => {
    Game.findById(socket.room)
    .exec()
    .then(foundGame => {
      console.log(`foundGame: `, !!foundGame)

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

      console.log({ foundGame })

      foundGame.save()
      .then(game => {
        console.log(`Game saved ok!`)
        socket.emit(`move-piece`, payload)
        socket.broadcast.to(socket.room).emit(`move-piece`, payload)
      })
      .catch(err => testSocketError(err, socket, 'move-piece', err.message, socket.room))

    })
    .catch(err => testSocketError(err, socket, 'move-piece', err.message))
  })

  socket.on('change-meta', payload => {
    console.log(socket.room)
    console.log(payload)
    Game.findOneAndUpdate({ _id: socket.room }, payload)
    .then(game => socket.broadcast.to(socket.room).emit('change-meta', payload))
    .catch(err => testSocketError(err, socket, 'change-meta', err.message, socket.room))
  })

  socket.on('chat-message', payload => {
    console.log('New chat message')
    console.log(payload)
    Game.findById(socket.room)
    .then(foundGame => {
      console.log('Game lookup ok')
      console.log({ foundGame })
      foundGame.chat = [...foundGame.chat, payload]
      foundGame.save()
      .then(game => {
        console.log('game save ok')
        socket.broadcast.to(socket.room).emit('chat-message', payload)
        socket.emit('chat-message', payload)
      })
      .catch(err => testSocketError(err, socket, 'chat-message', err.message, socket.room))
    })
    .catch(err => testSocketError(err, socket, 'chat-message', err.message))
  })

  socket.on('new-request', payload => {
    console.log('Request to create a new game offer:')
    console.log(socket.request.user.username)
    console.log(payload)
    console.log('this is the hurdle to pass:')
    if (payload.targetUser) socket.broadcast.to(payload.targetUser._id).emit('dev', payload)
    console.log('success(ish)')

    if (socket.request.user._id) {
      console.log('user is auth (definately, not making that up, I promis)')
      console.log('### DEV: swapping out real functionality for dummy to deliberately crash')
      User.findById(socket.request.user._id)
      .then(author => {
        console.log(author)
        let newRequest = {
          message: payload.message,
          author: {
            username: author.username,
            id: author._id
          },
          open: payload.openRequest,
          target: payload.openRequest ? null : { username: payload.targetUser.username, id: payload.targetUser._id }
        }
        console.log('USer found, creating request:')
        console.log({ newRequest })
        return Request.create(newRequest)
      })
      .then(request => {
        console.log('...request created...', { request })
        return User.findByIdAndUpdate(socket.request.user._id, { $push: { outboundRequests: request._id } })
      })
      .then(author => {
        console.log(`...SAVED: pushed to outbound req on ${author.username}`)

        if (!payload.openRequest) {
          console.log('# is not an open request')
          User.findById(payload.targetUser._id)//, { $push: { inboundRequests: request._id } }) // ?????????? request obj where?
          .then(target => {
            console.log('...target user found')
            target.inboundRequests.push(request._id)
            target.save()
            .then(() => {
              console.log('pushed to target user inbound')
              socket.broadcast.to(target._id).emit('inbound-request', request)
              socket.broadcast.to(target._id).emit('dev', request)
              console.log(`...pushed to inbound req on ${target.username}`)
            }).catch(err => testSocketError(err, socket, 'new-request', err.message, target._id))
          }).catch(err => testSocketError(err, socket, 'new-request', err.message, target._id))
        }

        console.log('Request made successfully!')
        return socket.emit('new-request', {
          err: null,
          message: 'Request created successfully!'
        })
      })
      .catch(err => testSocketError(err, socket, 'new-request', err.message))

    } else {
      console.log('User not authenticated:')
      console.log(socket.request.isAuthenticated())
      console.log(socket.request.user)
    }

  })

  socket.on('edit-request', payload => {
    Request.findByIdAndUpdate(payload.id, payload.data)
    .then(request => socket.emit('edit-request', payload))
    .catch(err => testSocketError(err, socket, 'edit-request', err.message))
  })

  socket.on('delete-request', payload => {
    Request.findByIdAndUpdate(payload, {
      deleted: true,
      deleted_on: Date.now(),
      deleted_by: socket.request.isAuthenticated() ? socket.request.user._id : undefined
    })
    .then(() => socket.emit('delete-request', { err: null, id: payload }))
    .catch(err => socket.emit('delete-request', { err }))
  })

  socket.on('accept-request', payload => {
    console.log('User wants to accept a request:')
    console.log(socket.request.user)
    console.log(payload)
    if (!socket.request.isAuthenticated()) {
      socket.emit('accept-request', { err: 'You are not singed in, please log in again.' })
    } else {
      Request.findById(payload)
      .then(request => {
        console.log('# Found Request')
        User.findById(socket.request.user._id)
        .then(recipient => {
          console.log('# Found Recipient')
          User.findById(request.author.id)
          .then(author => {
            console.log('# Found Author')
            Game.create({
              request: request._id,
              board: createDefaultBoard(),
              white: {
                id: request.author.id,
                username: request.author.username,
                score: 0
              },
              black: {
                id: socket.request.user._id,
                username: socket.request.user.username,
                score: 0
              }
            })
            .then(game => {
              console.log('Game Created!')

              author.activeGames.push(game._id)
              recipient.activeGames.push(game._id)
              request.game = game._id
              request.accepted = true
              request.accepted_date = Date.now()

              author.save()
              recipient.save()
              request.save()
              .then(saved_request => {
                console.log('# request saved, creating notification...')
                Notification.create({
                  name: 'Request Accepted',
                  message: `${recipient.username} accepted your request for a game, click to play against them!`,
                  notification_type: 'accept-request',
                  user: {
                    username: author.username,
                    id: author._id
                  },
                  other_users: [{
                    username: recipient.username,
                    id: recipient._id
                  }],
                  game: game._id,
                  request: request._id
                })
                .then(notification => {
                  console.log({ notification })
                  console.log('saving to author')
                  author.notifications.push(notification._id)
                  author.save()
                  .then(err => {
                    console.log(`broadcasting to author id: ${author._id}`)
                    socket.broadcast.to(author._id).emit('notification', notification)
                  }).catch(err => testSocketError(err, socket, 'accept-request', err.message))
                }).catch(err => testSocketError(err, socket, 'accept-request', err.message))
                socket.emit('accept-request', {
                  success: true,
                  game
                })
                socket.broadcast.to(author._id).emit('dev', {
                  dev_type: 'accept-request',
                  success: true,
                  game
                })
              }).catch(err => testSocketError(err, socket, 'accept-request', err.message))
            }).catch(err => testSocketError(err, socket, 'accept-request', err.message))
          }).catch(err => testSocketError(err, socket, 'accept-request', err.message))
        }).catch(err => testSocketError(err, socket, 'accept-request', err.message))
      }).catch(err => testSocketError(err, socket, 'accept-request', err.message))
    }

  })

  socket.on(`disconnect`, () => {
    socket.leave(socket.room)
    socket.leave(socket.request.user._id)
    console.log(`User ${socket.client.id} disconnecting`)
  })

})




// const seed = require('./utils/seed')

app.use('/api/auth/', require('./routes/auth'))
app.use('/api/games/', require('./routes/games'))
app.use('/api/users/', require('./routes/users'))
app.use('/api/requests/', require('./routes/requests'))
app.use('/api/notifications/', require('./routes/notifications'))


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'))
})

// $ git reset --hard HEAD
