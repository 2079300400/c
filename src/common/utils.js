
//  接收日期对象 或者  或者数字  {时间戳}
//  返回值是一个日期

export function formatterDate(date){
       if(typeof date === 'number'){
        date = new Date(date)
       }
       if(date instanceof Date){
         date = [date.getFullYear(),(date.getMonth()+1),date.getDate()].map(v=> (v+'').length>1?v:'0'+v).join('/')
       }
       return date
    }


    export  function debounce(fn,t=500){
    let timer = null;//  
    return function(...arg){
        clearTimeout(timer);
            
        timer = setTimeout(v=>{
            // fn  业务逻辑  具体要干的事
            fn.apply(this,arg)
        },t)
    }
}
