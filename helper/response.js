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
    return
  }

  console.log(error)
  
  templateResponse.message = "Terdapat kesalahan pada format pengiriman (Request)"
  templateResponse.data = error?.details[0]?.message

  res.status(400).json(templateResponse)
  res.end()

}

module.exports = {
  response, 
  responseValidator
}