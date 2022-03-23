const {default:axios} = require("axios")
const { convertUrl } = require("../helper/url")
const ConnectionNode = require("../lib/node/connection")
const ProductDetailNet = require("../model/productDetailNet")
const ProductNet = require("../model/productNet")
const { delay } = require("../helper/delay")

module.exports  = {
  
  getProductAll : async (shopid, shopname, totalPage, totalSoldOut) => {

    shopid = (shopid||-1)
    shopname = (shopname||"")
    totalPage = (totalPage||0)

    if(totalPage === 0 || shopid === -1 || shopname === "") return -1

    let generatorNewest = 0
    let generateUrl = ""
    let response = null    

    const template = {
      name:shopname,
      shopid,
      product:[]
    }    

    let dataItemProduct = []    
    let cookie = "";

    let objectHeaderAxios = (i, status) => {
      if(!status){
        if(cookie?.length === 0){
          return {            
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7",
            "if-none-match-": "55b03-0783f43193dce10368c56496b2e7bc94",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-api-source": "pc",
            "x-requested-with": "XMLHttpRequest",
            "x-shopee-language": "id",            
            "Referrer-Policy": "strict-origin-when-cross-origin"
          }
        }
        return {  
          "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7",
            "if-none-match-": "55b03-0783f43193dce10368c56496b2e7bc94",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-api-source": "pc",
            "x-requested-with": "XMLHttpRequest",
            "x-shopee-language": "id",
            "cookie":cookie,            
            "Referrer-Policy": "strict-origin-when-cross-origin"
        }
      }
      if(cookie?.length === 0){
        return {            
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7",
          "if-none-match-": "55b03-0783f43193dce10368c56496b2e7bc94",
          "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Linux\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-api-source": "pc",
          "x-requested-with": "XMLHttpRequest",
          "x-shopee-language": "id",
          "Referer": `https://shopee.co.id/tntbeautyshop?page=${i}&sortBy=ctime`,
          "Referrer-Policy": "strict-origin-when-cross-origin"
        }
      }
      return {  
        "accept": "*/*",
          "accept-language": "en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7",
          "if-none-match-": "55b03-0783f43193dce10368c56496b2e7bc94",
          "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Linux\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-api-source": "pc",
          "x-requested-with": "XMLHttpRequest",
          "x-shopee-language": "id",
          "cookie":cookie,
          "Referer": `https://shopee.co.id/tntbeautyshop?page=${i}&sortBy=ctime`,
          "Referrer-Policy": "strict-origin-when-cross-origin"
      }
    }    

    for(let i=0;i<totalPage;i++){            

      generatorNewest = 30*i      

      generateUrl = `https://shopee.co.id/api/v4/search/search_items?by=ctime&limit=30&match_id=${shopid}&newest=${generatorNewest}&order=desc&page_type=shop&scenario=PAGE_OTHERS&version=2`            

      console.log(generateUrl)

      try {
        response = await axios.get(generateUrl, {
          withCredentials:true,
          headers:objectHeaderAxios(i, true)
        })         
        cookie = response.headers['set-cookie'].toString()
      } catch (error) {        
        console.log(error)  
        console.log("Wait! "+i)
        await delay(500)
        continue;
      }

      dataItemProduct = response?.data?.items      

      for(let j=0;j<dataItemProduct?.length;j++){                
        const templateProduct = {
          link:"",
          itemid:"",  
          isNewUpdate: false       
        }        
        templateProduct.link = convertUrl(dataItemProduct[j]?.item_basic?.name, dataItemProduct[j]?.item_basic?.shopid, dataItemProduct[j]?.item_basic?.itemid)        
        templateProduct.itemid = dataItemProduct[j]?.item_basic?.itemid
        const { status } = ConnectionNode.BST.search(dataItemProduct[j]?.item_basic?.itemid)
        templateProduct.isNewUpdate = !status
        template.product.push(templateProduct)
      }      

    }    

    const totalPageSoldout = Math.floor(totalSoldOut/30)+1    
    
    for(let i=0;i<totalPageSoldout;i++){              

      generatorNewest = 30*i

      generateUrl = `https://shopee.co.id/api/v4/search/search_items?by=ctime&limit=30&match_id=${shopid}&newest=${generatorNewest}&order=desc&page_type=shop&scenario=PAGE_OTHERS&version=2&only_soldout=1`      

      console.log(generateUrl)      

      try {
        response = await axios.get(generateUrl, {
          withCredentials:true,
          headers:objectHeaderAxios(i, false)
        })         
        cookie = response.headers['set-cookie'].toString()
      } catch (error) {  
        console.log(error)
        console.log("Wait.. "+i)   
        await delay(500)            
        continue
      }

      dataItemProduct = response?.data?.items      

      for(let j=0;j<dataItemProduct?.length;j++){                
        const templateProduct = {
          link:"",
          itemid:"",  
          isNewUpdate: false       
        }        
        templateProduct.link = convertUrl(dataItemProduct[j]?.item_basic?.name, dataItemProduct[j]?.item_basic?.shopid, dataItemProduct[j]?.item_basic?.itemid)        
        templateProduct.itemid = dataItemProduct[j]?.item_basic?.itemid
        const { status } = ConnectionNode.BST.search(dataItemProduct[j]?.item_basic?.itemid)
        templateProduct.isNewUpdate = !status
        template.product.push(templateProduct)
      }       

    }      
    
    await ProductNet.deleteOne({shopid})

    await (new ProductNet(template)).save()
    
    return template.product?.length

  },

  getDetailProduct : async (shopid) => {
    
    const db = await ProductNet.findOne({shopid})    
    const dbProduct = db?.product

    let response = null
    let generateUrl = ""
    let cookie = "" 

    let objectHeaderAxios = (url) => {      
      if(cookie?.length === 0){
        return {            
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
          "referer":url,                   
          "Referrer-Policy": "strict-origin-when-cross-origin"
        }
      }
      return {  
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
        "cookie": cookie,        
        "referer":url,                   
        "Referrer-Policy": "strict-origin-when-cross-origin"
      }
    } 

    console.log("Total : "+dbProduct?.length)    

    for(let i=0;i<dbProduct?.length;i++){

      generateUrl = `https://shopee.co.id/api/v4/item/get?itemid=${dbProduct[i]?.itemid}&shopid=${shopid}`

      while(true){
        try {          
          response = await axios.get(generateUrl, {
            withCredentials:true,
            headers:objectHeaderAxios(dbProduct[i]?.link)
          })                   
          cookie = response.headers['set-cookie'].toString()           
          break
        } catch (error) { 
          console.log(error)       
          console.log("Wait.. "+i)                  
          await delay(1000)
        }            
      }

      await ProductDetailNet.deleteOne({itemid:dbProduct[i]?.itemid})      

      const obProductDetailNew = new ProductDetailNet({
        itemid:dbProduct[i]?.itemid,
        detail:response?.data?.data
      })

      await obProductDetailNew.save()  
      
      console.log("Data "+i+" Finish..")

    }

    return true

  },

  processCacheProduct : async (shopid) => {

    try {
      
      const db = await ProductNet.findOne({shopid})
      const dbProduct = db?.product      
  
      console.log("Total : "+dbProduct?.length)    
  
      for(let i=0;i<dbProduct?.length;i++){
        ConnectionNode.BST.add(dbProduct[i]?.itemid, dbProduct[i], true)
      }

      return true;

    } catch (error) {
      console.log(error)
      return false;
    }

  }

}