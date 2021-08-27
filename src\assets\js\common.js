//深克隆
const clone = (obj) => {
  let newObj = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === "object") {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = (obj && typeof obj[key] === 'object') ? clone(obj[key]) : obj[key];
      }
    }
  }
  return newObj
}

//下载文件
const download = (src,filName)=>{
  let x = new XMLHttpRequest();
  x.open("GET",src,true);
  x.responseType = "blob";
  x.onload = function(e){
    let url = window.URL.createObjectURL(x.response)
    let a = document.createElement('a')
    a.href= url
    a.download = filName
    a.click()
  }
  x.send()
}

module.exports = {
  clone,
  download
}
