const mongoose = require('mongoose')

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Chess Game'
  },

  board: [
    [
      {
        type: mongoose.Schema.Types.Mixed  //{ type: String },
        // team: { type: mongoose.Schema.Types.Mixed }
      }
    ]
  ],

  lastMove: {
    type: Number,
    default: 0
  },

  moves: [
    {
      w: {
        f: String,
        t: String,
        x: { type: Boolean, default: false }
      },
      b: {
        f: String,
        t: String,
        x: { type: Boolean, default: false }
      },
    }
  ],
  chat: [],

  white: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'chessGame-user'
    },
    username: String,
    score: Number,
    takenPieces: [ String ],
    clock: {
      type: Number,
      default: 0
    }
  },

  black: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'chessGame-user'
    },
    username: String,
    score: Number,
    takenPieces: [ String ],
    clock: {
      type: Number,
      default: 0
    }
  }

})

module.exports = mongoose.model('chessGame-game', GameSchema)
