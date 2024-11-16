<template>
  <view class="container">
    <view class="profile">
      <image class="avatar" src="/static/pictures/1.jpg" mode="aspectFill"></image>
      <text class="nickname">致良知</text>
    </view>
    <view class="info-list">
      <view class="info-item" @click="goToSettings('nickname')">
        <text class="info-title">昵称</text>
        <text class="info-value">微信用户</text>
        <image class="arrow" src="/static/arrow-right.png" mode="aspectFit"></image>
      </view>
      <view class="info-item" @click="goToSettings('weixinId')">
        <text class="info-title">微信号</text>
        <text class="info-value">wxid_123456789</text>
        <image class="arrow" src="/static/arrow-right.png" mode="aspectFit"></image>
      </view>
      <!-- 更多个人信息项 -->
    </view>
    <view class="operation-list">
      <view class="operation-item" @click="goToSettings('settings')">
        <text>设置</text>
      </view>
      <!-- 更多操作项 -->
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

.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.nickname {
  font-size: 20px;
  font-weight: bold;
}

.info-list {
  width: 100%;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.info-title {
  font-size: 16px;
  color: #333;
}

.info-value {
  font-size: 16px;
  color: #666;
}

.arrow {
  width: 20px;
  height: 20px;
}

.operation-list {
  width: 100%;
  margin-top: 20px;
}

.operation-item {
  padding: 15px 0;
  background-color: #f5f5f5;
  text-align: center;
  font-size: 16px;
  color: #333;
  border-bottom: 1px solid #eee; /* 添加分隔线 */
}
</style>

<script>
export default {
  methods: {
    goToSettings(page) {
      let url = '';
      switch (page) {
        case 'nickname':
          url = '/pages/Communication/index/'; // 假设这是昵称页面的路径
          break;
        case 'weixinId':
          url = '/pages/Communication/index'; // 假设这是微信号页面的路径
          break;
        case 'settings':
          url = '/pages/Communication/index'; // 假设这是设置页面的路径
          break;
        default:
          return;
      }
      uni.navigateTo({
        url: url
      });
    }
  }
}
</script>