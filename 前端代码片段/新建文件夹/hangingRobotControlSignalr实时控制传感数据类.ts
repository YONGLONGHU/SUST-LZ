import * as signalR from "@microsoft/signalr";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage, ElMessageBox } from "element-plus";
import { debounce } from "@pureadmin/utils";

interface ControlMethods {
  setStepLength: (step: number) => void;
  goForward: () => void;
  goBackward: () => void;
  accelerate: () => void;
  decelerate: () => void;
  goForwardWithSpeed: (speed: number) => void;
  goReverseWithSpeed: (speed: number) => void;
  stop: () => void;
  returnHomeAndCharge: () => void;
  resetFault: () => void;
  restartAllFunctions: () => void;
  setInspectionModeToManual: () => void;
  setFrontLampBrightness: (light: number) => void;
  setPadFrontLampBrightness: (light: number) => void;
  setRearLampBrightness: (light: number) => void;
  setPadRearLampBrightness: (light: number) => void;
  setAccelerationStepLengthToDegrees: (step: number) => void;
  tiltUpWithRotationStepLength: () => void;
  tiltDownWithRotationStepLength: () => void;
  rotateLeftWithRotationStepLength: () => void;
  rotateRightWithRotationStepLength: () => void;
  centerWithRotationStepLength: () => void;
  autoCalibrateGimbal: () => void;
  restartPanTilt: () => void;
  setFillLightBrightnessToPercent: (light: number) => void;
  setLeftServoAngleToDegrees: (angle: number) => void;
  setRightServoAngleToDegrees: (angle: number) => void;
  setLeftLampBrightnessToPercent: (light: number) => void;
  setRightLampBrightnessToPercent: (light: number) => void;
  setServoStep: (step: number) => void;
  setLeftServoAngleUp: () => void;
  setLeftServoAngleDown: () => void;
  setRightServoAngleUp: () => void;
  setRightServoAngleDown: () => void;
  setStopTask: () => void;
  setAutomaticTask: () => void;
  setScheduledTask: () => void;
  setTemporaryTask: () => void;
  zoomSetStep: (angle: any) => void
  setZoomIn: () => void
  setZoomOut: () => void
  setFocusNear: () => void
  setFocusFar: () => void
  setSetPrePos: (angle: any) => void
  setMoveToPreset: (angle: any) => void
  setMoveToPotint: (angle: any) => void
  setObstacleAvoidance: (angle: any) => void
}
export class HangingRobotControlSignalr {
  private hubUrl: string;
  private robotCode: string;
  private connection: signalR.HubConnection | null;
  private validationCriteria: Record<string, number[]> = {
    Move: [9, 10, 11],
    PanTilt: [11],
    WebTask: [0, 1, 2, 3]
  };
  private readonly controlMethods: ControlMethods;
  constructor(
    hubUrl: string,
    robotCode: string,
    validationCriteria?: Record<string, number[]>
  ) {
    this.hubUrl = hubUrl;
    this.robotCode = robotCode;
    this.connection = null;
    if (validationCriteria) {
      this.validationCriteria = validationCriteria;
    }

    // 定义控制方法
    this.controlMethods = {
      setStepLength: step =>
        this.invokeMove(1, step, "设置加减速步长为" + step + "米/s"),

      goForward: () => this.invokeMove(2, null, "前进"),

      goBackward: () => this.invokeMove(3, null, "后退"),

      accelerate: () => this.invokeMove(4, null, "加速"),

      decelerate: () => this.invokeMove(5, null, "减速"),

      goForwardWithSpeed: speed =>
        this.invokeMove(6, speed, "以" + speed + "米/s速度前进"),

      goReverseWithSpeed: speed =>
        this.invokeMove(7, speed, "以" + speed + "米/s速度后退"),

      stop: () => this.invokeMove(8, null, "停止"),

      returnHomeAndCharge: () => this.invokeMove(9, null, "回程充电"),

      resetFault: () => this.invokeMove(10, null, "故障复位"),

      restartAllFunctions: () => this.invokeMove(11, null, "一键重启"),

      setInspectionModeToManual: () =>
        this.invokeMove(12, 0, "设置巡检模式为手动"),

      setMoveToPotint: position => {
        if (position) {
          this.invokeMove(15, position, `手动前往${position}米`)
        } else {
          ElMessage.warning("请选择点位");
        }
      },


      setFrontLampBrightness: light =>
        this.invokeOther(1, light, "设置前灯亮度" + light + "%"),

      setRearLampBrightness: light =>
        this.invokeOther(2, light, "设置后灯亮度" + light + "%"),

      setPadFrontLampBrightness: light =>
        this.invokeOther(16, light, `设置左灯${light ? '开' : '关'}`),

      setPadRearLampBrightness: light =>
        this.invokeOther(17, light, `设置右灯${light ? '开' : '关'}`),

      setAccelerationStepLengthToDegrees: step =>
        this.invokePanTilt(1, step, "设置加减速步长为" + step + "度"),

      tiltUpWithRotationStepLength: () => this.invokePanTilt(2, null, "上仰"),

      tiltDownWithRotationStepLength: () => this.invokePanTilt(3, null, "下俯"),

      rotateLeftWithRotationStepLength: () =>
        this.invokePanTilt(4, null, "左旋"),

      rotateRightWithRotationStepLength: () =>
        this.invokePanTilt(5, null, "右旋"),

      centerWithRotationStepLength: () => this.invokePanTilt(6, null, "居中"),

      autoCalibrateGimbal: () => this.invokePanTilt(7, null, "云台自动校准"),

      setFillLightBrightnessToPercent: (() =>
        debounce(
          light =>
            this.invokePanTilt(8, light, "设置补光灯亮度为" + light + "%"),
          300
        ))(),

      restartPanTilt: () => this.invokePanTilt(11, null, "重启云台"),

      // Pad机器人控制
      setLeftServoAngleToDegrees: angle =>
        this.invokePad(1, angle, "设置左舵机角度至" + angle + "度"),

      setRightServoAngleToDegrees: angle =>
        this.invokePad(2, angle, "设置右舵机角度至" + angle + "度"),

      setLeftLampBrightnessToPercent: light =>
        this.invokePad(3, light, "设置左灯亮度为" + light + "%"),

      setRightLampBrightnessToPercent: light =>
        this.invokePad(4, light, "设置右灯亮度为" + light + "%"),

      setServoStep: step =>
        this.invokePad(5, step, "设置舵机步长为" + step + "度"),

      setLeftServoAngleUp: () => this.invokePad(6, null, "左舵机上仰"),

      setLeftServoAngleDown: () => this.invokePad(7, null, "左舵机下俯"),

      setRightServoAngleUp: () => this.invokePad(8, null, "右舵机上仰"),

      setRightServoAngleDown: () => this.invokePad(9, null, "右舵机下俯"),

      // 任务策略
      setStopTask: () => this.invokeWebTask(0, null, "停止巡检任务"),

      setAutomaticTask: () => this.invokeWebTask(1, null, "开始自动巡检"),

      setScheduledTask: () => this.invokeWebTask(2, null, "开始定时巡检"),

      setTemporaryTask: () => this.invokeWebTask(3, null, "开始临时巡检"),

      // 摄像头变焦
      zoomSetStep: angle => this.invokeZoom(1, angle, `设置步长${angle}`),

      setZoomIn: () => this.invokeZoom(2, 1, '变倍进'),
      setZoomOut: () => this.invokeZoom(2, 2, '变倍出'),
      setFocusNear: () => this.invokeZoom(3, 1, '变焦近'),
      setFocusFar: () => this.invokeZoom(3, 2, '变焦远'),
      setSetPrePos: angle => this.invokeZoom(4, angle, `设置预定位`),
      setMoveToPreset: angle => this.invokeZoom(5, angle, `移动到预定位${angle}`),

      setObstacleAvoidance: angle => this.invokeMove(13, angle, `避障状态${angle ? '开启' : '关闭'}`)


    };
  }

