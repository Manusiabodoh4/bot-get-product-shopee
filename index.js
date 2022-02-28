const express = require('express')
const app = express();

const mongo = require("mongoose")

const cors = require('cors')

//versioning
const v1 = require("./router/v1/index")

app.use(cors())
app.use(express.json())

app.use("/v1", v1)

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