const express = require('express')
const app = express();

const cors = require('cors')

//versioning
const v1 = require("./router/v1/index")

app.use(cors())
app.use("/v1", v1)


app.listen(6666)