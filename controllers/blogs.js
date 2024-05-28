const router = require('express').Router()
const { Blog, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    title = { [Op.iLike]: `%${req.query.search}%` }
    author = { [Op.iLike]: `%${req.query.search}%` }
    where = { [Op.or]: [{ title }, { author }] }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    where,
    order: [['likes', 'DESC']],
    group: ['blog.id', 'user.id'],
    include: {
      model: User,
      attributes: ['name'],
    },
  })
  res.json(blogs)
})

router.get('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id, {
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
  })
  res.json(blog)
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)

  if (!user) {
    return res.status(401).json({
      error: 'Authorization error: you must be logged in to post a blog',
    })
  }

  const blogToPost = { ...req.body, userId: user.id }

  console.log(blogToPost)

  const blog = await Blog.create(blogToPost)
  res.status(201).json(blog)
})

router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)

  blog.likes = req.body.likes
  await blog.save()
  res.json({ likes: req.body.likes })
})

router.delete('/:id', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)

  if (!user) {
    return res
      .status(401)
      .json({ error: 'Authorization error: you are not logged in' })
  }

  const blog = await Blog.findByPk(req.params.id)

  if (!blog) {
    return res.status(400).json({ error: 'Cannot find blog to delete' })
  }

  if (user.id !== blog.userId) {
    return res.status(401).json({ error: 'You are not the blog poster' })
  }

  await blog.destroy()
  res.status(204).end()
})

module.exports = router
