<template>
	<view class="container">
		<!-- 上半部分：实时更新的图像 -->
		<view class="image-container">
			<image :src="imageBase64" mode="widthFix" class="image" />
		</view>

		<!-- 下半部分：四个区域 -->
		<view class="control-container">
			<!-- 第一行：传感数据 + 一键指令 -->
			<view class="control-row">
				<view class="control-box sensor-box">
					<text class="control-title">传感数据</text>
					<view class="control-content">{{ sensorData1 }}</view>
					<view class="control-content">一号湿度值：60%</view>
					<view class="control-content">{{ sensorData2 }}</view>
					<view class="control-content">二号湿度值：60%</view>
				</view>
				<view class="control-box command-box">
					<text class="control-title">一键指令</text>
					<view class="control-row-2">
						<button class="control-button" @click="sendCommand('回程充电')">回程充电</button>
						<button class="control-button" @click="sendCommand('故障复位')">故障复位</button>
						<button class="control-button" @click="sendCommand('打开前灯')">打开前灯</button>
						<button class="control-button" @click="sendCommand('打开后灯')">打开后灯</button>
					</view>
				</view>
			</view>

			<!-- 第二行：机器人控制 + 云台控制 -->
			<view class="control-row">
				<view class="control-box robot-box">
					<text class="control-title">机器人控制</text>
					<view class="control-row-3">
						<button class="control-button" @click="toggleRobot('加速')">加速</button>
						<button class="control-button" @click="toggleRobot('减速')">减速</button>
						<button class="control-button" @click="toggleRobot('前进')">前进</button>
						<button class="control-button" @click="toggleRobot('后退')">后退</button>
						<button class="control-button" @click="toggleRobot('停止')">停止</button>
					</view>
					<input v-model="speed" class="set_speed" type="number" placeholder="请设置速度(m/s)" />
				</view>
				<view class="control-box camera-box">
					<text class="control-title">云台控制</text>
					<view class="control-row-3">
						<button class="control-button" @click="controlCamera('上仰')">上仰</button>
						<button class="control-button" @click="controlCamera('下仰')">下仰</button>
						<button class="control-button" @click="controlCamera('左旋')">左旋</button>
						<button class="control-button" @click="controlCamera('右旋')">右旋</button>
						<button class="control-button" @click="restartCamera">重启</button>
					</view>
					<input v-model="lightBrightness" class="set_light" type="number" min="0" max="100"
						placeholder="请设置补光灯亮度(%)" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imageBase64: '', // 存储从网络获取的base64图像数据
				sensorData1: '一号温度值：25°C', // 示例传感数据
				sensorData2: '二号温度值：29°C', // 示例传感数据
				speed: '', // 机器人速度
				lightBrightness: '', // 补光灯亮度（初始值）
			};
		},
		methods: {
			// 模拟从网络获取图像并实时更新
			fetchImageData() {
				setInterval(() => {
					// 假设你通过网络获取图像数据并更新
					// 此处使用随机生成的Base64字符串作为示例
					this.imageBase64 = 'data:image/png;base64,' + this.generateRandomBase64();
				}, 5000); // 每5秒更新一次
			},
			// 生成随机的Base64字符串（此处仅为示例，实际应用中应替换为真实数据）
			generateRandomBase64() {
				const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
				let result = '';
				for (let i = 0; i < 1000; i++) {
					result += characters.charAt(Math.floor(Math.random() * characters.length));
				}
				return result;
			},
			// 发送指令
			sendCommand(command) {
				uni.showToast({
					title: `${command} 指令已发送`,
					icon: 'success',
				});
			},
			// 控制机器人
			toggleRobot(action) {
				this.robotStatus = action;
			},
			// 设置机器人速度
			setSpeed() {
				uni.showToast({
					title: `设置速度：${this.speed}`,
					icon: 'success',
				});
			},
			// 控制云台
			controlCamera(direction) {
				uni.showToast({
					title: `云台控制：${direction}`,
					icon: 'success',
				});
			},
			// 重启云台
			restartCamera() {
				uni.showToast({
					title: '云台重启中...',
					icon: 'success',
				});
			},
		},
		onLoad() {
			//this.fetchImageData(); // 页面加载时开始获取图像数据
		},
	};
</script>

<style scoped>
	/* 整个页面的背景颜色和布局 */
	.container {
		background: linear-gradient(135deg, #1e1e2f, #292942);
		min-height: 100vh;
		color: #fff;
		font-family: 'Arial', sans-serif;
		padding: 20px;
		box-sizing: border-box;
	}

	/* 上半部分：图像展示 */
	.image-container {
		margin-bottom: 20px;
		text-align: center;
	}

	.image {
		width: 100%;
		max-height: 300px;
		border-radius: 10px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
	}

	/* 下半部分：四个控制区域 */
	.control-container {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	/* 每行控制区域布局 */
	.control-row {
		display: flex;
		justify-content: space-between;
		gap: 20px;
	}

	/* 每行控制区域布局：一行两列 */
	.control-row-2 {
		margin-top: 10px;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
	}

	/* 每行控制区域布局：一行三列 */
	.control-row-3 {
		margin-top: 10px;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 5px;
	}

	/* 单个控制区域的样式 */
	.control-box {
		flex: 1;
		background: rgba(255, 255, 255, 0.1);
		padding: 15px;
		border-radius: 10px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
	}

	.control-title {
		text-align: left;
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.control-content {
		text-align: left;
		font-size: 12px;
		margin-top: 5px;
	}

	.control-button {
		background-color: #007aff;
		color: white;
		border: none;
		padding: 5px;
		border-radius: 5px;
		font-size: 12px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.control-button:hover {
		background-color: #005bb5;
	}

	/* 不同区域的特定样式 */
	.sensor-box {
		background-color: rgba(34, 34, 59, 0.7);
	}

	.command-box {
		background-color: rgba(34, 34, 59, 0.7);
	}

	.robot-box {
		background-color: rgba(34, 34, 59, 0.7);
	}

	.camera-box {
		background-color: rgba(34, 34, 59, 0.7);
	}

	.speed-input {
		margin-top: 10px;
		display: flex;
		justify-content: space-between;
	}

	input {
		width: 80%%;
		padding: 5px;
		border-radius: 5px;
		border: 1px solid #ddd;
	}

	input[type="number"] {
		-moz-appearance: textfield;
	}

	input[type="number"]::-webkit-outer-spin-button,
	input[type="number"]::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.set_speed {
		margin-top: 10px;
		font-size: 12px;
	}

	.set_light {
		font-size: 12px;
		margin-top: 10px;
	}

	input[type="number"]:focus {
		outline: none;
		border-color: #007aff;
	}
</style>