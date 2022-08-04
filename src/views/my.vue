<template>
  <div class="container" style="padding-top: 0;">
  
    <van-cell-group  class="my-info" v-if="isLogin">
      <van-cell
        class="base-info"
        center
        :border="false"
         @click="$router.push('/userinfo')"
      >
        <van-image
          class="avatar"
          slot="icon"
          round
          fit="cover"
          :src="userInfo.avatar"
        />
        <div class="name" slot="title">{{userInfo.nickname}}</div>
        <van-button
          class="update-btn"
          size="small"
          round
        
        >编辑资料</van-button>
      </van-cell>
      <van-grid class="data-info" :border="false" column-num="2">
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-wrap">
            <div class="count">{{publish_num}}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{liked_num}}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <div  class="not-login" v-else @click="$router.push('/login')">
      <div >
        <img class="mobile" src="~@/assets/tel.png">
      </div>
      <div class="text">登录 / 注册</div>
    </div>

    <van-grid class="nav-grid mb-4" :column-num="2">
	  
	    <van-grid-item  class="nav-grid-item">
			
	     <span class="iconfont icon-shoucang"></span>
		 <span>收藏</span>
	    </van-grid-item>
	    <van-grid-item  class="nav-grid-item">
			
	     <span class="iconfont icon-lishi"></span>
		 <span>历史</span>
	    </van-grid-item>
    </van-grid>
    <van-cell title="修改密码" is-link to="/" />
    <van-cell title="联系我们" is-link to="/" />
    <van-cell
      class="mb-4"
      title="关于我们"
      is-link
      to="/"
    />
    <van-cell
      class="logout-cell"
      title="退出登录"
      @click="logout"
      v-if="isLogin"
    />
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex';
import { Dialog } from 'vant';
// mapState 小工具  帮我们少敲几个字符

// function m(arr){
//     let obj = {};
//       arr.forEach(v => {
//         obj[v] = function(){
//           return this.$store.state[v]
//         }
//       });
//     return obj
// }



export default{
  name:"my",
  computed:{
    ...mapState(['userInfo','isLogin','publish_num','liked_num'])
    
  },
  components:{
     [Dialog.Component.name]: Dialog.Component,
  },
  created(){
   
   //  是不是登录状态  有没有用户信息  

  //  如果有 渲染到页面  

  // let {uid,token,userInfo} = localStorage;

  // if(uid){
  //   console.log(uid,token,userInfo)
  // }

  },
  methods:{
    ...mapMutations(['clear']),
    async logout(){
        // 模态框

   try {
        await  Dialog.confirm({
          title: '提示',
          message: '确认退出登录吗?',
        });
          
          localStorage.clear();

          this.clear()


   } catch (error) {
      
   }



      
    }
  }


}
</script>

<style  lang="scss">
.container {
  .my-info {
     background: url("~@/assets/banner.jpg") no-repeat;
    background-size: cover;
    .base-info {
      box-sizing: border-box;
      height: 115px;
      background-color: unset;
      padding-top: 38px;
      padding-bottom: 11px;
      .avatar {
        box-sizing: border-box;
        width: 66px;
        height: 66px;
        border: 1px solid #fff;
        margin-right: 11px;
      }
      .name {
        font-size: 15px;
        color: #fff;
      }
      .update-btn {
        height: 24px;
        font-size: 12px;
        color: #666666;
      }
    }
    .data-info {
      .data-info-item {
        height: 65px;
        color: #fff;
        .text-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .count {
            font-size: 18px;
          }
          .text {
            font-size: 11px;
          }
        }
      }
    }
     .van-grid-item__content {
      background-color: unset;
    }
  }

  .not-login {
    height: 180px;
    background: url("~@/assets/banner.jpg") no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile {
      width: 66px;
      height: 66px;
    }
    .text {
      font-size: 14px;
      color: #fff;
    }
  }

   .nav-grid {
    .nav-grid-item {
      height: 70px;
      .iconfont {
        font-size: 22px;
		margin-bottom: 5px;
      }
      .icon-shoucang {
        color: #eb5253;
      }
      .icon-lishi {
        color: #ff9d1d;
      }
      .van-grid-item__text {
        font-size: 14px;
        color: #333333;
      }
    }
  }

  .logout-cell {
    text-align: center;
    color: #d86262;
  }
  .mb-4 {
    margin-bottom: 4px;
  }
}
</style>
