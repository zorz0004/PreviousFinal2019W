const sanitizeBody = require('../middleware/sanitizeBody')
const Order = require('../models/Order')
const express = require('express')
const router = express.Router()

router.get('/api/orders', async (req,res) => {
    const orders = await Order.find()
    res.send({ data: orders })
})

router.post('/api/orders', sanitizeBody, async (req,res) => {
    let
})