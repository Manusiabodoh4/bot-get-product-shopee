const express = require('express')
const { validatorProdAll, validatorProdDetailAll } = require('../../middleware/joi')
const app = express.Router()

app.post("/prod/a", express.json(), validatorProdAll ,()=>{

})

app.post("/prod/d/a", express.json(), validatorProdDetailAll ,()=>{

})

module.exports = app