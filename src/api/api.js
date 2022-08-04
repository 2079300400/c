

import http from './http.js';

//  获取分类
export function addArticle(params){
   return  http.post('/api/add_article',params)
}
export function getQiniuToken(){
   return  http.get('/upload/token')
}
export function uploadQiniu(formdata){
   return  http.post('https://upload-z1.qiniup.com', formdata)
}


//  搜索
export function search(params){
   return  http.get('/api/search',{
      params
   })
}
//  获取文章详情
export function getArticleDetail(params){
   return  http.get('/api/get_article_detail',{
      params
   })
}
//  获取评论列表
export function getCommentList(params){
   return  http.get('/api/get_comment_list',{
      params
   })
}
//  收藏
export function addFav(params){
   return  http.get('/api/add_fav',{
      params
   })
}
//  取消收藏
export function removeFav(params){
   return  http.get('/api/remove_fav',{
      params
   })
}
//  点赞
export function like(params){
   return  http.get('/api/like',{
      params
   })
}
//  取消点赞
export function unlike(params){
   return  http.get('/api/unlike',{
      params
   })
}
//  评论
export function addComment(params){
   return  http.post('/api/add_comment', params)
}

//  评论的点赞
export function commentLike(params){
   return  http.get('/api/comment_like',{
      params
   })
}
//  评论的取消点赞
export function commentUnlike(params){
   return  http.get('/api/comment_unlike',{
      params
   })
}
//  获取回复列表
export function getReplyList(params){
   return  http.get('/api/get_reply_list',{
      params
   })
}

