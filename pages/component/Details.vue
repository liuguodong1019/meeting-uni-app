<template>
	<view style="padding-bottom: 20px;">
		<Calendar />
	</view>
</template>
<script setup>
	import {
		reactive,
		ref,
		provide
	} from "vue";
	import { onReady,onShow,onLoad } from '@dcloudio/uni-app'
	
	import Calendar from "/pages/component/makeMeet/Calendar.vue";
	// import CreateMeetingRoom from "/pages/component/CreateMeetingRoom.vue";
	import { utils } from "@/static/js/utils.js";
	const items = reactive(['会议', '预约', '更新']);
	const current = ref(0);
	const activeColor = ref('#007aff');
	const styleType = ref('text');
	//tab切换
	function onClickItem(e) {
		if (current.value !== e.currentIndex) {
			current.value = e.currentIndex
		}
	}
	const mid = ref(0);
	//依赖注入
	provide("mid",mid);
	onLoad((option) => {
		mid.value = option.id;
		
		// getCalendarMeeting();
		// console.log(mid.value);
	});
	//是否展示Meeting组件
	const isShowMeeting = ref(false);
	//查询会议室id为mid的所有审核状态为审核中和审核通过的会议
	function getCalendarMeeting () {
		let requestParam = {
			url: utils.serverUrl + utils.apiPath.getMakeMeetList,
			data: {
				"meetId" : mid.value,
				"notEqAuditStatus" : 3
			},
			success: (res) => {
				console.log(res.data);
			// 	uni.hideLoading();
			// 	if (res.data.Code == 2) {
			// 		uni.showToast({"title" : res.data.Msg, "icon" : "error"});
			// 		return
			// 	}
			},
			// fail (resInfo) {
			// 	uni.hideLoading();
			// 	uni.showToast({"title" : "服务器连接失败", "icon" : "error"});
			// },
		};
		uni.request(requestParam);
	}
	
	
	//日历相关事件
	const info = reactive({
		lunar: true,
		range: true,
		insert: false,
		selected: [
			{date : "2023-03-15", info : "有约"},
			{date : "2023-03-17", info : "有约"},
			{date : "2023-03-18", info : "有约", data : {custom : "自定义信息", name : "自定义消息头"}},
			{date : "2023-03-19", info : "有约"},
			{date : "2023-04-18", info : "有约"},
		]
	});
	
	function change(e) {
		console.log('change 返回:', e)
		// 模拟动态打卡
		if (info.selected.length > 5) return
		info.selected.push({
			date: e.fulldate,
			// info: '打卡'
		})
	}
	//切换月份触发
	function monthSwitch(e) {
		console.log('monthSwitchs 返回:', e)
	}
</script>
