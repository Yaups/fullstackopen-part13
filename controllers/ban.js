const router = require('express').Router()
const { User, ActiveSession } = require('../models')

router.put('/:id', async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization !== 'banhammer1234') return next()

  const user = await User.findByPk(req.params.id)

  if (!user) {
    return res.status(404).json({ error: 'No user found' })
  }

  user.disabled = req.body.disabled
  console.log(user)
  await user.save()

  if (user.disabled) {
    await ActiveSession.destroy({ where: { userId: user.id } })
  }

  res.status(204).end()
})

module.exports = router
