<script setup lang="ts">
import {
  ref,
  reactive,
  onMounted,
  watch,
  onBeforeUnmount,
  defineEmits
} from "vue";
import * as echarts from "echarts";
import { HangingRobotControlSignalr } from "@/utils/robotCtrl/hangingRobotControlSignalr";
import BigTitleBox from "@/views/bigScreen/Shandong/components/BigTitleBox/index.vue";
import AudioWaveIns from "@/views/bigScreen/Shandong/components/AudioWaveIns/index.vue";
import { Refresh } from "@element-plus/icons-vue";
import eventHub from "./utills/eventBus";
import { getStepListByCode } from "@/api/task/task";
const props = defineProps([
  "robotCode",
  "robotConfig",
  "dashboardInfoList",
  "camelPtions"
]);
const isOnline = ref("离线");
/* const eventList = [
  {
    eventName: "RobotStatus",
    callback: (resp: string) => {
      try {
        const {
          RobotStatus: {
            pm,
            obs,
            co,
            position,
            speed,
            o2,
            temperature2,
            ForLed: headlight,
            BackLed: rearLamp,
            ch4,
            h2s
          } = {
            pm: 0,
            obs: 0,
            co: 0,
            position: 0,
            speed: 0,
            o2: 0,
            temperature2: 0,
            ForLed: 0,
            BackLed: 0,
            ch4: 0,
            h2s: 0
          },
          Battery: { BmsPercentage: battery, Amp: amp } = {
            BmsPercentage: 0,
            Amp: 0
          },
          CtrlStatus: {
            Speed: ctrlSpeed,
            WebTaskType: webTaskType,
            ForEnd: {
              TrackRobotConfig: { Obs }
            }
          } = {
            Speed: 0,
            WebTaskType: 0,
            ForEnd: {
              TrackRobotConfig: {
                Obs: 0
              }
            }
          },
          Sensors: { t1, h1 } = {
            t1: 0,
            h1: 0
          },
          PanTilt: { Led: led } = {
            Led: 0
          },
          PadStatus: { LeftLight: leftLight, RightLight: rightLight } = {
            LeftLight: 0,
            RightLight: 0
          },
          Motors: { Status: status } = { Status: "0" },
          NavTaskStatus: NavTaskStatus
        } = JSON.parse(resp) || {};

        Object.assign(robotInfo, {
          battery,
          position,
          ctrlSpeed,
          speed,
          leftLight,
          rightLight,
          headlight,
          rearLamp,
          led,
          pm,
          obs,
          co,
          o2,
          temperature2,
          status,
          webTaskType,
          ch4,
          h2s,
          amp,
          t1,
          h1,
          NavTaskStatus,
          Obs
        });
        isOnline.value = "在线";
        timer && clearTimeout(timer);
        timer = null;
        timer = setTimeout(() => {
          // robotInfoStore.robotState = "离线"; // 5秒后没有接收到数据，设置num为false
          isOnline.value = "离线";
        }, 5000);
        eventHub.emit("robotInfo", { webTaskType, NavTaskStatus });
        eventHub.emit("positions", position);
        eventHub.emit("temp", {
          t1,
          h1
        });
        // console.log(speed);
        speedDiskChart.setOption({
          series: [
            {
              data: [
                {
                  value: Math.abs(speed)
                }
              ]
            }
          ]
        });
      } catch (error) {
        console.error(error);
        console.error("让邵佩看看是不是又改状态结构了。");
      }
    }
  }
]; */
const eventList = [
  {
    eventName: "RobotStatus",
    callback: (resp: string) => {
      try {
        // recurse(JSON.parse(resp) || {});
        const res = JSON.parse(resp) || {};
        // console.log(res);
        // console.log(res);
        Object.assign(robotInfo, { ...res });
        isOnline.value = "在线";
        timer && clearTimeout(timer);
        timer = null;
        timer = setTimeout(() => {
          // robotInfoStore.robotState = "离线"; // 5秒后没有接收到数据，设置num为false
          isOnline.value = "离线";
        }, 5000);
        eventHub.emit("robotInfo", {
          webTaskType: robotInfo?.CtrlStatus.WebTaskType,
          NavTaskStatus: robotInfo?.NavTaskStatus
        });
        eventHub.emit("positions", robotInfo?.RobotStatus.position);
        eventHub.emit("temp", {
          t1: robotInfo?.Sensors.t1,
          h1: robotInfo?.Sensors.h1
        });
        // console.log(speed);
        speedDiskChart.setOption({
          series: [
            {
              data: [
                {
                  value: Math.abs(robotInfo?.RobotStatus.speed)
                }
              ]
            }
          ]
        });
      } catch (error) {
        console.error(error);
        console.error("让邵佩看看是不是又改状态结构了。");
      }
    }
  }
];
const HangingRobotControlSignalrInstance = new HangingRobotControlSignalr(
  "/proxySignalr/RobotHub",
  props.robotCode
);
const stepList = ref();
const getStepList = async () => {
  await getStepListByCode(props.robotCode).then((res: any) => {
    stepList.value = res?.items;
  });
};
/* eventHub.on("ctroWebTaskType", (value: number) => {
  robotCtrl.setInspectionModeToManual(value);
}); */
const sensorListInfo = ref([]);
watch(
  () => props.dashboardInfoList,
  res => {
    if (res) {
      sensorListInfo.value = res
        .filter(item => item.position == 1 && item.level == 2)
        .sort((a, b) => a.no - b.no);
    }
  },
  {
    deep: true,
    immediate: true
  }
);
const stopClick = (() => {
  let clickCount = 0,
    timer: NodeJS.Timeout;
  return () => {
    timer && clearTimeout(timer);
    clickCount++;
    if (clickCount < 3) {
      robotCtrl.stop();
    } else {
      robotCtrl.goForwardWithSpeed(0.1);
    }
    timer = setTimeout(() => {
      clickCount = 0;
    }, 200);
  };
})();
const robotCtrlEvent = (e: number) => {
  switch (e) {
    case 1:
      robotCtrl.accelerate();
      break;
    case 2:
      robotCtrl.decelerate();
      break;
    case 3:
      robotCtrl.goBackward();
      break;
    case 4:
      robotCtrl.goForward();
      break;
    case 5:
      stopClick();
      break;
  }
};
let timmers;
watch(
  () => isOnline.value,
  val => {
    if (val === "离线") {
      HangingRobotControlSignalrInstance.dispose();
      // HangingRobotControlSignalrInstance.init(eventList);
      // timmers =
      timmers = setInterval(() => {
        HangingRobotControlSignalrInstance.init(eventList);
      }, 1000);
    } else {
      timmers && clearTimeout(timmers);
    }
  },
  {
    deep: true
  }
);
watch(
  () => props.robotCode,
  () => {
    HangingRobotControlSignalrInstance.handleRobotCode(props.robotCode);
    getStepList();
    // getCamelPtions();
  }
);
const getDashboardDetail = () => {};
watch(
  () => props.robotConfig.isPad,
  () => {
    if (!props.robotConfig.isPad) {
      setTimeout(() => {
        aaa();
      }, 100);
    } else {
      pantiltDiskChart && pantiltDiskChart.dispose();
      pantiltDiskChart = null;
    }
  },
  { deep: true }
);
const robotCtrl = HangingRobotControlSignalrInstance.getControlMethods();
const robotInfo = reactive<any>({});
/* const robotInfo = reactive<any>({
  battery: 0,
  position: 0,
  ctrlSpeed: 0,
  speed: 0,
  leftLight: 0,
  rightLight: 0,
  headlight: 0,
  rearLamp: 0,
  led: 0,
  pm: 0,
  obs: 0,
  co: 0,
  o2: 0,
  temperature2: 0,
  status: "0",
  webTaskType: 0,
  ch4: 0,
  h2s: 0,
  amp: 0,
  t1: 0,
  h1: 0,
  Amp: 0,
  Obs: 0
}); */
let timer: NodeJS.Timer;

