const express = require('express');
const { uploadTemplate } = require('../../../controller/upload');
const { response } = require('../../../helper/response');
const { validatorUploadAdd } = require('../../../middleware/joi');
const app = express.Router();

app.post("/add/:shopid", validatorUploadAdd, async (req, res)=>{

  const { shopid } = req?.valid
  const namePropertie = Object.keys(req?.files)[0]
  const files = req?.files[namePropertie]

  const resUpload = await uploadTemplate(shopid, files)

  if(!resUpload?.status){    
    response(res, 500, "Any Problem in server", resUpload?.data)      
    return
  }

  response(res, 200, "Success calculate and copy File", resUpload?.data)      

})

app.get("/access/files/:uuid", (req, res)=>{
  const { uuid } = req?.params
  res.sendFile(`${process.cwd()}/public/${uuid}`)
});

module.exports = app;