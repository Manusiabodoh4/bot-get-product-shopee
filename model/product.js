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
        isReady:{type:Boolean, required:true},
        isNewProduct:Boolean,
        price : String,        
        totalVarian : Number,
        varian : [
          {
            name : String,
            price : String,   
            image : String,  
            isActive:Boolean       
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