eventHub.on("handleTaskType", (taskType: number) => {
  switch (taskType) {
    case 0:
      robotCtrl.setStopTask();
      break;
    case 1:
      robotCtrl.setAutomaticTask();
      break;
    case 2:
      robotCtrl.setScheduledTask();
      break;
    case 3:
      robotCtrl.setTemporaryTask();
      break;
    default:
      break;
  }
});
const finalSpeed = ref(0);
watch(
  () => robotInfo?.RobotStatus?.speed,
  () => {
    // console.log(robotInfo.speed);
    /*  if (robotInfo.speed >= 0.1) {
      finalSpeed.value = (robotInfo.speed * 1000) / 1000;
    } else {
      finalSpeed.value = 0;
    } */
    // console.log(robotInfo.speed);
  },
  {
    deep: true
  }
);
onMounted(() => {
  initSpeedDiskChart();
  HangingRobotControlSignalrInstance.init(eventList);
  getStepList();
});

onBeforeUnmount(() => {
  HangingRobotControlSignalrInstance.dispose();
  eventHub.all.clear();
});

//#region 速度仪表盘
// 速度仪表盘Dom
const speedDiskRef = ref<HTMLDivElement | null>();
// 速度仪表盘实例
let speedDiskChart: echarts.EChartsType;
// 速度仪表盘实例配置

const speedDiskChartOption = reactive<echarts.EChartsOption>({
  series: [
    {
      type: "gauge",
      min: 0,
      max: 2,
      axisLine: {
        lineStyle: {
          width: 10,
          color: [
            [0.3, "#67e0e3"],
            [0.7, "#37a2da"],
            [1, "#fd666d"]
          ]
        }
      },
      axisTick: {
        distance: -10,
        length: 8,
        lineStyle: {
          color: "#fff",
          width: 2
        }
      },
      splitLine: {
        distance: -10,
        length: 10,
        lineStyle: {
          color: "#fff",
          width: 4
        }
      },
      axisLabel: {
        color: "inherit",
        distance: 20,
        fontSize: 10
      },
      detail: {
        valueAnimation: true,
        formatter: "{value} m/s",
        color: "#fff",
        fontSize: 14
      },
      title: {
        offsetCenter: [0, "60%"],
        color: "#fff",
        fontSize: 14,
        fontFamily: "item_info_title",
        fontWeight: 200
      },
      data: [
        {
          value: 0
        }
      ],
      radius: "100%"
    }
  ]
});

// 速度仪表盘实例Init方法
const initSpeedDiskChart = () => {
  speedDiskChart ||= echarts.init(speedDiskRef.value!);
  speedDiskChart.setOption(speedDiskChartOption);
  pantiltDiskChart ||= echarts.init(pantiltDiskRef.value!);
  pantiltDiskChart.setOption(brightnessChartOption);
};
//#endregion

//#region 补光灯亮度
//#endregion
// 云台灯光亮度图表
const pantiltDiskRef = ref<HTMLDivElement | null>();
let pantiltDiskChart: echarts.EChartsType;
const pantiltLight = ref([
  {
    value: robotInfo?.PanTilt?.Led || 0
  }
]);

