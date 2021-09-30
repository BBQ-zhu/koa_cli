import API from './api';
import axios from "axios";

export async function createlogs(url,form){
  if(url.indexOf('find')!= -1){ //查询接口不加入日志
    return false
  }else{
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}')
    let oldUrl = url.split('/')
    let urlname = oldUrl[oldUrl.length-1]
    let remark = ''
    API.header.map(item=>{
      if(urlname.indexOf(item.name) != -1){
        remark += item.msg
      }
    })
    
    let data = {
      user: `${userInfo.username}(${userInfo.uid})`,
      logdata: JSON.stringify(form),
      remarks: remark
    }
    await axios.post(API.createlogs, data).then(res => {}).catch(err => {}) //创建日志
  }
}

export function createlogsImg(url,form){

    let oldUrl = url.split('/')
    let urlname = oldUrl[oldUrl.length-1]
    let remark = ''
    API.header.map(item=>{
      if(urlname.indexOf(item.name) != -1){
        remark += item.msg
      }
    })
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}')
    let data = {
      user: `${userInfo.username}(${userInfo.uid})`,
      logdata: JSON.stringify(form),
      remarks: remark
    }
    axios.post(API.createlogs, data).then(res => {}).catch(err => {}) //创建日志

}
