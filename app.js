const express       = require('express')
    , app           = express()
    , bodyParser    = require('body-parser')
    , cookieParser  = require('cookie-parser')
    , path          = require('path')
    , mongoose      = require('mongoose')
    , socketio      = require('socket.io')

const Game          = require('./models/Game')

require('dotenv').config()

mongoose.connect(process.env.DATABASE)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(express.static(path.join(__dirname + '/client/build')))

const PORT = process.env.PORT || 5000
var server = app.listen(
  PORT,
  () => console.log(
    `${new Date().toLocaleTimeString('en-GB')}: Server initialised on PORT: ${PORT}...`
  )
)

// ===============================================
const convertPoints = str => {
  switch(str) {
    case 'pawn':
      return 1;
    case 'knight':
      return 3;
    case 'bishop':
      return 3;
    case 'rook':
      return 5;
    case 'queen':
      return 9;
    default:
      console.log('Check please, switch game reducer ln: 4')
      console.log(str)
      return 1;
  }
}
// ===============================================

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
    console.log(`take piece recieved`)
    // console.log(payload)
    // console.log('================================================')
    Game.findById(socket.room)
    .exec((err, foundGame) => {
      if (err) console.log(err)

      const clientTeam = payload.team === 0 ? 'black' : 'white'
      const targetCell = foundGame.board[payload.to.row][payload.to.col]

      if (payload.takePiece) {
        foundGame[clientTeam].score += convertPoints(targetCell.type)
        foundGame[clientTeam].takenPieces.push(targetCell.type)
      }

      foundGame.board[payload.from.row][payload.from.col] = { type: "empty", team: null }
      foundGame.board[payload.to.row][payload.to.col] = { type: payload.piece, team: Number(payload.team) }
      foundGame.markModified('board')
      foundGame.lastMove = payload.team

      foundGame.save((err, game) => {
        console.log(err)
        console.log(game)
        if (err) console.log(err)
        else console.log(`Game saved ok!`)
        socket.emit(`move-piece`, payload)
        socket.broadcast.to(socket.room).emit(`move-piece`, payload)
      })
    })
  })

  socket.on(`disconnect`, () => console.log(`User ${socket.client.id} disconnecting`))

})

// const seed = require('./seed')

app.route('/api/games/public')
  .get((req, res) => {
    console.log(req.headers['x-forwarded-for'].split(',')[0])
    Game.find({}, (err, games) => {
      if (err) console.log(err)
      else res.status(200).json({ games })
    })
  })

// =================================
var jsontest = {}

app.get('/api/testLog', (req, res) => {
  res.json(jsontest)
})

app.post('/api/testLog', (req, res) => {
  console.log(req.body)
  jsontest = req.body
  res.json({ message: `data res ok` })
})
// =================================

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'))
})
