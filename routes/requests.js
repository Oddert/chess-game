const router = require('express').Router()
    , passport = require('passport')

const User = require('../models/User')
    , Request = require('../models/Request')
    , Game = require('../models/Game')

router.post('', (req, res) => {
  console.log(req.body)
  res.json({ server: 'res ok' })
})

router.get('/public', (req, res) => {
  Request.find({ open: true, accepted: false, deleted: false }, (err, requests) => {
    if (err) console.log(err)
    else {
      // console.log('public', requests)
      res.json({ requests })
    }
  })
})

router.get('/inbound', (req, res) => {
  if (req.user) {
    User.findById(req.user._id)
    .populate('inboundRequests')
    .exec((err, user) => {
      if (err) console.log(err)
      else res.status(200).json({ requests: user.inboundRequests.filter(e => !e.deleted) })
    })
  } else {
    res.status(200).json({ requests: [] })
  }
})

router.get('/outbound', (req, res) => {
  if (req.user) {
    User.findById(req.user._id)
    .populate('outboundRequests')
    .exec((err, user) => {
      console.log(user.outboundRequests)
      if (err) console.log(err)
      else res.status(200).json({ requests: user.outboundRequests })
    })
  } else {
    res.status(200).json({ requests: [] })
  }
})

module.exports = router
