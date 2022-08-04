<template>
  <div>
      <van-nav-bar title="登录" left-arrow @click-left="$router.back()"></van-nav-bar>

<!-- this.$emit('submit',1) -->

    <van-form @submit="onSubmit">

      <van-field
        v-model="username"
        name="username"
        label="手机号"
        placeholder="手机号"
        :rules="[{ required: true, message: '请填写手机号' },{ pattern : /^1[3-9]\d{9}$/, message: '手机号格式错误' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        placeholder="密码"
       :rules="[{ required: true, message: '请填写密码' },{ validator:(e)=>/^\w{6,12}$/.test(e), message: '密码格式为6-12位字母或数字' }]"
      />
      <div style="margin: 16px">
        <van-button round block type="info" color='#4badef' native-type="submit">提交</van-button
        >
      </div>
      <router-link to="/forget">忘记密码</router-link>
      <router-link to="/reg" >注册</router-link>
    </van-form>


  </div>
</template>

<script>
import { Form } from "vant";
import { Field } from "vant";
import {login} from '@/api/user'
export default {
  components: {
    [Form.name]: Form,
    [Field.name]: Field,
  },
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    onSubmit(values) {
        //  在这那额数据是校验过的  
      console.log("submit", values);
      

      login(values).then(res=>{
        console.log(res)

        //  登录成功  
        // 信息存起来
        if(res.code == 0){
          let {userInfo,token,uid,tokenExpired} = res;

       
            localStorage.setItem('token',token)
            localStorage.setItem('tokenExpired',tokenExpired)
           
      this.$store.dispatch('getuserInfo',token) 
     
              //  this.$store.commit('save',['uid',uid])
              //  this.$store.commit('save',['token',token])
              //  this.$store.commit('save',['userInfo',userInfo])
              //  this.$store.commit('save',['isLogin',true]) 
              
            


            setTimeout(v=>{
               this.$router.back()
            },800)
        }else{


        }
 


      })




    }
  },
};
</script>

<style>
</style>