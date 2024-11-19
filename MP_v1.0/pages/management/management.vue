<template>
  <view class="container">
    <!-- 第一部分：账号、名称、头像、监控数据 -->
    <view class="profile-card">
      <view class="profile-info-horizontal">
        <image class="avatar" src="/static/image/avatar.jpg" mode="aspectFill" />
        <view class="profile-info-text">
          <text class="name">致良知</text>
          <text class="username">账号：user123</text>
        </view>
      </view>
      <view class="monitor-stats">
        <text class="stats">总监控时长：120小时</text>
        <text class="stats">监控次数：45次</text>
      </view>
    </view>

    <!-- 第二部分：个人中心按钮 -->
    <view class="menu-card" @click="navigateTo('personalCenter')">
      <view class="menu-item">
        <image class="icon" src="/static/icons/personal-center.png" mode="widthFix" />
        <text class="menu-text">个人中心</text>
        <image class="arrow" src="/static/icons/arrow-right.png" mode="widthFix" />
      </view>
    </view>

    <!-- 第三部分：消息管理按钮 -->
    <view class="menu-card" @click="navigateTo('messageManagement')">
      <view class="menu-item">
        <image class="icon" src="/static/icons/message.png" mode="widthFix" />
        <text class="menu-text">消息管理</text>
        <image class="arrow" src="/static/icons/arrow-right.png" mode="widthFix" />
      </view>
    </view>

    <!-- 第四部分：设备管理按钮 -->
    <view class="menu-card" @click="navigateTo('deviceManagement')">
      <view class="menu-item">
        <image class="icon" src="/static/icons/device.png" mode="widthFix" />
        <text class="menu-text">设备管理</text>
        <image class="arrow" src="/static/icons/arrow-right.png" mode="widthFix" />
      </view>
    </view>

    <!-- 第五部分：切换账号按钮 -->
    <view class="menu-card" @click="navigateTo('switchAccount')">
      <view class="menu-item">
        <image class="icon" src="/static/icons/switchAccount.png" mode="widthFix" />
        <text class="menu-text">切换账号</text>
        <image class="arrow" src="/static/icons/arrow-right.png" mode="widthFix" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    navigateTo(page) {
      // 跳转到对应页面
      uni.navigateTo({
        url: `/pages/${page}/${page}`
      });
    }
  }
};
</script>

<style scoped>
/* 页面整体样式 */
.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #1e1e2f, #292942);
  min-height: 100vh;
  color: #fff;
}

/* 第一部分样式 */
.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.profile-info-horizontal {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
}

.avatar {
	margin-left: 30px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #00d4ff;
}

.profile-info-text {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 14px;
  color: #a5a5c0;
  margin-top: 5px;
}

.name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.monitor-stats {
  text-align: center;
  margin-top: 15px;
}

.stats {
  font-size: 14px;
  color: #a5a5c0;
  margin: 5px 0;
}

/* 按钮部分样式 */
.menu-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon {
  width: 24px;
  height: 24px;
}

.menu-text {
  flex: 1;
  font-size: 16px;
  margin-left: 15px;
  color: #fff;
}

.arrow {
  width: 16px;
  height: 16px;
}
</style>
