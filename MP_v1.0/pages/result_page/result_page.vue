<template>
  <view class="result-container">
      <text class="title">检索结果</text>
      <scroll-view scroll-y class="result-list">
        <!-- 使用 paginatedData 代替 filteredData -->
        <view class="result-card" v-for="item in paginatedData" :key="item.id">
          <text class="result-title">{{ item.AlarmName }}</text>
          <text class="result-info">设备名称: {{ item.DeviceId }}</text>
          <text class="result-info">产品类型: {{ item.ProductClass }}</text>
          <text class="result-info">报警分类: {{ item.AlarmClass }}</text>
          <text class="result-info">报警等级: {{ item.AlarmLevel }}</text>
          <text class="result-info">报警时间: {{ item.AlarmTime }}</text>
        </view>
      </scroll-view>
    
      <!-- 分页按钮 -->
      <view class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
          上一页
        </button>
        <text>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</text>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
          下一页
        </button>
      </view>
    </view>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,       // 当前页码
      pageSize: 5,          // 每页显示的条数
      filters: {},          // 筛选条件
      allData: [],          // 全部数据
      filteredData: [],     // 筛选后的数据
    };
  },
  computed: {
    paginatedData() {
      // 根据分页参数截取当前页的数据
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredData.slice(start, end);
    },
    totalPages() {
      // 计算总页数
      return Math.ceil(this.filteredData.length / this.pageSize);
    },
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
      // 筛选数据
      filterData() {
        // 使用 filter 方法对 allData 进行筛选
        this.filteredData = this.allData.filter(item => {
          // 判断报警名称（模糊匹配）
          const matchAlarmName = !this.filters.alarmName || item.AlarmName.includes(this.filters.alarmName);
          
          // 判断设备名称（模糊匹配）
          const matchDeviceName = !this.filters.deviceName || item.DeviceId.includes(this.filters.deviceName);
          
          // 判断产品类型（精确匹配）
          const matchProductType = !this.filters.productType || item.ProductClass === this.filters.productType;
      
          // 判断时间区间（起始时间和结束时间都需要满足）
          const matchTimeRange = (!this.filters.timeRange?.start || new Date(item.AlarmTime) >= new Date(this.filters.timeRange.start)) &&
                                 (!this.filters.timeRange?.end || new Date(item.AlarmTime) <= new Date(this.filters.timeRange.end));
          
          // 判断报警分类（精确匹配）
          const matchAlertCategory = !this.filters.alertCategory || item.AlarmClass === this.filters.alertCategory;
      
          // 判断报警等级（精确匹配，忽略大小写和空格差异）
          const matchAlertLevel = !this.filters.alertLevel || item.AlarmLevel.trim().toLowerCase() === this.filters.alertLevel.trim().toLowerCase();
          // 判断是否确认（布尔值匹配）
          const matchIsConfirmed = !this.filters.isConfirmed ||item.Confirm === this.filters.isConfirmed;
          // 返回所有条件均满足的数据
          return matchAlarmName && matchDeviceName && matchProductType && matchTimeRange &&
                 matchAlertCategory && matchAlertLevel && matchIsConfirmed;
        });
      
        // 重置页码到第一页
        this.currentPage = 1;
      
        // 打印筛选后的数据进行调试
        console.log('Filtered Data:', this.filteredData);
      },
    fetchData() {
      const apiUrl = 'http://113.200.148.162:18885/api/identity/users';
    
      uni.request({
        url: apiUrl,
        method: 'GET',
        header: {
          // 添加必要的请求头信息，例如身份验证
        },
        success: (res) => {
          if (res.statusCode === 200) {
            // 请求成功，处理返回数据
            console.log('Response Data:', res.data);
          } else {
            console.error('请求失败:', res.statusCode, res.data);
          }
        },
        fail: (err) => {
          console.error('网络请求失败:', err);
        },
      });
    },

  },
  onLoad(options) {
    // 接收筛选条件
    this.filters = JSON.parse(decodeURIComponent(options.filters || '{}'));
	console.log('filters Data:', this.filters);
    this.fetchData(); // 加载数据
  },
};
</script>


<style>
.result-container {
  padding: 20px;
  background: linear-gradient(135deg, #1e1e2f, #292942);
  color: #fff;
  min-height: 100vh;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: center;
}

.result-list {
  max-height: 100%;
  overflow-y: auto;
}

.result-card {
  display: flex;          /* 使用弹性布局 */
  flex-direction: column; /* 垂直排列子元素 */
  gap: 6px;               /* 每行之间增加间隔（可选） */
  padding: 10px;          /* 增加内边距（可选） */
  border: 1px solid #ccc; /* 可选：添加边框方便调试 */
  margin-bottom: 12px;    /* 可选：增加卡片间距 */
  background-color: #f9f9f9; /* 可选：设置背景色 */
}

.result-title {
  font-size: 16px;
  font-weight: bold;
  color: #00d4ff;
  margin-bottom: 5px;
}

.result-info {
  font-size: 14px;
  color: #a5a5c0;
  margin-bottom: 0px;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  padding: 6px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination text {
  font-size: 14px;
  color: #fff;
}

</style>
