import axios from 'axios'
import Vue from 'vue'
import { Message } from 'element-ui'
import router from '../router'

const Service = axios.create({
    timeout: 100000, // 请求超时时间
    baseURL: process.env.VUE_APP_API,
    method: 'post',
    headers: {
        "Content-type": "application/json"
    }
})

// 请求拦截器
Service.interceptors.request.use((config) => {
    let token = window.sessionStorage.getItem('token')
    if (token) {
        var now = Math.round(new Date() / 1000);
        var expire_time = sessionStorage.getItem('expire_time');
        if (now > expire_time) {
            Message.warning('登陆超时，请重新登陆')
            window.sessionStorage.clear();
            router.push('/login').catch(() => { });
        }
        config.headers['Authorization'] = 'Bearer ' + token //吧token放在请求头
        // config.params.Token=token  //吧token放在请求体
    }
    return config
})

// 响应拦截器
Service.interceptors.response.use((response) => {
    if (response.data.code == 9999) {
        window.sessionStorage.clear();
    }
    return response.data
}, (err) => {
    return Promise.reject(err)
})

export {
    Service
}