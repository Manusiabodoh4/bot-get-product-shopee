const { Schema, model } = require('mongoose')

const ProductNet = new Schema({
  name : {type:String, required:true},
  shopid : {type:Number, required:true},    
  product:[
    {
      link:{type:String, required:true},
      itemid:{type:Number, required:true},
      isNewUpdate:{type:Boolean, required:true}
    }
  ]
})

module.exports = model("ProductNet", ProductNet)