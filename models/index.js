const Blog = require('./blog')
const User = require('./user')
const SavedBlogs = require('./saved_blogs')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: SavedBlogs, as: 'reading_list' })
Blog.belongsToMany(User, { through: SavedBlogs, as: 'saved_by' })

module.exports = { Blog, User, SavedBlogs }
