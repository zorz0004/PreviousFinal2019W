const sanitizeBody = require('../middleware/sanitizeBody')
const Pizza = require('../models/Pizza')//.default
const authorize = require('../middleware/auth')
const User = require('../models/User')
const express = require('express')
const router = express.Router()



router.get('/', async (req,res) => {
    const pizzas = await Pizza.find()
    res.send({ data: pizzas })
})

router.post('/', authorize, sanitizeBody, async (req,res,next) => {
    let myUser = await User.findById(req.user._id).select('isStaff')
    if(myUser.isStaff === true){
        let newPizza = new Pizza(req.sanitizedBody)
        try{
            await newPizza.save()
            res.status(201).send({ data: newPizza })
        } catch (err) {
            next(err)
        } 
    } else{
        sendUnauthorized (req, res)
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
    let myUser = await User.findById(req.user._id).select('isStaff')
    if(myUser.isStaff === true){
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
     else{
        sendUnauthorized (req, res)
    }     
}

router.put('/:id', authorize, sanitizeBody, update((overwrite = true)))
router.patch('/:id', authorize, sanitizeBody, update((overwrite = false)))

router.delete('/:id', authorize, async (req,res) => {
    let myUser = await User.findById(req.user._id).select('isStaff')
    if(myUser.isStaff === true){
        try {
            const pizzas = await Pizza.findByIdAndRemove(req.params.id)
            if (!pizzas) throw new Error ('Resource not found')
            res.send({ data: pizzas })
        }catch (err) {
            sendResourceNotFound(req,res)
        }
    }
    else{
        sendUnauthorized (req, res)
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


function sendUnauthorized (req, res){
    return res.status(403).send({
        errors: [
            {
                status: 'Unauthorized',
                code: '403',
                title: 'Access denied',
                description: 'Not allowed'
            }
        ]
    })
}

module.exports = router