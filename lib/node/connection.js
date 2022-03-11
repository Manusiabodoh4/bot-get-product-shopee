const { BinarySearchTree } = require(".")
const Product = require("../../model/product")

class ConnectionNode{
  
  static connection = null

  static async createConnection(tokoName){
    if(this.connection === null){      
      this.connection = BinarySearchTree
      const data = await Product.findOne({shop:{name:tokoName}})
      const arr = data?.product?.detail    
      for(let i=0;i<arr?.length;i++){      
        const convertName = this.connection.convertTextToNumber(arr[i]?.name)    
        this.connection.add(convertName, arr[i], true)
      }      
    }
    return this.connection
  }

}

module.exports = ConnectionNode