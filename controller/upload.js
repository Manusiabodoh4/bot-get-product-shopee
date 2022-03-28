const ProductDetailNet = require("../model/productDetailNet");
const ProductNet = require("../model/productNet");
const File = require("../model/file");

const { v4: uuidv4 } = require('uuid');

const fs = require('fs')
const util = require('util')

const copyFilePromise = util.promisify(fs.copyFile)
const readFilePromise = util.promisify(fs.readFile)
const writeFilePromise = util.promisify(fs.writeFile)

const ExcelJS = require('exceljs')
const xlsx = require('xlsx');
const { makeShopeeImageURL } = require("../helper/url");
const { setLengWords } = require("../helper/parserString");
const { httpsGetSizeImage } = require("../helper/https");

const maksProductUploadOnce = 25;

function calculateFilesCreated(leng){
  leng = (leng||0)
  if(leng < maksProductUploadOnce) return 1;
  return Math.floor(leng/maksProductUploadOnce)+1
}

function createLocateFilePublicWithName(name){
  name = (name||"")
  return `${process.cwd()}/public/${name}.xlsx`
}

async function uploadTemplate(shopid, files){

  if(shopid === null || typeof shopid === "undefined" || files === null || typeof files === "undefined") return {status:false, data:null};

  const dataProd = await ProductNet.findOne({shopid})
  const listProd = dataProd?.product

  const listAddressFile = [];

  const lengFilesWillCreate = calculateFilesCreated(listProd?.length)

  let modLeng = listProd?.length % maksProductUploadOnce

  let uuid = ""
  let locateFilePublic = ""

  for(let i=0;i<lengFilesWillCreate;i++){
    
    uuid = uuidv4()
    
    locateFilePublic = createLocateFilePublicWithName(uuid)
    
    await copyFilePromise(files?.tempFilePath, locateFilePublic)

    listAddressFile.push(`${uuid}.xlsx`)

    let workbook = xlsx.readFile(locateFilePublic, {cellStyles:true})        

    let worksheet = workbook.Sheets[workbook.SheetNames[0]]     
    
    let nestedData = await generateDataToExcelFile(listProd, i, lengFilesWillCreate, modLeng)

    xlsx.utils.sheet_add_aoa(worksheet, nestedData, {origin:`B4`})

    xlsx.writeFileXLSX(workbook, locateFilePublic)

  }  

  const obFile = new File({
    addressFile:listAddressFile
  })

  const resSave = await obFile.save();  

  return {status:true, data:{id:resSave?._id, listFile:listAddressFile}}

}

async function generateDataToExcelFile(listData, page, maxPage, modLeng){

  page = (page||0)
  maxPage = (maxPage||0)
  listData = (listData||[])

  let start = 0;
  let end = 0;

  start = page*maksProductUploadOnce

  if(page === (maxPage-1)){
    end = start+modLeng
  }else{    
    end = ((page+1)*maksProductUploadOnce)-1
  }

  let dataDetail = null    
  let nestedData = []

  for(let i=start;i<end;i++){

    dataDetail = (await ProductDetailNet.findOne({itemid:listData[i]?.itemid}))?.detail

    let lengVarian = dataDetail?.models?.length

    if(lengVarian > 30){
      lengVarian = 30
    }

    let checkVarian = []

    for(let v=0;v<lengVarian;v++){
      
      let data = []      
      
      data.push(setLengWords(dataDetail?.name, 70))

      if(v === 0){
        data.push(setLengWords(dataDetail?.description, 2_000))
        data.push(500)
        data.push(1)
        data.push("")
        data.push("")
        data.push("Baru")
  
        let totalImage = 0;
        if(dataDetail?.images?.length > 5){
          totalImage = 5
        }else{
          totalImage = dataDetail?.images?.length
        }
  
        for(let j=0;j<totalImage;j++){
          // Image URL
          let urlImage = makeShopeeImageURL(dataDetail?.images[j])                                   
          urlImage = await httpsGetSizeImage(urlImage)          
          data.push(urlImage)
        }

        for(let j=0;j<5-totalImage;j++){
          data.push("")
        }
  
        for(let j=0;j<3;j++){
          // Video URL
          data.push("")
        }      
      }else{
        for(let j=0;j<14;j++){
          data.push("")
        }
      }
      
      //SKU - Asuransi
      let tempModel = dataDetail?.models[v]
      data.push(tempModel?.modelid)
      // data.push("")
      data.push(tempModel?.stock===0?"Nonaktif":"Aktif")
      data.push(tempModel?.stock)
      data.push(parseInt(tempModel?.price)/100_000)
      data.push("opsional")

      if(lengVarian === 1) continue;

      data.push("Cover")
      let nameVarian = setLengWords(tempModel?.name, 13)
      let foundIndex = checkVarian.findIndex((d)=>d?.toLowerCase()===nameVarian?.toLowerCase())
      if(foundIndex !== -1){
        nameVarian = nameVarian + Math.floor(Math.random() * 10) + 1;
      }
      checkVarian.push(nameVarian?.toLowerCase())        
      data.push(nameVarian)
      
      data.push("")
      data.push("")

      data.push("")
      data.push("")

      nestedData.push(data)

    }        
        
  }  

  return nestedData

}

module.exports = {
  uploadTemplate
}