const brightnessChartOption = reactive<echarts.EChartsOption>({
  series: [
    {
      type: "gauge",
      anchor: {
        show: true,
        showAbove: true,
        size: 14,
        itemStyle: {
          color: "#FAC858"
        }
      },
      pointer: {
        icon: "path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z",
        width: 4,
        length: "95%",
        offsetCenter: [0, "18%"]
      },
      progress: {
        show: true,
        overlap: true,
        roundCap: true
      },
      axisLine: {
        roundCap: true
      },
      data: pantiltLight.value,
      title: {
        fontSize: 14
      },
      // radius: "100%",
      detail: {
        width: 20,
        height: 10,
        fontSize: 14,
        color: "#fff",
        backgroundColor: "inherit",
        borderRadius: 3,
        formatter: "{value}%"
      }
    }
  ]
});
watch(
  () => robotInfo?.PanTilt?.Led,
  () => {
    pantiltLight.value[0].value = robotInfo?.PanTilt?.Led || 0;
    if (!props.robotConfig.isPad) {
      pantiltDiskChart.setOption(brightnessChartOption);
    }
  },
  {
    deep: true
  }
);
// IE、chromn
function Wheel(e) {
  // 滚轮方向 e.wheelDelta
  if (e.wheelDelta >= 0 && pantiltLight.value[0].value <= 90) {
    pantiltLight.value[0].value += 10;
    robotCtrl.setFillLightBrightnessToPercent(pantiltLight.value[0].value);
  }
  if (e.wheelDelta <= 0 && pantiltLight.value[0].value >= 10) {
    pantiltLight.value[0].value -= 10;
    robotCtrl.setFillLightBrightnessToPercent(pantiltLight.value[0].value);
  }
}
// FireFox
function FireFoxWheel(e) {
  // 滚轮方向 e.wheelDelta
  if (e.detail >= 0 && pantiltLight.value[0].value >= 10) {
    pantiltLight.value[0].value -= 10;
    robotCtrl.setFillLightBrightnessToPercent(pantiltLight.value[0].value);
  }
  if (e.detail <= 0 && pantiltLight.value[0].value <= 90) {
    pantiltLight.value[0].value += 10;
    robotCtrl.setFillLightBrightnessToPercent(pantiltLight.value[0].value);
  }
}
const aaa = () => {
  pantiltDiskChart ||= echarts.init(pantiltDiskRef.value!);
  pantiltDiskChart.setOption(brightnessChartOption);
};
// 云台变焦亮度切换
const changePantiltCtrl = ref(false);
const setStep = ref<any>(0);
const prePoss = ref("");
// const camelPtions = ref();

// 手动控制前往固定点位
const changeCtrl = ref<boolean>(false);

/* onMounted(() => {

}); */
const choosedPoint = ref();
/* const handleSelectChange = selectedValue => {
  choosedPoint.value = selectedValue;
  // console.log("Selected Value:", selectedValue); // 在控制台打印选中的值
}; */
const dialogVisible = ref(false);
const pointForm = ref<{
  name: string;
  value: any;
  isActive: boolean;
}>({
  value: "",
  name: "",
  isActive: true
});

const commit = () => {
  // console.log(pointForm.value);

  robotCtrl.setSetPrePos(
    JSON.stringify({
      Name: pointForm.value.name,
      Index: pointForm.value.value,
      IsEnable: pointForm.value.isActive
    })
  );
  setTimeout(() => {
    // getCamelPtions();
  }, 1000);
  dialogVisible.value = false;
  pointForm.value = {
    value: "",
    name: "",
    isActive: true
  };
};
const handleClose = () => {
  dialogVisible.value = false;
  pointForm.value = {
    value: "",
    name: "",
    isActive: true
  };
};
const getValueByPath = (obj, path) => {
  return path
    .split(".")
    .reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      obj
    );
};
</script>

