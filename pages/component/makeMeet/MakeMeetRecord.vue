<template>
	<view style="padding-bottom: 20px;">
		<nut-empty description="无数据" v-if="emptyShow"></nut-empty>
		<Meeting v-for="(item,index) in makeMeetList" :key="item.id" :item="item"/>
	</view>
</template>

<script setup>
	import Meeting from "/pages/component/makeMeet/Meeting.vue";
	import { utils } from "@/static/js/utils.js";
	import { onReady,onShow } from '@dcloudio/uni-app'
	import { reactive, ref, provide } from "vue";
	const emptyShow = ref(false);
	const makeMeetList = ref([]);
	//是否是上传图片类型 1是  2否 之所以设置这么一个变量，是因为图片上传功能，只要照片上传成功就会自动刷新页面，所以此变量为了阻止这种情况发生
	const isUploadType = ref(2);
	function upIsUploadType (num = 1) {
		isUploadType.value = num;
	}
	//依赖注入
	provide("uploadType",upIsUploadType);
	onShow(() => {
		if (isUploadType.value == 1) {
			return
		}
		uni.showLoading({
			title: '加载中'
		});
		uni.request({
			url: utils.serverUrl + utils.apiPath.getMakeMeetList,
			success: (res) => {
				uni.hideLoading();
				if (res.data.Code != 1) {
					uni.showToast({"title" : res.data.Msg, "icon" : "none"});
				}
				if (res.data.Data.length > 0) {
					emptyShow.value = false;
					makeMeetList.value = res.data.Data;
				}else {
					emptyShow.value = true;
				}			
			},
			fail (resInfo) {
				uni.hideLoading();
				uni.showToast({"title" : "服务器连接失败", "icon" : "error"});
			},
		});
	})
</script>

<style>

</style>
