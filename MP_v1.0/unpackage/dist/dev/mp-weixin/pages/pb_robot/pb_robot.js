"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      imageBase64: "",
      // 存储从网络获取的base64图像数据
      sensorData1: "一号温度值：25°C",
      // 示例传感数据
      sensorData2: "二号温度值：29°C",
      // 示例传感数据
      speed: "",
      // 机器人速度
      lightBrightness: ""
      // 补光灯亮度（初始值）
    };
  },
  methods: {
    // 模拟从网络获取图像并实时更新
    fetchImageData() {
      setInterval(() => {
        this.imageBase64 = "data:image/png;base64," + this.generateRandomBase64();
      }, 5e3);
    },
    // 生成随机的Base64字符串（此处仅为示例，实际应用中应替换为真实数据）
    generateRandomBase64() {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < 1e3; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    },
    // 发送指令
    sendCommand(command) {
      common_vendor.index.showToast({
        title: `${command} 指令已发送`,
        icon: "success"
      });
    },
    // 控制机器人
    toggleRobot(action) {
      this.robotStatus = action;
    },
    // 设置机器人速度
    setSpeed() {
      common_vendor.index.showToast({
        title: `设置速度：${this.speed}`,
        icon: "success"
      });
    },
    // 控制云台
    controlCamera(direction) {
      common_vendor.index.showToast({
        title: `云台控制：${direction}`,
        icon: "success"
      });
    },
    // 重启云台
    restartCamera() {
      common_vendor.index.showToast({
        title: "云台重启中...",
        icon: "success"
      });
    }
  },
  onLoad() {
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.imageBase64,
    b: common_vendor.t($data.sensorData1),
    c: common_vendor.t($data.sensorData2),
    d: common_vendor.o(($event) => $options.sendCommand("回程充电")),
    e: common_vendor.o(($event) => $options.sendCommand("故障复位")),
    f: common_vendor.o(($event) => $options.sendCommand("打开前灯")),
    g: common_vendor.o(($event) => $options.sendCommand("打开后灯")),
    h: common_vendor.o(($event) => $options.toggleRobot("加速")),
    i: common_vendor.o(($event) => $options.toggleRobot("减速")),
    j: common_vendor.o(($event) => $options.toggleRobot("前进")),
    k: common_vendor.o(($event) => $options.toggleRobot("后退")),
    l: common_vendor.o(($event) => $options.toggleRobot("停止")),
    m: $data.speed,
    n: common_vendor.o(($event) => $data.speed = $event.detail.value),
    o: common_vendor.o(($event) => $options.controlCamera("上仰")),
    p: common_vendor.o(($event) => $options.controlCamera("下仰")),
    q: common_vendor.o(($event) => $options.controlCamera("左旋")),
    r: common_vendor.o(($event) => $options.controlCamera("右旋")),
    s: common_vendor.o((...args) => $options.restartCamera && $options.restartCamera(...args)),
    t: $data.lightBrightness,
    v: common_vendor.o(($event) => $data.lightBrightness = $event.detail.value)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3fbd0c2c"]]);
wx.createPage(MiniProgramPage);