<template>
  <div class="boxs">
    <BigTitleBox
      title="传感数据"
      show-battery
      :battery-value="
        robotInfo?.Battery?.Percentage ? robotInfo.Battery.Percentage : 0
      "
      :apm-value="robotInfo?.Battery?.Amp ? robotInfo?.Battery.Amp : 0"
      :isOnline="robotInfo?.Motors?.Status == '1' ? '故障' : isOnline"
    >
      <div class="info-items my-6 -mr-2">
        <template v-if="sensorListInfo.length">
          <div class="info-item" v-for="item in sensorListInfo" :key="item.no">
            <span>{{ item?.extraProperties.name }}</span>
            <span
              >{{ getValueByPath(robotInfo, item.extraProperties.code) || 0 }}
            </span>
            <span>{{ item?.extraProperties.unit || "" }}</span>
          </div>
        </template>
        <template v-else>
          <div class="info-item">
            <span>CH4浓度</span>
            <span>{{ robotInfo?.Sensors?.ch4?.toFixed(2) || 0 }} </span>
            <span>%vol</span>
          </div>
          <div class="info-item">
            <span>氧气浓度</span>
            <span>{{ robotInfo?.Sensors?.o2.toFixed(1) || 0 }} </span>
            <span>%</span>
          </div>
          <div class="info-item">
            <span>烟雾浓度</span>
            <span
              >{{
                robotInfo?.Sensors?.pm / 100 <= 2
                  ? 0
                  : (robotInfo?.Sensors?.pm / 100).toFixed(1)
              }}
            </span>
            <span>ug/m³</span>
          </div>
          <div class="info-item">
            <span>H2S浓度</span>
            <span>{{ robotInfo?.Sensors?.h2s.toFixed(1) || 0 }} </span>
            <span>ppm</span>
          </div>
        </template>
      </div>
    </BigTitleBox>
    <BigTitleBox title="一键指令">
      <div class="functionBar flex justify-around my-6">
        <div
          :class="[
            { functionBlock: !robotConfig.isPad },
            {
              functionBlocks: robotConfig.isPad
            }
          ]"
          @click="robotCtrl.returnHomeAndCharge"
        >
          <div class="charge" />
          <span>回程充电</span>
        </div>
        <div
          :class="[
            { functionBlock: !robotConfig.isPad },
            {
              functionBlocks: robotConfig.isPad
            }
          ]"
          @click="robotCtrl.resetFault"
        >
          <div class="reset" />
          <span>故障复位</span>
        </div>
        <template v-if="!robotConfig.isPad">
          <div
            :class="[
              { active: robotInfo?.RobotStatus?.ForLed },
              { functionBlock: !robotConfig.isPad },
              {
                functionBlocks: robotConfig.isPad
              }
            ]"
            @click="
              () => {
                robotCtrl.setFrontLampBrightness(
                  robotInfo?.RobotStatus?.ForLed ? 0 : 100
                );
              }
            "
          >
            <div class="headlight" />
            <span>前灯</span>
          </div>
          <div
            :class="[
              { active: robotInfo?.RobotStatus?.BackLed },
              { functionBlock: !robotConfig.isPad },
              {
                functionBlocks: robotConfig.isPad
              }
            ]"
            @click="
              robotCtrl.setRearLampBrightness(
                robotInfo?.RobotStatus?.BackLed ? 0 : 100
              )
            "
          >
            <div class="rear-light" />
            <span>后灯</span>
          </div>
        </template>
        <template v-else>
          <div
            :class="[
              { active: robotInfo?.PadStatus?.LeftLight },
              { functionBlock: !robotConfig.isPad },
              {
                functionBlocks: robotConfig.isPad
              }
            ]"
            @click="
              () => {
                robotCtrl.setPadFrontLampBrightness(
                  robotInfo?.PadStatus?.LeftLight ? 0 : 100
                );
              }
            "
          >
            <div class="headlight" />
            <span>左灯</span>
          </div>
          <div
            :class="[
              { active: robotInfo?.PadStatus?.RightLight },
              { functionBlock: !robotConfig.isPad },
              {
                functionBlocks: robotConfig.isPad
              }
            ]"
            @click="
              robotCtrl.setPadRearLampBrightness(
                robotInfo?.PadStatus?.RightLight ? 0 : 100
              )
            "
          >
            <div class="rear-light" />
            <span>右灯</span>
          </div>
        </template>
        <div
          :class="[
            { active: robotInfo?.CtrlStatus?.ForEnd?.TrackRobotConfig?.Obs },
            { functionBlock: !robotConfig.isPad },
            {
              functionBlocks: robotConfig.isPad
            }
          ]"
          @click="
            robotCtrl.setObstacleAvoidance(
              robotInfo?.CtrlStatus?.ForEnd?.TrackRobotConfig?.Obs ? 0 : 1
            )
          "
          v-if="props.robotConfig.isPad"
        >
          <div class="reset" />
          <span>避障</span>
        </div>
      </div>
      <div
        class="w-full h-full absolute left-0 bottom-0 text-3xl flex justify-center items-center text-orange-600"
        style="background-color: #00000050"
        v-if="
          robotInfo?.CtrlStatus?.WebTaskType &&
          robotInfo?.CtrlStatus?.WebTaskTyp !== 0
        "
      >
        {{
          robotInfo?.CtrlStatus?.WebTaskType === 1
            ? "自动"
            : robotInfo?.CtrlStatus?.WebTaskType === 2
            ? "定时"
            : "临时"
        }}任务中...
      </div>
    </BigTitleBox>
    <BigTitleBox title="机器人控制">
      <div
        class="robot-ctrl h-4/5 flex justify-around items-center my-6 [&>div]:flex [&>div]:flex-col [&>div]:justify-center [&>div]:items-center"
      >
        <div class="left w-1/2">
          <div class="speed-disk translate-y-2" ref="speedDiskRef" />
          <div class="info">
            <div class="title">当前行程</div>
            <div class="value">
              {{ robotInfo?.RobotStatus?.position.toFixed(2) }}
              <span>m</span>
            </div>
          </div>
        </div>
        <div class="w-1/2">
          <div class="right" v-if="!changeCtrl">
            <div class="TripodPanel">
              <div class="panelTop" @click="robotCtrlEvent(1)">加速</div>
              <div class="panelRight" @click="robotCtrlEvent(4)">前进</div>
              <div class="panelBottom" @click="robotCtrlEvent(2)">减速</div>
              <div class="panelLeft" @click="robotCtrlEvent(3)">后退</div>
              <div class="panelCenter" @click="robotCtrlEvent(5)">
                <i class="iconfont icon-zanting1" />
              </div>
            </div>
          </div>
          <div class="right" v-else style="height: 170px">
            <div class="h-full flex items-center flex-col justify-center">
              <div class="w-full flex items-center flex-col">
                <h3 class="mr-4 w-full flex justify-center mb-2">选择位置</h3>
                <el-select
                  v-model="prePoss"
                  placeholder="选择点位或者输入位置"
                  size="large"
                  allow-create
                  style="width: 200px"
                  filterable
                >
                  <el-option
                    v-for="item in stepList"
                    :key="item.no"
                    :label="item.name"
                    :value="item.end"
                  />
                </el-select>
              </div>
              <!-- <div class="w-full flex items-center mt-2">
                <h3 class="mr-4">位置</h3>
                <el-select
                  v-model="prePoss"
                  placeholder="Select"
                  size="large"
                  style="width: 150px"
                  filterable
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div> -->
            </div>
            <!--   <div class="point_info">
            <div class="title">控制前往</div>
            <div class="value">{{ robotInfo.ctrlSpeed }}<span>m/s</span></div>
          </div> -->
          </div>
          <div class="info" v-if="!changeCtrl">
            <div class="title">设置速度</div>
            <div class="value">
              {{ robotInfo?.CtrlStatus?.Speed }}<span>m/s</span>
            </div>
          </div>
          <div
            class="point_info"
            v-else
            @click="robotCtrl.setMoveToPotint(prePoss)"
          >
            <div class="title">控制前往</div>
            <div class="value">{{ prePoss }}<span>m</span></div>
          </div>
        </div>

        <Switch
          @click="changeCtrl = !changeCtrl"
          style="
            width: 30px;
            position: absolute;
            right: 2%;
            top: 13%;
            color: #6f9cf0;
          "
        />
      </div>
      <div
        class="w-full h-full absolute left-0 bottom-0 text-3xl flex justify-center items-center text-orange-600"
        style="background-color: #00000050"
        v-if="
          robotInfo?.CtrlStatus?.WebTaskType &&
          robotInfo?.CtrlStatus?.WebTaskType !== 0
        "
      >
        {{
          robotInfo?.CtrlStatus?.WebTaskType === 1
            ? "自动"
            : robotInfo?.CtrlStatus?.WebTaskType === 2
            ? "定时"
            : "临时"
        }}任务中...
      </div>
    </BigTitleBox>
    <BigTitleBox :title="props.robotConfig.isPad ? '现场音谱' : '云台控制'">
      <div
        class="h-[220px] flex justify-center items-center"
        v-if="props.robotConfig.isPad"
      >
        <div class="h-4/5 w-11/12">
          <AudioWaveIns :robot-code="props.robotCode" />
        </div>
      </div>
      <div v-else class="gimbal-control relative">
        <div class="ctrl" v-show="!changePantiltCtrl">
          <div class="ctrl-l flex justify-center flex-col">
            <div class="TripodPanel">
              <div
                class="panelTop"
                @click="robotCtrl.tiltUpWithRotationStepLength"
              >
                上仰
              </div>
              <div
                class="panelRight"
                @click="robotCtrl.rotateRightWithRotationStepLength"
              >
                右旋
              </div>
              <div
                class="panelBottom"
                @click="robotCtrl.tiltDownWithRotationStepLength"
              >
                下俯
              </div>
              <div
                class="panelLeft"
                @click="robotCtrl.rotateLeftWithRotationStepLength"
              >
                左旋
              </div>
              <div
                class="panelCenter"
                @click="robotCtrl.centerWithRotationStepLength"
              >
                <el-icon>
                  <Refresh />
                </el-icon>
              </div>
            </div>
            <button @click="robotCtrl.restartPanTilt">一键重启</button>
          </div>
          <div class="ctrl-r flex flex-col justify-center gap-10 text-center">
            <div
              class="light flex justify-between flex-col"
              v-show="changePantiltCtrl"
            ></div>
            <div
              ref="pantiltDiskRef"
              class="speed-disk"
              @mousewheel="Wheel"
              @DOMMouseScroll="FireFoxWheel"
            />
            <div class="title">补光灯亮度</div>
            <!-- <div class="btns flex justify-around">
              <button @click="robotCtrl.autoCalibrateGimbal">自动校准</button>
              <button @click="robotCtrl.restartPanTilt">一键重启</button>
            </div> -->
          </div>
        </div>
        <div class="ctrls" v-show="changePantiltCtrl">
          <div class="w-full h-5/6 flex">
            <div class="w-3/5 h-full flex flex-col justify-center items-center">
              <div
                class="w-full h-3/5 bg-[url(@/assets/imgs/zoom.png)] bg-[length:85%_auto] zoom_ctrl"
                style="
                  background-repeat: no-repeat;
                  background-position: center;
                "
              >
                <div class="panelTop" @click="robotCtrl.setZoomIn">变倍进</div>
                <div class="panelRight" @click="robotCtrl.setFocusFar">
                  变焦远
                </div>
                <div class="panelBottom" @click="robotCtrl.setZoomOut">
                  变倍出
                </div>
                <div class="panelLeft" @click="robotCtrl.setFocusNear">
                  变焦近
                </div>
              </div>
              <div class="w-full flex justify-center mt-2 flex-wrap">
                <el-slider
                  v-model="setStep"
                  style="width: 80%"
                  @change="
                    value => {
                      robotCtrl.zoomSetStep(value);
                    }
                  "
                />
              </div>
            </div>
            <div class="w-2/5 flex justify-center flex-col items-center">
              <div class="zoom_left">
                <h3>预置位选择</h3>
                <el-select
                  v-model="choosedPoint"
                  placeholder="选择预置位"
                  size="large"
                  style="width: 140px"
                  filterable
                >
                  <el-option
                    v-for="item in props.camelPtions?.filter(
                      item => item.value.isEnable
                    )"
                    :key="item.key"
                    :label="item.value.name"
                    :value="item.key"
                  />
                </el-select>
              </div>
            </div>
          </div>
          <div class="w-full h-1/6 -mt-3 flex justify-evenly">
            <div class="zoom_title">步长设置</div>
            <div class="zoom_acitve" @click="dialogVisible = true">
              设置预定位
            </div>
            <div
              class="zoom_acitve"
              @click="robotCtrl.setMoveToPreset(choosedPoint)"
            >
              移动到预置位
            </div>
          </div>
        </div>
        <Switch
          @click="changePantiltCtrl = !changePantiltCtrl"
          style="
            width: 30px;
            position: absolute;
            right: 2%;
            top: 5%;
            color: #6f9cf0;
          "
        />
      </div>
    </BigTitleBox>
    <el-dialog
      v-model="dialogVisible"
      title="设置预置位"
      width="500"
      :before-close="handleClose"
    >
      <el-form
        label-width="100px"
        style="margin-bottom: -20px"
        v-model="pointForm"
      >
        <el-form-item label="选择预置位" prop="categoryName">
          <el-select
            placeholder="请选择预置位"
            clearable
            style="width: 250px"
            v-model="pointForm.value"
          >
            <el-option
              v-for="item in props.camelPtions"
              :label="item.value.name"
              :value="item.key"
              :key="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设置名称" prop="categoryName">
          <el-input
            v-model="pointForm.name"
            placeholder="请设置预置位名称"
            clearable
            style="width: 250px"
          />
        </el-form-item>
        <el-form-item label="是否激活" prop="categoryName">
          <el-switch v-model="pointForm.isActive" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button
            @click="
              () => {
                dialogVisible = false;
                pointForm = {
                  value: '',
                  name: '',
                  isActive: true
                };
              }
            "
            >取消</el-button
          >
          <el-button type="primary" @click="commit"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
