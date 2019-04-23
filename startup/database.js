const config = require('config')
const logger = require('./logger')
const mongoose = require('mongoose')

const dbConfig = config.get('db')

module.exports = () => {
  mongoose
    //.connect(`mongodb://localhost:27017/mad9124`, { 
    .connect(`mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`, {
      useNewUrlParser: true }
    )
    .then(() => {
      logger.log('info', `Connected to MongoDB ...`)
    })
    .catch(err => {
      logger.log('error', `Error connecting to MongoDB ...`, err)
      process.exit(1)
    })
}
