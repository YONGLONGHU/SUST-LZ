"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      weatherData: []
      // 用于存储解析后的数据
    };
  },
  methods: {
    fetchdata() {
      const apiUrl = "http://192.168.1.128:3000/data";
      common_vendor.index.request({
        url: apiUrl,
        method: "GET",
        success: (res) => {
          console.log("请求成功:", res.data);
          if (res.data.success) {
            this.weatherData = res.data.data;
          } else {
            console.error("请求数据失败");
          }
        },
        fail: (err) => {
          console.error("请求失败:", err);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.fetchdata && $options.fetchdata(...args)),
    b: $data.weatherData.length > 0
  }, $data.weatherData.length > 0 ? {
    c: common_vendor.f($data.weatherData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.tem),
        b: common_vendor.t(item.som),
        c: index
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
