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

    console.log("Hello")

    //get price product
    const priceProduct = await page.$x(`//div[contains(@class, '2v0Hgx')]`)    
    const priceTextProduct = await (await priceProduct[0].getProperty("textContent")).jsonValue()    

    //get varian product
    const varianProduct = await page.$x(`//div[contains(@class, 'flex _3qYU_y _6Orsg5')]/div`)
    const childrenElementVarian = await varianProduct[0].getProperty('children')
    const lengElementVarian = await (await childrenElementVarian.getProperty("length")).jsonValue()

    console.log("Read varian : "+lengElementVarian+" pcs -> ("+url+")")

    const templateDetailProduct = {
      price :"",
      totalVarian : 0,
      varian : []
    }

    templateDetailProduct.price = priceTextProduct

    if(lengElementVarian === 1){      
      return templateDetailProduct
    }

    for(let i=1;i<=lengElementVarian-1;i++){

      const item = await page.$x(`//div[contains(@class, 'flex _3qYU_y _6Orsg5')]/div/div[${i}]/div`)
      const childrenButton = await item[0].getProperty('children')
      const lengChildrenVarian = await (await childrenButton.getProperty("length")).jsonValue()      

      for(let j=1;j<=lengChildrenVarian;j++){                
        
        const obVarian = {
          name : "",
          price: "",
          status : false
        }

        const buttonVarian = await page.$x(`//div[contains(@class, 'flex _3qYU_y _6Orsg5')]/div/div[${i}]/div/button[${j}]`)
        const textButtonVarian = await (await buttonVarian[0].getProperty("textContent")).jsonValue()
        //const statusButtonVarian = await (await buttonVarian[0].getProperty("aria-disabled")).jsonValue()

        const statusButtonVarian = await page.$x(`//div[contains(@class, 'flex _3qYU_y _6Orsg5')]/div/div[${i}]/div/button[${j}]/@aria-disabled`)
        const status = await (await statusButtonVarian[0].getProperty("value")).jsonValue()        

        await buttonVarian[0].click()

        await delay(1000)

        const priceVarian = await (await priceProduct[0].getProperty("textContent")).jsonValue()

        obVarian.name = textButtonVarian
        obVarian.status = !status
        obVarian.price = priceVarian

        console.log(obVarian)

        templateDetailProduct.varian.push(obVarian)

      }

      templateDetailProduct.totalVarian = templateDetailProduct.totalVarian + lengChildrenVarian

    }

    console.log(templateDetailProduct)

    return templateDetailProduct
    
  } catch (error) {
    
    console.log(error)
    return null

  }

}

module.exports = {
  run
}