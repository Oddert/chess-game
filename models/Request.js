const mongoose = require('mongoose')

const RequestSchema = new mongoose.Schema ({
  name: {
    type: String,
    default: 'Match Request'
  },
  author: {
    username: String,
    id: mongoose.Schema.Types.ObjectId
  },
  open: {
    type: Boolean,
    default: true
  },
  target: {
    username: String,
    id: mongoose.Schema.Types.ObjectId
  },
  created: {
    type: Date,
    default: Date.now
  },
  accepted: {
    type: Boolean,
    default: false
  },
  accepted_date: Date,
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'chessGame-game'
  }
})

module.exports = mongoose.model('chessGame-request', RequestSchema)