  init(
    eventWatchlist?: {
      eventName: string;
      callback: (...args: any[]) => any;
    }[],
    onConnected?: Function,
    onDisconnected?: (error: Error) => any
  ) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect()
      .build();
    eventWatchlist &&
      eventWatchlist.forEach(event => {
        this.connection.on(event.eventName, resp => {
          if (JSON.parse(resp).RobotStatus.Id === this.robotCode)
            event.callback(resp);
        });
      });

    this.connection
      .start()
      .then(() => {
        if (onConnected) {
          onConnected();
        }
      })
      .catch(error => {
        console.error("SignalR connection error:", error);
        if (onDisconnected) {
          onDisconnected(error);
        }
      });

    return this.connection;
  }

  invokeMove(action: number, arg: number | null, desc: string) {
    this.invokeAction("Move", action, arg, desc);
  }

  invokeOther(action: number, arg: number | null, desc: string) {
    this.invokeAction("Other", action, arg, desc);
  }

  invokePanTilt(action: number, arg: number | null, desc: string) {
    this.invokeAction("PanTilt", action, arg, desc);
  }

  invokePad(action: number, arg: number | null, desc: string) {
    this.invokeAction("Pad", action, arg, desc);
  }
  invokeWebTask(action: number, arg: null, desc: string) {
    this.invokeAction("WebTask", action, arg, desc);
  }

  invokeZoom(action: number, arg: any, desc: string) {
    console.log(arg);

    this.invokeAction("HikCtrl", action, arg, desc);
  }
  getControlMethods() {
    return this.controlMethods;
  }
  invokeAction(
    topic: string,
    action: number,
    arg: number | null,
    desc: string
  ) {
    if (!useUserStoreHook().permissions.BackEndSignalR)
      return ElMessage.warning("您没有权限操作该功能");

    if (!this.connection) {
      console.error("SignalR connection is not initialized");
      return;
    }

    const data = {
      Id: this.robotCode,
      Topic: topic,
      Action: action,
      Arg: arg,
      Desc: desc,
      UserId: JSON.parse(localStorage.getItem('user-info')).id,
      UserName: JSON.parse(localStorage.getItem('user-info')).username,
    };

    const invoke = () => {
      console.log(data);

      this.connection
        .invoke(topic, data)
        .then(() => {
          ElMessage.success(desc + "成功");
        })
        .catch(err => {
          ElMessage.error(desc + "失败");
          ElMessage.error(err.message);
        });
    };

    if (this.validationCriteria[topic]?.includes(action)) {
      ElMessageBox.confirm(`确定执行${desc}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        invoke();
      });
    } else {
      invoke();
    }
  }

  handleRobotCode(robotCode: string) {
    this.robotCode = robotCode;
  }

  dispose() {
    if (this.connection) {
      this.connection.stop();
    }
  }
}
