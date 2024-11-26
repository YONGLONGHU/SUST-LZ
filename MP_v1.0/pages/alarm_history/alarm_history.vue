<template>
	<view class="container">
		<!-- 三列布局容器 -->
		<view class="row">
			<!-- 第一列 -->
			<view class="column">
				<view class="input-group">
					<input class="input" placeholder="请输入报警名称" v-model="alarmName" />
				</view>
				<view class="input-group">
					<picker mode="selector" :value="alertCategories_index" :range="selectedAlertCategory" class="picker"
						@change="onAlertCategoryChange">
						<text class="picker-text">{{ selectedAlertCategory[alertCategories_index] }}</text>
					</picker>
				</view>
			</view>
			<!-- 第二列 -->
			<view class="column">
				<view class="input-group">
					<picker mode="date" class="picker" @change="onStartDateChange">
						<text class="picker-text">{{ startDate || '请选择开始时间' }}</text>
					</picker>
				</view>
				<view class="input-group">
					<picker mode="date" class="picker" @change="onEndDateChange">
						<text class="picker-text">{{ endDate || '请选择结束时间' }}</text>
					</picker>
				</view>
			</view>
			<!-- 第三列 -->
			<view class="column">
				<view class="input-group">
					<picker mode="selector" :value="alertLevels_index" :range="alertLevels" class="picker"
						@change="onAlertLevelChange">
						<text class="picker-text">{{ alertLevels[alertLevels_index] }}</text>
					</picker>
				</view>
				<view class="input-group">
					<picker mode="selector" :value="isConfirmed_index" :range="isConfirmed" class="picker"
						@change="isConfirmedChange">
						<text class="picker-text">{{ isConfirmed[isConfirmed_index] }}</text>
					</picker>
				</view>
			</view>
		</view>
		<scroll-view class="data-list" scroll-y>
			<view class="data-item" v-for="(item, index) in paginatedData" :key="index">
				<view class="data-row">
					<view class="data-column1">{{ item.AlarmName }}</view>
					<view class="data-column2">{{ item.AlarmTime }}</view>
					<view class="data-column3">{{ item.AlarmLevel }}</view>
				</view>
				<view class="data-row1">
					<view class="data-column4">{{ item.Position }}</view>
					<view class="data-column5">{{ item.Confirm }}</view>
					<button class="action-btn1" @click="viewDetails(item)">查看详情</button>
				</view>
			</view>
		</scroll-view>

		<!-- 弹框：显示报警详细信息 -->
		<view v-if="showModal" class="modal" @click="closeModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">报警详情</text>
					<button class="close-btn" @click="closeModal">×</button>
				</view>
				<view class="modal-body">
					<view><strong>报警名称:</strong> {{ selectedItem.AlarmName }}</view>
					<view><strong>报警时间:</strong> {{ selectedItem.AlarmTime }}</view>
					<view><strong>报警级别:</strong> {{ selectedItem.AlarmLevel }}</view>
					<view><strong>报警位置:</strong> {{ selectedItem.Position }}</view>
					<view><strong>确认状态:</strong> {{ selectedItem.Confirm }}</view>
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
				alarmName: '',
				alertCategories_index: 0,
				selectedAlertCategory: [
					'请选择报警分类',
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
				alertLevels_index: 0,
				alertLevels: ['请选择报警等级', '异常', '正常', '警告', '一般报警', '严重报警'],
				isConfirmed_index: 0,
				isConfirmed: ['请选择是否确认', '确认', '不确认'],
				allData: [],
				startDate: '',
				endDate: '',
				currentPage: 1,
				pageSize: 8, // 每页展示的数据条数
				showModal: false, // 控制弹框显示
				selectedItem: {} // 存储点击查看详情的报警信息
			};
		},
		computed: {
			filteredData() {
				return this.allData.filter(item => {
					const beginDate = new Date(this.startDate); // 用户选择的日期
					const itemstartDate = new Date(item.AlarmTime); // 数据项的开始时间
					const EndDate = new Date(this.endDate); // 用户选择结束的日期
					return (
						(this.alarmName ? item.AlarmName.includes(this.alarmName) : true) &&
						(this.alertCategories_index > 0 ? item.AlarmClass === this.alertCategories[this
							.alertCategories_index] : true) &&
						(this.alertLevels_index > 0 ? item.AlarmLevel === this.alertLevels[this
							.alertLevels_index] : true) &&
						(this.isConfirmed_index > 0 ? item.Confirm === this.isConfirmed[this
							.isConfirmed_index] : true) &&
						(this.startDate ? itemstartDate >= beginDate : true) && // 仅保留开始时间大于等于选择时间的数据
						(this.endDate ? itemstartDate <= EndDate : true)
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
			fetchData() {
				uni.showLoading({
					title: '加载中...', // 显示加载动画
				});
				const apiUrl = 'http://192.168.1.128:3000/data';
				uni.request({
					url: apiUrl,
					method: 'GET',
					success: (res) => {
						if (res.data.success) {
							this.allData = res.data.data;
							console.error('请求数据成功:', this.allData);
						} else {
							console.error('请求数据失败:', res.data.message);
						}
					},
					fail: (err) => {
						console.error('请求失败:', err);
					},
					complete: () => {
						uni.hideLoading(); // 隐藏加载动画
						uni.stopPullDownRefresh(); // 停止下拉刷新动画
					},
				});
			},
			onAlertCategoryChange(e) {
				this.alertCategories_index = parseInt(e.detail.value);
			},
			onAlertLevelChange(e) {
				this.alertLevels_index = parseInt(e.detail.value);
			},

			isConfirmedChange(e) {
				this.isConfirmed_index = parseInt(e.detail.value);
			},
			// 处理开始时间筛选
			onStartDateChange(e) {
				this.startDate = e.detail.value;
			},
			onEndDateChange(e) {
				this.endDate = e.detail.value;
			},
			// 查看详情
			viewDetails(item) {
				this.selectedItem = item; // 将点击的报警数据存储到 selectedItem
				this.showModal = true; // 显示弹框
			},
			closeModal() {
				this.showModal = false; // 关闭弹框
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
		onLoad(options) {
			this.fetchData(); // 加载数据
		},
		onPullDownRefresh() {
			this.fetchData(); // 重新加载数据
		},
	};
</script>

<style>
	.container {
		padding: 5px;
		background: linear-gradient(135deg, #1e1e2f, #292942);
		color: #fff;
		min-height: 100vh;
		font-family: Arial, sans-serif;
	}

	.row {
		display: flex;
		justify-content: space-between;
		/* 三列均匀分布 */
	}

	.column {
		flex: 1;

	}

	.input-group {
		margin-bottom: 10px;
		/* 控件之间的间距 */
	}

	.input,
	.picker {
		text-align: center;
		font-size: 10px;
		height: 30px;
		padding: 0 10px;
		background-color: #2e2e3f;
		border: 1px solid #444;
		border-radius: 5px;
		color: #fff;
	}

	.picker-text {
		text-align: center;
		font-size: 10px;
		line-height: 30px;
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

	.data-row1 {
		display: flex;
		flex-wrap: nowrap;
		/* 子元素在同一行展示 */
		justify-content: space-between;
		margin-top: 6px;
		/* 每行之间增加间距 */
	}

	.data-column1,
	.data-column2,
	.data-column3,
	.data-column4,
	.data-column5,
	.action-btn1 {
		text-align: left;
	}

	.data-column1 {
		width: 30%;
	}

	.data-column2 {
		width: 50%;
	}

	.data-column3 {
		width: 20%;

	}

	.data-column4 {
		width: 30%;
	}

	.data-column5 {
		width: 50%;
		/* 平均分配第二行宽度 */
	}

	.action-btn1 {
		width: 20%;
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