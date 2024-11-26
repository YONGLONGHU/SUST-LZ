"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/login/login.js";
  "./pages/device_list/device_list.js";
  "./pages/inspection_log/inspection_log.js";
  "./pages/alarm_history/alarm_history.js";
  "./pages/management/management.js";
  "./pages/result_page/result_page.js";
  "./pages/personal_center/personal_center.js";
  "./pages/switch_account/switch_account.js";
  "./pages/about_us/about_us.js";
  "./pages/gg_robot/gg_robot.js";
  "./pages/pb_robot/pb_robot.js";
  "./pages/ls_robot/ls_robot.js";
  "./pages/roomba/roomba.js";
}
const _sfc_main = {
  onLaunch() {
    const isLoggedIn = common_vendor.index.getStorageSync("isLoggedIn");
    if (!isLoggedIn) {
      common_vendor.index.redirectTo({
        url: "/pages/login/login"
      });
    }
  },
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
