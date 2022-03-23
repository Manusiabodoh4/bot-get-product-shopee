const express = require("express")
const app = express.Router()

const ControllerNet = require("../../../controller/net")
const { validatorNetProdAll, validatorNetProdDetail } = require("../../../middleware/joi")
const { response } = require("../../../helper/response")

const ConnectionNode  = require("../../../lib/node/connection")

app.post("/prod/a", validatorNetProdAll, async (req, res)=>{

  const {id, name, totalPage, totalSoldOut} = req.body?.toko

  const total = await ControllerNet.getProductAll(id, name, totalPage, totalSoldOut)
  
  if(total === -1){
    response(res, 500, "Something error in server", null)
    return
  }

  response(res, 200, "Success Get and Save product", {total})      

})

app.post("/prod/d/a", validatorNetProdDetail, async (req, res)=>{

  const shop = req?.body?.toko  

  const resDetailProduct = await ControllerNet.getDetailProduct(shop?.id)

  if(!resDetailProduct){
    response(res, 500, "Something error in server", null)
    return
  }

  response(res, 200, "Success Get and Save detail product", {})      

})

app.post("/prod/c/a", validatorNetProdDetail, async (req, res)=>{

  const { id } = req?.body?.toko;

  const resCache = await ControllerNet.processCacheProduct(id)

  if(!resCache){
    response(res, 500, "Something error in server", null)
    return
  }

  response(res, 200, "Success Cache All Product", {})      

})

app.get("/prod/t/c", (_, res) =>{

  try {
    ConnectionNode.BST.print()    
    response(res, 200, "Success Print Cache Data", {})      
  } catch (error) {
    response(res, 500, "Something error in server", null)
  }

})

module.exports = app