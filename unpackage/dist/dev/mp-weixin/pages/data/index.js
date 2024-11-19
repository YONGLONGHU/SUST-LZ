"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      canvasWidth: 750,
      // 使用设计稿宽度
      canvasHeight: 400,
      data: [100, 200, 70, 400, 50],
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      colors: ["#1E90FF", "#32CD32", "#FF8C00", "#FF6347", "#4B0082"]
    };
  },
  onReady() {
    this.drawChart();
  },
  methods: {
    getColor(index) {
      return this.colors[index % this.colors.length];
    },
    drawChart() {
      const ctx = common_vendor.index.createCanvasContext("myChart", this);
      const width = this.canvasWidth / this.data.length;
      const height = this.canvasHeight;
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(this.canvasWidth, height);
      ctx.lineTo(this.canvasWidth, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.strokeStyle = "#ccc";
      ctx.stroke();
      this.data.forEach((item, index) => {
        const x = index * width + width / 2;
        const y = height - item;
        const color = this.colors[index % this.colors.length];
        ctx.setFillStyle(color);
        ctx.fillRect(x - width / 4, y, width / 2, item);
      });
      ctx.draw();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.canvasWidth + "px",
    b: $data.canvasHeight + "px",
    c: common_vendor.f($data.data, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: common_vendor.t($data.categories[index]),
        c: index,
        d: $options.getColor(index)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
