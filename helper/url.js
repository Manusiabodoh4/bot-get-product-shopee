const makeShopeeURL = (toko,page,filter) => {
  
  page = (page||0)
  filter = (filter||"")

  let URL = ""

  switch (filter) {
    case "populer":
      URL = "https://shopee.co.id/"+toko+"?page="+page+"&sortBy=pop"
      break;
    case "terbaru":
      URL = "https://shopee.co.id/"+toko+"?page="+page+"&sortBy=ctime"
      break;
    case "terlaris":
      URL = "https://shopee.co.id/"+toko+"?page="+page+"&sortBy=sales"
      break;
    case "harga-rendah":
      URL = "https://shopee.co.id/"+toko+"?order=asc&page="+page+"&sortBy=price"
      break;
    case "harga-tinggi":
      URL = "https://shopee.co.id/"+toko+"?order=desc&page="+page+"&sortBy=price"
      break;
    default:
      URL = "https://shopee.co.id/"+toko+"?page="+page
      break;
  }

  return URL+"#product_list"

}

const convertUrl = (name="", shopid, itemid) => {    
  name = (name||"")
  shopid  =(shopid||-1)
  itemid = (itemid||-1)    
  if(name === "" || shopid === -1 || itemid === -1) return ""
  const generateSpesialCharater = name.replace(/[^a-zA-Z ]/g, " ")
  const generateName = generateSpesialCharater.replace(/ /g,"-")
  return `https://shopee.co.id/${generateName}-i.${shopid}.${itemid}`
}


const makeShopeeImageURL = (id) => {    
  return "https://cf.shopee.co.id/file/"+id
}

const makeShopeeVideoURL = (id) => {  
  return "https://cvf.shopee.co.id/file/"+id
}

module.exports = {
  makeShopeeURL,
  convertUrl,
  makeShopeeImageURL,
  makeShopeeVideoURL
}