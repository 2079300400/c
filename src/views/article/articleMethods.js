import { removeFav, addFav ,like,unlike,commentLike,commentUnlike} from "@/api/api";
export default {
  //  收藏和取消操作 二合一
  toggleFav() {
    if (!this.checkLogin()) return;
    let {
      article: { is_fav },
      uid,
      article_id,
    } = this;

    if (is_fav) {
      //  取消
      removeFav({
        user_id: uid,
        article_id,
      }).then((res) => {
        console.log(res);
        this.$toast(res.msg);
        if (res.code == 0) {
          //  让他高亮
          this.article.is_fav = false;
        }
      });
    } else {
      //  收藏

      addFav({
        user_id: uid,
        article_id,
      }).then((res) => {
        console.log(res);
        this.$toast(res.msg);
        if (res.code == 0) {
          //  让他高亮
          this.article.is_fav = true;
        }
      });
    }
  },

  // 点赞 取消点赞

  toggleLike() {
    if (!this.checkLogin()) return;
    let {
      article: { is_like },
      uid,
      article_id,
    } = this;

    if (is_like) {
      //  取消
      unlike({
        user_id: uid,
        article_id,
      }).then((res) => {
        console.log(res);
        this.$toast(res.msg);
        if (res.code == 0) {
        
          this.article.is_like = false;
        }
      });
    } else {
      

      like({
        user_id: uid,
        article_id,
      }).then((res) => {
        console.log(res);
        this.$toast(res.msg);
        if (res.code == 0) {
          //  让他高亮
          this.article.is_like = true;
        }
      });
    }
  },
  toggleCommentLike(comment_id,index,is_like) {

    // console.log(comment_id,index,is_like)
    // return 
    if (!this.checkLogin()) return;
    let {
      uid
    } = this;

    if (is_like) {
      //  取消
      commentUnlike({
        user_id: uid,
        comment_id,
      }).then((res) => {
        console.log(res);
        this.$toast(res.msg);
        if (res.code == 0) {
        
          this.commentList[index].is_like = false;
          this.commentList[index].like_count= res.count;
        }
      });
    } else {
      

      commentLike({
        user_id: uid,
        comment_id,
      }).then((res) => {
        console.log(res);
        this.$toast(res.msg);
        if (res.code == 0) {
          //  让他高亮
          this.commentList[index].is_like = true;
          this.commentList[index].like_count = res.count;
        }
      });
    }
  },

};
