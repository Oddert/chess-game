const mongoose = require('mongoose')

const RequestSchema = new mongoose.Schema ({
  name: {
    type: String,
    default: 'Match Request'
  },
  message: {
    type: String,
    default: 'Hey! Want to play a game of Chess?'
  },
  responce_message: String,
  author: {
    username: String,
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'chessGame-user'
    }
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
  updated: Date,

  deleted: {
    type: Boolean,
    default: false
  },
  deleted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'chessGame-user'
  },
  deleted_on: Date,

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
