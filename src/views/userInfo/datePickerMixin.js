import {
    Popup,
    DatetimePicker 
} from "vant";
import {formatterDate} from '@/common/utils'
export default {
    components: {
        [Popup.name]: Popup,
        [DatetimePicker .name]: DatetimePicker 
    },
    data() {
        return {
            datePickerShow: false, //  性别弹窗是否显示 
            minDate:new Date(1920, 0, 1),
            maxDate: new Date(),
        };
    },
    methods: {
        datePickerConfirm(e) {
            console.log(e);//  日期类型 Date  
            //  日期转化  
            this.datePickerShow = false;
            this.userInfo.birthday = formatterDate(e)

        },
    }

}