@font-face {
  font-family: "item_info_title";
  src: url("./style/fontStyle/Source_Han_Sans_SC_Medium_Medium.otf");
}

@mixin style-font {
  font-family: "item_info_title", serif;
}

.info-items {
  display: flex;
  align-content: space-between;
  justify-content: space-evenly;
  // width: 600px;
  height: 8.125rem;
  font-size: 1rem;
  gap: 10px;

  .info-item {
    width: 22%;
    // height: 52%;
    background: url("../../../assets/imgs/top3.png") center center no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    span {
      width: 100%;
      display: flex;
      justify-content: center;
      font-family: "item_info_title", serif;
      // font-size: 1rem;
      letter-spacing: 0.1rem;

      // margin-left: 30px;
    }

    span:first-child {
      margin-top: 2px;
      color: #fff;
    }

    span:nth-child(2) {
      margin-top: 15px;
      color: #fff;
      font-size: 30px;
      @include style-font;
    }

    span:last-child {
      margin-top: -12px;
      color: #b1b3c3;
      font-size: 16px;
      @include style-font;
    }
  }
}

.functionBlock {
  margin-top: -10px;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 6.75rem;
  font-size: 0.9rem;
  letter-spacing: 0.1rem;
  color: #fff;
  text-align: center;
  padding-left: 10px;
  cursor: pointer;
  @include style-font;

  span {
    position: absolute;
    background: url("../../../assets/imgs/按钮点击.png") center/100% 100%;
    width: 80%;
    height: 1.6rem;
    line-height: 1.7rem;
    top: 85px;

    &:active {
      color: #c3c3c365;
      background: url("../../../assets/imgs/按钮.png") center/100% 100%
        no-repeat;
    }
  }

  div {
    height: 5rem;
    width: 80%;
    -webkit-transition: background-image 0.5s ease-in-out;
    -moz-transition: background-image 0.5s ease-in-out;
    -o-transition: background-image 0.5s ease-in-out;
    transition: background-image 0.5s ease-in-out;
  }
  .charge {
    background: url("../../../assets/Shandong/imgs/ctrl/chongdian.png")
      no-repeat;
    background-size: 90%;
    background-position: center bottom;
  }

  .reset {
    background: url("../../../assets/Shandong/imgs/ctrl/fuwei.png") no-repeat;
    background-size: 90%;
    background-position: center bottom;
  }

  .headlight {
    background: url("../../../assets/Shandong/imgs/ctrl/qiandeng.png") no-repeat;
    background-size: 90%;
    background-position: center bottom;
  }

  .rear-light {
    background: url("../../../assets/Shandong/imgs/ctrl/houdeng.png") no-repeat;
    background-size: 90%;
    background-position: center bottom;
  }

  &:hover,
  &.active {
    color: #4dd4d4;

    .charge {
      background: url("../../../assets/Shandong/imgs/ctrl/chongdian_at.png")
        no-repeat;
      background-size: 90%;
      background-position: center bottom;
    }

    .reset {
      background: url("../../../assets/Shandong/imgs/ctrl/fuwei_at.png")
        no-repeat;
      background-size: 90%;
      background-position: center bottom;
    }

    .headlight {
      background: url("../../../assets/Shandong/imgs/ctrl/qiandeng_at.png")
        no-repeat;
      background-size: 90%;
      background-position: center bottom;
    }

    .rear-light {
      background: url("../../../assets/Shandong/imgs/ctrl/houdeng_at.png")
        no-repeat;
      background-size: 90%;
      background-position: center bottom;
    }
  }
}

