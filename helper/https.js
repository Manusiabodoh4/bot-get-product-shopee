const URL = require('url')
const https = require('https')
const util = require('util')
const sizeOf = require('image-size')

function httpsGetSizeImage(url){
  return new Promise(function (resolve, reject){
    https.get(URL.parse(url),  function (response) {
      const chunks = []
      response.on('data', function (chunk) {
        chunks.push(chunk)
      }).on('end', function() {
        const buffer = Buffer.concat(chunks)        
        const dimensi =  sizeOf(buffer)        
        if(dimensi?.width < 300 || dimensi?.height < 300){
          resolve("")
        }
        resolve(url)
      })
    })    
  })
}

module.exports = {
  httpsGetSizeImage
}