<template>
  <view class="container">
    <view class="header">
      <text class="title">这是首页页面</text>
      <button class="btn" @click="gotoCommunication">测试通信状态</button>
    </view>
    <image src="/static/pictures/1.jpg" mode="aspectFill" class="pic1"></image>
  </view>
</template>
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

.pic1 {
  width: 100%; /* 图片宽度 */
  height: 300px; /* 图片高度 */
}
</style>
<script>
export default {
  methods: {
    gotoCommunication() {
      uni.navigateTo({
        url: '/pages/Communication/index'
      });
    }
  }
}
</script>