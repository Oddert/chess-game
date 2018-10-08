const express       = require('express')
    , app           = express()
    , bodyParser    = require('body-parser')
    , cookieParser  = require('cookie-parser')
    , path          = require('path')
    , mongoose      = require('mongoose')

const Game          = require('./models/Game')

require('dotenv').config()

mongoose.connect(process.env.DATABASE)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(express.static(path.join(__dirname + '/client/build')))

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

const PORT = process.env.PORT || 5000
var server = app.listen(
  PORT,
  () => console.log(
    `${new Date().toLocaleTimeString('en-GB')}: Server initialised on PORT: ${PORT}...`
  )
)
