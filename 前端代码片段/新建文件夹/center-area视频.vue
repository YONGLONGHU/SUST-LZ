<script lang="ts" setup>
import { ref, reactive, watch, onBeforeUnmount, onMounted } from "vue";
import { ReconnectingWebSocket } from "@/utils/ws";
import BigTitleBox from "@/views/bigScreen/Shandong/components/BigTitleBox/index.vue";
import eventHub from "./utills/eventBus";
import { getRobotInfo } from "@/api/shanDong";
import { getTaskList, publicTemporaryTask, StopTask } from "@/api/task/task";
import { ElMessageBox, ElMessage } from "element-plus";
const props = defineProps(["robotCode", "handleRobotCode", "robotConfig"]);

type videoType = "Vis" | "Ir" | "Vis2" | "Ir2";
const videoData = reactive<Record<videoType, string>>({
  Vis: "",
  Ir: "",
  Vis2: "",
  Ir2: ""
});
const inspection = ref([
  { name: "手动任务", value: false, isShow: false },
  { name: "自动巡检", value: false, isShow: true },
  // { name: "定时巡检", value: false, isShow: true },
  { name: "临时巡检", value: false, isShow: true }
]);

eventHub.on("robotInfo", (curTaskType: any) => {
  inspection.value[curTaskType.webTaskType] &&
    (inspection.value[curTaskType.webTaskType].value = true);
  inspection.value.forEach((item, index) => {
    if (index !== curTaskType.webTaskType) {
      item.value = false;
    }
  });
  taskList.value.forEach(element => {
    if (
      curTaskType.webTaskType === 3 &&
      element.navTaskId === curTaskType.NavTaskStatus?.NavTaskStatus.Id
    ) {
      element.active = true;
    }
    if (curTaskType.webTaskType !== 3) {
      element.active = false;
    }
  });
});

const switchBeforeChange = (taskType: number) => {
  eventHub.emit(
    "handleTaskType",
    inspection.value[taskType].value ? 0 : taskType
  );
  return false;
};
const mainVideoType = ref<videoType>("Vis");

let videoWs: ReconnectingWebSocket | null;

const initWs = () => {
  videoData.Vis = ""; //可见光
  videoData.Ir = ""; //红外
  videoData.Vis2 = "";
  videoData.Ir2 = "";
  videoWs = new ReconnectingWebSocket({
    url: `ws://${window.location.host}/proxyWs/${props.robotCode}`,
    msgCb: event => {
      const data = JSON.parse(event.data);
      videoData[data.Type] = `data:image/jpeg;base64,${data.Data}`;
    }
  });
  videoWs.connect();
};

onBeforeUnmount(() => {
  videoWs && videoWs.close();
  eventHub.all.clear();
});
// 临时任务
const temporaryTaskValue = ref(false);
// 临时任务列表
const taskList = ref();
const deviceId = ref();
const getTaskInfo = () => {
  getRobotInfo(props.robotCode).then(data => {
    getTaskList({ type: 3, DeviceId: data?.deviceId }).then(res => {
      taskList.value = res.items.map(item => {
        return {
          ...item, // 保持原来的属性
          active: false // 设置 active 属性为 false
        };
      });
      deviceId.value = data?.deviceId;
      // total.value = res.totalCount;
    });
  });
};
onMounted(() => {
  getTaskInfo();
});
watch(
  () => props.robotCode,
  newVal => {
    if (newVal) {
      videoWs && videoWs.close();
      initWs();
      getTaskInfo();
    }
  },
  { immediate: true }
);
const isWebTaskEnabled = ref(false);
// 停止临时任务
const stopTask = data => {
  ElMessageBox.confirm("是否确定停止任务？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    fetch(`/proxyApi/api/app/nav-task/${data.navTaskId}/stop-task`, {
      method: "POST"
    })
      .then(res => {
        if (res.ok) {
          ElMessage.success("停止临时任务成功");
        }
      })
      .catch(() => {
        ElMessage.error("停止临时任务失败");
      });
  });
};
</script>

