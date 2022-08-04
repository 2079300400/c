<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      title="个人资料"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>

    <div class="container">
      <input type="file" hidden accept="image/*" id="file" @change="change" />
      <!-- /导航栏 -->

      <van-cell title="头像" center>
        <label for="file">
          <van-image
            width="50"
            height="50"
            round
            fit="cover"
            :src="userInfo.avatar"
          />
        </label>
      </van-cell>
      <van-cell
        title="昵称"
        is-link
        :value="userInfo.nickname"
        @click="showDialog"
      />
      <van-cell title="性别" is-link :value="userInfo.sex || '请选择性别'"  @click="sexPickerShow = true"  />

<!-- 弹出层组件 -->
       <van-popup v-model="sexPickerShow" position="bottom">
          <van-picker
            show-toolbar
            :columns='["男","女"]'
            @confirm="sexPickerConfirm"
            @cancel="sexPickerShow = false"
          />
        </van-popup>


<!--  -->
      <van-cell
        title="生日"
        is-link
        @click="datePickerShow = true"
        :value="userInfo.birthday || '请选择生日'"
      />
      <!--  生日弹窗  -->
      <van-popup v-model="datePickerShow" position="bottom">


        <van-datetime-picker
        @confirm="datePickerConfirm"
        @cancel="datePickerShow = false"
        :value="userInfo.birthday?new Date(userInfo.birthday):new Date('2000/01/01')"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
        />
      </van-popup>

      <!--  /生日弹窗 end -->

      <div style="margin: 30px 50px">
        <van-button
          round
          block
          color='#4badef'
          type="primary"
          size="normal"
          :square="true"
          native-type="submit"
          @click="save"
          >保存</van-button
        >
      </div>
    </div>

    <van-dialog v-model="nickDialogShow" title="修改昵称" show-cancel-button>
      <input type="text" v-model="userInfo.nickname" />
    </van-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Dialog } from "vant";
import sexPickerMixin from './sexPickerMixin'
import datePickerMixin from './datePickerMixin'
import {setuserInfo} from '@/api/user'
export default {
  name: "userInfo",
  data() {
    return {
      userInfo: {},
      nickDialogShow: false,
    };
  },
  mixins:[sexPickerMixin,datePickerMixin],
  components: {
    [Dialog.Component.name]: Dialog.Component
  },
  watch: {
    "$store.state.userInfo": {
      immediate: true, // 正常流程进来
      handler(n, o) {
        this.userInfo = JSON.parse(JSON.stringify(n));
      },
    },
  },
  methods: {
    ...mapActions(["upload"]),
    save() {
      console.log(this.userInfo);
      let { nickname, avatar, _id:uid, birthday, sex } = this.userInfo;

      console.log(nickname, avatar, uid, birthday, sex);


setuserInfo({
  nickname, avatar, uid, birthday, sex
}).then(res=>{
  console.log(res)
   this.$toast(res.msg);



  if(res.code == 0){


      //  vuex里的还没改  
      // 1. 本地修改   麻烦一点省流量  
// this.$store.commit('save',['userInfo',{ nickname, avatar,_id:uid, birthday, sex}])

      // 2. 调一下接口 浪费 但是严谨
      this.$store.dispatch('getuserInfo',localStorage.getItem('token'))
     
    setTimeout(v=>{
       this.$router.back()
    },300)

  }
})


    },
    //  修改昵称
    showDialog() {
      this.nickDialogShow = true;
    },
    async change(e) {
      // e.target.files
      let fileLsit = [...e.target.files].map((v) => {
        return {
          file: v,
        };
      });
      // [File,File]

      // [{
      // 	file:File
      // },{
      // 	file:File
      // }]
      let [avatar] = await this.upload(fileLsit);
      this.userInfo.avatar = avatar; //我们其实还没有传到服务器呢  现在修改vuex 属于错误逻辑
    },
  },
};
</script>

<style scoped lang="less">
.van-popup {
  background-color: #f5f7f9;
}

.update-photo-popup {
  background-color: #000;
}

.name-field-wrap {
  padding: 10px;
}
.update-photo {
  height: 100%;
}

.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
}

/* Ensure the size of the image fit the container perfectly */
.image {
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>
