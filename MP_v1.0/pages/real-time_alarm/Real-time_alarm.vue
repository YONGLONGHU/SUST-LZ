<template>
  <view class="container">
    <view class="video-wrapper">
      <video 
        class="video-player" 
        :src="videoSrc" 
        controls 
        autoplay 
        muted
        objectFit="cover"
      ></video>
    </view>
    <view class="controls">
      <view class="control-btn" @click="togglePlay">
        <text class="iconfont" :class="{'pause': isPlaying, 'play': !isPlaying}">&#xe609;</text>
      </view>
      <view class="progress-wrapper">
        <view class="progress-bar" :style="{ width: progress + '%' }"></view>
      </view>
      <view class="time">{{ currentTime }} / {{ duration }}</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      videoSrc: '', // 视频地址
      isPlaying: false, // 是否正在播放
      progress: 0, // 视频播放进度
      currentTime: '0:00', // 当前播放时间
      duration: '0:00', // 视频总时长
    };
  },
  mounted() {
    this.videoSrc = this.getVideoSrc(); // 获取本地视频地址
  },
  methods: {
    getVideoSrc() {
      // 这里需要替换为获取本地视频地址的逻辑
      // 例如：返回一个本地路径或者通过转换工具转换后的小程序可访问路径
      return '/static/video/概率模型分享.mp4';
    },
    togglePlay() {
      const videoPlayer = this.$refs.videoPlayer;
      if (this.isPlaying) {
        videoPlayer.pause();
      } else {
        videoPlayer.play();
      }
      this.isPlaying = !this.isPlaying;
    },
    updateProgress(e) {
      const videoPlayer = this.$refs.videoPlayer;
      this.progress = (e.detail.currentTime / e.detail.duration) * 100;
      this.currentTime = this.formatTime(e.detail.currentTime);
      this.duration = this.formatTime(e.detail.duration);
    },
    formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    },
  }
};
</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.video-wrapper {
  width: 100%;
  height: 60%;
  position: relative;
  overflow: hidden;
}

.video-player {
  width: 100%;
  height: 100%;
}

.controls {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 20px;
}

.control-btn {
  cursor: pointer;
  margin-right: 20px;
}

.iconfont {
  font-size: 24px;
}

.play:before {
  content: "\e609";
}

.pause:before {
  content: "\e60a";
}

.progress-wrapper {
  flex-grow: 1;
  background-color: #222;
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
  margin-right: 20px;
}

.progress-bar {
  height: 100%;
  background-color: #fff;
  width: 0;
  transition: width 0.3s ease;
}

.time {
  margin-left: 20px;
}
</style>