<template>
  <view class="container">
    <!-- 标题 -->
    <view class="header">
      <text class="header-title">租户信息</text>
    </view>
    
    <!-- 租户信息展示 -->
    <view class="info-section">
      <view class="info-item">
        <text class="label">ID:</text>
        <text class="value">{{ tenantInfo.id || '暂无数据' }}</text>
      </view>
      <view class="info-item">
        <text class="label">名称:</text>
        <text class="value">{{ tenantInfo.name || '暂无数据' }}</text>
      </view>
      <view class="info-item">
        <text class="label">并发标记:</text>
        <text class="value">{{ tenantInfo.concurrencyStamp || '无' }}</text>
      </view>
      <view class="info-item">
        <text class="label">额外属性:</text>
        <text class="value">{{ tenantInfo.items ? JSON.stringify(tenantInfo.items) : '无' }}</text>
      </view>
    </view>
  </view>
</template>
<style scoped>
/* 页面整体样式 */
.container {
  padding: 20px;
  background-color: #f4f6f8;
  min-height: 100vh;
}

/* 标题样式 */
.header {
  background-color: #007aff;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  text-align: center;
}
.header-title {
  color: #fff;
  font-size: 20px;
  font-weight: bold;
}

/* 信息展示区域样式 */
.info-section {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 单条信息的样式 */
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eaeaea;
}
.info-item:last-child {
  border-bottom: none;
}

/* 标签和数值样式 */
.label {
  font-weight: bold;
  color: #333;
  font-size: 16px;
}
.value {
  color: #555;
  font-size: 16px;
  text-align: right;
  word-wrap: break-word;
}
</style>

<script>
export default {
  data() {
    return {
      tenantInfo: {}, // 用于存储租户信息
    };
  },
  onLoad() {
    // 页面加载时获取租户信息
    this.getTenantInfo();
  },
  methods: {
    // 网络请求：获取租户信息
    getTenantInfo() {
      const url = '/api/project/2595419/api/multi-tenancy/tenants'; // 请求地址

      // 发起网络请求
      uni.request({
        url: url, // 请求的 URL
        method: 'GET', // 请求方式
        header: {
          'Content-Type': 'application/json', // 请求头，指定为 JSON 格式
        },
        success: (res) => {
          if (res.statusCode === 200) {
            console.log('请求成功:', res.data);
            this.tenantInfo = res.data; // 将数据赋值给 tenantInfo
          } else {
            console.error('请求失败，状态码:', res.statusCode);
            uni.showToast({
              title: '数据加载失败',
              icon: 'none',
            });
          }
        },
        fail: (err) => {
          console.error('请求失败:', err);
          uni.showToast({
            title: '请求失败，请检查网络',
            icon: 'none',
          });
        },
      });
    },
  },
};
</script>
