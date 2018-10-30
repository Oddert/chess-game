const router = require('express').Router()
    , passport = require('passport')

const User = require('../models/User')
    , Request = require('../models/Request')
    , Game = require('../models/Game')

router.get('/public', (req, res) => {
  Game.find({}, (err, games) => {
    if (err) console.log(err)
    else res.status(200).json({ games })
  })
})

router.get('/user', (req, res) => {
  User.findById(req.user._id)
    .populate('activeGames')
    .exec((err, user) => {
      if (err) console.log(err)
      else res.status(200).json({ games: user.activeGames })
    })
})

module.exports = router
