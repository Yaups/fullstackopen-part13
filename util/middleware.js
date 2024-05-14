const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
  } else {
    return res
      .status(401)
      .json({ error: 'Authorization token missing: you are not logged in.' })
  }
  next()
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  console.error(error.name)

  if (error.name === 'SequelizeValidationError')
    return res.status(400).json({ error: error.message })

  if (error.name === 'TypeError')
    return res.status(404).json({ error: 'Cannot find target' })

  if (error.name === 'SequelizeUniqueConstraintError')
    return res.status(400).json({ error: 'Not unique / already taken' })

  if (error.name === 'JsonWebTokenError')
    return res
      .status(401)
      .json({
        error: 'Invalid authorization token. Check that you are logged in.',
      })

  next(error)
}

const unknownEndpoint = (_req, res) => {
  res.status(400).json({ error: 'Unknown endpoint' })
}

module.exports = { tokenExtractor, errorHandler, unknownEndpoint }
