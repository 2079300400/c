<template>
  <div class="search-container">

    <form action="/">
      <van-search
        :placeholder="hotword"
         v-model="value"
        show-action
        @cancel="$router.back()"
        @input="onSearchInput"
        @search="onSearch"
      />
    </form>

<!-- trim  去掉字符串的前后空格
'  1   '.trim()  '1' -->

<!--   搜索结果 -->
    <div class="search-result" v-show="value.trim().length">
       <van-cell :title="item.title" 
       @click="searchResultTap(item.title)"
       v-for="item in searchResult" :key="item._id">
       </van-cell>
     </div> 

    <!-- 历史记录 -->
  <div class="search-history">
    <van-cell
      title="搜索历史"
    >
      <div @click="clear">

        <span>全部删除</span>
       <van-icon  name="delete" />
      </div>
  
    </van-cell>
    <van-cell :title="item" 
     @click="historyTap(item)"
     :key="item"
    v-for="(item,index) in searchHistory" >
      <van-icon @click.stop="del(index)" name="close"/>
    </van-cell>
  </div>
    <!-- /历史记录 -->
  </div>
</template>

<script>
 import search from './search';

 export default search

</script>

<style  lang="less">

  .search-result {
    position: fixed;
    left: 0;
    right: 0;
    top: 54px;
    bottom: 0;
    overflow-y: auto;
    background-color: #f4f4f4;
    z-index: 999;
  }
</style>
