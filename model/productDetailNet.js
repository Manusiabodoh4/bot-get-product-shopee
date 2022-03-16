const { Schema, model } = require('mongoose')

const ProductDetailNet = new Schema({
  itemid:{type:Number, required:true},
  detail:{}
})

module.exports = model("ProductDetailNet", ProductDetailNet)