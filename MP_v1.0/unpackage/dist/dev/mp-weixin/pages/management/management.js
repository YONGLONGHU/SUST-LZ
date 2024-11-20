"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
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
    b: common_assets._imports_1$1,
    c: common_assets._imports_2$1,
    d: common_vendor.o(($event) => $options.navigateTo("personalCenter")),
    e: common_assets._imports_3$1,
    f: common_assets._imports_2$1,
    g: common_vendor.o(($event) => $options.navigateTo("messageManagement")),
    h: common_assets._imports_4,
    i: common_assets._imports_2$1,
    j: common_vendor.o(($event) => $options.navigateTo("deviceManagement")),
    k: common_assets._imports_5,
    l: common_assets._imports_2$1,
    m: common_vendor.o(($event) => $options.navigateTo("switchAccount"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e1f91689"]]);
wx.createPage(MiniProgramPage);
