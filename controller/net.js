const {default:axios} = require("axios")
const { convertUrl } = require("../helper/url")
const ProductDetailNet = require("../model/productDetailNet")
const ProductNet = require("../model/productNet")

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
    let cookie = ""

    for(let i=0;i<totalPage;i++){      

      randomDelay = Math.floor(Math.random() * 1000) + 200;

      generatorNewest = 30*i      

      generateUrl = `https://shopee.co.id/api/v4/search/search_items?by=ctime&limit=30&match_id=${shopid}&newest=${generatorNewest}&order=desc&page_type=shop&scenario=PAGE_OTHERS&version=2`            

      console.log(generateUrl)

      try {
        response = await axios.get(generateUrl, {
          withCredentials:true,
          headers:{  
            'Cookie': cookie,
            'Content-Type': 'application/json',
            'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'
          }
        })         
        cookie = response.headers['set-cookie'].toString()
      } catch (error) {          
        console.log("Skip! "+i)
        continue;
      }

      dataItemProduct = response?.data?.items      

      for(let j=0;j<dataItemProduct?.length;j++){                
        const templateProduct = {
          link:"",
          detail:null
        }
        templateProduct.link = convertUrl(dataItemProduct[j]?.item_basic?.name, dataItemProduct[j]?.item_basic?.shopid, dataItemProduct[j]?.item_basic?.itemid)
        templateProduct.detail = dataItemProduct[j]
        template.product.push(templateProduct)
      }      

    }    

    const totalPageSoldout = Math.floor(totalSoldOut/30)+1    
    
    for(let i=0;i<totalPageSoldout;i++){    
      
      randomDelay = Math.floor(Math.random() * 1000) + 200;

      generatorNewest = 30*i

      generateUrl = `https://shopee.co.id/api/v4/search/search_items?by=ctime&limit=30&match_id=${shopid}&newest=${generatorNewest}&order=desc&page_type=shop&scenario=PAGE_OTHERS&version=2&only_soldout=1`      

      console.log(generateUrl)

      try {
        response = await axios.get(generateUrl, {
          withCredentials:true,
          headers:{                            
            'Cookie': cookie,
            'Content-Type': 'application/json',
            'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'
          }
        })         
        cookie = response.headers['set-cookie'].toString()
      } catch (error) {  
        console.log("Skip "+i)        
        continue
      }

      dataItemProduct = response?.data?.items      

      for(let j=0;j<dataItemProduct?.length;j++){    
        const templateProduct = {
          link:"",
          detail:null
        }            
        templateProduct.link = convertUrl(dataItemProduct[j]?.item_basic?.name, dataItemProduct[j]?.item_basic?.shopid, dataItemProduct[j]?.item_basic?.itemid)
        templateProduct.detail = dataItemProduct[j]
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

    console.log("Total : "+dbProduct?.length)

    for(let i=0;i<dbProduct?.length;i++){

      generateUrl = `https://shopee.co.id/api/v4/item/get?itemid=${dbProduct[i]?.detail?.item_basic?.itemid}&shopid=${shopid}`

      while(true){
        try {
          response = await axios.get(generateUrl, {
            withCredentials:true,
            headers:{                            
              'Cookie': cookie,
              'Content-Type': 'application/json',
              'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'
            }
          })         
          cookie = response.headers['set-cookie'].toString() 
          break
        } catch (error) {        
          console.log("Wait.. "+i)                  
        }            
      }

      await ProductDetailNet.deleteOne({itemid:dbProduct[i]?.detail?.item_basic?.itemid})      

      const obProductDetailNew = new ProductDetailNet({
        itemid:dbProduct[i]?.detail?.item_basic?.itemid,
        detail:response?.data?.data
      })

      await obProductDetailNew.save()  
      
      console.log("Data "+i+1+" Finish..")

    }

    return true

  }

}