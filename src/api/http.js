import axios from 'axios';

axios.defaults.baseURL = 'https://d33a5037-6c63-4e92-8bb1-30018ab701ea.bspapp.com/http';


//  拦截器
axios.interceptors.request.use((config)=>{
//   
 return config
},
(err)=>{
    return Promise.reject(err)

})

//  响应拦截

axios.interceptors.response.use((res)=>{

    return res.data

},(err)=>{
    return Promise.reject(err)
})

export default axios;
