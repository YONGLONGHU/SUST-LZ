<template>
  <view>
    <text>租户信息：</text>
    <view>
      <text>ID: {{ tenantInfo.id }}</text>
    </view>
    <view>
      <text>名称: {{ tenantInfo.name }}</text>
    </view>
    <view>
      <text>并发标记: {{ tenantInfo.concurrencyStamp || '无' }}</text>
    </view>
    <view>
      <text>额外属性: {{ tenantInfo.items ? JSON.stringify(tenantInfo.items) : '无' }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      tenantInfo: {} // 存储租户信息
    };
  },
  onLoad() {
    this.getTenantInfo();
  },
  methods: {
    getTenantInfo() {
      const url = `https://app.apifox.com/project/2595419/api/multi-tenancy/tenants`;

      uni.request({
        url: '/api/project/2595419/api/multi-tenancy/tenants', // 这里的 /api 会被代理到目标服务器
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          if (res.statusCode === 200) {
            console.log('请求成功:',res);
			console.log("------------------",res.data);
            // 处理返回的数据
            this.tenantInfo = res.data;
          } else {
            console.error('请求失败，状态码:', res.statusCode);
          }
        },
        fail: (err) => {
          console.error('请求失败:', err);
        }
      });

    }
  }
};
</script>
