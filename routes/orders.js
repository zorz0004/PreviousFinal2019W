const sanitizeBody = require('../middleware/sanitizeBody')
const Order = require('../models/Order')
const authorize = require('../middleware/auth')
const express = require('express')
const router = express.Router()


router.get('/', authorize, async (req,res) => {
    const orders = await Order.find()
    res.send({ data: orders })
})

router.post('/', authorize, sanitizeBody, async (req,res, next) => {
    let newOrder = new Order(req.sanitizedBody)
    try{
        await newOrder.save()
        res.status(201).send({ data: newOrder })
    } catch (err) {
        next(err)
    }  
})

router.get('/:id', authorize, async (req,res) => {
    try{
        const orders = await Order.findById(req.params.id).populate('pizzas')
        if(!orders)
        throw new Error('Resource not found')
        res.send({ data: orders })
    } catch (err) {
        sendResourceNotFound(req, res)
    }
})

const update = (overwrite = false) => async (req, res) => {
    try{
        const orders = await Order.findByIdAndUpdate(
            req.params.id,
            req.sanitizedBody,
            {
                new: true,
                overwrite,
                runValidators: true
            })
        if (!orders) throw new Error('Resource not found')
        res.send({ data: orders })
    } catch (err) {
        //next(err)
        sendResourceNotFound(req, res)
    }
}

router.put('/:id', authorize, sanitizeBody, update((overwrite = true)))
router.patch('/:id', authorize, sanitizeBody, update((overwrite = false)))

router.delete('/:id', authorize, async (req,res) => {
    try {
        const orders = await Order.findByIdAndRemove(req.params.id)
        if (!orders) throw new Error ('Resource not found')
        res.send({ data: orders })
    }catch (err) {
        sendResourceNotFound(req,res)
    }
})

function sendResourceNotFound (req, res) {
    console.error(err)
    res.status(404).send({
      error: [
        {
          status: 'Not Found',
          code: '404',
          title: 'Resource does not exist',
          description: `We could not find a order with id: ${req.params.id}`
        }
      ]
    })
  }


module.exports = router