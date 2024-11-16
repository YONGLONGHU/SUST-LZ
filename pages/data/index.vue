<template>
  <view class="container">
    <view class="title">数据可视化界面</view>
    <view class="canvas-container">
      <canvas canvas-id="myChart" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"></canvas>
    </view>
    <view class="legend">
      <view v-for="(item, index) in data" :key="index" class="legend-item" :style="{ backgroundColor: getColor(index) }">
        {{ item }} <text class="legend-text">{{ categories[index] }}</text>
      </view>
    </view>
  </view>
</template>
<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.canvas-container {
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.legend {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.legend-text {
  margin-left: 5px;
}
</style>
<script>
export default {
  data() {
    return {
      canvasWidth: 750, // 使用设计稿宽度
      canvasHeight: 400,
      data: [100, 200, 70, 400, 50],
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      colors: ['#1E90FF', '#32CD32', '#FF8C00', '#FF6347', '#4B0082']
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
      const ctx = uni.createCanvasContext('myChart', this);
      const width = this.canvasWidth / this.data.length;
      const height = this.canvasHeight;
      
      // 绘制坐标轴
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(this.canvasWidth, height);
      ctx.lineTo(this.canvasWidth, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.strokeStyle = '#ccc';
      ctx.stroke();

      // 绘制柱状图
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
</script>