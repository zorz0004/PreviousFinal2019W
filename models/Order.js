const mongoose = require('mongoose')
const User = require('./User')
const Pizza = require('./Pizza')

const schema = new mongoose.Schema({
    customer: {type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    type: {type:String, enum:['pickup', 'delivery'], default:'pickup'},
    status: {type:String, enum:['draft', 'ordered', 'paid', 'delivered'], default: 'draft'},
    pizzas: {type: mongoose.Schema.Types.ObjectId, ref:'Pizza'},
    address: {type:String, required:(schema.type==='delivery' ? true : false)},
    price: {type: Number, default:0},
    //deliveryCharge: {type: Number, default:(schema.type==='delivery' ? 500 : 0)},
    deliveryCharge: {
        type: Number,
        default: function(){
            return this.type ==='delivery'? 500 : 0
        }
    },
    tax: {type: Number, default:0},
    total: {type: Number, default:0}
},{
    timestamps: {
        createdAt: 'created_at'
    }
})

module.exports = mongoose.model('Order', schema)