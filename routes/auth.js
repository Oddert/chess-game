const router    = require('express').Router()
    , passport  = require('passport')

const User      = require('../models/User')

router.route('/')
.get((req, res) => {
  res.json({ message: 'This is /api/auth/ ' })
})

router.route('/ping')
.get((req, res) => {
  if (req.isAuthenticated()) req.session.user_id = req.user.id;
  console.log('Ping recieved. Is Auth:')
  console.log(req.isAuthenticated())
  if (req.isAuthenticated()) {
    User.findById(req.user._id)
    .populate('activeGames')
    .populate('notifications')
    .populate('outboundRequests')
    .populate('inboundRequests')
    .exec((err, user) => {
      if (err) {
        console.log(err)
        res.status(500).json({ err })
      } else {
        res.json({ isAuth: req.isAuthenticated(), user })
      }
    })
  } else {
    res.json({ isAuth: req.isAuthenticated() })
  }
})

router.get('/logout', (req, res) => {
  req.logout()
  res.json({
    message: `Successfully logged out`,
    isAuth: req.isAuthenticated()
  })
})

router.route('/local/register')
.post((req, res) => {
  console.log(`User attempting to register`)
  console.log(req.body)
  let newUser = new User({ username: req.body.username })
  User.register(newUser, req.body.password, (err, user) => {
    if (err) console.log(err)
    else passport.authenticate('local')(req, res, () => {
      res.json({ user })
    })
  })
  // res.json({ message: 'This is /api/local/register/ ' })
})

router.route('/local/login')
.post((req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.log(err)
      res.status(401).json({ err })
      return
    }
    if (user) {
      req.login(user, (err) => {
        if (err) {
          console.log(err)
          return res.status(401).json({ err })
        }
        User.findById(user._id)
        .populate('activeGames')
        .populate('notifications')
        .populate('outboundRequests')
        .populate('inboundRequests')
        .exec((err, foundUser) => {
          if (err) {
            console.log(err)
            return res.status(500).json({ err })
          } else {
            req.session.user_id = req.user.id;
            console.log(foundUser)
            return res.status(200).json({ user: foundUser })
          }
        })
      })
    } else {
      console.log(info)
      res.status(401).json({ err: info })
    }
  })(req, res);
})

module.exports = router
