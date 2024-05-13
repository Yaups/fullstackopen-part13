const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  console.error(error.name)

  if (error.name === 'SequelizeValidationError')
    return res.status(400).json({ error: 'Post is incorrectly formatted' })

  if (error.name === 'TypeError')
    return res.status(404).json({ error: 'Cannot find target' })

  if (error.name === 'SequelizeUniqueConstraintError')
    return res.status(400).json({ error: 'Not unique / already taken' })

  next(error)
}

const unknownEndpoint = (_req, res) => {
  res.status(400).json({ error: 'Unknown endpoint' })
}

module.exports = { errorHandler, unknownEndpoint }