.functionBlocks {
  margin-top: -10px;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 6.75rem;
  font-size: 0.8rem;
  letter-spacing: 0.1rem;
  color: #fff;
  text-align: center;
  padding-left: 10px;
  cursor: pointer;
  @include style-font;

  span {
    position: absolute;
    background: url("../../../assets/imgs/按钮点击.png") center/100% 100%;
    width: 80%;
    height: 1.3rem;
    line-height: 1.4rem;
    top: 85px;

    &:active {
      color: #c3c3c365;
      background: url("../../../assets/imgs/按钮.png") center/100% 100%
        no-repeat;
    }
  }

  div {
    height: 5rem;
    width: 80%;
    -webkit-transition: background-image 0.5s ease-in-out;
    -moz-transition: background-image 0.5s ease-in-out;
    -o-transition: background-image 0.5s ease-in-out;
    transition: background-image 0.5s ease-in-out;
  }
  .charge {
    background: url("../../../assets/Shandong/imgs/ctrl/chongdian.png")
      no-repeat;
    background-size: 90%;
    background-position: center bottom;
  }

  .reset {
    background: url("../../../assets/Shandong/imgs/ctrl/fuwei.png") no-repeat;
    background-size: 90%;
    background-position: center bottom;
  }

  .headlight {
    background: url("../../../assets/Shandong/imgs/ctrl/qiandeng.png") no-repeat;
    background-size: 90%;
    background-position: center bottom;
  }

  .rear-light {
    background: url("../../../assets/Shandong/imgs/ctrl/houdeng.png") no-repeat;
    background-size: 90%;
    background-position: center bottom;
  }

  &:hover,
  &.active {
    color: #4dd4d4;

    .charge {
      background: url("../../../assets/Shandong/imgs/ctrl/chongdian_at.png")
        no-repeat;
      background-size: 90%;
      background-position: center bottom;
    }

    .reset {
      background: url("../../../assets/Shandong/imgs/ctrl/fuwei_at.png")
        no-repeat;
      background-size: 90%;
      background-position: center bottom;
    }

    .headlight {
      background: url("../../../assets/Shandong/imgs/ctrl/qiandeng_at.png")
        no-repeat;
      background-size: 90%;
      background-position: center bottom;
    }

    .rear-light {
      background: url("../../../assets/Shandong/imgs/ctrl/houdeng_at.png")
        no-repeat;
      background-size: 90%;
      background-position: center bottom;
    }
  }
}

.info {
  display: inline-block;
  /* 盒子宽度跟随文本长度变化 */
  display: flex;
  justify-content: space-between;
  padding-right: 15px;
  min-width: 180px;
  height: 1.75rem;
  line-height: 1.8rem;
  // letter-spacing: 0.1em;
  color: #fff;
  @include style-font;
  background: url("../../../assets/imgs/按钮.png") center/100% 100% no-repeat;
  white-space: nowrap;

  /* 不换行 */
  div:first-child {
    padding-left: 20px;
    margin-right: 15px;
    // width: 50%;
    text-align: left;
  }
}

