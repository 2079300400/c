<!--  -->
<template>
  <div>

    <van-pull-refresh v-model="isrefreshing" @refresh="onRefresh" v-if="refresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="getList"
        :immediate-check="immediateCheck">
        <slot :list="list"></slot>
      </van-list>
    </van-pull-refresh>





    <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="getList"
      :immediate-check="immediateCheck">
      <slot :list="list"></slot>
    </van-list>

  </div>

</template>

<script>
import { List, PullRefresh } from "vant";
export default {
  name: 'commonList',
  data() {
    return {
      skip: 0,
      list: [],
      finished: false,
      loading: false,
      isrefreshing: false
    };
  },
  props: {
    limit: {
      type: Number,
      default: 10
    },
    immediateCheck: {
      default: true,
      type: Boolean
    },
    API: {
      required: true,
      type: Function
    },
    params: {
      type: Object
    },
    refresh: {
      default: false,
      type: Boolean
    }
  },
  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh
  },
  created(){
    this.$Bus.$on('listRefresh',(e)=>{
     this.onRefresh()
    })
  }, 

  methods: {
    onRefresh() {
      this.skip = 0;
      this.finished = false;

      this.getList(true)
    },
    getList(flag) {
      let { skip, limit, params } = this;
      this.API({
        skip, limit,
        ...params
      }).then(res => {
        if (res.code == 0) {
          console.log(res)
          if (flag) {
            this.list = res.data;
            this.isrefreshing = false
          } else {
            this.list.push(...res.data);
          }

          let len = this.list.length;
          if (len >= res.count) {
            this.finished = true
          } else {
            this.loading = false;
            this.skip = len
          }
        }
      })

    }

  },
};
</script>
<style lang='scss'>
</style>