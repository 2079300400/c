
import {List} from 'vant'
import {getCommentList} from '@/api/api'

//  混入不是最好的方案  
//  vue3 

export default {
   components:{
    [List.name]:List
   },
   data(){
    return {
        commentList:[],
        skip:0,
        limit:10,
        commentLoading:false,
        commentFinished:false
        
    }
   },
   created(){
       
   },
   methods:{
          getCommentList(){

            let {uid,article_id,skip,
                limit} = this;
            getCommentList({
                user_id:uid,
                article_id,
                skip,
                limit
            }).then(res=>{
               console.log(res);
               if(res.code == 0){
                    this.commentList.push(...res.data);

                    let len = this.commentList.length;
                    if(len>=res.count){
                        this.commentFinished = true;
                    }else{
                        this.commentLoading = false;
                        this.skip = len
                    }

               }else{
                  this.$toast(res.msg)
               }
            })
          } 
   }

}