.point_info {
  display: inline-block;
  /* 盒子宽度跟随文本长度变化 */
  display: flex;
  justify-content: space-between;
  padding-right: 15px;
  min-width: 180px;
  height: 1.75rem;
  line-height: 1.85rem;
  // letter-spacing: 0.1em;
  color: #fff;
  @include style-font;
  background: url("../../../assets/imgs/按钮点击.png") center/100% 100%
    no-repeat;
  white-space: nowrap;

  /* 不换行 */
  div:first-child {
    padding-left: 20px;
    margin-right: 15px;
    // width: 50%;
    text-align: left;
  }
  &:hover {
    color: #43ecf3;
  }
  &:active {
    background: url("../../../assets/imgs/按钮.png") center/100% 100% no-repeat;
  }
}
.robot-ctrl {
  .speed-disk {
    width: 170px;
    height: 170px;
  }

  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .roulette {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: 160px;
      height: 160px;
      margin-bottom: 10px;
      border-radius: 50%;
      box-shadow: inset 0 0 30px #6f9cf0;
      color: #fff;

      .roulette-1 {
        width: 7.407vh;
        height: 7.407vh;
        border-radius: 50%;
        box-shadow: inset 0 0 30px #6f9cf0;
      }

      div:not(.roulette-1) {
        position: absolute;
      }

      .iconfont {
        cursor: pointer;
        font-size: 30px;

        &:hover,
        &.active {
          color: #43ecf3;
        }
      }

      .add {
        top: 0;
      }

      .sub {
        bottom: 0;
      }

      .advance {
        right: 0;
      }

      .retreat {
        left: 0;
      }
    }
    .TripodPanel {
      width: 160px;
      height: 160px;
      border-radius: 50%;
      box-shadow: inset 0 0 30px #6f9cf0;
      color: #fff;
      position: relative;
      margin-bottom: 10px;

      @mixin panelItem() {
        width: 45px;
        height: 45px;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: none;
        cursor: pointer;
        border-radius: 50%;
        // border: 1px solid #8f9092;
        background-image: url("../../../assets/Shandong/imgs/ctrl/yuntaibtn_ctrl.png");
        background-size: cover;
        transition: all 0.2s ease;
        font-size: 15px;
        @include style-font;
        font-weight: 400;
        font-family: "item_info_title";
        color: #ffffff;
        // text-shadow: 0 1px #fff;

        &:active {
          box-shadow: inset 0 0 5px 3px #999, inset 0 0 30px #aaa;
        }

        &:focus {
          box-shadow: 0 4px 3px 1px #fcfcfc, 0 6px 8px #d6d7d9,
            0 -4px 4px #cecfd1, 0 -6px 4px #fefefe, inset 0 0 5px 3px #999,
            inset 0 0 30px #aaa;
        }
      }

      .panelTop {
        @include panelItem;
        left: 0;
        right: 0;
        top: 0;
        margin: 0 auto;
        background: none;
        border-radius: 50%;
        box-shadow: inset 0 0 30px #6f9cf0;
      }

      .panelRight {
        @include panelItem;
        display: flex;
        align-items: center;
        justify-content: center;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto 0;
        background: none;
        border-radius: 50%;
        box-shadow: inset 0 0 30px #6f9cf0;
      }

      .panelBottom {
        @include panelItem;
        left: 0;
        bottom: 0;
        right: 0;
        margin: 0 auto;
        background: none;
        border-radius: 50%;
        box-shadow: inset 0 0 30px #6f9cf0;
      }

      .panelLeft {
        @include panelItem;
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto 0;
        background: none;
        border-radius: 50%;
        box-shadow: inset 0 0 30px #6f9cf0;
      }

      .panelCenter {
        width: 50px;
        height: 50px;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: none;
        cursor: pointer;
        border-radius: 50%;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        color: #ffffff;
        font-size: 24px;
        font-family: "item_info_title";
        // border: 1px solid #e8e8e8;
        transition: all 0.3s ease;

        border-radius: 50%;
        box-shadow: inset 0 0 30px #6f9cf0;

        &:active {
          box-shadow: inset 0 0 5px 3px #999, inset 0 0 30px #aaa;
        }
      }
    }
  }
}

