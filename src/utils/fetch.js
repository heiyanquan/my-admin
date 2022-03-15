import axios from 'axios'
import { message } from 'antd'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 60000
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    // Do something with request error
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  (res) => {
    const { code, data: resData } = res.data
    const resDataInfor = resData || res.data.result
    if (code !== 200) {
      message.error(res.mesage || res.data.message)
      return Promise.reject(res)
    }
    return resDataInfor
  },
  (error) => {
    return Promise.reject(error)
  }
)
const fetch = (method, url, data, config = {}) => {
  let result
  if (method === 'post') {
    result = service.post(url, data, config)
  }
  if (method === 'get') {
    result = service.get(url, {
      params: data,
      ...config
    })
  }
  if (method === 'put') {
    result = service.put(url, data, config)
  }
  if (method === 'delete') {
    result = service.delete(url, {
      params: data,
      ...config
    })
  }
  if (method === 'download') {
    result = service.download({ url, data })
  }
  return result
}

export default fetch
