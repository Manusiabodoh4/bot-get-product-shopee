const mongo = require("mongoose")

const product = require("../../model/product")
const {BinarySearchTree} = require(".");
const { default: axios } = require("axios");
const bst = BinarySearchTree

const run  = async function () {  

  await mongo.connect("mongodb://127.0.0.1:27017", {
    dbName:"Bot",
    maxPoolSize: 25
  })    

  const arr = await product.findOne({shop:{name:"tntbeautyshop"}});
  
  const data = arr?.product?.detail    

  for(let i=0;i<data?.length;i++){      
    const convertName = bst.convertTextToNumber(data[i]?.name)    
    bst.add(convertName, data[i], true)
  }


  const start = performance.now()  

  const nameProduct = "FOCALLURE 6 Pcs Makeup Brushes Set FA 70 A | FA70"

  const keySearch = bst.convertTextToNumber(nameProduct)  
  console.log(keySearch)

  let plus = 0

  while(true){
    const resSearch = bst.search(keySearch+plus)
    if(resSearch.status && resSearch.data?.name !== nameProduct){      
      console.log("Tidak Ketemu")
      console.log(resSearch)
      plus += 10_000      
      continue
    }  
    console.log("Ketemu")
    console.log(resSearch)
    break
  }  

  const end = performance.now()
  
  console.log(`Selesai : ${end-start}`)

  bst.print()

};

const checkHttp = async () => {

  for(let i=0;i<1;i++){
    const res = await axios.get("https://shopee.co.id/api/v4/item/get?itemid=916590714&shopid=744873",{
      withCredentials:true,
      headers:{
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7",
        "af-ac-enc-dat": "AAUyLjEuMAAAAX+0mlQ/AAAAAAJcAAAAAAAAAACaqf2d6nCXl43qUp5uTlDurxzU95FxtXJiT+jwaRsyxiwXX5ID+ztsEP/7AsdJKI3VmXS7Xq7P1oO1u5BgAaFQOe8p9e4EM5CS1Tm/aX76N6VZunbM04sCKcolNg1Z0w9M3isJe3BU8Sfx/RoKdMm7HnQy2ipQKiavgissUxMSIiB+/cGuxgThtg/pSkAf9esQlNnOdUgztH0NOBais3g2kWOzjLDykZY2dhCO2aemltaYSNH3qpLos1wCO0s3ieXsg9q/qeUBOfiEfBwfEnlY8cK6D+mS+izuW4fUEsbihj+3GWFrc6txHgwvmltdr6URul/bNcp2Sur50wYMwSDikzRUuI9VU/LDpdQRLTm64jX06tURVS3Pa2v0N4wMhs3c/eepLj1lWtbHvNydwzvOa8ZStWbkuVsfU1NJsDNWgchboxnH5IyvTl/zxe2iaGUlVhQnezi7GN9B49To0imbwzU6ZAIWKr3Tsiwkxq+NZO1L7/Rhs/44ox/EVLkpcu2xvGNq9BqrY508wDAjwLfPkzRUuI9VU/LDpdQRLTm64sE7a6pgLeafJ00eBk9LRieRY7OMsPKRljZ2EI7Zp6aW5cBthv+0MleG91IL4+QR2xUD0DBYru2q6ZM1DGXBN4/ANkzNqvNFPOXe3Xpmr1Y2ELeruvsCa78VxL9+LBAisvU8L0xyLdgGo+xBwv3ANVpgjxbCfd6/Y81Z/LN/Jl9I+IahLPTXJmu3TjyfwSGb0OpvyDS9nVSiQvrk30hABHafgIsuafgATPq8Uo4cqq7ZHZLefFJsmXynydCBmODwDg==",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-api-source": "pc",
        "x-csrftoken": "GwyXPkJw7TcCP4S8jOuAqdhreky06R9P",
        "x-requested-with": "XMLHttpRequest",
        "x-shopee-language": "id",    
        "referer":"https://shopee.co.id/-BPOM-Freeman-Apple-Cider-Vinegar-Mask-i.744873.916590714",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      }     
    })  
    console.log(res.headers)    
  }

  console.log("Finish")

}



(async()=>{
  await checkHttp()
})()