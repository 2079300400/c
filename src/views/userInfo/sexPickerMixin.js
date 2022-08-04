import {
    Popup,
    Picker
} from "vant";

export default {
    components: {
        [Popup.name]: Popup,
        [Picker.name]: Picker
    },
    data() {
        return {
            sexPickerShow: false, //  性别弹窗是否显示 
        };
    },
    methods: {
        sexPickerConfirm(e) {
            console.log(e)
            this.sexPickerShow = false;
            this.userInfo.sex = e

        },
    }

}