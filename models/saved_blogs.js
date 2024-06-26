const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class SavedBlogs extends Model {}
SavedBlogs.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'saved_blogs',
  }
)

module.exports = SavedBlogs
