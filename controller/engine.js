const Product = require("../model/product")

const getDataWithShopName = async (name) => {
  return await Product.find({shop:{name:name}})    
}

const updateDataDetailProduct = async (name = "", total = 0,detail = []) => {
  if(name === "" || detail.length === 0 || total === 0) return false
  
  try {
    
    await Product.updateOne({shop:{name}}, {product:{total, detail}})

    return true

  } catch (error) {
  
    console.log(error)
    return false

  }

}

const insertDataProduct = async (name, total, product) => {

  name = (name||"")
  total = (total||0)
  product = (product||[])

  if(name === "" || total === 0 || product?.length === 0){
    return false
  }

  try {

    await Product.deleteOne({shop:{name:name}})

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
  getDataWithShopName,
  updateDataDetailProduct
}