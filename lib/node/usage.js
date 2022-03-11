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

  const keySearch = bst.convertTextToNumber("Vaseline Healthy White Hand body | Body Lotion Aloe Soothe Perfect 10 Night Repair | Pelembab Kulit")
  console.log(keySearch)
  const resSearch = bst.search(keySearch)

  console.log(resSearch)

  const end = performance.now()

  bst.print()
  
  console.log(`Selesai : ${end-start}`)

};

(async()=>{
  await run()
})()