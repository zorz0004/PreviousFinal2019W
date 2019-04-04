const debug = require('debug')('sanitize:body')
const xss = require('xss')

const sanitize = sourceString => {
  return xss(sourceString, {
    whiteList: [],
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script']
  })
}

const stripTags = payload => {
  let attributes = { ...payload } // return a new object, do not mutate the input object
  for (let key in attributes) {
    if (attributes[key] instanceof Array) {
      debug('Recurse array', attributes[key])
      attributes[key] = attributes[key].map(element => {
        return typeof element === 'string'
          ? sanitize(element)
          : stripTags(element)
      })
    } else if (attributes[key] instanceof Object) {
      debug('Recurse object', attributes[key])
      attributes[key] = stripTags(attributes[key])
    } else {
      attributes[key] = sanitize(attributes[key])
    }
  }
  return attributes
}

module.exports = (req, res, next) => {
  debug({ body: req.body })
  const { id, _id, ...attributes } = req.body
  debug({ attributes })
  const sanitizedBody = stripTags(attributes)
  debug({ sanitizedBody })
  req.sanitizedBody = sanitizedBody
  next()
}