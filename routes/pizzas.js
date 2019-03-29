//const sanitizeBody = require('../middleware/sanitizeBody')
const Pizza = require('../models/Pizza')
const express = require('express')
const router = express.Router()


router.get('/api/', async (req,res) => {
    const pizzas = await Pizza.find()
    res.send({ data: pizzas })
})

router.post('/api/', sanitizeBody, async (req,res) => {
    let newPizza = new Pizza(req.sanitizeBody)
    try{
        await newPizza.save()
        res.atatus(201).send({ data: newPizza})
    } catch (err) {
        next(err)
    }   
})

router.get('/api/:id', async (req,res) => {
    try{
        const pizzas = await Pizza.findById(req.params.id).populate('ingredients')
        if(!pizzas)
        throw new Error('Resource not found')
        res.send({ data: pizzas })
    } catch (err) {
        sendResourceNotFound(req, res)
    }
})

const update = (overwrite = false) => async (req, res) => {
    try{
        const pizzas = await Pizza.findByIdAndUpdate(
            req.params.id,
            req.sanitizeBody,
            {
                new: true,
                overwrite,
                runValidators: true
            })
        if (!pizzas) throw new Error('Resource not found')
        res.send({ data: course })
    } catch (err) {
        sendResourceNotFound(req, res)
    }
}

router.put('/api/:id', sanitizeBody, update((overwrite = true)))
router.put('/api/:id', sanitizeBody, update((overwrite = false)))

router.delete('/api/:id', async (req,res) => {

})

//add function sendResourceNotFound 
function sendResourceNotFound (req, res) {
    console.error(err)
    res.status(404).send({
      error: [
        {
          status: 'Not Found',
          code: '404',
          title: 'Resource does nto exist',
          description: `We could not find a pizza with id: ${req.params.id}`
        }
      ]
    })
  }


module.exports = router