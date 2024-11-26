"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      clientHeight: "",
      username: "",
      password: ""
    };
  },
  mounted() {
    this.clientHeight = common_vendor.index.getSystemInfoSync().windowHeight;
  },
  methods: {
    login() {
      if (this.username === "admin" && this.password === "123") {
        common_vendor.index.setStorageSync("isLoggedIn", true);
        common_vendor.index.switchTab({ url: "/pages/device_list/device_list" });
      } else {
        common_vendor.index.showToast({ title: "账号或密码错误", icon: "none" });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: $data.username,
    c: common_vendor.o(($event) => $data.username = $event.detail.value),
    d: common_assets._imports_1,
    e: $data.password,
    f: common_vendor.o(($event) => $data.password = $event.detail.value),
    g: common_vendor.o((...args) => $options.login && $options.login(...args)),
    h: $data.clientHeight ? $data.clientHeight + "px" : "auto"
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
