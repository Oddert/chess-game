const router = require('express').Router()

const User = require('../models/User')

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user._id)
    .populate('notifications')
    .exec((err, user) => {
      if (err) {
        console.log(err)
        res.status(500).json({ err })
      } else {
        res.status(200).json({ notifications: user.notifications })
      }
    })
  } else {
    res.status(401).json({ err: 'Please log in to recieve notifications' })
  }
})

module.exports = router
