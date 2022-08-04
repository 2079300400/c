import http from './http.js'


export function reg(params){
    return http.post('/user/reg',params)
}
export function login(params){
    return http.post('/user/login',params)
}
// 发验证码
export function sendSms(params){
    return http.post('/user/sendSms',params)
}
// 注销账号
export function delete_user(params){
  
    return http.post('/user/delete_user',params)
}
//  获取用户信息
export function getuserInfo(params){
   
    return http.post('/user/getuserInfo',params)
}
//  保存用户信息
export function setuserInfo(params){
   
    return http.post('/user/editUserInfo',params)
}