'use_strict'

const debug = require('debug')('final')
require('./startup/database')()

const express = require('express')
const app = express()

app.use(express.json())

const port = process.env.PORT || 3030
app.listen(port, () => debug(`Express is listening on port ${port} ...`))