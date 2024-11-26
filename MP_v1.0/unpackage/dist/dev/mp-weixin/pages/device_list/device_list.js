"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  onShow() {
    const isLoggedIn = common_vendor.index.getStorageSync("isLoggedIn");
    if (!isLoggedIn) {
      common_vendor.index.redirectTo({
        url: "/pages/login/login"
      });
    }
  },
  methods: {
    navigateTo(page) {
      common_vendor.index.navigateTo({
        url: `/pages/${page}/${page}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$1,
    b: common_vendor.o(($event) => $options.navigateTo("gg_robot")),
    c: common_assets._imports_1$1,
    d: common_vendor.o(($event) => $options.navigateTo("pb_robot")),
    e: common_assets._imports_2,
    f: common_vendor.o(($event) => $options.navigateTo("ls_robot")),
    g: common_assets._imports_3,
    h: common_vendor.o(($event) => $options.navigateTo("roomba"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
