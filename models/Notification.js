const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema ({
  name: {
    type: String,
    default: 'Notification'
  },
  message: {
    type: String,
    // required: true
  },
  notification_type: {
    type: String,
    // required: true
  },

  user: {
    username: String,
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'chessGame-user'
    },
    // required: true
  },

  other_users: [
    {
      username: String,
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chessGame-user'
      }
    }
  ],

  recieved: {
    type: Boolean,
    default: false
  },
  recieved_date: Date,
  // Recieved means the user has had the item on screen but not interacted with

  read: {
    type: Boolean,
    default: false
  },
  read_date: Date,
  // Notification has been opened and read (can be undone maually)

  action_complete: {
    type: Boolean,
    default: false
  },
  action_complete_date: Date,
  // Notification dismissed or actioned on

  deleted: {
    type: Boolean,
    default: false
  },
  deleted_date: Date,

  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'chessGame-game'
  },

  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'chessGame-request'
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'chessGame-user'
  }

})

// name
// message
// notification_type
// user

// other_users

// recieved
// recieved_date

// read
// read_date

// action_complete
// action_complete_date

// deleted
// deleted_date

// game
// request
// sender


module.exports = mongoose.model('chessGame-notification', NotificationSchema)
