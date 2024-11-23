<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import * as echarts from "echarts";
import * as signalR from "@microsoft/signalr";
import dayjs from "dayjs";
import AudioWaveIns from "@/views/bigScreen/Shandong/components/AudioWaveIns/index.vue";
import {
  getAlertDayStatistics,
  getAlertMonthStatistics,
  getSpotChartData
} from "@/api/shanDong";
import BigTitleBox from "@/views/bigScreen/Shandong/components/BigTitleBox/index.vue";
import Radar from "@/views/bigScreen/Shandong/components/Radar/index.vue";
import eventHub from "./utills/eventBus";
const props = defineProps(["robotCode", "robotConfig"]);
//#region 实时告警信号
const positions = ref("-4%");
const left_posirion = ref("4%");
const top_posirion = ref("21%");

const alertList = ref<
  {
    AlertName: string;
    AlertLevel: string;
    DeviceName: string;
    CreationTime: string;
    Location: string;
    StateValue: string;
    Pic: string;
  }[]
>([]);
eventHub.on("positions", (e: number) => {
  if (props.robotCode === "956308279") {
    const getPositions = (e / 87) * 100;
    positions.value = `${getPositions - 4}%`;
  } else if (props.robotCode === "805507434") {
    const getPositions = (e / 84) * 100;
    positions.value = `${getPositions - 4}%`;
  } else if (props.robotCode === "2885688118") {
    // const getPositions = (position - 87 / 260) * 100;
    const position = e % 259;
    if (position >= 3.7 && position <= 25.7) {
      const getPositions = ((position - 3.7) / 22) * 100;
      left_posirion.value = "4%";
      top_posirion.value = `${0.7 * getPositions + 21}%`;
    } else if (position > 25.7 && position <= 42) {
      const getPositions = ((position - 25.7) / 16.3) * 100;
      top_posirion.value = "91%";
      left_posirion.value = `${0.05 * getPositions + 4}%`;
    } else if (position > 42 && position <= 125) {
      const getPositions = ((position - 42) / 83) * 100;
      top_posirion.value = "91%";
      left_posirion.value = `${0.745 * getPositions + 9}%`;
    } else if (position > 125 && position <= 133) {
      const getPositions = ((position - 125) / 8) * 100;
      top_posirion.value = "91%";
      left_posirion.value = `${0.055 * getPositions + 83}%`;
    } else if (position > 133 && position <= 155) {
      const getPositions = ((position - 133) / 22) * 100;
      left_posirion.value = "88.5%";
      top_posirion.value = `${-0.7 * getPositions + 91}%`;
    } else if (position > 155 && position <= 164) {
      const getPositions = ((position - 155) / 9) * 100;
      top_posirion.value = "21%";
      left_posirion.value = `${-0.055 * getPositions + 88.5}%`;
    } else if (position > 164 && position <= 247) {
      const getPositions = ((position - 164) / 83) * 100;
      top_posirion.value = "21%";
      left_posirion.value = `${-0.74 * getPositions + 83}%`;
    } else if (position > 250 && position <= 266) {
      const getPositions = ((position - 250) / 16) * 100;
      top_posirion.value = "21%";
      left_posirion.value = `${-0.05 * getPositions + 9}%`;
    } else {
      left_posirion.value = "4%";
      top_posirion.value = "21%";
    }
  } else if (props.robotCode === "2508200758") {
    const position = e % 259;
    if (position >= 0 && position <= 16) {
      const getPositions = (position / 16) * 100;
      top_posirion.value = "21%";
      left_posirion.value = `${-0.055 * getPositions + 88.5}%`;
    } else if (position > 16 && position <= 102) {
      const getPositions = ((position - 16) / 86) * 100;
      top_posirion.value = "21%";
      left_posirion.value = `${-0.74 * getPositions + 83}%`;
    } else if (position > 102 && position <= 110) {
      const getPositions = ((position - 102) / 8) * 100;
      top_posirion.value = "21%";
      left_posirion.value = `${-0.05 * getPositions + 9}%`;
    } else if (position > 110 && position <= 132) {
      const getPositions = ((position - 110) / 22) * 100;
      left_posirion.value = "4%";
      top_posirion.value = `${0.7 * getPositions + 21}%`;
    } else if (position > 132 && position <= 143) {
      const getPositions = ((position - 132) / 11) * 100;
      top_posirion.value = "91%";
      left_posirion.value = `${0.05 * getPositions + 4}%`;
    } else if (position > 143 && position <= 225.5) {
      const getPositions = ((position - 143) / 82.5) * 100;
      top_posirion.value = "91%";
      left_posirion.value = `${0.74 * getPositions + 9}%`;
    } else if (position > 225.5 && position <= 240) {
      const getPositions = ((position - 225.5) / 14.5) * 100;
      top_posirion.value = "91%";
      left_posirion.value = `${0.055 * getPositions + 83}%`;
    } else if (position > 240 && position <= 259) {
      const getPositions = ((position - 240) / 19) * 100;
      left_posirion.value = "88.5%";
      top_posirion.value = `${-0.7 * getPositions + 91}%`;
    } else {
      left_posirion.value = "88.5%";
      top_posirion.value = "21%";
    }
  }
});
const alertLevelText = {
  0: "异常",
  1: "正常",
  2: "警告",
  3: "一般告警",
  4: "严重告警"
};
const positionList = {
  "2885688118": {
    left_top: 4,
    right_top: 155,
    left_bottom: 26,
    right_bottom: 133
  },
  "956308279": {
    left_top: 0,
    right_top: 87,
    left_bottom: 26,
    right_bottom: 133
  },
  "805507434": {
    left_top: 0,
    right_top: 87,
    left_bottom: 26,
    right_bottom: 133
  },
  "2508200758": {
    left_top: 111,
    right_top: 4,
    left_bottom: 133,
    right_bottom: 240
  }
};
const showPoins = ref<{
  left_top: number;
  right_top: number;
  left_bottom: number;
  right_bottom: number;
}>({
  left_top: 4,
  right_top: 155,
  left_bottom: 26,
  right_bottom: 133
});
watch(
  () => {
    props.robotCode;
  },
  () => {
    Object.keys(positionList).forEach(e => {
      if (props.robotCode == e) {
        console.log(e, positionList[e]);
        showPoins.value = positionList[e];
      }
    });
  },
  { deep: true }
);
const AlertHub: signalR.HubConnection = new signalR.HubConnectionBuilder()
  .withUrl("/proxySignalr/QiRobotIMACPHub")
  .build();

