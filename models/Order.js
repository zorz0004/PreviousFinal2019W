const mongoose = require('mongoose')
const User = require('./User')
const Pizza = require('./Pizza')

const schema = new mongoose.Schema({
    customer: {type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    type: {type:String, enum:['pickup', 'delivery'], default:'pickup'},
    status: {type:String, enum:['draft', 'ordered', 'paid', 'delivered'], default: 'draft'},
    pizzas: {type: mongoose.Schema.Types.ObjectId, ref:'Pizza'},
    address: {type:String, required:(schema.type==='delivery' ? true : false)},
    price: {type: Integer, default:0},
    deliveryCharge: {type: Integer, default:(schema.type==='delivery' ? 500 : 0)},
    tax: {type: Integer, default:0},
    total: {type: Integer, default:0},
    createdAt: {type:Date, default:Date.now()},
    updatedAt: {type:Date, default:Date.now()}
})

module.exports = mongoose.model('Order', schema)