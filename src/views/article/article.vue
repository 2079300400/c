<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar title="文章详情" fixed placeholder left-arrow @click-left="$router.back()"></van-nav-bar>

    <!-- /导航栏 -->

    <div class="container">
      <div class="article-content" ref="articleContent">
        <!--   头 -->
        <div class="articleContentTop" ref="articleContentTop">
          <h1 class="title">{{ title }}</h1>

          <van-skeleton title avatar :row="4" :loading="!article._id">
            <van-cell center class="user-info">
              <div slot="title" class="name">{{ article.author }}</div>
              <van-image slot="icon" class="avatar" round fit="cover" :src="article.avatar" />
              <div slot="label" class="pubdate">
                {{ article.time | formatterDate }}
              </div>
              <!-- <van-button class="follow-btn" type="default" icon="plus" round size="small">已关注</van-button> -->
            </van-cell>
            <div class="markdown-body" v-html="article.content"></div>
          </van-skeleton>
        </div>

        <!--   fengexian  -->

        <van-divider :hairline="false" :style="{ borderColor: '#999', padding: '0 5px' }"></van-divider>


        <div class="commentListHead">精彩评论</div>
        <!-- 文章评论列表 -->
        <div style="min-height: calc(100vh - 120px)">
          <van-list v-model="commentLoading" :finished="commentFinished" finished-text="没有更多了" @load="getCommentList">
            <van-cell class="comment-item" v-for="(item, index) in commentList" :key="item._id">
              <van-image slot="icon" class="avatar" round fit="cover" :src="item.info.avatar" />
              <div slot="title">
                <div class="title-w">
                  <div class="name">{{ item.info.nickname }}</div>

                  <div class="like-w" @click="toggleCommentLike(item._id, index, item.is_like)">
                    <van-icon class="like-icon" :class="{ liked: item.is_like }" name="good-job" />
                    <span class="like-count">{{
                        item.like_count == 0 ? "" : item.like_count
                    }}</span>
                  </div>
                </div>
                <div class="content">{{ item.content }}</div>
                <div class="info">
                  <span class="pubdate">{{
                      item.create_time | formatterDate
                  }}</span>
                  <van-button class="reply-btn" @click="openReplyFiledPopup(item, index)" round size="mini">
                    {{ item.reply_num == 0 ? "" : item.reply_num }}

                    回复</van-button>
                </div>
              </div>
            </van-cell>
            <!-- /文章评论列表 -->
          </van-list>
        </div>
      </div>
    </div>
    <a class="bshareDiv" href="http://www.bshare.cn/share">分享按钮</a>
    <!-- /发布评论 -->
    <div class="article-bottom">
      <van-button class="comment-btn" type="default" round size="small" @click="openFiledPopup">写评论</van-button>

      <!--  评论图标 -->
      <van-icon name="comment-o" color="#777" v-if="!article.comment || article.comment == 0" />
      <van-icon name="comment-o" color="#777" :badge="article.comment" v-else />

      <!--  收藏 -->
      <van-icon name="star" :color="article.is_fav ? '#f00' : '#777'" @click="toggleFav" />
      <!-- 点赞 -->
      <van-icon name="good-job" :color="article.is_like ? '#f00' : '#777'" @click="toggleLike" />
      <van-icon name="share" @click="showShare = true" color="#777777"></van-icon>
    </div>
    <!-- 评论回复 -->

    <van-popup v-model="popupShow" position="bottom">
      <div class="post-comment">
        <van-field v-model="content" rows="4" autosize type="textarea" maxlength="1000"
          :placeholder="contentPlaceholder" show-word-limit ref="content" />
        <div style="width: 100%">
          <van-button size="large" type="primary" @click="addComment">发布</van-button>
        </div>
      </div>
    </van-popup>
    <!-- /评论回复 -->

    <!--  二级回复   -->

    <van-popup v-model="replyPopupShow" round position="bottom" z-index="99" style="height:100%">

      <replyComponent @close="replyPopupShow = false" @toggleCommentLike="toggleCommentLike"
        :active_reply_index="active_reply_index" :article_id="article_id"
        :replayItemInfo="commentList[active_reply_index]">

      </replyComponent>
      <div class="article-bottom">
        <van-button class="comment-btn" type="default" round size="small"
          @click="openReplyFiledPopup(commentList[active_reply_index], active_reply_index, true)">写评论</van-button>


      </div>
    </van-popup>

    <!--  分享 -->
    <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" @select="onSelect" />


    <!--  二维码弹出层 -->
