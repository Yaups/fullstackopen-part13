const express = require('express')
const app = express()
const blogsRouter = require('./controllers/blogs')
const { errorHandler, unknownEndpoint } = require('./util/middleware')
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
