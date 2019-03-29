//const sanitizeBody = require('../middleware/sanitizeBody')
const Pizza = require('../models/Pizza')
const express = require('express')
const router = express.Router()
//ResourceNotFoundError

router.get('/api/', async (req,res) => {

})

router.post('/api/', sanitizeBody, async (req,res) => {
    
})

router.get('/api/:id', async (req,res) => {

})

//const update

router.put('/api/:id', sanitizeBody, update((overwrite = true)))
router.put('/api/:id', sanitizeBody, update((overwrite = false)))

router.delete('/api/:id', async (req,res) => {

})

//add function sendResourceNotFound 
//or use the request ResourceNotFoundError

module.exports = router