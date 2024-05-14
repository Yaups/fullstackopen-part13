const router = require('express').Router()
const { User } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

router.post('/', async (req, res) => {
  const user = await User.findOne({ where: { username: req.body.username } })

  if (!req.body.password) {
    return res.status(400).json({ error: 'No password specified' })
  }

  const passwordCheckSuccessful = user
    ? await bcrypt.compare(req.body.password, user.passwordHash)
    : false

  if (!passwordCheckSuccessful) {
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  const tokenInfo = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(tokenInfo, SECRET)

  res.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router
