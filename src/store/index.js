import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import {SAVE,CHANGE_NUM} from './mutations_type'
import {getuserInfo} from '@/api/user'
import { getQiniuToken, uploadQiniu } from "@/api/api";
export default new Vuex.Store({
  // 存的数据  
  // a  默认值1
  state: {
     uid:'',
     token:'',
     userInfo:{},
     isLogin:false,
     publish_num:0,
     liked_num:0
  },
  //   computed 就是一个vuex里的计算属性
  getters: {
    // sum(){
    //   return this.a+this.b
    // }
  },
  //改数据  commit  同步  
  mutations: {
    [SAVE](state,[key,val]){
      state[key] =val
    },
    clear(state){

      state['uid'] =''
      state['token'] =''
      state['userInfo'] ={}
      state['isLogin'] =false 
      state['liked_num'] =0 
      state['publish_num'] =0 
    
    }
  },
  // dispatch  异步的
  actions: {
    //  调接口  
    getuserInfo({commit},token){

     return  getuserInfo({
        token
      }).then(res=>{
        console.log(res)
       let {uid,userInfo,liked_num,publish_num} = res;
       //  免登录
        commit('save',['uid',uid])
        commit('save',['userInfo',userInfo])
        commit('save',['token',token])
        commit('save',['isLogin',true])
        commit('save',['liked_num',liked_num])
        commit('save',['publish_num',publish_num])

      })
    },
    //  上传图片
    async  upload(o,fileList) {
      //  接收fileList   [file]组成的数组

      if (!Array.isArray(fileList) || fileList.length === 0) {
        return [];
      }

      console.log(fileList)

      // 多图 我们需要多个上传任务
      //  Promise.all   接收一个数组  数组里是多个promise对象
      //  检测 所有的promise都成功以后  把他们所有的resolve的值组成新数组  返回
      let task = fileList.map((v) => {
        return new Promise((resolve, reject) => {
          let file = v.file; // 二进制文件

          //  生成一个随机名字

          let { type } = file; //  jpg png
          type = type.split("/")[1];
          // 重新命名
          let file_name = `${new Date().getTime()}_${Math.random()
            .toString(36)
            .slice(2)}.${type}`;

          getQiniuToken().then(({ token }) => {
            // token   是靠  我们的用户名密码 等认证信息生成的
            console.log(token);

            const formdata = new FormData();
            formdata.append("file", file);
            formdata.append("token", token);
            formdata.append("key", file_name);

            //  上传到七牛云的服务器了

            uploadQiniu(formdata).then((res) => {
              resolve(`http://toutiao.longxiaokj.com/` + res.key);
            });
          });
        });
      });

    let imgList =  await  Promise.all(task);

    return imgList

      //  @return []  上传到服务器的图片路径
    },


  },
  //  模块化  
  modules: {

  }
})
