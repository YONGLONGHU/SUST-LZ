<template>
	<view class="container">
		<!-- 用户信息 -->
		<view class="user-info">
			<view class="item">
				<text class="label">账号名称</text>
				<text class="value">量子智能助手</text>
			</view>
			<view class="item">
				<text class="label">手机号</text>
				<text class="value">15826263010</text>
			</view>
		</view>

		<!-- 退出登录按钮 -->
		<view class="logout">
			<button class="logout-btn" @click="logout">退出登录</button>
		</view>
	</view>
</template>


<script>
	export default {
		methods: {
			// 退出登录方法
			logout() {
				// 清除用户登录状态
				uni.removeStorageSync('isLoggedIn');
				// 跳转到登录页面
				uni.navigateTo({
					url: '/pages/login/login' // 确保路径正确
				});
			}
		}
	};
</script>

<style>
	/* 页面容器 */
	.container {
		padding: 20rpx;
		background-color: #f8f8f8;
		height: 100%;
	}

	/* 用户信息部分 */
	.user-info {
		background-color: #ffffff;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
		padding: 30rpx;
	}

	/* 用户信息每一项 */
	.item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	/* 标签文字 */
	.label {
		font-size: 28rpx;
		color: #666666;
	}

	/* 值文字 */
	.value {
		font-size: 28rpx;
		color: #333333;
		font-weight: bold;
	}

	/* 退出登录按钮 */
	.logout {
		margin-top: 30rpx;
	}

	.logout-btn {
		background-color: #4caf50;
		color: white;
		font-size: 30rpx;
		padding: 20rpx;
		width: 100%;
		border-radius: 50rpx;
		border: none;
	}
</style>