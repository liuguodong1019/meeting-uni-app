<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			// clearInterval(getApp().globalData.setInterval);
			// getApp().globalData.setInterval = '';
			console.log('App Hide')
		}
	}
</script>
<style lang="scss">
	@import '@/uni_modules/sky-nutui/components/sky-nutui/app.scss';
	/*每个页面公共css */
	
	//预约会议室页面的预约日期选择框
	.makeMeeting .uni-date__x-input {
		height: 20px;
		line-height: unset;
	}
</style>
