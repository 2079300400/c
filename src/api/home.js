import http from './http.js';

//  获取分类
export function getCateList(){
   return  http.get('/api/get_cate_list')
}
//  获取文章列表
export function getArticleList(params){
   return  http.get('/api/get_article_list',{
      params
   })
}


