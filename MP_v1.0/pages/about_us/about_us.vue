<template>
  <view class="container">
    <!-- 公司介绍 -->
   <view class="image-container">
     <image src="/static/image/about_us.png" mode="scaleToFill" />
   </view>
    <view class="about-section">
      <view class="about-description">
        量子智能科技致力于危险环境作业特种机器人研发制造，用人工智能与创新技术，
        减少恶劣工作环境对人身伤害，提高生产安全性和生产效率，让科技和创新为人类
        社会带来更美好的生活。
      </view>
      <view class="about-description">
        公司已经研发成功矿山巡检机器人，管廊巡检机器人，皮带廊巡检机器人，隧道
        打孔机器人等多款产品，并且均已形成市场销售和样板示范应用点。
        在机器人底盘，三轴自稳云台，全自动换电机构，视觉检测，AI边缘
        计算等核心部件和核心技术上都有重要创新。
      </view>
    </view>

    <!-- 联系信息 -->
    <view class="info-section">
      <view class="info-item">
        <image class="info-icon" src="/static/icons/web.png" />
        <text class="info-text">http://www.qirobot.com.cn/</text>
      </view>
      <view class="info-item">
        <image class="info-icon" src="/static/icons/phone.png" />
        <text class="info-text">400 663 0899</text>
      </view>
      <view class="info-item">
        <image class="info-icon2" src="/static/icons/email.png" />
        <text class="info-text">zhaolei@qirobot.com.cn</text>
      </view>
      <view class="info-item">
        <image class="info-icon1" src="/static/icons/address.png" />
        <text class="info-text">
          陕西省西安市经开区人工智能与机器人产业基地凯瑞G座405
        </text>
      </view>
    </view>
  </view>
</template>
<style scoped>
.container {
  padding: 20px;
  background: linear-gradient(135deg, #1e1e2f, #3b3f58); /* 深色科技风背景 */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: #fff;
}

/* 关于我们部分 */
.about-section {
  margin-bottom: 20px;
}
.about-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  color: #00d8ff; /* 科技蓝色 */
  text-shadow: 0 2px 5px rgba(0, 255, 255, 0.8);
}
.about-description {
  font-size: 14px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  text-align: justify; /* 两端对齐 */
  text-indent: 2em; /* 首行缩进两个字符 */
  margin-bottom: 3px; /* 段落之间的间距 */
  display: block; /* 确保文字为块状显示 */
}

/* 联系信息部分 */
.info-section {
  background: rgba(255, 255, 255, 0.1); /* 半透明背景 */
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}
.info-item {
  display: flex;
  align-items: left;
  margin-bottom: 10px;
}
.info-icon {
  width: 24px;
  height: 24px;
  margin-right: 20px;
}
.info-icon1 {
	margin-left: -5px;
  margin-top: 5px;
  width: 35px;
  height: 24px;
  margin-right: 15px;
}
.info-icon2 {
  width: 20px;
  height: 18px;
  margin-left: 2px;
  margin-right: 23px;
}
.info-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  word-break: break-word;
}
.image-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100%; /* 或者设置一个具体的高度 */
}
</style>
<script>
export default {
  data() {
    return {};
  },
};
</script>


