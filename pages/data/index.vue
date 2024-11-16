<template>
  <view class="canvas-container">
    <canvas canvas-id="myChart" type="2d" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"></canvas>
  </view>
</template>

<script>
export default {
  data() {
    return {
      canvasWidth: 300,
      canvasHeight: 200,
      data: [10, 20, 30, 40, 50]
    };
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      const ctx = uni.createCanvasContext('myChart', this);
      const width = this.canvasWidth / this.data.length;
      this.data.forEach((item, index) => {
        ctx.setFillStyle('blue');
        ctx.fillRect(index * width, this.canvasHeight - item, width - 2, item);
      });
      ctx.draw();
    }
  }
};
</script>

<style>
.canvas-container {
	width: 100%%;
	height: 1000px;
  display: flex;
  justify-content: center;
}
</style>