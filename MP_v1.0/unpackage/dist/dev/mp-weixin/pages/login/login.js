"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      clientHeight: "",
      // 屏幕高度
      username: "",
      // 用户名
      password: "",
      // 密码
      isLogin: true
      // 是否为登录模式
    };
  },
  mounted() {
    this.clientHeight = common_vendor.index.getSystemInfoSync().windowHeight;
  },
  methods: {
    // 切换登录/注册模式
    toggleMode() {
      this.isLogin = !this.isLogin;
      this.username = "";
      this.password = "";
    },
    // 提交表单
    submit() {
      if (!this.username || !this.password) {
        common_vendor.index.showToast({ title: "请输入账号和密码", icon: "none" });
        return;
      }
      const url = this.isLogin ? "http://192.168.1.102:8083/login" : "http://192.168.1.102:8083/register";
      const data = {
        username: this.username,
        password: this.password
      };
      common_vendor.index.request({
        url,
        method: "POST",
        data,
        header: {
          "Content-Type": "application/json"
        },
        success: (res) => {
          const response = res.data;
          if (response.success) {
            if (this.isLogin) {
              common_vendor.index.setStorageSync("isLoggedIn", true);
              common_vendor.index.switchTab({
                url: "/pages/device_list/device_list"
              });
            } else {
              common_vendor.index.showToast({ title: "注册成功，请登录", icon: "success" });
              this.isLogin = true;
            }
          } else {
            common_vendor.index.showToast({ title: response.message || "操作失败", icon: "none" });
          }
        },
        fail: (err) => {
          common_vendor.index.showToast({ title: "网络错误，请检查服务器", icon: "none" });
          console.error("Request failed:", err);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.isLogin ? "量子智能监控平台" : "量子智能监控平台"),
    b: common_assets._imports_0,
    c: $data.username,
    d: common_vendor.o(($event) => $data.username = $event.detail.value),
    e: common_assets._imports_1,
    f: $data.password,
    g: common_vendor.o(($event) => $data.password = $event.detail.value),
    h: common_vendor.t($data.isLogin ? "登录" : "注册"),
    i: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    j: common_vendor.t($data.isLogin ? "没有账号？去注册" : "已有账号？去登录"),
    k: common_vendor.o((...args) => $options.toggleMode && $options.toggleMode(...args)),
    l: $data.clientHeight ? $data.clientHeight + "px" : "auto"
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
