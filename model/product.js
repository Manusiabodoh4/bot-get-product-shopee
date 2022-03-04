const { Schema, model } = require('mongoose')

const Product = new Schema({
  shop : {
    name : {type:String, required:true},    
  },
  product : {     
    total : {type:Number, required:true},
    detail : [
      {       
        image : {type:String, required:true} ,
        link : {type:String, required:true},
        name : {type:String, required:true},                        
        price : String,
        image : String,
        totalVarian : Number,
        varian : [
          {
            name : String,
            price : String,            
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

