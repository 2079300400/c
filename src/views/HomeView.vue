<template>

  <div class="home">
    <van-nav-bar fixed placeholder>
      <template #title>
        <router-link class="home-header-search" to="/search">
          <van-icon name="search" /> <span>搜索</span>
        </router-link>
      </template>
    </van-nav-bar>

    <van-tabs v-model="active" @click="switchTab">
      <van-tab :title="item.name" v-for="item in cate" :key="item._id"></van-tab>
    </van-tabs>

    <div class="articleList" style="padding-bottom:60px">

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">

   <template #pulling="props">
    <img
      class="doge"
      src="https://img01.yzcdn.cn/vant/doge.png"
      :style="{ transform: `scale(${props.distance / 80})` }"
    />
  </template>

  <!-- 释放提示 -->
  <template #loosing>
    <img class="doge" src="https://img01.yzcdn.cn/vant/doge.png" />
  </template>

  <!-- 加载提示 -->
  <template #loading>
    <img class="doge" src="https://img01.yzcdn.cn/vant/doge-fire.jpg" />
  </template>

      <van-list v-model="loading" :finished="finished" @load="getArticle" :immediate-check="false">
        <!-- @load="getArticle"  是初始化好了以后自动触发一下   -->

        <template #finished>
          <div style="text-align: center;padding: 10px;">
            <van-icon name="clock-o" size="30" color="red" />
          </div>
        </template>

        <template #loading>
          <div style="text-align: center;padding: 10px;">
            <van-icon name="clock-o" size="30" color="red" />
          </div>
        </template>
        <li v-for="(item, index) in articleList" :key="item._id"
          @click="$router.push({ path: '/article', query: { id: item._id,title:item.title } })">
          <p>{{ item.title }}</p>
          <div
            :class="{ none: item.poster_type == 1, articlesingleImg: item.poster_type == 2, articlemoreImg: item.poster_type == 3 }">
            <img  v-for="img in item.imageSrc" v-lazy="img">

          </div>

          <p>{{ item.time | dateFormatYMD}}</p>
        </li>

      </van-list>
</van-pull-refresh>
    </div>




  </div>

</template>

<script>
// @ is an alias to /src

import { Tab, Tabs, List,PullRefresh  } from 'vant';

import { getCateList, getArticleList } from '@/api/home.js';

export default {
  name: 'HomeView',
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [List.name]: List,
    [PullRefresh.name]:PullRefresh 
  },
  data() {
    return {
      active: 0,
      cate: [],
      articleList: [],  // 文章列表
      loading: false,//  是否正在加载  
      finished: false,//  是否全部加载完毕  
      skip: 0,  //  从skip 开始拿
      limit: 20,//  一次拿多少条
      refreshing:false,//  是否正在刷新
    }
  },
  computed: {

    cate_id() {
      //  获取到当前被选择的分类的id
      let active_cate = this.cate[this.active];
      //  console.log(active_cate)
      if (!active_cate) return ''
      return active_cate._id
    }
  },
  created() {
    console.log('created')
    this.getCate();//   获取分类

  },
  //  组件被keep-alive缓存后 会多两个生命周期钩子 
  //  激活后   执行的比较晚  比mounted还wan    
  activated() {

    console.log('激活')
  },
  //  失活后
  deactivated() {
    console.log('失活')
  },
  methods: {
    //  切换分类
    switchTab() {
      console.log(this.active)
      this.articleList = [];  //清空原来数据
      this.skip = 0;
      this.finished = false;  //  如果不改 会有BUG   
      this.getArticle()
    },
    getCate() {
      getCateList()
        .then(res => {
          console.log(res)
          this.cate = res.data;   // 第一次请求成功  他会有数据  
          //  第一个接口成功  调用第二个 
          this.getArticle()

        })
    },
    getArticle(flag) {
      let { cate_id, skip, limit } = this;

      console.log('触发了上拉加载--------------------------------')
      getArticleList({
        cate_id,
        skip, limit
      }).then(res => {
        console.log(res)


        //  我们的逻辑  每次拿到数据都 赋值给articleList  

        //  应该做的是累加的操作  往上滑动数据是越来越多

        // articleList   []   skip  0      20
        // articleList   [20]   skip  20      20
        // articleList   [40]   skip  40      20

        // 每次请求完 做个判断  是否全部加载完毕了 如果加载完毕了  this.finished 改成 true
        // 如果没完毕  把loading 改成 false

       if( res.data){
            res.data = res.data.map(v=>{
                 v.imageSrc =  v.imageSrc.map(v=>{
                  return v+'?imageView2/1/w/200/h/200'
                 });
                 return v
            })
       }
       

         if(flag){
          // 是刷新
          this.refreshing = false;
           this.articleList = res.data;   //  把数据替换  
         }else{

           this.articleList.push(...res.data);  // 数据追加
         }

        let len = this.articleList.length;
        let count = res.count;

        if (len >= count) {
          this.finished = true;
        } else {
          this.loading = false;
          this.skip = len; //  skip得动态的变化  
        }





      }).catch(err => {
        console.log(err)
      })
    },
    onRefresh(){
      
       

      this.skip = 0;
      this.finished = false;  //  如果不改 会有BUG  

      //  通过一个参数 告诉getArticle  我们是执行的刷新动作还是加载动作
      this.getArticle(true);  //  数据拿到以后 再结束刷新的动作 

      
      

    }

  }
}
</script>

<style lang="less" scoped>
.home-header-search {
  width: 280px;
  height: 34px;
  border-radius: 20px;
  background: #0f65c1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

::v-deep .van-nav-bar__title {
  max-width: 75%;
}

::v-deep .van-tabs--line .van-tabs__wrap {
  border-bottom: 1px solid #ccc;
}

::v-deep .van-tabs__wrap--scrollable .van-tab {
  border-right: 1px solid #ccc;
}

// ::v-deep .van-tabs__wrap--scrollable .van-tab:last-of-type{ 
//   border-right:0
// }
::v-deep .van-tabs__line {

  bottom: 5.4vw;

  width: 4.66667vw;

  background-color: @color;

}

.articleList {
  overflow: hidden;

  img {
    max-width: 100%;
  }

  .none {
    display: none;
  }

  .articlemoreImg img {
    width: 100px;
    height: 56.25px;
  }
}

  .doge {
    width: 140px;
    height: 72px;
    margin-top: 8px;
    border-radius: 4px;
  }

</style>