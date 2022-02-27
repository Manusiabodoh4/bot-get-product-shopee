//template response

const templateResponse = {
  status : false,
  data : null,
  message : "",
}


const response = (res, code, message, data) => {

  if(code === 200){
    templateResponse.status = true
  }

  templateResponse.message = message
  templateResponse.data = data

  res.status(code).json(templateResponse)
  res.end()

}

const responseValidator = (req, res, next, error, value) => {
  
  if(error === null || typeof error === "undefined"){
    req.valid = value
    next()
  }

  templateResponse.data = error
  templateResponse.message = "Terdapat kesalahan pada format pengiriman (Request)"

  res.status(400).json(templateResponse)
  res.end()

}

module.exports = {
  response, 
  responseValidator
}