const router = require('express').Router()
const { User, Blog } = require('../models')
const bcrypt = require('bcrypt')

router.get('/', async (_req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash', 'username'] },
    include: { model: Blog, attributes: { exclude: ['userId'] } },
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const where = req.query.read ? { read: req.query.read } : {}

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['passwordHash', 'username'] },
    include: [
      { model: Blog, attributes: { exclude: ['userId'] } },
      {
        model: Blog,
        as: 'reading_list',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        through: {
          attributes: ['id', 'read'],
          where,
        },
      },
    ],
  })
  res.json(user)
})

router.post('/', async (req, res) => {
  const { name, username, password } = req.body

  if (!password) {
    return response.status(400).json({ error: 'User must have a password' })
  }

  if (password.length < 3) {
    return response
      .status(400)
      .json({ error: 'Password must have at least 3 characters' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const userToSave = { name, username, passwordHash }
  const user = await User.create(userToSave)
  res.status(201).json({
    name: user.name,
    username: user.username,
    createdAt: user.createdAt,
  })
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } })

  if (!req.body.password) {
    return response.status(400).json({ error: 'No password specified' })
  }

  const passwordCorrect = user
    ? await bcrypt.compare(req.body.password, user.passwordHash)
    : false

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'Invalid username or password',
    })
  }

  user.username = req.body.newUsername
  const updatedUser = await user.save()

  res.status(200).json({
    name: updatedUser.name,
    username: updatedUser.username,
    createdAt: updatedUser.createdAt,
  })
})

module.exports = router
