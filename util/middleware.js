const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { User, ActiveSession } = require('../models')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)

    const activeSession = await ActiveSession.findOne({ where: { token } })
    if (!activeSession) {
      return res
        .status(401)
        .json({ error: 'Session expired: please log back in.' })
    }

    const decodedToken = jwt.verify(token, SECRET)

    const user = await User.findByPk(decodedToken.id)
    if (user.disabled) {
      return res.status(401).json({ error: 'Account is banned' })
    }

    req.token = token
    req.decodedToken = decodedToken
  } else {
    return res
      .status(401)
      .json({ error: 'Authorization token missing: you are not logged in.' })
  }
  next()
}

const errorHandler = (error, _req, res, next) => {
  console.error('Error message:', error.message)
  console.error('Error name:', error.name)

  if (error.name === 'SequelizeValidationError')
    return res.status(400).json({ error: error.message })

  if (error.name === 'TypeError')
    return res.status(404).json({ error: 'Cannot find target' })

  if (error.name === 'SequelizeUniqueConstraintError')
    return res.status(400).json({ error: 'Not unique / already taken' })

  if (error.name === 'JsonWebTokenError')
    return res.status(401).json({
      error: 'Invalid authorization token. Check that you are logged in.',
    })

  if (error.name === 'SyntaxError')
    return res.status(400).json({
      error:
        'Invalid syntax somewhere within the request. Is your auth token of the correct format?',
    })

  if (error.name === 'SequelizeDatabaseError')
    return res.status(400).json({
      error:
        'Trying to use something which cannot exist or is the wrong data type.',
    })

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res
      .status(400)
      .json({ error: 'Trying to locate an item which does not exist' })
  }

  next(error)
}

const unknownEndpoint = (_req, res) => {
  res.status(400).json({ error: 'Unknown endpoint' })
}

module.exports = { tokenExtractor, errorHandler, unknownEndpoint }
