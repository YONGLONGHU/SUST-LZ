<template>
	<view class="container">
		<view class="row">
			<view class="filter">
				<input v-model="taskName" class="filter-input" placeholder="请输入任务名称" />
			</view>
			<view class="filter">
				<input v-model="deviceName" class="filter-input" placeholder="请输入设备名称" />
			</view>
			<view class="filter">
				<picker mode="selector" :value="taskStatusIndex" :range="statusRange" class="filter-input"
					@change="onStatusChange">
					<view class="picker">{{ statusRange[taskStatusIndex] }}</view>
				</picker>
			</view>
			<view class="filter">
				<picker mode="date" class="filter-input" @change="onStartDateChange">
					<text class="picker">{{ startDate || '输入开始时间' }}</text>
				</picker>
			</view>
		</view>
		<scroll-view class="data-list" scroll-y>
			<view class="data-item" v-for="(item, index) in paginatedData" :key="index">
				<view class="data-row">
					<view class="data-column1">{{ item.taskName }}</view>
					<view class="data-column2">{{ item.startTime }}</view>
					<view class="data-column3">{{ item.cycleCount }}</view>
					<button class="action-btn1" @click="viewDetails(item)">详情</button>
				</view>
				<view class="data-row">
					<view class="data-column4">{{ item.deviceName }}</view>
					<view class="data-column5">{{ item.lastResponseTime }}</view>
					<view class="data-column6">{{ item.taskStatus }}</view>
					<button class="action-btn2" @click="exportLog(item)">报表</button>
				</view>
			</view>
		</scroll-view>

		<!-- 弹框：显示报警详细信息 -->
		<view v-if="showModal" class="modal" @click="closeModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">巡检日志详情</text>
					<button class="close-btn" @click="closeModal">×</button>
				</view>
				<view class="modal-body">
					<view><strong>任务名称:</strong> {{ selectedItem.taskName }}</view>
					<view><strong>设备名称:</strong> {{ selectedItem.deviceName }}</view>
					<view><strong>任务循环次数:</strong> {{ selectedItem.cycleCount }}</view>
					<view><strong>任务状态:</strong> {{ selectedItem.taskStatus }}</view>
					<view><strong>初始化时间:</strong> {{ selectedItem.startTime }}</view>
					<view><strong>最后响应时间:</strong> {{ selectedItem.lastResponseTime }}</view>
				</view>
			</view>
		</view>

		<view class="pagination">
			<button :disabled="currentPage === 1" @click="prevPage">上一页</button>
			<span class="span">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
			<button :disabled="currentPage === totalPages" @click="nextPage">下一页</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				taskName: '',
				deviceName: '',
				taskStatusIndex: 0, // 初始选中为“请选择”
				statusRange: ['请选择状态', '进行中', '已完成'],
				startDate: '',
				currentPage: 1,
				pageSize: 8, // 每页展示的数据条数
				data: [{
						taskName: '厂房检测',
						deviceName: '防爆设备003',
						cycleCount: 3,
						taskStatus: '进行中',
						startTime: '2024-11-22 17:07:49',
						lastResponseTime: '2024-11-22 17:07:49'
					},
					{
						taskName: '东莞油库轮换式',
						deviceName: '东莞油库01',
						cycleCount: 2,
						taskStatus: '已完成',
						startTime: '2024-11-22 15:31:46',
						lastResponseTime: '2024-11-22 15:31:46'
					},
					{
						taskName: '东莞油库轮换式',
						deviceName: '东莞油库03',
						cycleCount: 8,
						taskStatus: '进行中',
						startTime: '2024-11-22 13:24:09',
						lastResponseTime: '2024-11-22 13:24:09'
					},
					{
						taskName: '厂房检测',
						deviceName: '防爆设备003',
						cycleCount: 3,
						taskStatus: '已完成',
						startTime: '2024-11-22 13:02:54',
						lastResponseTime: '2024-11-22 13:02:54'
					},
					{
						taskName: '东莞油库轮换式',
						deviceName: '东莞油库01',
						cycleCount: 5,
						taskStatus: '进行中',
						startTime: '2024-11-21 15:34:17',
						lastResponseTime: '2024-11-21 15:34:17'
					},
					{
						taskName: '厂房检测',
						deviceName: '防爆设备003',
						cycleCount: 3,
						taskStatus: '进行中',
						startTime: '2024-11-22 17:07:49',
						lastResponseTime: '2024-11-22 17:07:49'
					},
					{
						taskName: '东莞油库轮换式',
						deviceName: '东莞油库01',
						cycleCount: 2,
						taskStatus: '已完成',
						startTime: '2024-11-22 15:31:46',
						lastResponseTime: '2024-11-22 15:31:46'
					},
					{
						taskName: '东莞油库轮换式',
						deviceName: '东莞油库03',
						cycleCount: 8,
						taskStatus: '进行中',
						startTime: '2024-11-22 13:24:09',
						lastResponseTime: '2024-11-22 13:24:09'
					},
					{
						taskName: '厂房检测',
						deviceName: '防爆设备003',
						cycleCount: 3,
						taskStatus: '已完成',
						startTime: '2024-11-22 13:02:54',
						lastResponseTime: '2024-11-22 13:02:54'
					},
					{
						taskName: '东莞油库轮换式',
						deviceName: '东莞油库01',
						cycleCount: 5,
						taskStatus: '进行中',
						startTime: '2024-11-21 15:34:17',
						lastResponseTime: '2024-11-21 15:34:17'
					},
					{
						taskName: '厂房检测',
						deviceName: '防爆设备003',
						cycleCount: 3,
						taskStatus: '进行中',
						startTime: '2024-11-22 17:07:49',
						lastResponseTime: '2024-11-22 17:07:49'
					},
					{
						taskName: '东莞油库轮换式',
						deviceName: '东莞油库01',
						cycleCount: 2,
						taskStatus: '已完成',
						startTime: '2024-11-22 15:31:46',
						lastResponseTime: '2024-11-22 15:31:46'
					},
					{
						taskName: '东莞油库轮换式',
						deviceName: '东莞油库03',
						cycleCount: 8,
						taskStatus: '进行中',
						startTime: '2024-11-22 13:24:09',
						lastResponseTime: '2024-11-22 13:24:09'
					},
					{
						taskName: '厂房检测',
						deviceName: '防爆设备003',
						cycleCount: 3,
						taskStatus: '已完成',
						startTime: '2024-11-22 13:02:54',
						lastResponseTime: '2024-11-22 13:02:54'
					},
					{
						taskName: '东莞油库轮换式',
						deviceName: '东莞油库01',
						cycleCount: 5,
						taskStatus: '进行中',
						startTime: '2024-11-21 15:34:17',
						lastResponseTime: '2024-11-21 15:34:17'
					},
					// 更多数据...
				],
				showModal: false, // 控制弹框显示
				selectedItem: {} // 存储点击查看详情的报警信息
			};
		},
		computed: {
			filteredData() {
				return this.data.filter(item => {
					const selectedDate = new Date(this.startDate); // 用户选择的日期
					const itemStartDate = new Date(item.startTime); // 数据项的开始时间
					return (
						(this.taskName ? item.taskName.includes(this.taskName) : true) &&
						(this.deviceName ? item.deviceName.includes(this.deviceName) : true) &&
						(this.taskStatusIndex > 0 ? item.taskStatus === this.statusRange[this
							.taskStatusIndex] : true) &&
						(this.startDate ? itemStartDate >= selectedDate : true) // 仅保留开始时间大于等于选择时间的数据
					);
				});
			},
			totalPages() {
				return Math.ceil(this.filteredData.length / this.pageSize);
			},
			paginatedData() {
				const start = (this.currentPage - 1) * this.pageSize;
				const end = start + this.pageSize;
				return this.filteredData.slice(start, end);
			},
		},
		methods: {
			// 处理任务状态筛选
			onStatusChange(e) {
				this.taskStatusIndex = parseInt(e.detail.value);
			},
			// 处理开始时间筛选
			onStartDateChange(e) {
				this.startDate = e.detail.value;
			},
			// 查看详情
			viewDetails(item) {
				this.selectedItem = item; // 将点击的报警数据存储到 selectedItem
				this.showModal = true; // 显示弹框
			},
			closeModal() {
				this.showModal = false; // 关闭弹框
			},
			// 导出日志
			exportLog(item) {
				console.log("导出日志", item);
			},
			// 上一页
			prevPage() {
				if (this.currentPage > 1) {
					this.currentPage--;
				}
			},
			// 下一页
			nextPage() {
				if (this.currentPage < this.totalPages) {
					this.currentPage++;
				}
			},
		},
	};
