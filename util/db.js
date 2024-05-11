const { Sequelize } = require('sequelize')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL)

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connected to Postgres database')
  } catch (err) {
    console.error('Failed to connect to the Postgres database')
    console.error(err)
    return process.exit(1)
  }

  return null
}

module.exports = { sequelize, connectToDatabase }
