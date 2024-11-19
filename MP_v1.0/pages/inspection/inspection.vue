<template>
  <view class="container">
    <!-- 标题 -->
    <view class="header">
      <text class="title">智能机器人</text>
    </view>
    <view class="header">
      <text class="subtitle">ROBOT</text>
    </view>

    <!-- 中间按钮区域 -->
    <view class="button-list">
      <view class="button-item" @tap="navigateTo('robot')">
        <text class="button-text">ROBOT</text>
        <image src="/static/icons/robot1.png" class="icon"></image>
      </view>
      <view class="button-item" @tap="navigateTo('g20')">
        <text class="button-text">石头G20</text>
        <image src="/static/icons/robot2.png" class="icon"></image>
      </view>
      <view class="button-item" @tap="navigateTo('irobot')">
        <text class="button-text">iRobot i7+</text>
        <image src="/static/icons/robot3.png" class="icon"></image>
      </view>
      <view class="button-item" @tap="navigateTo('roomba')">
        <text class="button-text">Roomba s9</text>
        <image src="/static/icons/robot4.png" class="icon"></image>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    navigateTo(page) {
      uni.navigateTo({
        url: `/pages/${page}/${page}`
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
  background-color: #ffffff;
}

.header {
  margin-top: 20px;
  text-align: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.subtitle {
  font-size: 18px;
  color: #888888;
  margin-top: 5px;
}

.button-list {
  margin-top: 20px;
  width: 90%;
}

.button-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #e6e6fa;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.button-text {
  font-size: 18px; /* 调整字体大小 */
  font-weight: bold; /* 加粗字体 */
  color: #00008b; /* 深蓝色 */
}

.icon {
  width: 40px;
  height: 40px;
}
</style>
