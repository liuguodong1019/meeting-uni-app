<template>
	<nut-form>
		<nut-form-item label="会议室" required>
			<picker mode="selector" :value="meet" :range="meetArray" @change="bindMeetChange">
				<view class="uni-input" style="color: black;">{{meetArray[meet]}}</view>
			</picker>
		</nut-form-item>
		<nut-form-item label="预约日期" required class="skystars">
			<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
				<view class="uni-input" style="color: black;">{{date}}</view>
			</picker>
			
			<!-- <view class="makeMeeting">
				<uni-datetime-picker type="date" :clear-icon="false" :border="false" v-model="date"/>
			</view> -->
		</nut-form-item>
		<nut-form-item label="开始时间" required>
			<picker mode="time" :value="startTime" @change="bindTimeChangeStart">
				<view class="uni-input" style="color: black;">{{startTime}}</view>
			</picker>
		</nut-form-item>
		<nut-form-item label="结束时间" required>
			<picker mode="time" :value="endTime" @change="bindTimeChangeEnd">
				<view class="uni-input" style="color: black;">{{endTime}}</view>
			</picker>
		</nut-form-item>
		<nut-form-item label="参会人数" prop="attendance" required :rules="[{ required: true, message: '请填写人数' }]">
			<input class="nut-input-text" placeholder="请填写人数" type="number" v-model="attendance" />
		</nut-form-item>
		<nut-form-item label="备注" prop="remark" required>
			<input class="nut-input-text" type="text" v-model="remark" placeholder="请填写备注信息" />
		</nut-form-item>
		<nut-form-item>
			<nut-button block type="primary" @click="submit">提交</nut-button>
		</nut-form-item>
	</nut-form>
</template>
<script setup>
	import {
		ref,
		reactive,
		inject,
		provide
	} from 'vue';
	import {
		onReady,
		onShow
	} from '@dcloudio/uni-app'
	import { utils } from '@/static/js/utils.js';
	var midArray = [],
		mid = 0;
	//文档地址:https://uniapp.dcloud.net.cn/tutorial/page.html#lifecycle
	//页面初次渲染触发,渲染会议室列表
	onReady(() => {
		utils.getMeetList(function(meeting) {
			let m = ["请选择"];
			for (let elem of meeting.values()) {
				m.push(elem['mName']);
				midArray.push(elem['ID']);
			}
			meetArray.value = m;
		});
	});
	// //每次切换到页面都会触发
	// onShow(() => {
	// 	console.log('我是show')
	// });

	const meet = ref(0);
	const meetArray = ref([]);
	//选择会议室触发
	const bindMeetChange = (e) => {
		mid = midArray[e.detail.value - 1];
		meet.value = e.detail.value
	}
	const currentDate = utils.getDate({
		format: true
	});
	//开始日期
	const startDate = ref(utils.getDate());
	//结束日期
	const endDate = ref(utils.getDate('end'));
	//现在日期
	const date = ref(currentDate);
	//开始时间
	const startTime = ref(utils.getTime());
	//结束时间
	const endTime = ref(utils.getTime());
	//选择日期触发
	function bindDateChange(e) {
		date.value = e.detail.value;
	}
	//选择开始时间触发
	function bindTimeChangeStart(e) {
		startTime.value = e.detail.value
	}
	//选择结束时间触发
	function bindTimeChangeEnd(e) {
		endTime.value = e.detail.value
	}
	//备注
	let remark = ref('暂无'),
		//参会人数
		attendance = ref(1);

	//提交
	function submit() {
		uni.showLoading({
			title: '请稍候'
		});
		if (mid <= 0) {
			return errAlert("请选择会议室");
		}
		if (endTime.value == "00:00" || endTime.value <= startTime.value) {
			return errAlert("请重新选择结束时间");
		}
		var arr = {
			"meetId": mid,
			"userId": utils.getCache("user").ID,
			"startDate": date.value,
			"startTime": +new Date(date.value + ' ' + startTime.value),
			"endTime": +new Date(date.value + ' ' + endTime.value),
			"number": attendance.value,
			"remark": remark.value
		};
		let requestParam = {
			url: utils.serverUrl + utils.apiPath.makeMeet,
			data: arr,
			success: (res) => {
				uni.hideLoading();
				if (res.data.Code != 1) {
					uni.showToast({
						"title": res.data.Msg,
						"icon": "none"
					});
				} else {
					uni.showToast({
						"title": "预定成功",
						"icon": "success"
					});
				}
			}
		};
		uni.request(requestParam);
	}

	function errAlert(title = '') {
		uni.hideLoading();
		uni.showToast({
			"title": title,
			"icon": "none"
		});
	}
</script>
