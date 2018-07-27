import axios from 'axios'
import iView from 'iview'
import auth from './auth'
import consts from '@/utils/consts'


// 创建axios实例
const service = axios.create({
  baseURL: consts.API_URL, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (auth.get()['token'] != null) {
    config.headers['Authorization'] = auth.get()['token'] // 让每个请求携带自定义token 请根据实际情况自行修改
  }

  if(config.data != null ){
    let currentPage = config.data.currentPage;
    let pageSize = config.data.pageSize;

    if(currentPage != null || pageSize != null){
      if(config.url.indexOf("?") == -1){
        config.url = config.url + "?"
      }
    }

    if(currentPage != null ){
      config.url = config.url + "currentPage="+currentPage+"&"
      config.url = config.url + "pageNum="+currentPage+"&"
    }
    if(pageSize != null){
      config.url = config.url + "pageSize="+pageSize
    }
  }

  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * res.ok 可结合自己业务进行修改
  */
    const res = response.data
    if(res.ok){
      return res;
    }else{
      iView.Message.error(res.status.description);
      return Promise.reject(error)  
    }
    
  //   if(res.ok){
  //   //   if(res.status.serviceCode == "TOKEN_CHECK_FAILED" || res.status.serviceCode == "TOKEN_REQUIRED"){
  //   //     //重定向到登录页面
  //   //     res.status.description = "token失效"
  //   //     Message({
  //   //       message: res.status.description || res.status.message,
  //   //       type: 'error'
  //   //     })
  //   //     window.location.href = process.env.LOGIN_URL
  //   //   }else{
  //   //     return response.data;
  //   //   }
  //   // }else{
  //   //   if(res.status.serviceCode == "TOKEN_CHECK_FAILED" || res.status.serviceCode == "TOKEN_REQUIRED"){
  //   //     //重定向到登录页面
  //   //     res.status.description = "token失效"
  //   //   }
  //   //   Message({
  //   //     message: res.status.description || res.status.message,
  //   //     type: 'error'
  //   //   })
  //   //   return Promise.reject('error');
  //   // }
  },
  error => {
    console.log('err' + error)// for debug
    iView.Message.error(error)
    return Promise.reject(error)  
  }
)

export default service
