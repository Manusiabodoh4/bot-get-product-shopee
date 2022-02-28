const { Schema } = require('mongoose')

const Shopee = new Schema({

  toko : {
    nama : String,    
  },
  produk : { 
    total : Number,
    detail : [
      {
        link : String,
        nama : String,                
        varian : [
          {
            nama : String,
            image : String,
            harga : String
          }
        ],
        harga : String,
        image : String
      }
    ]
  }

}, {timestamps:true})

module.exports = mongo.model("shopee", Shopee)

