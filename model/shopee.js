const { Schema } = require('mongoose')

const Shopee = new Schema({

  toko : {
    nama : String,
    mengikuti : String,
    peforma : String,
    pengikut : String,
    penilaian : String,
    bergabung : String
  },
  produk : {
    total : String,
    finalTotal : Number,
    detail : [
      {
        link : String,
        nama : String,
        penilaian : String,
        terjual : String,
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

