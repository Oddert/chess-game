const mongoose              = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  activeGames: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'chessGame-game'
    }
  ],
  inboundRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'chessGame-request'
    }
  ],
  outboundRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'chessGame-request'
    }
  ]
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('chessGame-user', UserSchema)
