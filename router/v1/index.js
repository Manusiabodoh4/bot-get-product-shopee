const express = require('express')

const prodAll = require('../../browser/prodAll')
const close = require("../../browser/close")

const { response } = require('../../helper/response')
const { makeShopeeURL } = require('../../helper/url')
const { validatorProdAll, validatorProdDetailAll } = require('../../middleware/joi')

const app = express.Router()

app.post("/prod/a", validatorProdAll ,async (req, res)=>{

  const {toko, produk} = req?.valid  
  
  const leng = produk?.total    

  let URL = ""

  URL = makeShopeeURL(toko?.nama, 0, produk?.filter)

  let data = null

  const tempateResponse = {
    total : 0,
    produk : []
  }

  let status = true

  for(let i=0;i<leng;i++){
    
    URL = makeShopeeURL(toko?.nama, i, produk?.filter)    
    
    data = await prodAll.run(URL)

    if(data === null){
      status = false
      break
    }

    tempateResponse.total = tempateResponse.total + data.total
    tempateResponse.produk = tempateResponse.produk.concat(data.produk)

  }  

  if(status){
    response(res, 200, "Success get data", tempateResponse)      
    return
  }

  response(res, 500, "System failed run, please re run execution", null)

})

app.post("/prod/d/a", validatorProdDetailAll , async (req, res)=>{

})

app.get("/close", async (req, res) => {

  await close.run()

  response(res, 200, "Berhasil menutup browser", null)

})

module.exports = app