<template>
  <div class="container column flex-b">
    <BigTitleBox style="height: 65%; padding-left: 0" title="主视频">
      <div
        class="titleCon flex justify-between"
        style="height: 3vh"
        v-if="false"
      >
        <div
          class="changeBtn"
          :style="props.robotCode === '1342718097' && 'color:#1bf4f8'"
          @click="props.handleRobotCode('1342718097')"
        >
          二号焦炉烟道
        </div>
        <div
          class="changeBtn"
          :style="props.robotCode === '956308279' && 'color:#1bf4f8'"
          @click="props.handleRobotCode('956308279')"
        >
          二号焦炉地下室
        </div>
        <div
          class="changeBtn bg-flip"
          :style="props.robotCode === '2508200758' && 'color:#1bf4f8'"
          @click="props.handleRobotCode('2508200758')"
        >
          一号焦炉烟道
        </div>
        <div
          class="changeBtn bg-flip"
          :style="props.robotCode === '805507434' && 'color:#1bf4f8'"
          @click="props.handleRobotCode('805507434')"
        >
          一号焦炉地下室
        </div>
      </div>
      <div class="mainVideo p-4 h-full">
        <img
          class="w-full h-full"
          :src="videoData[mainVideoType]"
          alt="主屏幕"
        />
      </div>
    </BigTitleBox>

    <BigTitleBox title="视频选择与巡检控制" style="height: 30%">
      <div
        class="video-and-control"
        @click.stop="
          () => {
            // taskTactics(3);
            temporaryTaskValue = false;
          }
        "
      >
        <div class="flex-1 flex justify-between items-center h-full ml-10">
          <div class="w-[49%] h-5/6 cursor-pointer relative">
            <img
              :src="videoData.Vis"
              alt="机器人可见光"
              @click="mainVideoType = 'Vis'"
              class="w-full h-full"
            />
            <img
              v-if="props.robotConfig.isPad"
              :src="videoData.Ir"
              @click="mainVideoType = 'Ir'"
              alt="机器人红外"
              style="
                position: absolute;
                width: 130px;
                height: 90px;
                right: 0;
                top: 0;
              "
            />
            <!--  <div
              style="
                position: absolute;
                width: 130px;
                height: 90px;
                background: #000;
                right: 0;
                top: 0;
              "
            ></div> -->
          </div>
          <div class="w-[49%] h-5/6 cursor-pointer relative">
            <img
              :src="props.robotConfig.isPad ? videoData.Vis2 : videoData.Ir"
              @click="
                props.robotConfig.isPad
                  ? (mainVideoType = 'Vis2')
                  : (mainVideoType = 'Ir')
              "
              :alt="props.robotConfig.isPad ? '机器人可见光2' : '机器人红外'"
              class="w-full h-full"
            />
            <img
              v-if="props.robotConfig.isPad"
              :src="videoData.Ir2"
              @click="mainVideoType = 'Ir2'"
              alt="机器人红外2"
              style="
                position: absolute;
                width: 130px;
                height: 90px;
                right: 0;
                top: 0;
              "
            />
          </div>
        </div>
        <div class="mode-control">
          <div
            class="mode-control-item"
            v-for="(item, key) in inspection"
            :key="item.name"
            v-show="item.isShow"
          >
            <div
              class="mode-control-item-l"
              @click.stop="
                () => {
                  if (item.name === '临时巡检') {
                    temporaryTaskValue = !temporaryTaskValue;
                  }
                }
              "
            >
              {{ item.name }}
            </div>
            <el-switch
              v-model="item.value"
              class="switchStyle"
              :before-change="() => switchBeforeChange(key)"
            />
          </div>
          <div class="temporaryTask" v-show="temporaryTaskValue" @click.stop>
            <div
              v-for="(item, index) in taskList"
              :key="index"
              style="border-bottom: 1px solid #bbbfcc; margin-bottom: 15px"
            >
              <p>{{ item.name }}</p>
              <el-switch
                v-model="item.active"
                class="switchStyle"
                @change="
                  value => {
                    // console.log(value);
                    if (value) {
                      publicTemporaryTask({
                        deviceId,
                        navTaskId: item.navTaskId
                      });
                    } else {
                      stopTask({
                        deviceId,
                        navTaskId: item.navTaskId
                      });
                    }
                    // robotCtrl.setFrontLampBrightness(!leftLight ? 0 : 100);
                  }
                "
              />
            </div>
            <p
              v-if="!taskList?.length"
              style="
                width: 100%;
                display: flex;
                justify-content: center;
                font-size: 14px;
              "
            >
              暂无临时任务
            </p>
          </div>
        </div>
      </div>
    </BigTitleBox>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  font-family: "font_second_title";
  src: url("./style/fontStyle/Source_Han_Sans_SC_Regular.otf");
}

