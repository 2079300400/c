import store from "@/store";
import { Toast } from "vant";

export default function () {
  return new Promise((resolve, reject) => {
    let token = localStorage.getItem("token");
    let tokenExpired = localStorage.getItem("tokenExpired"); //  过期时间  时间戳

    if (token) {
      let now = new Date().getTime();
      if (now >= Number(tokenExpired)) {
        //  token 过期了
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpired");
        Toast("您的身份认证已过期,请重新登录");
        resolve();
      } else {
        Toast.loading({
          message: "加载中...",
          forbidClick: true,
        });

        store
          .dispatch("getuserInfo", token)
          .then((res) => {
            // uid  userInfo
            resolve();
            Toast.clear();
          })
          .catch((err) => {
            Toast("网络异常");
            reject();
          });
      }
    } else {
      resolve();
    }
  });
}
