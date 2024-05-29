const Blog = require('./blog')
const User = require('./user')
const SavedBlogs = require('./saved_blogs')
const ActiveSession = require('./active_session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: SavedBlogs, as: 'reading_list' })
Blog.belongsToMany(User, { through: SavedBlogs, as: 'saved_by' })

User.hasMany(ActiveSession)
ActiveSession.belongsTo(User)

module.exports = { Blog, User, SavedBlogs, ActiveSession }
