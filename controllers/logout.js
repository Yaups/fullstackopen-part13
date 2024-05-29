const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')
const { ActiveSession } = require('../models')

router.post('/', tokenExtractor, async (req, res) => {
  const activeSession = await ActiveSession.findOne({
    where: { token: req.token },
  })

  await activeSession.destroy()

  res.status(204).end()
})

module.exports = router