<van-popup v-model="qrcodePopup" round position="center" z-index="99" >
   <van-image :src="qrcodeurl" >

   </van-image>
   <button><a :href="qrcodeurl" download>下载</a></button>
</van-popup>
  </div>
</template>

<script>
import "@/common/github-markdown.css";

import { Popup, Field, Skeleton, Divider, ShareSheet } from "vant";

import { getArticleDetail, addComment } from "@/api/api";

import { mapState } from "vuex";

import commentListMixin from "./commentList";

import methods from "./articleMethods";

import replyComponent from './replyComponent.vue'

import QRCode from 'qrcode'
import html2canvas from 'html2canvas'

export default {
  data() {
    return {
      popupShow: false,
      content: "",
      article_id: "", //  文章id
      title: "", //  标题
      article: {}, //  文章详情信息
      comment_type: 0, //comment_type为0时是评论文章 为1时是回复评论
      articleContentTop: 0, //  分割线之前的的内容高度
      contentPlaceholder: "友善是交流的起点",
      reply_comment_id: "", //  回复的评论的 ID
      active_reply_index: 0,
      replyPopupShow: false,
      showShare: false,
      options: [
        { name: '微信', icon: 'wechat' },
        { name: '微博', icon: 'weibo' },
        { name: 'QQ', icon: 'qq' },
        { name: '复制链接', icon: 'link' },
        { name: '分享海报', icon: 'poster' },
        { name: '二维码', icon: 'qrcode' },
      ],
      qrcodePopup:false,//  
      qrcodeurl:''
    };
  },
  mixins: [commentListMixin],
  components: {
    [Popup.name]: Popup,
    [Field.name]: Field,
    [Skeleton.name]: Skeleton,
    [Divider.name]: Divider,
    [replyComponent.name]: replyComponent,
    [ShareSheet.name]: ShareSheet
  },
  computed: {
    ...mapState(["uid", "userInfo"]),
  },
  created() {
    let { id, title } = this.$route.query;
    this.article_id = id;
    this.title = title;
    this.getArticleDetail();
  },
  methods: {

    copy(params) {

      let input = document.createElement('input')
      input.value = params;
      // input.type = 'hidden'
      document.body.appendChild(input);
      input.select();
      document.execCommand("Copy");   // 执行复制
      document.body.removeChild(input)
    },
    shareTSina() {

      let img = this.article.imageSrc[0];
      let title = this.article.title;

      console.log(img)

      let url = window.location.href;
      window.open("http://service.weibo.com/share/share.php?pic=" + encodeURIComponent(img) + "&title=" +
        title + "&url=" + url);
    },
    shareQQ() {

      let img = this.article.imageSrc[0];
      let title = this.article.title;

      console.log(img)

      let url = window.location.href;
      window.open("http://connect.qq.com/widget/shareqq/index.html?pic=" + encodeURIComponent(img) + "&title=" +
        title + "&url=" + url);
    },
    qrcode(){
 let url = window.location.href;
      QRCode.toDataURL(url)
      .then(url => {
        console.log(url)

       this.qrcodeurl = url;
       this.qrcodePopup = true

      })
      .catch(err => {
        console.error(err)
      })

    },

    onSelect({ name }) {
      console.log(name)


      switch (name) {
        case '复制链接':
          console.log(window.location.href)
          this.$toast('复制成功,快分享给好友吧')
          this.copy(window.location.href)
          break;

        case '微博':
          this.shareTSina();
          break

        case 'QQ':
          this.shareQQ();
          break
        case '微信':
        case '二维码':
          this.qrcode();
          break

          case "分享海报":
            let articleContentTop =  this.$refs.articleContentTop
                if(articleContentTop){
                  html2canvas(articleContentTop,{
                    allowTaint:true
                  }).then(canvas=>{
                    console.log(canvas);
var cxt=canvas.getContext('2d');
                    let img = new Image();
                    img.src = require('@/views/article/1.png');
                    img.onload = function(){
                   cxt.drawImage(img,10,10);  

                    let res = canvas.toDataURL(); //  画布导出图片

console.log(res) 

                    }
 
 



                  }).catch(err=>{

                  })
                }
            

      }




      this.showShare = false;
    },
    ...methods,
    //  打开输入框弹出层
    openFiledPopup() {
      if (!this.checkLogin()) return;
      this.contentPlaceholder = "友善是交流的起点";
      this.comment_type = 0;
      this.popupShow = true;
      this.$nextTick(function () {
        console.log(this.$refs.content);
        this.$refs.content.focus();
      });
    },
    openReplyFiledPopup(item, index, is_child) {
      if (!this.checkLogin()) return;
      let {
        reply_num,
        info: { nickname },
        _id: reply_comment_id,
      } = item;
      this.active_reply_index = index;


      if (reply_num == 0 || is_child) {
        //  没人回复
        this.popupShow = true;
        this.comment_type = 1;
        this.contentPlaceholder = "回复:" + nickname;
        this.reply_comment_id = reply_comment_id;

        this.$nextTick(function () {
          this.$refs.content.focus();
        });
      } else {
        //  后续再说


        this.replyPopupShow = true

      }
    },

    //  获取文章详情
    getArticleDetail() {
      let { article_id, uid: user_id } = this;
      getArticleDetail({
        user_id,
        article_id,
      }).then((res) => {
        console.log(res);
        if (res.code == 0) {
          this.article = res.data;
          //  console.log(this.$refs.articleContentTop.offsetHeight)   //  51  这个51不准确 这个是还没渲染真实dom前的高度

          // 数据 ->虚拟dom  -> 真实dom  异步
          this.$nextTick(function () {
            //  console.log(this.$refs.articleContentTop.offsetHeight)  ;
            this.articleContentTop = this.$refs.articleContentTop.offsetHeight;
          });
        } else {
          this.$toast(res.msg);
        }
      });
    },
    //发布评论
    addComment() {
      let {
        uid: user_id,
        article_id,
        content,
        comment_type,
        reply_comment_id,
      } = this;

      content = content.trim();

      if (content.length == 0) {
        this.$toast("请输入内容");
        return;
      }

      addComment({
        user_id,
        article_id,
        content,
        comment_type,
        reply_comment_id,
      }).then((res) => {
        this.$toast(res.msg);
        if (res.code == 0) {
          this.popupShow = false;

          this.article.comment++;
          this.content = "";

          if (comment_type == 0) {
            let { avatar, nickname, username } = this.userInfo;

            let commentData = {
              article_id,
              comment_type: 0,
              content,
              create_time: new Date().getTime(),
              info: {
                avatar,
                nickname,
                username,
              },
              is_like: false,
              like_count: 0,
              reply_comment_id: "",
              reply_num: 0,
              user_id,
              _id: res.data.id,
            };
            this.skip++;
            this.commentList.unshift(commentData);
            //  我们需要计算出来  分割线之上是多高
            this.$refs.articleContent.scrollTo(0, this.articleContentTop);
          } else if (comment_type == 1) {

            if (this.replyPopupShow) {

              //  如果是打开状态  二级的评论  
              console.log(11)
              this.$Bus.$emit('listRefresh')

            } else {
              this.commentList[this.active_reply_index].reply_num++;

              let index = this.active_reply_index
              let item = this.commentList[index];

              this.openReplyFiledPopup(item, index)

            }


          }



        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.article-content {
  overflow-y: auto;
  padding-bottom: 44px;
  height: calc(100vh - 92px);

  .title {
    font-size: 20px;
    color: #3a3a3a;
    padding: 24px 20px 18px;
    background-color: #fff;
    margin: 0;
  }
}

.user-info {
  .avatar {
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }

  .name {
    font-size: 12px;
    color: #333333;
  }

  .pubdate {
    font-size: 11px;
    color: #b4b4b4;
  }

  .follow-btn {
    width: 85px;
    height: 29px;
  }
}

ul {
  list-style: unset;
}

.markdown-body {
  padding: 14px;
  background-color: #fff;
}

.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;

  .comment-btn {
    width: 141px;
    height: 23px;
    border: 1px solid #eeeeee;
    font-size: 15px;
    line-height: 23px;
    color: #a7a7a7;
  }

  .van-icon {
    font-size: 20px;

    .van-info {
      font-size: 11px;
      background-color: #e22829;
    }
  }
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

.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;

  .comment-btn {
    width: 200px;
    height: 30px;
    border: 1px solid #eeeeee;
    font-size: 15px;
    line-height: 23px;
    color: #a7a7a7;
  }
}

.post-comment {
  padding: 14px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.commentListHead {
  padding: 10px;
  font-weight: bold;
  font-size: 20px;
}
</style>
