const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError')
    return res.status(400).json({ error: 'Blog post is incorrectly formatted' })

  if (error.name === 'TypeError')
    return res.status(404).json({ error: `Blog does not exist` })

  next(error)
}

const unknownEndpoint = (_req, res) => {
  res.status(400).json({ error: 'Unknown endpoint' })
}

module.exports = { errorHandler, unknownEndpoint }
