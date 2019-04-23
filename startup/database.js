const config = require('config')
const logger = require('./logger')
const mongoose = require('mongoose')

const dbConfig = config.get('db')

let credentials = ''

if(process.env.NODE_ENV === 'production'){
  credentials = `${dbConfig.user}:${dbConfig.password}@`
}

module.exports = () => {
  mongoose
    //.connect(`mongodb://localhost:27017/mad9124`, { 
    .connect(`mongodb://${credentials}${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}?authSource=admin`,{
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
