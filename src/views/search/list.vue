<template>
  <div>
    <van-nav-bar
      title="搜索列表"
      left-arrow
      @click-left="$router.back()"
      fixed
      placeholder
    ></van-nav-bar>

    <div class="listPage">
    
        <!-- <van-list v-model="loading" :finished="finished" @load="getList">
       

          <li v-for="item in list" :key="item._id">
            <p>{{ item.title }}</p>
          </li>
        </van-list> -->

<commentList :API="searchApi" :params="{key_word}" :refresh="true">
        <template #default="{list}">
  <li v-for="item in list" :key="item._id">
            <p>{{ item.title }}</p>
          </li>
        </template>
</commentList>



    </div>
  </div>
</template>

<script>
import { search as searchApi } from "@/api/api";

import commentList  from "@/components/commonList.vue"; 

export default {
  name: "searchList",
  components: {
    'commentList':commentList
  },
  data() {
    return {

      searchApi
    };
  },
  computed: {
    key_word() {
      return this.$route.query.key_word;
    },
  },
  created() {

  },
  methods: {


  },
};
</script>

<style lang="less">
.listPage{
    li{
        min-height: 100px;
    }
}

</style>