.gimbal-control {
  .ctrl {
    display: flex;
    justify-content: space-evenly;
    height: 260px;

    .ctrl-l {
      align-items: center;
      width: 50%;

      .TripodPanel {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        background: url(@/assets/Shandong/imgs/ctrl/yuntai.png);
        background-size: cover;
        position: relative;

        @mixin panelItem() {
          width: 45px;
          height: 45px;
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          outline: none;
          cursor: pointer;
          border-radius: 50%;
          // border: 1px solid #8f9092;
          background-image: url("../../../assets/Shandong/imgs/ctrl/yuntaibtn_ctrl.png");
          background-size: cover;
          transition: all 0.2s ease;
          font-size: 15px;
          @include style-font;
          font-weight: 400;
          font-family: "item_info_title";
          color: #ffffff;
          // text-shadow: 0 1px #fff;

          &:active {
            box-shadow: inset 0 0 5px 3px #999, inset 0 0 30px #aaa;
          }

          &:focus {
            box-shadow: 0 4px 3px 1px #fcfcfc, 0 6px 8px #d6d7d9,
              0 -4px 4px #cecfd1, 0 -6px 4px #fefefe, inset 0 0 5px 3px #999,
              inset 0 0 30px #aaa;
          }
        }

        .panelTop {
          @include panelItem;
          left: 0;
          right: 0;
          top: 3%;
          margin: 0 auto;
        }

        .panelRight {
          @include panelItem;
          right: 3%;
          top: 0;
          bottom: 0;
          margin: auto 0;
        }

        .panelBottom {
          @include panelItem;
          left: 0;
          bottom: 3%;
          right: 0;
          margin: 0 auto;
        }

        .panelLeft {
          @include panelItem;
          left: 3%;
          top: 0;
          bottom: 0;
          margin: auto 0;
        }

        .panelCenter {
          width: 50px;
          height: 50px;
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          outline: none;
          cursor: pointer;
          border-radius: 50%;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          color: #ffffff;
          font-size: 24px;
          font-family: "item_info_title";
          // border: 1px solid #e8e8e8;
          transition: all 0.3s ease;
          background-image: url("../../../assets/Shandong/imgs/ctrl/yuntaibtn_ctrl.png");
          background-size: cover;

          &:active {
            box-shadow: inset 0 0 5px 3px #999, inset 0 0 30px #aaa;
          }
        }
      }

      button {
        border: none;
        width: 70%;
        margin-top: 10px;
        background: url("../../../assets/imgs/按钮点击.png") center/100% 100%
          no-repeat;
        // border: 1px solid #6f9cef;
        // border-radius: 5px;
        height: 1.75rem;
        line-height: 1.8rem;
        letter-spacing: 0.1em;
        color: #ffffff;
        @include style-font;

        &:hover {
          color: #43ecf3;
        }

        &:active {
          color: #c3c3c365;
          background: url("../../../assets/imgs/按钮.png") center/100% 100%
            no-repeat;
        }
      }
    }

    .ctrl-r {
      position: relative;
      width: 50%;

      // background-color: #43ecf3;
      .speed-disk {
        position: absolute;
        width: 250px;
        height: 250px;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        // z-index: 100;
        // background-color: red;
      }

      .title {
        position: absolute;
        top: 210px;
        left: 50%;
        transform: translateX(-50%);
        width: 70%;
        height: 1.75rem;
        line-height: 1.8rem;
        letter-spacing: 0.1em;
        background: url("../../../assets/imgs/按钮.png") center/100% 100%
          no-repeat;
        // border: 1px solid #6f9cef;
        // border-radius: 5px;
        font-size: 16px;
        letter-spacing: 0.1rem;
        color: #ffffff;
        @include style-font;
      }

      /* .light {
        align-items: center;

        .title {
          width: 50%;
          height: 30px;
          background: url("../../../assets/imgs/按钮.png") center/100% 100%
            no-repeat;
          // border: 1px solid #6f9cef;
          // border-radius: 5px;
          font-size: 16px;
          letter-spacing: 0.1rem;
          color: #ffffff;
          line-height: 30px;
          @include style-font;
        }
      } */
    }
  }
  .ctrls {
    // justify-content: space-evenly;
    height: 260px;
  }
}
.iconfont {
  // font-size: 30px;
  font-weight: 800;
}
.zoom_title {
  display: flex;
  justify-content: center;
  // margin-top: 10px;
  width: 140px;
  height: 1.75rem;
  line-height: 1.8rem;
  letter-spacing: 0.1em;
  background: url("../../../assets/imgs/按钮.png") center/100% 100% no-repeat;
  // border: 1px solid #6f9cef;
  // border-radius: 5px;
  font-size: 16px;
  letter-spacing: 0.1rem;
  color: #ffffff;
  @include style-font;
}
.zoom_acitve {
  display: flex;
  justify-content: center;
  // margin-top: 10px;
  width: 140px;
  height: 1.75rem;
  line-height: 1.8rem;
  letter-spacing: 0.1em;
  background: url("../../../assets/imgs/按钮点击.png") center/100% 100%
    no-repeat;
  // border: 1px solid #6f9cef;
  // border-radius: 5px;
  font-size: 16px;
  letter-spacing: 0.1rem;
  color: #ffffff;
  @include style-font;
  &:hover {
    color: #43ecf3;
  }

  &:active {
    color: #c3c3c365;
    background: url("../../../assets/imgs/按钮.png") center/100% 100% no-repeat;
  }
}
.zoom_left {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  @include style-font;
  font-size: 18px;
  // margin-bottom: 30px;
  h3 {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    letter-spacing: 0.1em;
    font-weight: 400;
  }
}
.zoom_ctrl {
  position: relative;

  @mixin panelItem() {
    width: 45px;
    height: 45px;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    cursor: pointer;
    border-radius: 50%;
    // border: 1px solid #8f9092;
    // background-image: url("../../../assets/Shandong/imgs/ctrl/yuntaibtn_ctrl.png");
    // background-size: cover;
    transition: all 0.2s ease;
    font-size: 15px;
    @include style-font;
    font-weight: 400;
    font-family: "item_info_title";
    color: #ffffff;
    // text-shadow: 0 1px #fff;

    &:active {
      color: #43ecf3;
      // box-shadow: inset 0 0 5px 3px #999, inset 0 0 20px #aaa;
    }

    &:focus {
      box-shadow: 0 4px 3px 1px #fcfcfc, 0 6px 8px #d6d7d9, 0 -4px 4px #cecfd1,
        0 -6px 4px #fefefe, inset 0 0 5px 3px #999, inset 0 0 20px #aaa;
    }
  }

  .panelTop {
    @include panelItem;
    left: 0;
    right: 0;
    top: 3%;
    margin: 0 auto;
  }

  .panelRight {
    @include panelItem;
    right: 12%;
    top: 0;
    bottom: 0;
    margin: auto 0;
  }

  .panelBottom {
    @include panelItem;
    left: 0;
    bottom: 3%;
    right: 0;
    margin: 0 auto;
  }

  .panelLeft {
    @include panelItem;
    left: 12%;
    top: 0;
    bottom: 0;
    margin: auto 0;
  }

  .panelCenter {
    width: 30px;
    height: 30px;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    cursor: pointer;
    border-radius: 50%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    color: #ffffff;
    font-size: 24px;
    font-family: "item_info_title";
    // border: 1px solid #e8e8e8;
    transition: all 0.3s ease;
    // background-image: url("../../../assets/Shandong/imgs/ctrl/yuntaibtn_ctrl.png");
    // background-size: cover;

    &:active {
      box-shadow: inset 0 0 5px 3px #999, inset 0 0 30px #aaa;
    }
  }
}
</style>

<style lang="scss">
.light-tooltip {
  background: #33364b !important;
  border: 1px solid #5f689e !important;
  color: #b1b3c3 !important;

  .el-popper__arrow::before {
    border: 1px solid #5f689e !important;
    background-color: #33364b !important;
  }
}
</style>
