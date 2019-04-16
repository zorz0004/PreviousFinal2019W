const sanitizeBody = require('../middleware/sanitizeBody')
const Pizza = require('../models/Pizza')//.default
const authorize = require('../middleware/auth')
const express = require('express')
const router = express.Router()


router.get('/', async (req,res) => {
    const pizzas = await Pizza.find()
    res.send({ data: pizzas })
})

router.post('/', sanitizeBody, async (req,res,next) => {
    let newPizza = new Pizza(req.sanitizedBody)
    try{
        await newPizza.save()
        res.status(201).send({ data: newPizza })
    } catch (err) {
        next(err)
    }   
})

router.get('/:id', async (req,res) => {
    try{
        const pizzas = await Pizza.findById(req.params.id).populate('ingredients')
        if(!pizzas)
        throw new Error('Resource not found')
        res.send({ data: pizzas })
    } catch (err) {
        sendResourceNotFound(req, res)
    }
})

const update = (overwrite = false) => async (req, res, next) => {
    try{
        const pizzas = await Pizza.findByIdAndUpdate(
            req.params.id,
            req.sanitizedBody,
            {
                new: true,
                overwrite,
                runValidators: true
            })
        if (!pizzas) throw new Error('Resource not found')
        res.send({ data: pizzas })
    } catch (err) {
        next(err)
        //sendResourceNotFound(req, res)
    }
}

router.put('/:id', sanitizeBody, update((overwrite = true)))
router.patch('/:id', sanitizeBody, update((overwrite = false)))

router.delete('/:id', async (req,res) => {
    try {
        const pizzas = await Pizza.findByIdAndRemove(req.params.id)
        if (!pizzas) throw new Error ('Resource not found')
        res.send({ data: pizzas })
    }catch (err) {
        sendResourceNotFound(req,res)
    }
})

//add function sendResourceNotFound 
function sendResourceNotFound (req, res) {
    console.error(err)
    res.status(404).send({
      error: [
        {
          status: 'Not Found',
          code: '404',
          title: 'Resource does not exist',
          description: `We could not find a pizza with id: ${req.params.id}`
        }
      ]
    })
  }


module.exports = router