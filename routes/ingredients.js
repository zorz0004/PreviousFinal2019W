const sanitizeBody = require('../middleware/sanitizeBody')
const Ingredient = require('../models/Ingredient')//.default
const express = require('express')
const router = express.Router()

//router.get('/api/ingredients/:id'), async (req,res) => {
router.get('/', async (req,res) => {
    const ingredients = await Ingredient.find()
    res.send({ data: ingredients })
})

//router.post('/api/ingredients', sanitizeBody, async (req,res) => {
router.post('/', sanitizeBody, async (req,res, next) => {
    let newIngredient = new Ingredient(req.sanitizedBody)
    try{
        await newIngredient.save()
        res.status(201).send({ data: newIngredient })
    } catch (err) {
        next(err)
        //sendResourceNotFound(req, res)
    }
})

router.get('/api/ingredients/:id', async (req,res) => {
    try{
        const ingredients = await Ingredient.findById(req.params.id)
        if(!ingredients)
        throw new Error('Resource not found')
        res.send({ data: ingredients })
    } catch (err) {
        sendResourceNotFound(req, res)
    }
})

const update = (overwrite = false) => async (req,res) => {
    try{
        const ingredients = await Ingredient.findByIdAndUpdate(
            req.params.id,
            req.sanitizeBody,
            {
                new: true,
                overwrite,
                runValidators: true
            })
        if (!ingredients) throw new Error ('Resource not found')
        res.send({ data: ingredients })
    } catch (err) {
        sendResourceNotFound(req, res)
    }
}

router.put('/api/ingredients/:id', sanitizeBody, update((overwrite = true)))
router.patch('/api/ingredients/:id', sanitizeBody, update((overwrite = false)))

router.delete('/api/ingredients/:id', async (req,res) => {
    try{
        const ingredients = await Ingredient.findByIdAndRemove(req.params.id)
        if (!ingredients) throw new Error ('Resource not found')
        res.send({ data: ingredients })
    } catch (err) {
        sendResourceNotFound(req, res)
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


module.exports = router




