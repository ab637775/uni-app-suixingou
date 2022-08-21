<script>
	import routingIntercept from '@/utils/permission.js'
	export default {
		onLaunch: function() {
		// 初始化用户数据，判断是否已经登录
			this.$store.commit('initUserInfo')
			routingIntercept()
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
	@import '@/common/uni.css';
	@import '@/static/iconfont/iconfont.css';
	@import '@/common/common.css';
	/* @import "@/uni_modules/uview-ui/theme.scss"; */
</style>
