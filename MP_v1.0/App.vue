<script>
	export default {
		onLaunch() {
			// 启动时检查登录状态
			const isLoggedIn = uni.getStorageSync('isLoggedIn');
			if (!isLoggedIn) {
				// 未登录，跳转到登录页面
				uni.redirectTo({
					url: '/pages/login/login'
				});
			} else {
				// 已登录，不做操作
			}
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>