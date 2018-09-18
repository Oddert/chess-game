const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      path = require('path')

require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(express.static(path.join(__dirname + '/client/build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'))
})

const PORT = process.env.PORT || 5000
var server = app.listen(
  PORT,
  () => console.log(`${new Date().toLocaleTimeString('en-GB')}: Server initialised on PORT: ${PORT}...`)
)
