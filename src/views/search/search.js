import { Search } from 'vant';
import {search as searchApi} from '@/api/api';

import {debounce} from '@/common/utils'
export default {
    name:'search',
    data(){
      return {
         value:'',//  
         searchResult:[],
         searchHistory:[],
         hotword:"二舅"
      }
    },
    components:{
      [Search.name]:Search
    },
    created(){
      //  我们去本地存储看看有没有数据 

      let searchHistory = localStorage.getItem('searchHistory');

      if(searchHistory){
        this.searchHistory = JSON.parse(searchHistory)||[]
      }

    //   如果有 拿过来  渲染
    //   没有 
    },
    methods:{
        onSearch(e){
            e = e.trim();
            e = e||this.hotword;
            this.searchResultTap(e)
         
        },
        onSearchInput:debounce(function(e){
            e = e.trim();
            if(e.length === 0){
                this.searchResult = []
                return 
            }
                searchApi({
                    key_word:e
                }).then(res=>{
                     if(res.code == 0){
                        this.searchResult = res.data;
                     }
                })

        }),
        //  搜索结果点击 事件
        searchResultTap(title){
            title = title.trim();//
            //   
            // 页面历史记录 需要记住 
            //  本地存储需要记住

           let index = this.searchHistory.findIndex(v=>v===title);
            //index ===-1  就是没找到  证明没重复项  新的 
           // >=0   找到 有重复项  删掉
           if(index>=0){
               this.searchHistory.splice(index,1)
           }
            this.searchHistory.unshift(title);

            localStorage.setItem('searchHistory',JSON.stringify(this.searchHistory))
               
            this.$router.push('/searchList?key_word='+title)
        },
        // 历史记录点击
        historyTap(title){
              this.searchResultTap(title)
        },
        //  删除某个历史记录
        del(index){
           this.searchHistory.splice(index,1);
          localStorage.setItem('searchHistory',JSON.stringify(this.searchHistory))
        },
        clear(){
          this.searchHistory = [];
          localStorage.setItem('searchHistory',JSON.stringify([]))
        
        }
    }



}