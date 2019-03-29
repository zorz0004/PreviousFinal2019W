const mongoose = require('mongoose')
const Ingredients = require('./ingredients')

const schema = new mongoose.Schema({
    name: {type:String, required:true, minlength:4, maxlength:64},
    price: {type:Integer, required:false, min:1000, max:10000, default:1000},
    size: {type:ENUM ['small', 'medium', 'large', 'extra large'],
           required:false, default:'small'},
    isGlutenFree: {type:Boolean, required: false, default:false},
    imageUrl: {type:String, required:false, maxlength:1024},
    ingredients: {type: mongoose.Schema.Types.ObjectId, ref:'Ingredients'},
    extraToppings: {type: mongoose.Schema.Types.ObjectId, ref:'Ingredients'}
})

module.exports = mongoose.model('Pizza', schema)