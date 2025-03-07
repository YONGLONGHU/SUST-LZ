<template>
  <view class="login-container" :style="{ height: clientHeight ? clientHeight + 'px' : 'auto' }">
    <!-- 登录/注册框 -->
    <view class="login-box">
      <text class="title">{{ isLogin ? '量子智能监控平台' : '量子智能监控平台' }}</text>
      <!-- 输入框 -->
      <view class="input-group">
        <image src="/static/icons/account.png" class="icon" />
        <input v-model="username" class="input-field" placeholder="请输入账号" placeholder-class="placeholder" />
      </view>
      <view class="input-group">
        <image src="/static/icons/password.png" class="icon" />
        <input v-model="password" type="password" class="input-field" placeholder="请输入密码" placeholder-class="placeholder" />
      </view>
      <!-- 按钮 -->
      <button class="login-button" @click="submit">{{ isLogin ? '登录' : '注册' }}</button>
      <text class="toggle-text" @click="toggleMode">
        {{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}
      </text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      clientHeight: '', // 屏幕高度
      username: '', // 用户名
      password: '', // 密码
      isLogin: true // 是否为登录模式
    };
  },
  mounted() {
    // 动态计算屏幕高度
    this.clientHeight = uni.getSystemInfoSync().windowHeight;
  },
  methods: {
    // 切换登录/注册模式
    toggleMode() {
      this.isLogin = !this.isLogin;
      this.username = '';
      this.password = '';
    },
    // 提交表单
    submit() {
      if (!this.username || !this.password) {
        uni.showToast({ title: '请输入账号和密码', icon: 'none' });
        return;
      }

      const url = this.isLogin
        ? 'http://192.168.173.250:8083/login'
        : 'http://192.168.173.250:8083/register';
      const data = {
        username: this.username,
        password: this.password
      };

      uni.request({
        url: url,
        method: 'POST',
        data: data,
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          const response = res.data;
          if (response.success) {
            if (this.isLogin) {
              // 登录成功
              uni.setStorageSync('isLoggedIn', true);
              uni.switchTab({
                url: '/pages/device_list/device_list'
              });
            } else {
              // 注册成功，提示并切换到登录模式
              uni.showToast({ title: '注册成功，请登录', icon: 'success' });
              this.isLogin = true;
            }
          } else {
            uni.showToast({ title: response.message || '操作失败', icon: 'none' });
          }
        },
        fail: (err) => {
          uni.showToast({ title: '网络错误，请检查服务器', icon: 'none' });
          console.error('Request failed:', err);
        }
      });
    }
  }
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

/* 登录/注册框样式 */
.login-box {
  width: 90%;
  height: 40%;
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
  width: 80%;
  margin-left: auto;
  margin-right: auto;
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

/* 登录/注册按钮 */
.login-button {
  width: 85%;
  height: 70rpx;
  background: linear-gradient(135deg, #00ccff, #0077ff);
  border: none;
  border-radius: 35rpx;
  color: white;
  font-size: 30rpx;
  font-weight: bold;
  box-shadow: 0px 5px 15px rgba(0, 204, 255, 0.5);
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 30rpx;
}

/* 切换模式文字 */
.toggle-text {
  font-size: 28rpx;
  color: #00ccff;
  text-decoration: underline;
}
</style>