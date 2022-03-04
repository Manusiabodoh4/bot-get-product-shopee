const express = require('express')

const prodAll = require('../../browser/prodAll')
const detailProd = require('../../browser/detailProd')
const close = require("../../browser/close")

const { response } = require('../../helper/response')
const { makeShopeeURL } = require('../../helper/url')
const { validatorProdAll, validatorProdDetailAll } = require('../../middleware/joi')
const { insertDataProduct, getDataWithShopName } = require('../../controller')

const app = express.Router()

app.post("/prod/a", validatorProdAll , async (req, res)=>{

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

  await insertDataProduct(toko?.nama, tempateResponse.total, tempateResponse.produk)

  if(status){
    console.log("*===== SELESAI =====*")
    response(res, 200, "Success get data", tempateResponse)      
    return
  }

  response(res, 500, "System failed run, please re run execution", null)

})

app.post("/prod/d/a", validatorProdDetailAll , async (req, res)=>{

  const {toko} = req?.valid

  const dataProduct = await getDataWithShopName(toko?.nama)

  if(dataProduct.length === 0){
    response(res, 404, "Data product empty with shop name "+toko?.nama, null)
    return
  }

  const productDetail = dataProduct[0]?.product    

  let status = true

  //productDetail?.total

  for(let i=0;i<1;i++){
    
    // const url = productDetail?.detail[i]?.link
    const url = "https://shopee.co.id/Fresh-Care-Aromatherapy-Roll-On-Minyak-Angin-FreshCare-Fresh-Care-Teens-Minyak-Angin-Minyak-Aromaterapi-TnT-Beauty-Shop-i.744873.6641331608?sp_atk=23781c03-db8c-4abc-8721-8d2dea112b58"

    const data = await detailProd.run(url)

    if(data === null){
      status = false
      break
    }    

  }

  if(status){
    console.log("*===== SELESAI =====*")
    response(res, 200, "Success get data", {})      
    return
  }

  response(res, 500, "System failed run, please re run execution", null)

})

app.get("/close", async (req, res) => {

  await close.run()

  response(res, 200, "Berhasil menutup browser", null)

})

module.exports = app