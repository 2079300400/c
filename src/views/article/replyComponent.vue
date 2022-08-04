<template>
  <div>
    <van-nav-bar title="1条回复" @click-left="$emit('close')" fixed placeholder>
      <template #left>
        <van-icon name="cross" size="26" color="#333" />
      </template>
    </van-nav-bar>
    <!-- {{replayItemInfo}} -->
    <van-cell class="comment-item" border>
      <van-image
        slot="icon"
        class="avatar"
        round
        fit="cover"
        :src="replayItemInfo.info.avatar"
      />
      <div slot="title">
        <div class="title-w">
          <div class="name">{{ replayItemInfo.info.nickname }}</div>
        </div>
        <div class="content">{{ replayItemInfo.content }}</div>
        <div class="info">
          <span class="pubdate">{{
            replayItemInfo.create_time | formatterDate
          }}</span>

          <div class="like-w" @click="toggleCommentLike">
            <van-icon
              class="like-icon"
              :class="{ liked: replayItemInfo.is_like }"
              name="good-job"
            />
            <span class="like-count">{{
              replayItemInfo.like_count == 0 ? "" : replayItemInfo.like_count
            }}</span>
          </div>
        </div>
      </div>
    </van-cell>

    <!--   对上拉加载 二次封装 -->
<h1>评论</h1>
    <commonList
      :API="getReplyList"
      :params="{ user_id, reply_comment_id: replayItemInfo._id, article_id }"
      ref="ReplyList"
    >
      <template #default="{ list }">
        <van-cell
          class="comment-item"
          border
          v-for="item in list"
          :key="item._id"
        >
          <van-image
            slot="icon"
            class="avatar"
            round
            fit="cover"
            :src="item.info.avatar"
          />
          <div slot="title">
            <div class="title-w">
              <div class="name">{{ item.info.nickname }}</div>
            </div>
            <div class="content">{{ item.content }}</div>
            <div class="info">
              <span class="pubdate">{{
                item.create_time | formatterDate
              }}</span>

              <!-- <div class="like-w" @click="toggleCommentLike">
                <van-icon
                  class="like-icon"
                  :class="{ liked: item.is_like }"
                  name="good-job"
                />
                <span class="like-count">{{
                  item.like_count == 0 ? "" : item.like_count
                }}</span>
              </div> -->
            </div>
          </div>
        </van-cell>
      </template>
    </commonList>
  </div>
</template>

<script>
import { getReplyList } from "@/api/api";

import commonList from "@/components/commonList.vue";

export default {
  name: "replyComponent",
  components: {
    [commonList.name]: commonList,
  },
  data() {
    return {
      getReplyList,
    };
  },
  computed: {
    user_id() {
      return this.$store.state.uid;
    },
  },
    beforeDestroy(){
    this.$Bus.$off('listRefresh')
  },
  props: {
    replayItemInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    active_reply_index: {
      type: Number,
    },
    article_id: {},
  },
  methods: {
    close() {
      this.$emit("close");
    },
    toggleCommentLike() {
      let { is_like, _id } = this.replayItemInfo;
      let { active_reply_index } = this;

      // this.$emit('toggleCommentLike',{comment_id:_id,is_like,index:active_reply_index})
      this.$emit("toggleCommentLike", _id, active_reply_index, is_like);
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .van-nav-bar {
  background-color: #fff;
  border-bottom: 1px solid #999;
}
::v-deep .van-nav-bar__title {
  color: #333;
}

::v-deep .van-cell {
  border-bottom: 1px solid #ccc;
}

.comment-item {
  .avatar {
    width: 36px;
    height: 36px;
    margin-right: 13px;
  }
  .name {
    font-size: 16px;
    color: #555;
  }
  .content {
    font-size: 16px;
    color: #222222;
    margin: 10px 0;
  }
  .info {
    display: flex;
    height: 36px;
    align-items: center;
    justify-content: space-between;
  }
  .pubdate {
    font-size: 12px;
    margin-right: 12px;
  }
  .title-w {
    display: flex;
    justify-content: space-between;
    height: 36px;
    align-items: center;
  }
  .like-w {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .like-icon.liked {
    color: #ef092c;
  }
}
</style>
