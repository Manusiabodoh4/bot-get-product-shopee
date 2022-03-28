function setLengWords(str, leng){  
  return (str?.length<=leng)?str:str?.slice(0, leng);  
}

module.exports = {setLengWords}