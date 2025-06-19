/* eslint-disable no-unused-vars */
import axios from 'axios'
import { userAuthStore } from '@/stores/auth'
import { refreshTokenAPI } from './user'

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://47.122.130.222:8080',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器（加 token）
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)


// 自动刷新token并重试请求
let isRefreshing = false
let pendingRequests = []


// 响应拦截器(处理token过期)
request.interceptors.response.use(
  async res=> {
    const originalRequest = res.config
    const resData = res.data
    if (resData.code===1003 && !originalRequest._retry){
      originalRequest._retry = true
      if(isRefreshing){
        return new Promise((resolve, reject) => {
          pendingRequests.push(token=>{
          originalRequest.headers.Authorization = `Bearer ${token}`
          resolve(request(originalRequest))
        })
      })
      }

      isRefreshing = true
      const auth = userAuthStore()
      try{
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) throw new Error('缺少 refreshToken')
        const tokenRes = await refreshTokenAPI(refreshToken)
        if (!tokenRes) throw new Error('刷新失败')
        auth.setToken(tokenRes.accessToken, tokenRes.refreshToken)
        // 重试所有挂起请求
        pendingRequests.forEach(cb => cb(tokenRes.accessToken))
        pendingRequests = []
        // 继续原请求
        originalRequest.headers.Authorization = `Bearer ${tokenRes.accessToken}`
        return request(originalRequest)
      }catch(e){
        console.log('token刷新失败，用户登出');
        auth.loginOut()
        location.reload()
        return Promise.reject(e)
      }finally{
        isRefreshing = false
      }
    }
    return res
  },error=>{
    return Promise.reject(error)
  }
)


export default request


