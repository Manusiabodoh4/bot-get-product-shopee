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

module.exports = {
  makeShopeeURL
}