const router = require('express').Router()
const { Blog } = require('../models')
const { fn, col } = require('sequelize')

router.get('/', async (_req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      'author',
      [fn('COUNT', col('author')), 'total_blogs'],
      [fn('SUM', col('likes')), 'total_likes'],
    ],
    group: ['author'],
    order: [['total_likes', 'DESC']],
  })

  res.json(blogs)
})

module.exports = router
