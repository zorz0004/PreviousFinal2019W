const logger = require('./logger')
const mongoose = require('mongoose')

module.exports = () => {
  mongoose
    .connect(`mongodb://localhost:27017/mad9124`, { useNewUrlParser: true }
    )
    .then(() => {
      logger.log('info', `Connected to MongoDB ...`)
    })
    .catch(err => {
      logger.log('error', `Error connecting to MongoDB ...`, err)
      process.exit(1)
    })
}
