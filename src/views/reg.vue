<template>
  <div>
      <van-nav-bar title="注册" left-arrow @click-left="$router.back()"></van-nav-bar>

<!-- this.$emit('submit',1) -->

    <van-form @submit="onSubmit" ref="regForm">

      <van-field
        v-model="username"
        name="username"
        label="手机号"
        placeholder="手机号"
        :rules="[{ required: true, message: '请填写手机号' },{ pattern : /^1[3-9]\d{9}$/, message: '手机号格式错误' }]"
      />


    <van-field
      v-model="vercode"
      clearable
      label="验证码"
       name="vercode"
      placeholder="请输入短信验证码"
       :rules="[{ required: true, message: '请填写验证码' },{ pattern:/^\d{6}$/, message: '验证码错误' }]"
    >
      <template #button>
        <van-button size="small" type="primary" @click="send" color='#4badef' native-type="button" :disabled="btnDisabled" >{{code_text}}</van-button>
      </template>
    </van-field> 

      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        placeholder="密码"
       :rules="[{ required: true, message: '请填写密码' },{ validator:(e)=>/^\w{6,12}$/.test(e), message: '密码格式为6-12位字母或数字' }]"
      />
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit" color='#4badef' :loading="submitLoading">提交</van-button
        >
      </div>
    </van-form>


  </div>
</template>

<script>
import { Form } from "vant";
import { Field } from "vant";
import {reg,sendSms} from '@/api/user'
export default {
  components: {
    [Form.name]: Form,
    [Field.name]: Field,
  },
  data() {
    return {
      username: "",
      password: "",
      vercode: "",
      btnDisabled:false,
      code_text:"发送验证码",
      submitLoading:false
    };
  },

  methods: {
    onSubmit(values) {
        //  在这那额数据是校验过的  
      console.log("submit", values);
      
      this.submitLoading = true

      reg(values).then(res=>{
        console.log(res)
            
    
      }).finally(e=>{
  this.submitLoading = false
      })




    },
    //发送
    async send(){
      
      try {
           await this.$refs.regForm.validate('username');///   

           //  

           this.btnDisabled = true;//  不可点击

           this.code_text = '发送中...'
          
          let timer = null;
          let count = 10;
         sendSms({
              mobile:this.username,
              type:'register'
            }).then(res=>{

              if(res.code == 0){
                    this.$toast(`验证码已经发送到${this.username},请注意查收`);

                      timer = setInterval(e=>{
                                count--;
                               this.code_text = `${count}s后再次发送`;
                               if(count<=0){
                                  clearInterval(timer);
                                  count = 10;
                                  this.code_text = '再次获取';
                                   this.btnDisabled = false;//  不可点击
                               }
                      },1000)



              }else{

                  this.$toast(res.msg);
                  this.btnDisabled = false;//

                this.code_text = '再次发送'

            }

            }).catch(err=>{
                  // 提示失败   再次发送  恢复到可以点击的状态

                  this.$toast(res.msg||'网络错误')

               this.btnDisabled = false;//

                this.code_text = '再次发送'
            })


      } catch (error) {

        
        
      }
  




    }
  },
};
</script>

<style>
</style>