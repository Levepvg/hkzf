import axios from 'axios'
//  设置基准地址
axios.defaults.baseURL = 'http://localhost:8080'

//  封装响应拦截器
axios.interceptors.response.use( function (response) {
    return response.data
}, function (error) {
    return Promise.reject(error)
})

export default ({method , url , data , params}) => {
    return axios ({
        method,
        url,
        data,
        params
    })    
}
