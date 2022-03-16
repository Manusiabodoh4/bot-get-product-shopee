const express = require('express')

const prodAll = require('../../browser/prodAll')
const detailProd = require('../../browser/detailProd')
const close = require("../../browser/close")

const { response } = require('../../helper/response')
const { makeShopeeURL } = require('../../helper/url')
const { validatorProdAll, validatorProdDetailAll } = require('../../middleware/joi')
const { insertDataProduct, getDataWithShopName, updateDataDetailProduct } = require('../../controller')
const ConnectionNode = require('../../lib/node/connection')

const app = express.Router()

app.post("/prod/a", validatorProdAll , async (req, res)=>{

  const {toko, produk} = req?.valid  

  const leng = produk?.total    
  let URL = ""  
  let data = null
  const tempateResponse = {
    total : 0,
    produk : []
  }
  let status = true
  let isLast = false
  
  const tree = await ConnectionNode.createConnection(toko?.nama)

  for(let i=0;i<leng;i++){
    
    URL = makeShopeeURL(toko?.nama, i, produk?.filter)    
    
    if(i === (leng-1)){
      isLast = true
    }    

    data = await prodAll.run(URL, isLast, tree)

    if(data === null){
      status = false
      break
    }

    tempateResponse.total = tempateResponse.total + data.total
    tempateResponse.produk = tempateResponse.produk.concat(data.produk)

  }  

  if(status){

    await insertDataProduct(toko?.nama, tempateResponse.total, tempateResponse.produk)

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
  let productDetailItem = productDetail?.detail   

  let status = true

  console.log("Total : "+productDetail?.total)

  for(let i=0;i<productDetail?.total;i++){
    
    const url = productDetailItem[i]?.link

    const data = await detailProd.run(url)    

    productDetailItem[i].price = data?.price
    productDetailItem[i].totalVarian = data?.totalVarian
    productDetailItem[i].varian = data?.varian
    productDetailItem[i]["media"] = data?.media    

    if(data === null){
      status = false
      break
    }    

    console.log(`Progress Data : ${i+1}/${productDetail?.total}`)

  }

  if(status){

    await updateDataDetailProduct(toko?.nama, productDetail?.total, productDetailItem)

    console.log("*===== SELESAI =====*")
    response(res, 200, "Success update detail product", productDetailItem)      
    return
  }

  response(res, 500, "System failed run, please re run execution", null)

})

app.get("/close", async (req, res) => {

  await close.run()

  response(res, 200, "Berhasil menutup browser", null)

})

module.exports = app