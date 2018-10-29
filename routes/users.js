const router = require('express').Router(),
      passport = require('passport')

const User = require('../models/User'),
      Request = require('../models/Request'),
      Game = require('../models/Game')

router.get('/public', (req, res) => {
    User.find({}, (err, users) => {
      if (err) console.log(err)
      else res.status(200).json({ users })
    })
  })

router.get('/friends', (req, res) => {
// PLACEHOLDER for friends adding functionality
  User.find({}, (err, users) => {
    if (err) console.log(err)
    else res.status(200).json({ users: users.sort((a, b) => a.username < b.username ? 1 : -1) })
  })
})

module.exports = router
