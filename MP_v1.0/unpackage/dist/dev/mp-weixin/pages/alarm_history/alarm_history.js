"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      alarmName: "",
      alertCategories: [
        "AI报警",
        "气体监测",
        "撕裂",
        "划痕",
        "联锁停机",
        "设备高温检测",
        "跑冒滴检测",
        "巡检日志",
        "安全行为检测",
        "其他(默认)",
        "火焰检测"
      ],
      selectedAlertCategory: "",
      alertLevels: ["异常", "正常", "警告", "一般报警", "严重报警"],
      selectedAlertLevel: "",
      startDate: "",
      endDate: "",
      isConfirmed: ["确认", "不确认"],
      selectedisConfirmed: ""
    };
  },
  methods: {
    onStartDateChange(e) {
      this.startDate = e.detail.value;
    },
    onEndDateChange(e) {
      this.endDate = e.detail.value;
    },
    onAlertCategoryChange(e) {
      this.selectedAlertCategory = this.alertCategories[e.detail.value];
    },
    onAlertLevelChange(e) {
      this.selectedAlertLevel = this.alertLevels[e.detail.value];
    },
    isConfirmedChange(e) {
      this.selectedisConfirmed = this.isConfirmed[e.detail.value];
    },
    submitForm() {
      const filters = {
        alarmName: this.alarmName,
        timeRange: { start: this.startDate, end: this.endDate },
        alertCategory: this.selectedAlertCategory,
        alertLevel: this.selectedAlertLevel,
        isConfirmed: this.selectedisConfirmed
      };
      common_vendor.index.navigateTo({
        url: `/pages/result_page/result_page?filters=${encodeURIComponent(JSON.stringify(filters))}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.alarmName,
    b: common_vendor.o(($event) => $data.alarmName = $event.detail.value),
    c: common_vendor.t($data.startDate || "开始时间"),
    d: common_vendor.o((...args) => $options.onStartDateChange && $options.onStartDateChange(...args)),
    e: common_vendor.t($data.endDate || "结束时间"),
    f: common_vendor.o((...args) => $options.onEndDateChange && $options.onEndDateChange(...args)),
    g: common_vendor.t($data.selectedAlertCategory || "请选择报警分类"),
    h: $data.alertCategories,
    i: common_vendor.o((...args) => $options.onAlertCategoryChange && $options.onAlertCategoryChange(...args)),
    j: common_vendor.t($data.selectedAlertLevel || "请选择报警等级"),
    k: $data.alertLevels,
    l: common_vendor.o((...args) => $options.onAlertLevelChange && $options.onAlertLevelChange(...args)),
    m: common_vendor.t($data.selectedisConfirmed || "请选择是否确认"),
    n: $data.isConfirmed,
    o: common_vendor.o((...args) => $options.isConfirmedChange && $options.isConfirmedChange(...args)),
    p: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
