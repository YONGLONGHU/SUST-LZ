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
    a: common_assets._imports_0$2,
    b: common_assets._imports_1$2,
    c: common_assets._imports_2$1,
    d: common_vendor.o(($event) => $options.navigateTo("personal_center")),
    e: common_assets._imports_3$1,
    f: common_assets._imports_2$1,
    g: common_vendor.o(($event) => $options.navigateTo("switch_account")),
    h: common_assets._imports_4,
    i: common_assets._imports_2$1,
    j: common_vendor.o(($event) => $options.navigateTo("about_us"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e1f91689"]]);
wx.createPage(MiniProgramPage);
