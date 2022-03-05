const { Schema, model } = require('mongoose')

const Product = new Schema({
  shop : {
    name : {type:String, required:true},    
  },
  product : {     
    total : {type:Number, required:true},
    detail : [
      {               
        link : {type:String, required:true},
        name : {type:String, required:true},                        
        status:{type:Boolean, required:true},
        price : String,        
        totalVarian : Number,
        varian : [
          {
            name : String,
            price : String,   
            image : String         
          }
        ],
        media : [
          {
            link : String
          }
        ]
      }
    ],    
  }

}, {timestamps:true})

module.exports = model("Product", Product)

