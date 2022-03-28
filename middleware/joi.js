const joi = require('joi')
const { responseValidator } = require("../helper/response")

const validatorNetProdAll = (req, res, next) => {

  const schema = joi.object().keys({
    toko : joi.object().keys({      
      id : joi.number().required(),
      name :  joi.string().required(),
      totalPage : joi.number().required(),
      totalSoldOut : joi.number().required()
    })
  })

  const {error,value} = schema.validate(req?.body)  

  responseValidator(req, res, next, error, value)

}

const validatorNetProdDetail = (req, res, next) => {

  const schema = joi.object().keys({
    toko : joi.object().keys({
      id : joi.number().required(),      
    })    
  })

  const {error,value} = schema.validate(req?.body)  

  responseValidator(req, res, next, error, value)

}

const validatorProdAll = (req, res, next) => {  

  const schema = joi.object().keys({
    toko : joi.object().keys({
      nama : joi.string().required()
    }),
    produk : joi.object().keys({
      filter : joi.string().required().custom((val, help)=>{        
        if(val === "populer" || val === "terbaru" || val === "terlaris" || val === "harga-rendah" || val === "harga-tinggi"){
          return val
        }        
        help.message("Field filter hanya dapat dimasukan dengan format -> (populer, terbaru, terlaris, harga-rendah, harga-tinggi)")
      }),
      total : joi.number().required(),      
    })
  })

  const {error,value} = schema.validate(req?.body)  

  responseValidator(req, res, next, error, value)

}

const validatorProdDetailAll = (req, res, next) => {

  const schema = joi.object().keys({
    toko : joi.object().keys({
      nama : joi.string().required()
    })
  })

  const {error, value} = schema.validate(req?.body)

  responseValidator(req, res, next, error, value)

}

const validatorUploadAdd  = (req, res, next) => {
  
  const schema = joi.object().keys({
    shopid: joi.number().required()
  })
  
  const {error, value} = schema.validate(req?.params)

  responseValidator(req, res, next, error, value)

}

module.exports = {
  validatorProdAll,
  validatorProdDetailAll,
  validatorNetProdAll,
  validatorNetProdDetail,
  validatorUploadAdd
}