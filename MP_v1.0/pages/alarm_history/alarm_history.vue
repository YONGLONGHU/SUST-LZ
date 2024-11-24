<template>
  <view class="container">
    <view class="input-group">
      <text class="label">报警名称</text>
      <input class="input" placeholder="请输入报警名称" v-model="alarmName" />
    </view>

    <view class="input-group">
      <text class="label">时间区间</text>
      <picker mode="date" class="picker" @change="onStartDateChange">
        <text class="picker-text">{{ startDate || '开始时间' }}</text>
      </picker>
      <picker mode="date" class="picker" @change="onEndDateChange">
        <text class="picker-text">{{ endDate || '结束时间' }}</text>
      </picker>
    </view>

    <view class="input-group">
      <text class="label">报警分类</text>
      <picker mode="selector" :range="alertCategories" class="picker" @change="onAlertCategoryChange">
        <text class="picker-text">{{ selectedAlertCategory || '请选择报警分类' }}</text>
      </picker>
    </view>

    <view class="input-group">
      <text class="label">报警等级</text>
      <picker mode="selector" :range="alertLevels" class="picker" @change="onAlertLevelChange">
        <text class="picker-text">{{ selectedAlertLevel || '请选择报警等级' }}</text>
      </picker>
    </view>

    <view class="input-group">
      <text class="label">是否确认</text>
      <picker mode="selector" :range="isConfirmed" class="picker" @change="isConfirmedChange">
        <text class="picker-text">{{ selectedisConfirmed || '请选择是否确认' }}</text>
      </picker>
    </view>

    <button class="submit-btn" @click="submitForm">提交</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      alarmName: '',
      alertCategories: [
        'AI报警',
        '气体监测',
        '撕裂',
        '划痕',
        '联锁停机',
        '设备高温检测',
        '跑冒滴检测',
        '巡检日志',
        '安全行为检测',
        '其他(默认)',
        '火焰检测'
      ],
      selectedAlertCategory: '',
      alertLevels: ['异常', '正常', '警告', '一般报警', '严重报警'],
      selectedAlertLevel: '',
      startDate: '',
      endDate: '',
      isConfirmed: ['确认', '不确认'],
      selectedisConfirmed: ''
    };
  },
  methods: {
    onStartDateChange(e) {
      this.startDate = e.detail.value;
    },
    onEndDateChange(e) {
      this.endDate = e.detail.value;
    },
    onAlertCategoryChange(e) {
      this.selectedAlertCategory = this.alertCategories[e.detail.value];
    },
    onAlertLevelChange(e) {
      this.selectedAlertLevel = this.alertLevels[e.detail.value];
    },
    isConfirmedChange(e) {
      this.selectedisConfirmed = this.isConfirmed[e.detail.value];
    },
    submitForm() {
      const filters = {
        alarmName: this.alarmName,
        timeRange: { start: this.startDate, end: this.endDate },
        alertCategory: this.selectedAlertCategory,
        alertLevel: this.selectedAlertLevel,
        isConfirmed: this.selectedisConfirmed
      };

      // 跳转到结果展示页面并传递筛选条件
      uni.navigateTo({
        url: `/pages/result_page/result_page?filters=${encodeURIComponent(JSON.stringify(filters))}`
      });
    }
  }
};
</script>

<style>
.container {
  padding: 20px;
  background: linear-gradient(135deg, #1e1e2f, #292942);
  color: #fff;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

.input-group {
  margin-bottom: 15px; /* 控件间距缩小 */
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 16px;
  margin-bottom: 5px;
  color: #a5a5c0;
}

.input,
.picker {
  height: 40px;
  padding: 0 10px;
  background-color: #2e2e3f;
  border: 1px solid #444;
  border-radius: 5px;
  color: #fff;
}

.picker-text {
  line-height: 40px;
}

.submit-btn {
  width: 100%;
  height: 45px;
  background-color: #007aff;
  color: white;
  text-align: center;
  line-height: 45px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
}

.submit-btn:active {
  background-color: #005bb5;
}
</style>