let timer: NodeJS.Timeout;
AlertHub.on("VAlert", resp => {
  alertList.value = [...alertList.value, ...JSON.parse(resp)];
  alertList.value.length &&
    !timer &&
    (timer = setInterval(() => {
      alertList.value.shift();
      alertList.value.length === 0 &&
        (() => {
          clearInterval(timer);
          timer = null;
        })();
    }, 5000));
});

onMounted(() => {
  AlertHub.start();
});

onBeforeUnmount(() => {
  AlertHub.stop();
});

//#endregion

//#region 告警统计
// 图表配置
const alarmRef = ref(null);

let alarmChart: echarts.ECharts;
const alarmOption: echarts.EChartsOption = {
  title: {
    top: 20,
    text: "总数/个",
    textStyle: {
      color: "#ffffffc8",
      fontStyle: "normal",
      fontSize: 14
    }
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  legend: {
    top: 18,
    icon: "circle",
    itemHeight: 10,
    itemGap: 8,
    textStyle: {
      fontSize: 10,
      color: "#fff",
      padding: [0, 0, 0, -10]
    }
  },
  grid: {
    left: "3%",
    right: "1%",
    bottom: "4%",
    containLabel: true
  },
  xAxis: [
    {
      type: "category",
      data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      axisLabel: {
        color: "#fff",
        fontSize: 10
      }
    }
  ],
  yAxis: [
    {
      type: "value",
      axisLabel: {
        color: "#fff"
      }
    }
  ],
  series: []
};

const _isDay = ref(true);
const handleAlarmChartData = async () => {
  const data = _isDay.value
    ? await getAlertDayStatistics()
    : await getAlertMonthStatistics();

  const xAxisData = [];
  const seriesData = {};

  // 遍历 dataList 构建 legend 和 seriesData
  data.forEach(item => {
    xAxisData.push(
      dayjs(item.time as string).format(_isDay.value ? "MM.DD" : "MM月")
    );
    Object.keys(item).forEach(key => {
      if (key !== "time") {
        if (!seriesData[key] && typeof item[key] !== "string") {
          seriesData[key] = {
            type: (
              item[key] as {
                type: number;
              }
            ).type,
            list: []
          };
        }
        seriesData[key].list.push(
          (
            item[key] as {
              count: number;
            }
          ).count
        );
      }
    });
  });

  alarmChart.setOption({
    xAxis: [
      {
        data: xAxisData
      }
    ],
    series: Object.keys(seriesData).map(key => ({
      name: key,
      type: "bar",
      stack: seriesData[key].type, // 你可能需要根据实际情况修改这里
      data: seriesData[key].list
    }))
  });
};

onMounted(() => {
  alarmChart = echarts.init(alarmRef.value as HTMLDivElement);
  alarmChart.setOption(alarmOption);
  handleAlarmChartData();
});

onBeforeUnmount(() => {
  alarmChart.dispose();
});

//#endregion

//#region 识别占比
// 图表配置
const spotRef = ref(null);
let spotChart: echarts.ECharts;

const m2R2Data = [
  {
    value: 335,
    legendName: "手柄识别",
    name: "手柄识别"
  },
  {
    value: 310,
    legendName: "铁链识别",
    name: "铁链识别"
  },
  {
    value: 234,
    legendName: "柱子识别",
    name: "柱子识别"
  }
];

const spotOption: echarts.EChartsOption = {
  title: [
    {
      text: "合计",
      subtext:
        m2R2Data.reduce(
          (accumulator, currentValue) => accumulator + currentValue.value,
          0
        ) + "个",
      textStyle: {
        fontSize: 12,
        color: "white"
      },
      subtextStyle: {
        fontSize: 12,
        color: "white"
      },
      textAlign: "center",
      left: "69.5%",
      top: "44%"
    }
  ],
  tooltip: {
    trigger: "item",
    formatter: function (params: any) {
      return (
        params.marker +
        "" +
        params.data.legendName +
        "</br>" +
        "数量：" +
        params.data.value +
        "</br>" +
        "占比：" +
        params.percent +
        "%"
      );
    }
  },
  legend: {
    type: "scroll",
    orient: "vertical",
    left: "10%",
    align: "left",
    top: "middle",
    textStyle: {
      color: "#"
    }
  },
  series: [
    {
      name: "标题",
      type: "pie",
      center: ["70%", "50%"],
      radius: ["40%", "65%"],
      clockwise: false, //饼图的扇区是否是顺时针排布
      avoidLabelOverlap: false,
      label: {
        show: false
      },
      labelLine: {
        length: 5,
        length2: 3,
        smooth: true
      },
      data: m2R2Data
    }
  ]
};

const handleSpotChartData = () => {
  getSpotChartData().then(res => {
    const data = res.map(item => ({
      value: item.count,
      legendName: item.aiType,
      name: item.aiType
    }));
    spotChart.setOption({
      title: [
        {
          subtext:
            data.reduce(
              (accumulator, currentValue) => accumulator + currentValue.value,
              0
            ) + "个"
        }
      ],
      series: [
        {
          data: data
        }
      ]
    });
  });
};
const init = () => {
  spotChart = echarts.init(spotRef.value as HTMLDivElement);
  spotChart.setOption(spotOption);
  handleSpotChartData();
};
/* onMounted(() => {
  init();
}); */

onBeforeUnmount(() => {
  if (spotChart) {
    spotChart.dispose();
  }
});
watch(
  () => props.robotConfig.isPad,
  () => {
    if (!props.robotConfig.isPad) {
      setTimeout(() => {
        init();
      }, 100);
    } else {
      spotChart && spotChart.dispose();
      spotChart = null;
    }
  },
  { deep: true }
);
//#endregion
</script>

<template>
  <div>
    <BigTitleBox class="h-[28%]" title="实时告警">
      <div class="flex my-6">
        <div class="w-3/5 pl-4 text-sm">
          <div
            class="flex justify-center items-center h-full text-4xl text-[#1bf4f8]"
            v-if="!alertList.length"
          >
            暂无告警
          </div>
          <div
            v-else
            class="py-5 h-full flex flex-col justify-between [&_div_span:first-child]:inline-block [&>div>span:first-child]:w-1/3 [&_div_span:first-child]:text-right"
          >
            <div>
              <span>告警名称：</span>
              <span>{{ alertList[0] && alertList[0].AlertName }}</span>
            </div>
            <div>
              <span>告警级别：</span>
              <span>{{
                alertLevelText[alertList[0] && alertList[0].AlertLevel]
              }}</span>
            </div>
            <div>
              <span>设备名称：</span>
              <span>{{ alertList[0] && alertList[0].DeviceName }}</span>
            </div>
            <div>
              <span>告警时间：</span>
              <span>{{
                alertList[0] &&
                dayjs(alertList[0].CreationTime).format("YYYY-MM-DD HH:mm:ss")
              }}</span>
            </div>
            <div>
              <span>告警地址：</span>
              <span>{{ alertList[0] && alertList[0].Location }}</span>
            </div>
            <div>
              <span>状态值：</span>
              <span>{{ alertList[0] && alertList[0].StateValue }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-center w-3/5 h-full">
          <el-image
            v-if="alertList[0] && alertList[0].Pic"
            style="width: 200px; height: 200px"
            :src="alertList[0].Pic"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="[alertList[0].Pic]"
            :initial-index="4"
            fit="cover"
            preview-teleported
          />
          <!--  <el-image
            style="width: 200px; height: 200px"
            src="/src/assets/imgs/login-bg1.jpg"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :initial-index="4"
            fit="cover"
            preview-teleported
          /> -->
          <Radar v-else class="mt-5" />
        </div>
      </div>
    </BigTitleBox>
    <BigTitleBox class="h-1/3" title="告警统计">
      <div class="flex items-center h-full px-2 pt-4">
        <el-button
          @click="
            () => {
              _isDay = !_isDay;
              handleAlarmChartData();
            }
          "
          link
        >
          &lang;
        </el-button>
        <div class="w-full h-full alarmRef" ref="alarmRef" />
        <el-button
          @click="
            () => {
              _isDay = !_isDay;
              handleAlarmChartData();
            }
          "
          class="-scale-x-100"
          link
        >
          &lang;
        </el-button>
      </div>
    </BigTitleBox>
    <BigTitleBox
      class="h-1/3 box_position_squal"
      title="机器人位置"
      v-if="
        props.robotCode === '2885688118' || props.robotCode === '2508200758'
      "
      v-show="false"
    >
      <div class="position">
        <div class="con">
          <div class="point_position" v-for="item in 9" :key="item">
            <p>{{ item * 7 - 6 }}</p>
            <div />
            <p v-if="item < 9">{{ item * 7 }}</p>
            <p v-else>62</p>
          </div>
          <div class="point_position" v-for="item in 9" :key="item">
            <p>{{ item * 7 - 6 }}</p>
            <div />
            <p v-if="item < 9">{{ item * 7 }}</p>
            <p v-else>62</p>
          </div>
          <div class="sign"><span>焦测</span><span>机测</span></div>
        </div>
        <div class="position_points">
          <span class="left_top">{{ showPoins?.left_top }}米</span>
          <span class="right_top">{{ showPoins?.right_top }}米</span>
          <span class="left_bottom">{{ showPoins?.left_bottom }}米</span>
          <span class="right_bottom">{{ showPoins?.right_bottom }}米</span>
        </div>
      </div>
      <div class="robot" :style="{ left: left_posirion, top: top_posirion }" />
    </BigTitleBox>
    <BigTitleBox
      class="h-1/3 box_position_line"
      title="机器人位置"
      v-else-if="
        props.robotCode === '956308279' || props.robotCode === '805507434'
      "
      v-show="false"
    >
      <div class="position">
        <div class="con">
          <div class="top">
            <div class="point_position" v-for="item in 10" :key="item">
              <p>{{ item * 6 - 5 }}</p>
              <div />
              <p v-if="item < 10">{{ item * 6 }}</p>
              <p v-else>61</p>
            </div>
          </div>
          <div class="schedule" />
          <div class="robot" :style="{ left: positions }" />
        </div>
        <div class="position_points">
          <span class="left_top">{{ showPoins?.left_top }}米</span>
          <span class="right_top">{{ showPoins?.right_top }}米</span>
        </div>
      </div>
    </BigTitleBox>
    <BigTitleBox
      class="h-1/3"
      :title="props.robotConfig.isPad ? '识别占比' : '现场音频'"
    >
      <div
        class="spotRef h-full"
        ref="spotRef"
        v-if="props.robotConfig.isPad"
      />
      <div v-else class="h-[220px] flex justify-center items-center audio">
        <div class="h-4/5 w-11/12">
          <AudioWaveIns :robot-code="props.robotCode" />
        </div>
      </div>
    </BigTitleBox>
  </div>
</template>

<style scoped lang="scss">
.box_position_squal {
  width: 100%;
  position: relative;
  height: 33%;

  .position {
    // background: url("../../../assets/Shandong/imgs/position_bg.png");
    // background-position: bottom;
    // background-size: 100% 90%;
    // background-repeat: no-repeat;
    // box-shadow: inset 0 0 20px #6f9cf0;
    // position: absolute;
    width: 100%;
    height: 100%;

    // margin-top: -30px;
    // background-color: aqua;
    .con {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -40%);
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 85%;
      height: 70%;
      border: 2px solid #6f9cf0;
      border-radius: 5px;
      padding: 20px 20px;
      box-shadow: inset 0 0 20px #6f9cf0;

      .point_position {
        text-align: center;
        position: relative;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        width: 8%;
        height: 45%;
        background-image: url("../../../assets/Shandong/imgs/point_bg.png");
        background-position: top;
        background-size: 100% 150%;
        background-repeat: no-repeat;
        margin: 5px;
        font-size: 16px;
        padding: 5px 0;

        div {
          width: 2px;
          height: 20px;
          background-color: rgba(240, 255, 255, 0.496);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          // margin-left: 14px;
          // margin: 2px 14px;
        }
      }

      .sign {
        position: absolute;
        left: 4px;
        width: 20px;
        color: #d1d5dc;
        height: 70%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-top: 20px;
      }
    }

    .position_points {
      position: absolute;
      width: 95%;
      height: 85%;
      left: 2%;
      top: 15%;

      span {
        position: absolute;
        color: #d1d5dc;
      }

      .left_top {
        left: 0%;
        top: 0%;
      }

      .right_top {
        right: 0%;
        top: 0%;
      }

      .left_bottom {
        left: 0%;
        bottom: 0%;
      }

      .right_bottom {
        right: 0%;
        bottom: 0%;
      }
    }
  }

  .robot {
    width: 40px;
    height: 30px;
    background-image: url("../../../assets/imgs/机器人.png");
    background-position: center;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: absolute;
    // top: 60%;
    // left: 94%;
  }
}

.box_position_line {
  width: 100%;
  position: relative;
  height: 33%;

  .position {
    // background: url("../../../assets/Shandong/imgs/position_bg.png");
    // background-position: bottom;
    // background-size: 100% 90%;
    // background-repeat: no-repeat;
    // position: absolute;
    box-shadow: inset 0 0 20px #6f9cf0;
    width: 100%;
    height: 100%;
    // margin-top: -40px;
    // background-color: aqua;
    padding: 30px 40px;

    .con {
      width: 100%;
      height: 100%;
      margin-top: 10%;
      position: relative;

      .top {
        width: 100%;
        height: 50%;
        display: flex;
        justify-content: space-between;

        .point_position {
          text-align: center;
          position: relative;
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          width: 8%;
          height: 100%;
          background-image: url("../../../assets/Shandong/imgs/point_bg.png");
          background-position: top;
          background-size: 100% 150%;
          background-repeat: no-repeat;
          margin: 5px;
          padding: 14px 0;
          font-size: 16px;

          // color: aqua;
          div {
            width: 2px;
            height: 25%;
            background-color: rgba(240, 255, 255, 0.496);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            // margin-left: 14px;
            // margin: 2px 14px;
          }
        }
      }

      .schedule {
        width: 102%;
        height: 4px;
        background-color: #6f9cf0;
        // box-shadow: inset 0 0 20px #6f9cf0;
        position: absolute;
        top: 62%;
      }

      .robot {
        width: 40px;
        height: 30px;
        background-image: url("../../../assets/imgs/机器人.png");
        background-position: center;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        position: absolute;
        top: 62%;
        left: 94%;
      }
    }

    .position_points {
      position: absolute;
      width: 95%;
      height: 10%;
      left: 2%;
      top: 85%;

      span {
        position: absolute;
        color: #d1d5dc;
      }

      .left_top {
        left: 0%;
        top: 0%;
      }

      .right_top {
        right: 0%;
        top: 0%;
      }
    }
  }
}
</style>
