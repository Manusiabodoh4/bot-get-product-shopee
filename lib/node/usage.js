const mongo = require("mongoose")

const product = require("../../model/product")
const {BinarySearchTree} = require(".")

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

(async()=>{
  await run()
})()