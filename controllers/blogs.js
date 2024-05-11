const router = require('express').Router()
const { Blog } = require('../models')

router.get('/', async (_req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body)
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id)

  try {
    blog.likes = req.body.likes
    await blog.save()
    res.json({ likes: req.body.likes })
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id)

  try {
    await blog.destroy()
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router