@mixin pointer {
  cursor: pointer;
}

@mixin fh {
  height: 100%;
}

$textColor: #ccc;

.container {
  @include fh;

  .titleCon {
    width: 100%;
    padding: 0 140px;
    position: absolute;
    top: -1.204vh;
    left: 0;

    .changeBtn {
      @include pointer;
      position: relative;
      height: 3vh;
      line-height: 3vh;
      text-align: center;
      width: 23%;
      font-size: 17px;
      font-family: "font_second_title";
      color: $textColor;

      &::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: -1;
        background: url("@/assets/Shandong/imgs/center/title_btn.png") no-repeat;
        background-size: 100% 100%;
      }

      &.bg-flip {
        &::after {
          transform: scaleX(-1);
        }
      }
    }

    .logo {
      width: 180px;
      height: 60px;
      margin: auto 0;
    }
  }

  .video-and-control {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;

    .mode-control {
      width: 30%;
      height: 70%;
      margin-left: 35px;
      margin-right: 35px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 30px;
      position: relative;
      .mode-control-item {
        width: 100%;
        height: 25px;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;

        .mode-control-item-l {
          font-size: 16px;
          font-family: "font_second_title";
          width: 120px;
          height: 35px;
          line-height: 35px;
          background: url("@/assets/Shandong/imgs/center/ctrl_box.png") center /
            100% 100% no-repeat;
          text-align: center;
        }

        .mode-control-item-r {
          height: 1.852vh;
          width: 69px;
          border-radius: 10px;
          background-image: url("@/assets/Shandong/imgs/center/ctrl_switch.png");
          background-position: -38px 0;
          transition: all 0.5s;

          @include pointer;

          &.active {
            background-position: 0;
          }
        }
      }
      .temporaryTask {
        position: absolute;
        left: -60%;
        bottom: 30%;
        width: 220px;
        // height: 120px;
        max-height: 16rem;
        background-color: #42518b;
        border: #7882ac solid 0.1rem;
        border-radius: 1rem;
        display: flex;
        flex-direction: column;
        align-items: start;
        padding: 1.5rem;
        // justify-content: space-around;
        font-size: 16px;
        overflow: hidden;
        overflow-y: auto;
        div {
          display: flex;
          width: 100%;
          // height: 30px;
          justify-content: center;
          align-items: center;

          p {
            display: flex;
            justify-content: center;
            width: 100%;
            color: #dbdbdb;
            // letter-spacing: 0.2rem;
            margin-right: -1rem;
          }
        }
      }
      .temporaryTask::-webkit-scrollbar {
        width: 0; /* 隐藏滚动条 */
        background: transparent; /* 可选，确保背景透明 */
      }
    }
  }
}

::v-deep .switchStyle {
  margin-left: 30px;

  //开关小盒子
  .el-switch__core {
    width: 60px !important;
    height: 2.2vh !important;
    border-radius: 20px;
  }

  //开关内区域
  .el-switch__action {
    width: 2vh;
    height: 2vh;
    // border: var(--el-switch-on-color) 1px;
  }
}

.el-switch {
  --el-switch-on-color: var(--el-color-primary);
  --el-switch-off-color: #8b8c8f;
  display: inline-flex;
  align-items: center;
  position: relative;
  font-size: 14px;
  line-height: 20px;
  height: 32px;
  vertical-align: middle;
}
</style>
