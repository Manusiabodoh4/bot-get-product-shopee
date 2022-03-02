const { Schema, model } = require('mongoose')

const Detail = new Schema({
  id : {type:String, required:true},
  price : {type:String, required:true},
  image : {type:String, required:true},
  totalVarian : {type:Number, required:true},
  varian : [
    {
      name : {type:String, required:true},
      price : {type:String, required:true},
      image : {type:String, required:true},
    }
  ]
}, {timestamps:true})

module.exports = model("Detail", Detail)

