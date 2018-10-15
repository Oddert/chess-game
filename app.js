const express       = require('express')
    , app           = express()
    , bodyParser    = require('body-parser')
    , cookieParser  = require('cookie-parser')
    , path          = require('path')
    , mongoose      = require('mongoose')
    , socketio      = require('socket.io')

    , passport      = require('passport')
    , LocalStrategy = require('passport-local')

const Game          = require('./models/Game')
    , User          = require('./models/User')

const convertPoints = require('./utils/convertPoints')
    , toPGN         = require('./utils/toPGN')

require('dotenv').config()

mongoose.connect(process.env.DATABASE)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(express.static(path.join(__dirname + '/client/build')))

app.use(require('express-session')({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: false
  }
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

const PORT = process.env.PORT || 5000
var server = app.listen(
  PORT,
  () => console.log(
    `${new Date().toLocaleTimeString('en-GB')}: Server initialised on PORT: ${PORT}...`
  )
)


const io = socketio(server)

io.on(`connection`, socket => {
  console.log(`User ${socket.client.id} has connected.`)

  socket.on(`join-game`, payload => {
    console.log(`User ${socket.client.id} joining room: ${payload}`)
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
      const clientTeam = payload.team === 0 ? 'black' : 'white'
      const targetCellType = foundGame.board[payload.to.row][payload.to.col].type

      if (payload.takePiece) {
        foundGame[clientTeam].score += convertPoints(targetCellType)
        foundGame[clientTeam].takenPieces.push(targetCellType)
      }

      if (payload.team === 0) {
        foundGame.moves[foundGame.moves.length-1].b = toPGN(payload.piece, payload.from.row, payload.from.col, payload.piece, payload.to.row, payload.to.col, payload.takePiece)
      } else {
        console.log({ w : toPGN(payload.piece, payload.from.row, payload.from.col, payload.piece, payload.to.row, payload.to.col, payload.takePiece) })
        foundGame.moves.push({ w : toPGN(payload.piece, payload.from.row, payload.from.col, payload.piece, payload.to.row, payload.to.col, payload.takePiece) })
        console.log(foundGame.moves)
      }

      foundGame.board[payload.from.row][payload.from.col] = { type: "empty", team: null }
      foundGame.board[payload.to.row][payload.to.col] = { type: payload.piece, team: Number(payload.team) }
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

  socket.on(`disconnect`, () => console.log(`User ${socket.client.id} disconnecting`))

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
