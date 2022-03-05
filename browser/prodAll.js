const pup = require('puppeteer-extra').default
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

const DataStatic = require('../helper/data')
const { delay } = require('../helper/delay')

pup.use(StealthPlugin())

let browser = null

const run = async (url, isLast) => {  
  
  isLast = (isLast||false)  

  try {  
    if(DataStatic.browserWsEndpoint.length === 0 || browser === null){    
      browser = await pup.launch({
        headless: false,         
        ignoreHTTPSErrors: true,     
        args : [      
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--single-process",
          "--disable-gpu"
        ],
        defaultViewport:{
          width: 1366,
          height: 768,
          isLandscape : true
        }
      })          
    }else{        
      browser = await pup.connect({
        browserWSEndpoint : DataStatic.browserWsEndpoint,        
        ignoreHTTPSErrors: true,                     
        defaultViewport:{
          width: 1366,
          height: 768,
          isLandscape : true
        }
      })
    }
    

    DataStatic.browserWsEndpoint =  browser.wsEndpoint()

    const pages = await browser.pages()    

    const page = pages[0]      

    await page.goto(url, {waitUntil:"domcontentloaded", timeout:0});              
    
    await page.waitForXPath("//div[contains(@class, 'shop-search-result-view')]")    

    //scroll with iteration delay
    // await page.evaluate( async () => {            

    //   let scrollPosition = 0
    //   let documentHeight = document.body.scrollHeight      

    //   const iteration = 500

    //   while (documentHeight > scrollPosition) {
    //     window.scrollBy(0, iteration)
    //     await new Promise(resolve => {
    //       setTimeout(resolve, 1000)
    //     })
    //     scrollPosition = scrollPosition + iteration     
    //     documentHeight = document.body.scrollHeight
    //   }            
    // });                
    
    await delay(5000)

    //get length list product  
    const elementListProduct = await page.$x(`//div[contains(@class, 'shop-search-result-view')]/div[1]`)         
    const childrenElementListProduct = await elementListProduct[0].getProperty('children')
    const lengElementListProduct = await (await childrenElementListProduct.getProperty("length")).jsonValue()

    console.log("Read data : "+lengElementListProduct+" pcs -> ("+url+")")

    let link = ""  
    let name = ""  
    // let image = ""
    let status = true

    const templateObjectReturn = {
      total : lengElementListProduct,
      produk : [],      
    }

    for(let i=1;i<=lengElementListProduct;i++){      
      
      const itemProduct = await page.$x(`//div[contains(@class, 'shop-search-result-view')]/div[1]/div[${i}]/a`)        
      const itemName = await page.$x(`//div[contains(@class, 'shop-search-result-view')]/div[1]/div[${i}]/a/div/div/div[2]/div[1]/div[1]/div`)         

      // const itemImage = await page.$x(`//div[contains(@class, 'shop-search-result-view')]/div[1]/div[${i}]/a/div/div/div[1]/img`)            

      // image = await itemImage[0].evaluate((element)=>{
      //   return element.getAttribute("src")
      // })            

      link = await (await itemProduct[0].getProperty("href")).jsonValue()            
      name = await (await itemName[0].getProperty("textContent")).jsonValue()                

      const templateObject = {
        link, name, status
      }

      templateObjectReturn.produk.push(templateObject)      

    }       

    if(isLast){      

      await page.evaluate(async()=>{
        const scrollShopPage = document.getElementsByClassName("shopee-page-controller")        
        scrollShopPage[0].scrollIntoView()        
      })      
      
      await page.waitForXPath("//div[contains(@class, 'shop-sold-out-items-view')]")      

      const itemSoldOut = await page.$x(`//div[contains(@class, 'shop-sold-out-items-view')]/div/div[2]/div`)
      const childrenItemSoldout = await itemSoldOut[0].getProperty('children')
      const lengChildrenItemSoldOut = await (await childrenItemSoldout.getProperty("length")).jsonValue()

      console.log("Read data (empty) : "+lengChildrenItemSoldOut+" pcs -> ("+url+")")

      for(let i=1;i<=lengChildrenItemSoldOut;i++){      

        const itemProduct = await page.$x(`//div[contains(@class, 'shop-sold-out-items-view')]/div/div[2]/div/div[${i}]/a`)        
        const itemName = await page.$x(`//div[contains(@class, 'shop-sold-out-items-view')]/div/div[2]/div/div[${i}]/a/div/div/div[2]/div`)         

        link = await (await itemProduct[0].getProperty("href")).jsonValue()            
        name = await (await itemName[0].getProperty("textContent")).jsonValue()                

        status = false

        const templateObject = {
          link, name, status
        } 

        templateObjectReturn.produk.push(templateObject)              

      }
      
      templateObjectReturn.total = templateObjectReturn.total + lengChildrenItemSoldOut

    }    

    return templateObjectReturn

  } catch (error) {
    console.log(error)
    return null    
  }

}

module.exports = {
  run
}