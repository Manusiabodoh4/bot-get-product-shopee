const { Schema, model } = require('mongoose')

const File = new Schema({
  addressFile:[{type:String}]
})

module.exports = model("File", File)