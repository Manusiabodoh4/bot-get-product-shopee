const Product = require("../model/product")

const getDataWithShopName = async (name) => {
  return await Product.find({shop:{name:name}})    
}

const insertDataProduct = async (name, total, product) => {

  name = (name||"")
  total = (total||0)
  product = (product||[])

  if(name === "" || total === 0 || product?.length === 0){
    return false
  }

  try {

    const dataProduct = await getDataWithShopName(name)

    if(dataProduct.length !== 0){      
      // schema with checking data before and after
      if(dataProduct[0]?.product?.total === total) return false            
    }    

    const objectProduct = new Product({
      shop : {
        name : name
      },
      product : { 
        total : total,
        detail : product
      }
    })

    objectProduct.save()

    return true

  } catch (error) {

    console.log(error)

    return false

  }  
}

module.exports = {
  insertDataProduct,
  getDataWithShopName
}