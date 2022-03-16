const pup = require('puppeteer-extra').default
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const { parseBacgroundImage } = require('../helper/backgroundImage')

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

    while(true){
      try {
        await page.waitForXPath("//div[contains(@class, '2v0Hgx')]")    
        await page.waitForXPath("//div[contains(@class, 'flex _3qYU_y _6Orsg5')]/div")        
        await page.waitForXPath("//div[contains(@class, '_2riwuv')]")     
        break
      } catch (error) {
        console.log("Reload")
        await page.reload({waitUntil:"domcontentloaded", timeout:0})       
      }    
    }

    //get price product
    const priceProduct = await page.$x(`//div[contains(@class, '2v0Hgx')]`)    
    const priceTextProduct = await (await priceProduct[0].getProperty("textContent")).jsonValue()    

    //get varian product
    const varianProduct = await page.$x(`//div[contains(@class, 'flex _3qYU_y _6Orsg5')]/div`)
    const childrenElementVarian = await varianProduct[0].getProperty('children')
    const lengElementVarian = await (await childrenElementVarian.getProperty("length")).jsonValue()    

    const templateDetailProduct = {
      price :"",
      totalVarian : 0,
      varian : [],
      media : []
    }        

    templateDetailProduct.price = priceTextProduct                    

    for(let i=1;i<=lengElementVarian-1;i++){

      const item = await page.$x(`//div[contains(@class, 'flex _3qYU_y _6Orsg5')]/div/div[${i}]/div`)
      const childrenButton = await item[0].getProperty('children')
      const lengChildrenVarian = await (await childrenButton.getProperty("length")).jsonValue()      

      for(let j=1;j<=lengChildrenVarian;j++){                
        
        const obVarian = {
          name : "",
          price: "",
          image:"",
          isActive : false
        }

        const buttonVarian = await page.$x(`//div[contains(@class, 'flex _3qYU_y _6Orsg5')]/div/div[${i}]/div/button[${j}]`)
        const textButtonVarian = await (await buttonVarian[0].getProperty("textContent")).jsonValue()                        

        const statusButtonVarian = await page.$x(`//div[contains(@class, 'flex _3qYU_y _6Orsg5')]/div/div[${i}]/div/button[${j}]/@aria-disabled`)
        const status = await (await statusButtonVarian[0].getProperty("value")).jsonValue()                

        await buttonVarian[0].click()        

        try {
          await page.waitForXPath("//div[contains(@class, '_3rslob _1vc1W7')]", {timeout:10000}) 
        } catch (error) {
          //error dan tidak ada image yang terambil
        }       
        
        await delay(100)

        const priceProductVarian = await page.$x(`//div[contains(@class, '2v0Hgx')]`)
        const priceVarian = await (await priceProductVarian[0].getProperty("textContent")).jsonValue()
        const itemImage = await page.$x(`//div[contains(@class, '_3rslob _1vc1W7')]`)            

        if(itemImage[0] === null || typeof itemImage[0] === "undefined") {
          image = ""
        }
        else{
          image = await itemImage[0].evaluate((element)=>{
            return element.getAttribute("style")
          })                                          
        }        

        obVarian.name = textButtonVarian
        obVarian.isActive = !(status === 'true')
        obVarian.price = (!(status === 'true'))?priceVarian:'0'
        obVarian.image = parseBacgroundImage(image)

        templateDetailProduct.varian.push(obVarian)

      }

      templateDetailProduct.totalVarian = templateDetailProduct.totalVarian + lengChildrenVarian

    }

    const media = []

    const listItemMedia = await page.$x(`//div[contains(@class, '_2riwuv')]/div[1]`)
    
    await listItemMedia[0].click()

    await page.waitForXPath("//div[contains(@class, 'flex _1P7dnP')]")
    await page.waitForXPath("//div[contains(@class, '_1zceAY')]/video")
    await page.waitForXPath("//div[contains(@class, '_1jTFGt')]")        

    const listMediaImage = await page.$x("//div[contains(@class, '_1jTFGt')]")
    const childrenListMediaImage = await listMediaImage[0].getProperty('children')
    const lengListMediaImage = await (await childrenListMediaImage.getProperty("length")).jsonValue()

    for(let o=1;o<=lengListMediaImage;o++){

      const itemMediaImage = await page.$x(`//div[contains(@class, '_1jTFGt')]/div[${o}]/div[1]/div`)

      if(o === 1){
        
        await itemMediaImage[0].click()
        
        await delay(250)

        const videoMedia = await page.$x("//div[contains(@class, '_1zceAY')]/video")
        const tempVideoMediaSrc = await videoMedia[0].evaluate((element)=>{
          return element.getAttribute("src")
        })      

        if(tempVideoMediaSrc === null){
          media.push({link:""})
          continue
        }

        media.push({link:tempVideoMediaSrc})

      }

      const styleItemMediaImage = await itemMediaImage[0].evaluate((element)=>{
        return element.getAttribute("style")
      })

      media.push({link:parseBacgroundImage(styleItemMediaImage)})      

    }

    templateDetailProduct.media = media            

    return templateDetailProduct
    
  } catch (error) {
    
    console.log(error)
    return null

  }

}

module.exports = {
  run
}