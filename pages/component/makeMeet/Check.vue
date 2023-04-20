<template>
	<view>
		<nut-empty description="无数据" v-if="emptyShow"></nut-empty>
		<div class="list-div" v-for="(item,index) in list" :key="index">
			<nut-row type="flex" wrap="nowrap">
				<nut-col :span="24">
					<div class="flex-content-time">预定时间：{{ utils.handleMakeMeetTime(item.startTime,item.endTime) }}
					</div>
				</nut-col>
			</nut-row>
			<nut-divider />
			<nut-row type="flex" wrap="nowrap">
				<nut-col :span="8">
					<div class="flex-content">{{ item.mName }}</div>
				</nut-col>
				<nut-col :span="16">
					<div class="flex-content-res">申请人：{{ item.name }}</div>
				</nut-col>
			</nut-row>
			<div style="margin-top: 15px;">
				<nut-row type="flex" wrap="nowrap" :gutter="15">
					<nut-col :span="12">
						<nut-button block type="success" size="small" @click="passed(item.id,index)">通过</nut-button>
					</nut-col>
					<nut-col :span="12">
						<nut-button block type="danger" size="small" @click="openRefuse(index,item.id)">拒绝</nut-button>
						<uni-popup ref="popup" type="dialog">
							<uni-popup-dialog mode="input" @close="close(index)" @confirm="confirm" title="输入内容">
							</uni-popup-dialog>
						</uni-popup>
					</nut-col>
				</nut-row>
			</div>
		</div>
	</view>
</template>
<script setup>
	import {
		ref
	} from "vue";
	import { utils } from '@/static/js/utils.js';
	import {
		onReady,
		onShow
	} from '@dcloudio/uni-app'
	//无数据显示框
	const emptyShow = ref(false);
	const list = ref([]);
	const popup = ref([]);
	let refusePopupKey = 0,
	refuseMakeMeetId = 0;
	onShow(() => {
		uni.showLoading({
			title: '请稍候'
		});
		uni.request({
			url: utils.serverUrl + utils.apiPath.getMakeMeetList,
			data: {"auditStatus" : "1"},
			success: (res) => {
				uni.hideLoading();
				if (res.data.Code != 1) {
					return uni.showToast({
						"title": res.data.Msg,
						"icon": "error"
					});
				}
				if (res.data.Data.length > 0) {
					emptyShow.value = false;
					list.value = res.data.Data;
				}else {
					emptyShow.value = true;
				}	
			}
		});
	});

	function openRefuse(key,id) {
		// 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
		refusePopupKey = key;
		refuseMakeMeetId = id;
		popup.value[key].open()
	}
	/**
	 * 点击取消按钮触发
	 * @param {Object} done
	 */
	function close(key) {
		// TODO 做一些其他的事情，before-close 为true的情况下，手动执行 close 才会关闭对话框
		// ...
		popup.value[key].close()
	}
	/**
	 * 点击确认按钮触发
	 * @param {Object} done
	 * @param {Object} value
	 */
	function confirm(value) {
		// TODO 做一些其他的事情，手动执行 close 才会关闭对话框
		uni.request({
			url: utils.serverUrl + utils.apiPath.refuse,
			data: {
				"id" : refuseMakeMeetId,
				"auditRefuse" : value
			},
			success(res) {
				uni.hideLoading();
				if (res.data.Code != 1) {
					return uni.showToast({
						"title": res.data.Msg,
						"icon": "none"
					});
				}
				//对数组变更，通过splice函数触发更新，因为是响应式数组，数组的任何变动都会自动体现在页面上
				list.value.splice(refusePopupKey, 1);
			}
		})
		popup.value[refusePopupKey].close()
	}
	//通过审核
	function passed(id,key) {
		uni.showLoading({
			title: '请稍候'
		});
		uni.request({
			url: utils.serverUrl + utils.apiPath.passed,
			data: {
				id
			},
			success(res) {
				uni.hideLoading();
				if (res.data.Code != 1) {
					return uni.showToast({
						"title": res.data.Msg,
						"icon": "none"
					});
				}
				//对数组变更，通过splice函数触发更新，因为是响应式数组，数组的任何变动都会自动体现在页面上
				list.value.splice(key, 1);
			}
		})
	}
</script>

<style>
	.list-div {
		padding: 10px;
		border: 1px solid #e5e5e5;
		border-radius: 10px;
		margin: 20px 15px 25px 15px;
		font-size: 14px;
		box-shadow: 0px 0px 10px 0px #007aff;
	}

	.flex-content-time {
		font-size: 12px;
	}

	.flex-content-res {
		text-align: right;
	}
</style>
