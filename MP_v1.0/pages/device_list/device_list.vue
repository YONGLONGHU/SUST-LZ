<template>
	<view class="container">
		<!-- 标题 -->
		<view class="header">
			<text class="title">智能机器人</text>
		</view>
		<view class="header">
			<text class="subtitle">ROBOT</text>
		</view>

		<!-- 中间按钮区域 -->
		<view class="button-list">
			<view class="button-item" @tap="navigateTo('gg_robot')">
				<text class="button-text">挂轨机器人</text>
				<image src="/static/icons/robot1.png" class="icon"></image>
			</view>
			<view class="button-item" @tap="navigateTo('pb_robot')">
				<text class="button-text">平板机器人</text>
				<image src="/static/icons/robot2.png" class="icon"></image>
			</view>
			<view class="button-item" @tap="navigateTo('ls_robot')">
				<text class="button-text">轮式机器人</text>
				<image src="/static/icons/robot3.png" class="icon"></image>
			</view>
			<view class="button-item" @tap="navigateTo('roomba')">
				<text class="button-text">Roomba s9</text>
				<image src="/static/icons/robot4.png" class="icon"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onShow() {
			//检查用户是否登录
			const isLoggedIn = uni.getStorageSync('isLoggedIn');
			if (!isLoggedIn) {
				// 如果未登录，跳转到登录页面
				uni.redirectTo({
					url: '/pages/login/login'
				});
			}
		},
		methods: {
			navigateTo(page) {
				uni.navigateTo({
					url: `/pages/${page}/${page}`
				});
			}
		}
	};
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: linear-gradient(135deg, #1e1e2f, #292942);
		height: 100vh;
	}

	.header {
		margin-top: 20px;
		text-align: center;
	}

	.title {
		font-size: 24px;
		font-weight: bold;
		color: lightgoldenrodyellow;
	}

	.subtitle {
		font-size: 18px;
		color: lightgoldenrodyellow;
		margin-top: 5px;
	}

	.button-list {
		margin-top: 20px;
		width: 90%;
	}

	.button-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
		background: rgba(255, 255, 255, 0.1);
		padding: 10px;
		border-radius: 20px;
		margin-bottom: 15px;
	}

	.button-text {
		font-size: 18px;
		/* 调整字体大小 */
		font-weight: bold;
		/* 加粗字体 */
		color: #fff;
	}

	.icon {
		width: 40px;
		height: 40px;
	}
</style>