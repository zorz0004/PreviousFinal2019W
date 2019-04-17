const sanitizeBody = require('../middleware/sanitizeBody')
const Ingredient = require('../models/Ingredient')//.default
const authorize = require('../middleware/auth')
const User = require('../models/User')
const express = require('express')
const router = express.Router()

router.get('/', async (req,res) => {
    const ingredients = await Ingredient.find()
    res.send({ data: ingredients })
})

router.post('/', authorize, sanitizeBody, async (req,res, next) => {
    let myUser = await User.findById(req.user._id).select('isStaff')
    if(myUser.isStaff === true){
        let newIngredient = new Ingredient(req.sanitizedBody)
    try{
        await newIngredient.save()
        res.status(201).send({ data: newIngredient })
    } catch (err) {
        next(err)
    }
    }
    else{
        sendUnauthorized (req, res)
    }
})

router.get('/:id', async (req,res) => {
    try{
        const ingredients = await Ingredient.findById(req.params.id)
        if(!ingredients)
        throw new Error('Resource not found')
        res.send({ data: ingredients })
    } catch (err) {
        sendResourceNotFound(req, res)
    }
})

const update = (overwrite = false) => async (req,res, next) => {
    let myUser = await User.findById(req.user._id).select('isStaff')
    if(myUser.isStaff === true){
        try{
            const ingredients = await Ingredient.findByIdAndUpdate(
                req.params.id,
                req.sanitizedBody,
                {
                    new: true,
                    overwrite,
                    runValidators: true
                })
            if (!ingredients) throw new Error ('Resource not found')
            res.send({ data: ingredients })
        } catch (err) {
            next(err)
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
        try{
            const ingredients = await Ingredient.findByIdAndRemove(req.params.id)
            if (!ingredients) throw new Error ('Resource not found')
            res.send({ data: ingredients })
        } catch (err) {
            sendResourceNotFound(req, res)
        }
    }
    else{
        sendUnauthorized (req, res)
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
          description: `We could not find a ingredient with id: ${req.params.id}`
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




