const mongoose = require('mongoose')
const Ingredients = require('./Ingredient')//.default


const schema = new mongoose.Schema({
    name: {type:String, required:true, minlength:4, maxlength:64},
    price: {type:Number, required:false, min:1000, max:10000, default:1000},
    size: {type:String, enum:['small', 'medium', 'large', 'extra large'],
           required:false, default:'small'},
    isGlutenFree: {type:Boolean, required: false, default:false},
    imageUrl: {type:String, required:false, maxlength:1024},
    ingredients: [{type: mongoose.Schema.Types.ObjectId, ref:'Ingredients'}],
    extraToppings: [{type: mongoose.Schema.Types.ObjectId, ref:'Ingredients'}]
})


schema.pre('save', async function(){
    await this.populate('ingredients extraToppings').execPopulate()
    //this.price = this.ingredients.reduce((acc, element) => acc+= element.price, 0)
    let total = 0;

    [...this.ingredients, ...this.extraToppings].forEach(ingredient => {
        total += ingredient.price;
    });
    this.price = total;
})

module.exports = mongoose.model('Pizza', schema)

