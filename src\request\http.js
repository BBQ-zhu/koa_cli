import axios from "axios";
import QS from 'qs';
import {Message} from 'element-ui';
import router from '../router'
import api from './api';
import {createlogs} from './logs';

const baseURL = '/api'
// 环境的切换
if (process.env.NODE_ENV == 'development') {
  axios.defaults.baseURL = baseURL
} else if (process.env.NODE_ENV == 'debug') {
  axios.defaults.baseURL = baseURL
} else if (process.env.NODE_ENV == 'production') {
  axios.defaults.baseURL = baseURL
}

//设置请求超时时间
axios.defaults.timeout = 10000;

//给post设置请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';



//请求拦截器：校验用户token是否有效
axios.interceptors.request.use((config) => {
  if (sessionStorage.getItem('userInfo')) {
    var userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    config.headers['Authorization'] = userInfo.token;
  }
  
  return config
})

//响应拦截器：校验用户token是否有效
axios.interceptors.response.use((success) => {
  if (success.status && success.status == 200) {
    if (success.data.code == 500 || success.data.code == 401 || success.data.code == 403) {
      Message.error(success.data.msg);
      return;
    }
  }
  return success
}, (error) => {
  if (error.response.status == 500 || error.response.status == 504 || error.response.status == 404) {
    Message.error({
      message: error.response.data.message
    });
  } else if (error.response.status == 403) {
    Message.error({
      message: '权限不足，请联系管理员！'
    });
  } else if (error.response.status == 401) {
    Message.error({
      message: '尚未登录，请登录'
    });
    sessionStorage.clear()
    router.replace('/');
  } else {
    if (error.response.data) {
      Message.error({
        message: error.response.data
      });
    } else {
      Message.error({
        message: '未知错误！'
      });
    }
  }
  return;
})

export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params || {}
    }).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.data)
    })
  })
}

export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, QS.stringify(params || {}))
      .then(async res => {
        if(res.data.code == 200){
          await createlogs(url, params) //创建日志
        }
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

