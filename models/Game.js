const mongoose = require('mongoose')

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Chess Game'
  },

  board: [
    [
      {
        type: { type: String },
        team: { type: mongoose.Schema.Types.Mixed }
      }
    ]
  ],

  lastMove: {
    type: Number,
    default: 0
  },

  white: {
    id: {
      type: String,
      default: ''
    },//swap out for user id once auth is implamented
    score: Number,
    takenPieces: [ String ],
    clock: {
      type: Number,
      default: 0
    }
  },

  black: {
    id: {
      type: String,
      default: ''
    },//swap out for user id once auth is implamented
    score: Number,
    takenPieces: [ String ]
  }

})

module.exports = mongoose.model('chessGame-game', GameSchema)
