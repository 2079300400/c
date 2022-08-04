import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',  //  必填
    name: 'home',  //  选填
    component: HomeView,
    meta:{
      isRoot:true,
      keep:true
    }
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue'),//  懒加载   

  },
  
  {
    path: '/reg',
    name: 'reg',
    component: () => import('../views/reg.vue'),//  懒加载   

  },
  {
    path: '/my',
    name: 'my',
    component: () => import('../views/my.vue'),
    meta:{
      isRoot:true,
      keep:true
    }   
  },
  {
    path: '/publish',
    name: 'publish',
    component: () => import('../views/publish.vue'),
    meta:{
      isRoot:true,
      keep:true
    }  
  },
  {
    path: '/userinfo',
    name: 'userinfo',
    component: () => import('../views/userInfo/userinfo.vue'),
    meta:{
      keep:true,
      auth:true
    }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/search/search.vue'),// 
  },
  {
    path: '/searchList',
    name: 'searchList',
    component: () => import('../views/search/list.vue'),// 
  },
  {
    path: '/article',
    name: 'article',
    component: () => import('../views/article/article.vue'),// 
  },
];




const router = new VueRouter({
  routes
});
//  全局前置守卫  保安  
import store from '@/store';
import {Toast} from 'vant'


router.beforeEach((to, from, next) => {

  // to   你准备去哪个路由
  // from  从哪来的

  // 未登录的时候 一些敏感页面不允许进
let uid = store.state.uid;

console.log(to.path);

//  如果你想进 敏感页面  
// 判断你登录  

if(to.meta.auth){
  if(uid){
    // 是登录状态
    
    next()

  }else{
    Toast('请先登录')
  setTimeout(v=>{
    router.replace('/login')
  },1000)
  }

}else{
  next()

}








  
})



export default router
