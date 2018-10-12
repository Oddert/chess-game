const router    = require('express').Router()
    , passport  = require('passport')

const User      = require('../models/User')

router.route('/')
.get((req, res) => {
  res.json({ message: 'This is /api/auth/ ' })
})

router.route('/ping')
.get((req, res) => {
  console.log('Ping recieved:')
  console.log(req.isAuthenticated())
  res.json({ isAuthenticated: req.isAuthenticated(), user: req.user })
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
        return res.status(200).json({ user })
      })
    } else {
      console.log(info)
      res.status(401).json({ err: info })
    }
  })(req, res);
})

module.exports = router
