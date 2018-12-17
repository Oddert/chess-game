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
      const fromPiece = payload.piece
      const toPiece = fromPiece

      const clientTeam = payload.team === 0 ? 'black' : 'white'

      const thisPGN = toPGN(fromPiece, fromRow, fromCol, toPiece, toRow, toCol, payload.takePiece)


      if (payload.takePiece) {
        const targetCellType = foundGame.board[toRow][toCol].type
        foundGame[clientTeam].score += convertPoints(targetCellType)
        foundGame[clientTeam].takenPieces.push(targetCellType)
      }

      if (payload.team === 0) {
        foundGame.moves[foundGame.moves.length-1].b = thisPGN
      } else {
        console.log({ w : thisPGN })
        foundGame.moves.push({ w : thisPGN })
        console.log(foundGame.moves)
      }

      foundGame.board[fromRow][fromCol] = { type: "empty", team: null }
      foundGame.board[toRow][toCol] = { type: toPiece, team: Number(payload.team) }
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
      // console.log('### DEV: swapping out real functionality for dummy to deliberately crash')
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
          target: payload.openRequest ? null : { username: payload.targetUser.username, id: payload.targetUser._id },
          target_self_assigned: payload.openRequest ? null : false
        }
        console.log('USer found, creating request:')
        console.log({ newRequest })
        return Request.create(newRequest)
      })
      .then(request => {
        console.log('...request created...', { request })
        return User.findByIdAndUpdate(socket.request.user._id, { $push: { outboundRequests: request._id } })
        .then(user => request)
      })
      .then(request => {
        if (!payload.openRequest) {
          console.log('# is not an open request')
          return User.findByIdAndUpdate(payload.targetUser._id, { $push: { inboundRequests: request._id } })
          .then(target => {
            console.log('...target user found and updated with request')
            socket.broadcast.to(target._id).emit('inbound-request', request)
            socket.broadcast.to(target._id).emit('dev', request)
            console.log(`...pushed to inbound req on ${target.username}`)
            return User.findById(request.author.id)
          })
        } else {
          return User.findById(request.author.id)
        }
      })
      .then(author => {
        console.log(`...SAVED: pushed to outbound req on ${author.username}`)
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
    console.log('NEW ROUTE, User wants to accept a request:')
    console.log('User: ', socket.request.user)
    console.log({ payload })
    if (!socket.request.isAuthenticated()) {
      socket.emit('accept-request', { err: { message: 'You are not signed in, please log in again' } })
    } else {
      console.log('User is authenticated, begining')
      const defaultGame = request => ({
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

      const notificationBody = request => ({
        name: 'Request Accepted',
        message: `${socket.request.user.username} accepted your request for a game, click to play against them!`,
        notification_type: 'accept-request',
        user: {
          username: request.author.username,
          id: request.author.id
        },
        other_users: [{
          username: socket.request.user.username,
          id: socket.request.user._id
        }],
        game: request.game,
        request: request._id
      })

      // Find the request to use IDs in game creation
      Request.findById(payload)
      .then(request => {
        // Duplicate routes. If there is a target on the request then this person was targeted
        // by the author, otherwise we simply override the 'target' with self if its an open request
        // this means we dont need two values, for example "target" vs "actual_recipient"
        if (request.target.id) {
          return Request.findByIdAndUpdate(request._id, { target_self_assigned: false })
          .then(request => {
            return Game.create(defaultGame(request)) // Create the new Game after updating the self assigned variable
          })
        } else {
          return Request.findByIdAndUpdate(request._id, { target_self_assigned: true })
          .then(request => {
            return Game.create(defaultGame(request)) // Create the new Game after updating the self assigned variable
          })
        }
      })
      .then(game => {
        console.log('[437]...game created', { game })
        // Update the request to say 'complete', update the target user to latest credentials
        const requestUpdate = {
          game: game._id,
          accepted: true,
          accepted_date: Date.now(),
          target: {
            id: socket.request.user._id,
            username: socket.request.user.username
          }
        }
        console.log({ requestUpdate })
        return Request.findByIdAndUpdate(payload, requestUpdate)
        .then(request => {
          console.log('[447]...request updated, updating author', { request })
          console.log(request.game, game._id)
          // Update the Author (user who created the request) to have the new game
          return User.findByIdAndUpdate(request.author.id, { $push: { activeGames: game._id } })
          .then(author => {
            console.log(`[452]Author updated, returning request (2nd level)`, { author, request })
            return request._id
          })
        })
      })
      // This is to circumvent a bug with mongoose where returning does not include the updated doc
      .then(requestId => Request.findById(requestId))
      .then(request => {
        console.log('[459]Now going to update the recipient: ', request.target)
        // console.log('[460] Request.game: ', request.game)
        // console.log('[462]', !!request.target, !!request.target.id, !!(!!request.target && !!request.target.id))
        if (request.target && request.target.id) {
          console.log('[464]...target found')
          // Update the Recipient (user accepting the request) to have the new game
          return User.findByIdAndUpdate(request.target.id, { $push: { activeGames: request.game } })
          .then(recipient => {
            console.log(`[467]Recipient updated, returning game (2nd level)`, { recipient })
            return request._id
          })
        } else {
          // This is a failsafe, should not actually reach
          console.log('[471]...no target')
          return request._id
        }
      })
      .then(requestId => Request.findById(requestId))
      .then(request => {
        let newNotification = notificationBody(request)
        console.log('[477] here is request.game: ', request.game)
        console.log('[478]Going to create a notification from this: ', { newNotification })
        return Game.findById(request.game)
        .then(game => {
          // Create the notification
          newNotification.game = game._id
          return Notification.create(newNotification)
        })
      })
      .then(notification => {
        console.log('[486]...notification created', { notification })
        // Using the request we find the Author
        return Request.findById(notification.request)
        .then(request => {
          console.log('[489](2nd) level, found request, adding to author')
          return User.findByIdAndUpdate(request.author.id, { $push: { notifications: notification._id } })
        })
        .then(author => {
          console.log(`[493] Author ${author.username} updated with notification`)
          // Once author is found, emit a notification
          socket.broadcast.to(author._id).emit('notification', notification)
          return Game.findById(notification.game)
          .then(game => {
            // All complete, fire the callback socket event (+ dev event)
            socket.emit('accept-request', {
              success: true,
              game
            })
            socket.broadcast.to(author._id).emit('dev', {
              dev_type: 'accept-request',
              success: true,
              game
            })
            return author
          })
        })
      })
      .then(author => {
        // Strictly uneccessary, for degub purposes
        console.log('FINISHING')
      })
      .catch(err => testSocketError(err, socket, 'accept-request', err.message))
    }
  })


  socket.on('decline-request', payload => {

    const samplePyaload = {
      id: '3979hgfe8h892yr9',
      message: 'Sory but im bissy the now'
    }

    const notificationBody = request => ({
      name: 'Request Declined',
      message: `${socket.request.user.username} politely declined your request for a game.`,
      notification_type: 'decline-request',
      user: {
        username: request.author.username,
        id: request.author.id
      },
      other_users: [{
        username: socket.request.user.username,
        id: socket.request.user._id
      }],
      request: request._id
    })

    Request.findById(payload.id)
    .then(request => {
      if (!(request.target && request.target.id)) {
        socket.emit('decline-request', { err: 'This is an open request, you may not decline it' })
      } else if (!request.target.id.equals(socket.request.user._id)) {
        socket.emit('decline-request', { err: 'You are not the intended target of this request' })
      } else {
        return Request.findByIdAndUpdate(payload.id, {
          declined: true,
          declined_date: Date.now()
        })
      }
    })
    .then(request => {
      return Notification.create(notificationBody(request))
    })
    .then(notification => {
      return User.findByIdAndUpdate(notification.user.id, { $push: { notifications: notification } })
      .then(author => {
        socket.broadcast.to(author._id).emit('notification', notification)
        return notification
      })
    })
    .then(notification => {
      console.log('FINISHING', { notification })
    })
    .catch(err => testSocketError(err, socket, 'decline-request', err.message))
  })








  socket.on('mongoose', payload => {
    console.log({ payload })
    console.log('### SIMULATION ### User wants to accept a request:')
    const dummyId = '5bc125e803a3f4388c11224b'
    console.log(`Dummy Id for oddert: ${dummyId}`)

    User.findById(payload.id)
    .then(user => {
      return Game.findById(user.activeGames[0])
    })
    .then(game => {
      console.log(`The users fist game is called: ${game.name}`)
      return User.findByIdAndUpdate(dummyId, {})
      .then(user => {
        console.log('Second user find function, going to try returning twice:')
        return game
      })
    })
    .then(whatIsThis => {
      console.log({ whatIsThis })
      return User.findByIdAndUpdate(dummyId, {})
      .then(user => {
        console.log('THIRD user lookup, pretend this is a diffirent one...')
        return whatIsThis
      })
      // socket.emit('mongoose', `found game: ${game.name}`)
    })
    .then(onceMore => console.log({ onceMore }))
    .catch(err => {
      console.log({ err })
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
app.use('/api/games/', require('./routes/games'))
app.use('/api/users/', require('./routes/users'))
app.use('/api/requests/', require('./routes/requests'))
app.use('/api/notifications/', require('./routes/notifications'))


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'))
})

// $ git reset --hard HEAD