</script>

<style>
	.container {
		padding: 8px;
		background: linear-gradient(135deg, #1e1e2f, #292942);
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.filter {
		flex: 1;
	}

	.row {
		display: flex;
		justify-content: space-between;
		/* 控件均匀分布 */
		align-items: left;
		/* 垂直居中 */
		font-size: 10px;
	}

	.filter-input {
		width: 80%;
		height: 40px;
		padding: 0 10px;
		background-color: #2e2e3f;
		border: 1px solid #444;
		border-radius: 5px;
		color: #fff;
	}

	.picker {
		line-height: 40px;
		color: #fff;
		text-align: left;
	}

	.data-list {
		flex: 1;
	}

	.data-item {
		display: flex;
		flex-direction: column;
		/* 改为垂直布局 */
		padding: 3px;
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
		border-radius: 8px;
		border: 1px solid #444;
		font-size: 13px;
	}

	.data-row {
		display: flex;
		flex-wrap: nowrap;
		/* 子元素在同一行展示 */
		justify-content: space-between;
		margin-top: 2px;
		/* 每行之间增加间距 */
	}

	.data-column1,
	.data-column2,
	.data-column3,
	.data-column4,
	.data-column5,
	.data-column6,
	.action-column {
		text-align: left;
	}

	.data-column1 {
		width: 30%;
	}

	.data-column2 {
		width: 45%;
	}

	.data-column3 {
		width: 15%;

	}

	.data-column4 {
		width: 30%;
	}

	.data-column5 {
		width: 45%;
		/* 平均分配第二行宽度 */
	}

	.data-column6 {
		width: 15%;
	}

	.action-btn1 {
		width: 10%;
		padding: 0px;
		background-color: #007aff;
		color: white;
		border-radius: 5px;
		font-size: 12px;
		/* 缩小字体 */
	}

	.action-btn2 {
		width: 10%;
		padding: 0px;
		background-color: #007aff;
		color: white;
		border-radius: 5px;
		font-size: 12px;
		/* 缩小字体 */
	}

	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		/* 半透明黑色背景 */
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}


	.modal-content {
		background: #2e2e3f;
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
		width: 80%;
		max-width: 600px;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.modal-title {
		font-size: 20px;
		color: #fff;
	}

	.close-btn {
		background: transparent;
		border: none;
		color: #fff;
		font-size: 18px;
		cursor: pointer;
	}

	.modal-body {
		font-size: 14px;
		color: #ccc;
	}

	.modal-body strong {
		color: #fff;
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2px;
	}

	.pagination button {
		padding: 2px;
		margin: 4px;
		background-color: #007aff;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-size: 10px;
		/* 调整按钮字体大小 */
	}

	.span {
		margin: 2px;
		font-size: 12px;
		/* 调整页码文字字体大小 */
	}

	.pagination button:disabled {
		background-color: #999;
		cursor: not-allowed;
	}
</style>