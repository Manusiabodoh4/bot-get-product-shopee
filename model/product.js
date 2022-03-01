const { Schema } = require('mongoose')

const Product = new Schema({
  shop : {
    name : {type:String, required:true},    
  },
  product : { 
    total : {type:Number, required:true},
    detail : [
      {
        id : {type:String, required:true},
        link : {type:String, required:true},
        name : {type:String, required:true},                        
      }
    ]
  }

}, {timestamps:true})

module.exports = mongo.model("product", Product)

