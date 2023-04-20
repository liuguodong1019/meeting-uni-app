<template>
	<view class="calendar-content">
		<view>
			<!-- 插入模式 -->
			<uni-calendar class="uni-calendar--hook" :selected="info.selected" :showMonth="false" @change="change"
				@monthSwitch="monthSwitch" />
		</view>
		<view>
			<nut-button block type="primary" @click="showAllMeet">显示全部</nut-button>
		</view>
		<view>
			<Meeting v-for="(item,index) in meetingArr" :key="item.id" :item="item"/>
		</view>
	</view>
</template>
<script setup>
	import {
		reactive,
		ref,
		inject,
		provide
	} from "vue";
	import Meeting from "/pages/component/makeMeet/Meeting.vue";
	import { onReady,onShow } from '@dcloudio/uni-app'
	import { utils } from "@/static/js/utils.js";
	const mid = inject('mid')
	const meetingArr = ref([]);
	var meetData = [];
	//是否是上传图片类型 1是  2否 之所以设置这么一个变量，是因为图片上传功能，只要照片上传成功就会自动刷新页面，所以此变量为了阻止这种情况发生
	const isUploadType = ref(2);
	function upIsUploadType (num = 1) {
		isUploadType.value = num;
	}
	//依赖注入
	provide("uploadType",upIsUploadType);
	onShow(() => {
		getCalendarMeeting();
	});
	const info = reactive({
		lunar: true,
		range: true,
		insert: false,
		selected: []
	});
	//日历选择某一天触发
	function change(e) {
		// console.log('change 返回:', e.fulldate)
		let selectd = [];
		for (let elem  of meetData.values()) {
			if (elem.startDate == e.fulldate) {
				selectd.push(elem);
			}	
		}
		meetingArr.value = selectd;
	}
	//切换月份触发
	function monthSwitch(e) {
		console.log('monthSwitchs 返回:', e)
	}
	//显示全部
	function showAllMeet () {
		meetingArr.value = meetData;
	}
	//查询会议室id为mid的所有审核状态为审核中和审核通过的会议
	function getCalendarMeeting () {
		if (isUploadType.value == 1) {
			return
		}
		uni.showLoading({
			title: '加载中'
		});
		let requestParam = {
			url: utils.serverUrl + utils.apiPath.activeMakeMeet,
			data: {
				"meetId" : mid.value,
			},
			success: (res) => {
				uni.hideLoading();
				if (res.data.Code != 1) {
					uni.showToast({"title" : res.data.Msg, "icon" : "error"});
					return
				}
				meetData = res.data.Data;
				meetingArr.value = res.data.Data;
				let dateSelected = [];
				for (let elem of res.data.Data.values()) {
					dateSelected.push({
						date : elem.startDate,
						info : "有约",
					});					
				}
				info.selected = dateSelected;
			},
			fail (resInfo) {
				uni.hideLoading();
				uni.showToast({"title" : "服务器连接失败", "icon" : "error"});
			},
		};
		uni.request(requestParam);
	}
</script>
