import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import qs from 'qs'

let root = '/api'
// 创建axios实例
const service = axios.create({
    baseURL:root , // api的base_url
    timeout: 15000 // 请求超时时间
})
// service.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;application/json;charset=utf-8'
service.defaults.headers['Content-Type'] = 'application/json;charset=utf-8;application/x-www-form-urlencoded'
// request拦截器
service.interceptors.request.use(config => {

    if (config.method === 'post') {

        // config.data = qs.stringify(config.data, {arrayFormat: 'brackets'})

        return config
    }
    if (store.getters.token) {
        config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
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
         * code为非20000是抛错 可结合自己业务进行修改
         */
        const res = response.data
        if (res.status === 200||res.status === 304||res.status === 400 ) {

            Message({
                message:'哪里错了',
                type: 'error',
                duration: 5 * 1000
            })

            // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('FedLogOut').then(() => {
                        location.reload()// 为了重新实例化vue-router对象 避免bug
                    })
                })
            }
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    error => {
        // console.log(error)// for debug
        Message({
            message: '用户不存在',
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)
// 返回在vue模板中的调用接口
export default service






