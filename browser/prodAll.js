const pup = require('puppeteer-extra').default
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

const DataStatic = require('../helper/data')
const { delay } = require('../helper/delay')

pup.use(StealthPlugin())

let browser = null

const run = async (url) => {    

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
        browserWSEndpoint : DataStatic.browserWsEndpoint
      })
    }
    

    DataStatic.browserWsEndpoint =  browser.wsEndpoint()

    const pages = await browser.pages()

    const page = pages[0]  

    await page.goto(url, {waitUntil:"domcontentloaded", timeout:0});        

    await delay(10000)  

    //get length list product  
    const elementListProduct = await page.$x(`//div[contains(@class, 'shop-search-result-view')]/div[1]`)  
    const childrenElementListProduct = await elementListProduct[0].getProperty('children')
    const lengElementListProduct = await (await childrenElementListProduct.getProperty("length")).jsonValue()

    console.log("Read data : "+lengElementListProduct+" pcs -> ("+url+")")

    let link = ""  
    let name = ""  

    const templateObjectReturn = {
      total : lengElementListProduct,
      produk : []
    }

    for(let i=1;i<=lengElementListProduct;i++){
      
      const itemProduct = await page.$x(`//div[contains(@class, 'shop-search-result-view')]/div[1]/div[${i}]/a`)        
      const itemName = await page.$x(`//div[contains(@class, 'shop-search-result-view')]/div[1]/div[${i}]/a/div/div/div[2]/div[1]/div[1]/div`)         

      link = await (await itemProduct[0].getProperty("href")).jsonValue()            
      name = await (await itemName[0].getProperty("textContent")).jsonValue()    

      const templateObject = {
        link, name
      }

      templateObjectReturn.produk.push(templateObject)

    }       

    return templateObjectReturn

  } catch (error) {
    return null    
  }

}

module.exports = {
  run
}