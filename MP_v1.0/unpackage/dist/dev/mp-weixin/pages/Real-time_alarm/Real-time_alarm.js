"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      videoSrc: "",
      // 视频地址
      isPlaying: false,
      // 是否正在播放
      progress: 0,
      // 视频播放进度
      currentTime: "0:00",
      // 当前播放时间
      duration: "0:00"
      // 视频总时长
    };
  },
  mounted() {
    this.videoSrc = this.getVideoSrc();
  },
  methods: {
    getVideoSrc() {
      return "/static/video/概率模型分享.mp4";
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
      this.$refs.videoPlayer;
      this.progress = e.detail.currentTime / e.detail.duration * 100;
      this.currentTime = this.formatTime(e.detail.currentTime);
      this.duration = this.formatTime(e.detail.duration);
    },
    formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.videoSrc,
    b: $data.isPlaying ? 1 : "",
    c: !$data.isPlaying ? 1 : "",
    d: common_vendor.o((...args) => $options.togglePlay && $options.togglePlay(...args)),
    e: $data.progress + "%",
    f: common_vendor.t($data.currentTime),
    g: common_vendor.t($data.duration)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6d95b3f1"]]);
wx.createPage(MiniProgramPage);
