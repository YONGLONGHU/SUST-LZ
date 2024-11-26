<template>
  <view class="login-container" :style="{ height: clientHeight ? clientHeight + 'px' : 'auto' }">
    <!-- 登录框 -->
    <view class="login-box">
      <text class="title">量子智能监控平台</text>
      <!-- 输入框 -->
      <view class="input-group">
        <image src="/static/icons/account.png" class="icon" />
        <input 
          v-model="username" 
          class="input-field" 
          placeholder="请输入账号" 
          placeholder-class="placeholder" 
        />
      </view>
      <view class="input-group">
        <image src="/static/icons/password.png" class="icon" />
        <input 
          v-model="password" 
          type="password" 
          class="input-field" 
          placeholder="请输入密码" 
          placeholder-class="placeholder" 
        />
      </view>
      <!-- 登录按钮 -->
      <button class="login-button" @click="login">登录</button>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      clientHeight: '',
      username: '',
      password: '',
    };
  },
  mounted() {
    // 动态计算屏幕高度
    this.clientHeight = uni.getSystemInfoSync().windowHeight;
  },
  methods: {
    login() {
      if (this.username === 'admin' && this.password === '123') {
        uni.setStorageSync('isLoggedIn', true);
        uni.switchTab({ url: '/pages/device_list/device_list' });
      } else {
        uni.showToast({ title: '账号或密码错误', icon: 'none' });
      }
    },
  },
};
</script>
<style>
	/* 登录页面容器 */
	.login-container {
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  background: linear-gradient(135deg, #1e1e2f, #3a3a5c);
	  color: white;
	}
	
	/* 登录框样式 */
	.login-box {
	  width: 90%;
	  height: 35%;
	  max-width: 600rpx;
	  padding: 40rpx 20rpx;
	  background: rgba(255, 255, 255, 0.1);
	  border-radius: 25rpx;
	  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
	  text-align: center;
	}
	
	/* 标题样式 */
	.title {
	  font-size: 42rpx;
	  font-weight: bold;
	  margin-bottom: 60rpx;
	  color: #00ccff;
	}
	
	/* 输入框组 */
	.input-group {
	  margin-top: 30rpx;
	  display: flex;
	  align-items: center;
	  margin-bottom: 30rpx;
	  background: rgba(255, 255, 255, 0.15);
	  border-radius: 20rpx;
	  padding: 10rpx 15rpx;
	  width: 80%; /* 设置宽度为父容器的80% */
	  margin-left: auto; /* 水平居中 */
	  margin-right: auto; /* 水平居中 */
	}
	
	/* 输入框图标 */
	.icon {
	  width: 50rpx;
	  height: 50rpx;
	  margin-right: 15rpx;
	}
	
	/* 输入框 */
	.input-field {
	  flex: 1;
	  height: 60rpx;
	  font-size: 30rpx;
	  border: none;
	  background: transparent;
	  color: white;
	  outline: none;
	}
	
	/* 输入框占位符样式 */
	.placeholder {
	  color: rgba(255, 255, 255, 0.6);
	}
	
	/* 登录按钮 */
	.login-button {
	  width: 100%;
	  height: 70rpx;
	  background: linear-gradient(135deg, #00ccff, #0077ff);
	  border: none;
	  border-radius: 35rpx;
	  color: white;
	  font-size: 30rpx;
	  font-weight: bold;
	  box-shadow: 0px 5px 15px rgba(0, 204, 255, 0.5);
	  transition: all 0.3s;
	  width: 85%; /* 设置宽度为父容器的80% */
	  margin-left: auto; /* 水平居中 */
	  margin-right: auto; /* 水平居中 */
	}
	
	.login-button:hover {
	  transform: scale(1.05);
	  box-shadow: 0px 8px 20px rgba(0, 204, 255, 0.7);
	}
</style>
