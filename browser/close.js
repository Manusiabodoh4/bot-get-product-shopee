const pup = require('puppeteer-extra').default
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const DataStatic = require('../helper/data')

pup.use(StealthPlugin())

const run = async () => {
   
  if(DataStatic.browserWsEndpoint.length === 0) return

  const browser = await pup.connect({
    browserWSEndpoint : DataStatic.browserWsEndpoint
  })

  await browser.close()

  DataStatic.browserWsEndpoint = ""

  return

}

module.exports = {run}