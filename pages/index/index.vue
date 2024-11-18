<template>
  <view class="container">
    <view class="header">
      <text class="title">这是首页页面</text>
      <button class="btn" @click="fetchdata">获取数据</button>
    </view>

    <!-- 显示温度和烟雾值 -->
    <view v-if="weatherData.length > 0">
      <view v-for="(item, index) in weatherData" :key="index" class="data-item">
        <text class="tem">温度: {{ item.tem }}°C</text>
        <text class="som">烟雾值: {{ item.som }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      weatherData: [] // 用于存储解析后的数据
    };
  },
  methods: {
    fetchdata() {
      const apiUrl = 'http://192.168.1.128:3000/data'; // API地址
      uni.request({
        url: apiUrl,
        method: 'GET',
        success: (res) => {
          console.log('请求成功:', res.data); // 打印返回的数据
          if (res.data.success) {
            this.weatherData = res.data.data; // 解析并存储数据
          } else {
            console.error('请求数据失败');
          }
        },
        fail: (err) => {
          console.error('请求失败:', err); // 打印错误信息
        },
      });
    }
  }
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px; /* 添加间距 */
}

.title {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px; /* 标题和按钮之间的间距 */
}

.btn {
  padding: 10px 20px; /* 按钮内边距 */
  background-color: #007aff; /* 按钮背景颜色 */
  color: white;
  border-radius: 5px; /* 按钮圆角 */
}

.data-item {
  margin-top: 20px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
}

.tem, .som {
  font-size: 18px;
  color: #333;
}
</style>
