const router = require('express').Router()
const { Blog } = require('../models')

router.get('/', async (_req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', async (req, res) => {
  const blog = await Blog.create(req.body)
  res.status(201).json(blog)
})

router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)

  blog.likes = req.body.likes
  await blog.save()
  res.json({ likes: req.body.likes })
})

router.delete('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)

  await blog.destroy()
  res.status(204).end()
})

module.exports = router
