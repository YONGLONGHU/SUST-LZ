"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  methods: {
    goToSettings(page) {
      let url = "";
      switch (page) {
        case "nickname":
          url = "/pages/Communication/index/";
          break;
        case "weixinId":
          url = "/pages/Communication/index";
          break;
        case "settings":
          url = "/pages/Communication/index";
          break;
        default:
          return;
      }
      common_vendor.index.navigateTo({
        url
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: common_assets._imports_1,
    c: common_vendor.o(($event) => $options.goToSettings("nickname")),
    d: common_assets._imports_1,
    e: common_vendor.o(($event) => $options.goToSettings("weixinId")),
    f: common_vendor.o(($event) => $options.goToSettings("settings"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
