"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      tenantInfo: {}
      // 用于存储租户信息
    };
  },
  onLoad() {
    this.getTenantInfo();
  },
  methods: {
    // 网络请求：获取租户信息
    getTenantInfo() {
      const url = "https://app.apifox.com/project/2595419/api/multi-tenancy/tenants";
      common_vendor.index.request({
        url,
        // 确保 URL 为完整的绝对路径
        method: "GET",
        header: {
          "Content-Type": "application/json"
          // 指定请求头
        },
        success: (res) => {
          if (res.statusCode === 200) {
            console.log("请求成功:", res.data);
            this.tenantInfo = res.data;
          } else {
            console.error("请求失败，状态码:", res.statusCode);
            common_vendor.index.showToast({
              title: "数据加载失败",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          console.error("请求失败:", err.errMsg);
          common_vendor.index.showToast({
            title: `请求失败: ${err.errMsg}`,
            icon: "none"
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.tenantInfo.id || "暂无数据"),
    b: common_vendor.t($data.tenantInfo.name || "暂无数据"),
    c: common_vendor.t($data.tenantInfo.concurrencyStamp || "无"),
    d: common_vendor.t($data.tenantInfo.items ? JSON.stringify($data.tenantInfo.items) : "无")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-49867d47"]]);
wx.createPage(MiniProgramPage);
