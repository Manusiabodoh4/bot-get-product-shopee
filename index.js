const express = require('express')
const fileUpload = require('express-fileupload');
const app = express();

const mongo = require("mongoose")

const cors = require('cors')

//versioning
const ve1 = require("./router/v1/engine/index")
const vn1 = require("./router/v1/network/index")
const vu1 = require("./router/v1/upload/index")

app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

app.use("/v1/e", ve1)
app.use("/v1/n", vn1)
app.use("/v1/u/", vu1)

mongo.connect("mongodb://127.0.0.1:27017", {
  dbName:"Bot",
  maxPoolSize: 25
}).then(()=>{
  app.listen(6666, ()=>{
    console.log("App running in port 6666")
  })
}).catch(err => {
  console.log(err)
})