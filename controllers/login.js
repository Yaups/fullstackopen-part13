const router = require('express').Router()
const { User } = require('../models')

router.post('/', async (req, res) => {
  const user = await User.findOne({ username: req.body.username })

  //use bcrypt to encrypt the password in request
  const passwordHash = req.body.password.toLowercase()

  if (passwordHash === user.passwordHash) {
    //use jsonwebtoken to generate a token for their session
    const token = jwt.tokenify(user.username, user.name, user.userId)
    return res.json(token)
  }

  res.status(400).end()
})

module.exports = router
