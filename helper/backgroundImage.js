module.exports = {
  parseBacgroundImage : (str) => {
    let strImage = ""
    let statusRenderChar = false

    for(let v=0;v<str?.length;v++){
      
      const char = str.charAt(v)          
      
      if(char === '('){
        statusRenderChar = true
      }else if(char === ')'){
        statusRenderChar = false            
        break;
      }

      if(statusRenderChar){
        strImage += char
      }

    }

    return strImage.substring(2, strImage.length-1)

  }
}