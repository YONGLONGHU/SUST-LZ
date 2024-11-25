"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      alarmName: "",
      alertCategories_index: 0,
      selectedAlertCategory: [
        "请选择报警分类",
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
      alertLevels_index: 0,
      alertLevels: ["请选择报警等级", "异常", "正常", "警告", "一般报警", "严重报警"],
      isConfirmed_index: 0,
      isConfirmed: ["请选择是否确认", "确认", "不确认"],
      allData: [],
      startDate: "",
      endDate: "",
      currentPage: 1,
      pageSize: 8
      // 每页展示的数据条数
    };
  },
  computed: {
    filteredData() {
      return this.allData.filter((item) => {
        const beginDate = new Date(this.startDate);
        const itemstartDate = new Date(item.AlarmTime);
        const EndDate = new Date(this.endDate);
        return (this.alarmName ? item.AlarmName.includes(this.alarmName) : true) && (this.alertCategories_index > 0 ? item.AlarmClass === this.alertCategories[this.alertCategories_index] : true) && (this.alertLevels_index > 0 ? item.AlarmLevel === this.alertLevels[this.alertLevels_index] : true) && (this.isConfirmed_index > 0 ? item.Confirm === this.isConfirmed[this.isConfirmed_index] : true) && (this.startDate ? itemstartDate >= beginDate : true) && // 仅保留开始时间大于等于选择时间的数据
        (this.endDate ? itemstartDate <= EndDate : true);
      });
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.pageSize);
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredData.slice(start, end);
    }
  },
  methods: {
    fetchData() {
      common_vendor.index.showLoading({
        title: "加载中..."
        // 显示加载动画
      });
      const apiUrl = "http://192.168.1.128:3000/data";
      common_vendor.index.request({
        url: apiUrl,
        method: "GET",
        success: (res) => {
          if (res.data.success) {
            this.allData = res.data.data;
            console.error("请求数据成功:", this.allData);
          } else {
            console.error("请求数据失败:", res.data.message);
          }
        },
        fail: (err) => {
          console.error("请求失败:", err);
        },
        complete: () => {
          common_vendor.index.hideLoading();
          common_vendor.index.stopPullDownRefresh();
        }
      });
    },
    onAlertCategoryChange(e) {
      this.alertCategories_index = parseInt(e.detail.value);
    },
    onAlertLevelChange(e) {
      this.alertLevels_index = parseInt(e.detail.value);
    },
    isConfirmedChange(e) {
      this.isConfirmed_index = parseInt(e.detail.value);
    },
    // 处理开始时间筛选
    onStartDateChange(e) {
      this.startDate = e.detail.value;
    },
    onEndDateChange(e) {
      this.endDate = e.detail.value;
    },
    // 查看详情
    viewDetails(item) {
      console.log("查看详情", item);
    },
    // 上一页
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    // 下一页
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  },
  onLoad(options) {
    this.fetchData();
  },
  onPullDownRefresh() {
    this.fetchData();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.alarmName,
    b: common_vendor.o(($event) => $data.alarmName = $event.detail.value),
    c: common_vendor.t($data.selectedAlertCategory[$data.alertCategories_index]),
    d: $data.alertCategories_index,
    e: $data.selectedAlertCategory,
    f: common_vendor.o((...args) => $options.onAlertCategoryChange && $options.onAlertCategoryChange(...args)),
    g: common_vendor.t($data.startDate || "请选择开始时间"),
    h: common_vendor.o((...args) => $options.onStartDateChange && $options.onStartDateChange(...args)),
    i: common_vendor.t($data.endDate || "请选择结束时间"),
    j: common_vendor.o((...args) => $options.onEndDateChange && $options.onEndDateChange(...args)),
    k: common_vendor.t($data.alertLevels[$data.alertLevels_index]),
    l: $data.alertLevels_index,
    m: $data.alertLevels,
    n: common_vendor.o((...args) => $options.onAlertLevelChange && $options.onAlertLevelChange(...args)),
    o: common_vendor.t($data.isConfirmed[$data.isConfirmed_index]),
    p: $data.isConfirmed_index,
    q: $data.isConfirmed,
    r: common_vendor.o((...args) => $options.isConfirmedChange && $options.isConfirmedChange(...args)),
    s: common_vendor.f($options.paginatedData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.AlarmName),
        b: common_vendor.t(item.AlarmTime),
        c: common_vendor.t(item.AlarmLevel),
        d: common_vendor.t(item.Position),
        e: common_vendor.t(item.Confirm),
        f: common_vendor.o(($event) => $options.viewDetails(item), index),
        g: index
      };
    }),
    t: $data.currentPage === 1,
    v: common_vendor.o((...args) => $options.prevPage && $options.prevPage(...args)),
    w: common_vendor.t($data.currentPage),
    x: common_vendor.t($options.totalPages),
    y: $data.currentPage === $options.totalPages,
    z: common_vendor.o((...args) => $options.nextPage && $options.nextPage(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
