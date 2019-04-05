const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {type:String, required:true, maxlength:64},
    price: {type:Number, required:false, max:10000, default:100},
    quantity: {type: Number, required:false, max:1000, default:10},
    isGlutenFree: {type:Boolean, required: false, default:false},
    imageUrl: {type:String, required:false, maxlength:1024},
    categories: {type:String, enum:['meat', 'spicy', 'vegitarian', 'vegan', 'halal', 'kosher', 'cheeze', 'seasonings'],
                 required: false}
})

module.exports = mongoose.model('Ingredients', schema)