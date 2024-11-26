"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      taskName: "",
      deviceName: "",
      taskStatusIndex: 0,
      // 初始选中为“请选择”
      statusRange: ["请选择状态", "进行中", "已完成"],
      startDate: "",
      currentPage: 1,
      pageSize: 8,
      // 每页展示的数据条数
      data: [
        {
          taskName: "厂房检测",
          deviceName: "防爆设备003",
          cycleCount: 3,
          taskStatus: "进行中",
          startTime: "2024-11-22 17:07:49",
          lastResponseTime: "2024-11-22 17:07:49"
        },
        {
          taskName: "东莞油库轮换式",
          deviceName: "东莞油库01",
          cycleCount: 2,
          taskStatus: "已完成",
          startTime: "2024-11-22 15:31:46",
          lastResponseTime: "2024-11-22 15:31:46"
        },
        {
          taskName: "东莞油库轮换式",
          deviceName: "东莞油库03",
          cycleCount: 8,
          taskStatus: "进行中",
          startTime: "2024-11-22 13:24:09",
          lastResponseTime: "2024-11-22 13:24:09"
        },
        {
          taskName: "厂房检测",
          deviceName: "防爆设备003",
          cycleCount: 3,
          taskStatus: "已完成",
          startTime: "2024-11-22 13:02:54",
          lastResponseTime: "2024-11-22 13:02:54"
        },
        {
          taskName: "东莞油库轮换式",
          deviceName: "东莞油库01",
          cycleCount: 5,
          taskStatus: "进行中",
          startTime: "2024-11-21 15:34:17",
          lastResponseTime: "2024-11-21 15:34:17"
        },
        {
          taskName: "厂房检测",
          deviceName: "防爆设备003",
          cycleCount: 3,
          taskStatus: "进行中",
          startTime: "2024-11-22 17:07:49",
          lastResponseTime: "2024-11-22 17:07:49"
        },
        {
          taskName: "东莞油库轮换式",
          deviceName: "东莞油库01",
          cycleCount: 2,
          taskStatus: "已完成",
          startTime: "2024-11-22 15:31:46",
          lastResponseTime: "2024-11-22 15:31:46"
        },
        {
          taskName: "东莞油库轮换式",
          deviceName: "东莞油库03",
          cycleCount: 8,
          taskStatus: "进行中",
          startTime: "2024-11-22 13:24:09",
          lastResponseTime: "2024-11-22 13:24:09"
        },
        {
          taskName: "厂房检测",
          deviceName: "防爆设备003",
          cycleCount: 3,
          taskStatus: "已完成",
          startTime: "2024-11-22 13:02:54",
          lastResponseTime: "2024-11-22 13:02:54"
        },
        {
          taskName: "东莞油库轮换式",
          deviceName: "东莞油库01",
          cycleCount: 5,
          taskStatus: "进行中",
          startTime: "2024-11-21 15:34:17",
          lastResponseTime: "2024-11-21 15:34:17"
        },
        {
          taskName: "厂房检测",
          deviceName: "防爆设备003",
          cycleCount: 3,
          taskStatus: "进行中",
          startTime: "2024-11-22 17:07:49",
          lastResponseTime: "2024-11-22 17:07:49"
        },
        {
          taskName: "东莞油库轮换式",
          deviceName: "东莞油库01",
          cycleCount: 2,
          taskStatus: "已完成",
          startTime: "2024-11-22 15:31:46",
          lastResponseTime: "2024-11-22 15:31:46"
        },
        {
          taskName: "东莞油库轮换式",
          deviceName: "东莞油库03",
          cycleCount: 8,
          taskStatus: "进行中",
          startTime: "2024-11-22 13:24:09",
          lastResponseTime: "2024-11-22 13:24:09"
        },
        {
          taskName: "厂房检测",
          deviceName: "防爆设备003",
          cycleCount: 3,
          taskStatus: "已完成",
          startTime: "2024-11-22 13:02:54",
          lastResponseTime: "2024-11-22 13:02:54"
        },
        {
          taskName: "东莞油库轮换式",
          deviceName: "东莞油库01",
          cycleCount: 5,
          taskStatus: "进行中",
          startTime: "2024-11-21 15:34:17",
          lastResponseTime: "2024-11-21 15:34:17"
        }
        // 更多数据...
      ],
      showModal: false,
      // 控制弹框显示
      selectedItem: {}
      // 存储点击查看详情的报警信息
    };
  },
  computed: {
    filteredData() {
      return this.data.filter((item) => {
        const selectedDate = new Date(this.startDate);
        const itemStartDate = new Date(item.startTime);
        return (this.taskName ? item.taskName.includes(this.taskName) : true) && (this.deviceName ? item.deviceName.includes(this.deviceName) : true) && (this.taskStatusIndex > 0 ? item.taskStatus === this.statusRange[this.taskStatusIndex] : true) && (this.startDate ? itemStartDate >= selectedDate : true);
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
    // 处理任务状态筛选
    onStatusChange(e) {
      this.taskStatusIndex = parseInt(e.detail.value);
    },
    // 处理开始时间筛选
    onStartDateChange(e) {
      this.startDate = e.detail.value;
    },
    // 查看详情
    viewDetails(item) {
      this.selectedItem = item;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    // 导出日志
    exportLog(item) {
      console.log("导出日志", item);
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
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.taskName,
    b: common_vendor.o(($event) => $data.taskName = $event.detail.value),
    c: $data.deviceName,
    d: common_vendor.o(($event) => $data.deviceName = $event.detail.value),
    e: common_vendor.t($data.statusRange[$data.taskStatusIndex]),
    f: $data.taskStatusIndex,
    g: $data.statusRange,
    h: common_vendor.o((...args) => $options.onStatusChange && $options.onStatusChange(...args)),
    i: common_vendor.t($data.startDate || "输入开始时间"),
    j: common_vendor.o((...args) => $options.onStartDateChange && $options.onStartDateChange(...args)),
    k: common_vendor.f($options.paginatedData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.taskName),
        b: common_vendor.t(item.startTime),
        c: common_vendor.t(item.cycleCount),
        d: common_vendor.o(($event) => $options.viewDetails(item), index),
        e: common_vendor.t(item.deviceName),
        f: common_vendor.t(item.lastResponseTime),
        g: common_vendor.t(item.taskStatus),
        h: common_vendor.o(($event) => $options.exportLog(item), index),
        i: index
      };
    }),
    l: $data.showModal
  }, $data.showModal ? {
    m: common_vendor.o((...args) => $options.closeModal && $options.closeModal(...args)),
    n: common_vendor.t($data.selectedItem.taskName),
    o: common_vendor.t($data.selectedItem.deviceName),
    p: common_vendor.t($data.selectedItem.cycleCount),
    q: common_vendor.t($data.selectedItem.taskStatus),
    r: common_vendor.t($data.selectedItem.startTime),
    s: common_vendor.t($data.selectedItem.lastResponseTime),
    t: common_vendor.o(() => {
    }),
    v: common_vendor.o((...args) => $options.closeModal && $options.closeModal(...args))
  } : {}, {
    w: $data.currentPage === 1,
    x: common_vendor.o((...args) => $options.prevPage && $options.prevPage(...args)),
    y: common_vendor.t($data.currentPage),
    z: common_vendor.t($options.totalPages),
    A: $data.currentPage === $options.totalPages,
    B: common_vendor.o((...args) => $options.nextPage && $options.nextPage(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
