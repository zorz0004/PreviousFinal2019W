const mongoose = require('mongoose')
const User = require('./User')
const Pizza = require('./Pizza')//.default

//deliveryCharge: {type: Number, default:(schema.type==='delivery' ? 500 : 0)},

//address: {type:String, required:(schema.type==='delivery' ? true : false)},

const schema = new mongoose.Schema({
    customer: {type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    type: {type:String, enum:['pickup', 'delivery'], default:'pickup'},
    status: {type:String, enum:['draft', 'ordered', 'paid', 'delivered'], default: 'draft'},
    pizzas: [{type: mongoose.Schema.Types.ObjectId, ref:'Pizza'}],
    address: {type: String, 
        default: function(){
            return this.type === 'delivery'? true : false
        }},
    price: {type: Number, default:0},
    deliveryCharge: {
        type: Number,
        default: function(){
            return this.type === 'delivery' ? 500 : 0
        }
    },
    tax: {type: Number, default:0},
    total: {type: Number, default:0}
},{
    timestamps: {
        createdAt: 'created_at'
    }
})


schema.pre('save', async function(){
    await this.populate('pizzas').execPopulate()
    this.price = this.pizzas.reduce((acc, element) => acc+= element.price, 0)
    this.tax = (this.price + this.deliveryCharge) * 0.13
    this.total = this.price + this.deliveryCharge + this.tax
})

module.exports = mongoose.model('Order', schema)