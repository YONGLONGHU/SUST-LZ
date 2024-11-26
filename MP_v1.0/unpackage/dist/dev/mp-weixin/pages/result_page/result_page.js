"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      currentPage: 1,
      // 当前页码
      pageSize: 5,
      // 每页显示的条数
      filters: {},
      // 筛选条件
      allData: [],
      // 全部数据
      filteredData: []
      // 筛选后的数据
    };
  },
  computed: {
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredData.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.pageSize);
    }
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    // 筛选数据
    filterData() {
      this.filteredData = this.allData.filter((item) => {
        var _a, _b;
        const matchAlarmName = !this.filters.alarmName || item.AlarmName.includes(this.filters.alarmName);
        const matchDeviceName = !this.filters.deviceName || item.DeviceId.includes(this.filters.deviceName);
        const matchProductType = !this.filters.productType || item.ProductClass === this.filters.productType;
        const matchTimeRange = (!((_a = this.filters.timeRange) == null ? void 0 : _a.start) || new Date(item.AlarmTime) >= new Date(
          this.filters.timeRange.start
        )) && (!((_b = this.filters.timeRange) == null ? void 0 : _b.end) || new Date(item.AlarmTime) <= new Date(this.filters.timeRange.end));
        const matchAlertCategory = !this.filters.alertCategory || item.AlarmClass === this.filters.alertCategory;
        const matchAlertLevel = !this.filters.alertLevel || item.AlarmLevel.trim().toLowerCase() === this.filters.alertLevel.trim().toLowerCase();
        const matchIsConfirmed = !this.filters.isConfirmed || item.Confirm === this.filters.isConfirmed;
        return matchAlarmName && matchDeviceName && matchProductType && matchTimeRange && matchAlertCategory && matchAlertLevel && matchIsConfirmed;
      });
      this.currentPage = 1;
      console.log("Filtered Data:", this.filteredData);
    },
    fetchData() {
      const apiUrl = "http://192.168.1.128:3000/data";
      common_vendor.index.request({
        url: apiUrl,
        method: "GET",
        success: (res) => {
          if (res.data.success) {
            this.allData = res.data.data;
            console.log("allData Data:", this.allData);
            this.filterData();
          } else {
            console.error("请求数据失败:", res.data.message);
          }
        },
        fail: (err) => {
          console.error("请求失败:", err);
        }
      });
    }
  },
  onLoad(options) {
    this.filters = JSON.parse(decodeURIComponent(options.filters || "{}"));
    console.log("filters Data:", this.filters);
    this.fetchData();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($options.paginatedData, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.AlarmName),
        b: common_vendor.t(item.DeviceId),
        c: common_vendor.t(item.ProductClass),
        d: common_vendor.t(item.AlarmClass),
        e: common_vendor.t(item.AlarmLevel),
        f: common_vendor.t(item.AlarmTime),
        g: item.id
      };
    }),
    b: common_vendor.o(($event) => $options.changePage($data.currentPage - 1)),
    c: $data.currentPage === 1,
    d: common_vendor.t($data.currentPage),
    e: common_vendor.t($options.totalPages),
    f: common_vendor.o(($event) => $options.changePage($data.currentPage + 1)),
    g: $data.currentPage === $options.totalPages
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
