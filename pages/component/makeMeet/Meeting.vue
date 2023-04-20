<template>
	<view style="margin: 20px 15px 5px 15px;box-shadow: rgb(0 0 0 / 8%) 0px 0px 3px 2px;border-radius: 5px;">
		<view class="metting-list-div" style="padding: 10px 20px 10px 20px;">
			<uni-row class="demo-uni-row">
				<uni-col :span="12">
					<view class="demo-uni-col dark">
						<view style="font-size: 15px;">{{ item.mName }}</view>
						<view style="font-size: 12px; color: #999;margin-top: 5px;">{{ item.onState }}</view>
					</view>
				</uni-col>
				<uni-col :span="12">
					<view class="demo-uni-col light">
						<view style="font-size: 14px;text-align: right;line-height: 40px;">{{ item.name }}</view>
					</view>
				</uni-col>
			</uni-row>
		</view>
		<view style="border-top: 1px solid #d5d5d6;margin: 0px 10px 0 10px;"></view>
		<view class="metting-list-div" style="padding: 10px 20px 10px 20px;">
			<uni-row class="demo-uni-row">
				<uni-col :span="24">
					<view class="demo-uni-col" style="font-size: 13px;">
						<!-- 预约时间：{{ item.startDate }} {{ item.startTime }} ~ {{ item.endTime }} -->
						预约时间：{{ utils.handleMakeMeetTime(item.startTime,item.endTime) }}
					</view>
				</uni-col>
			</uni-row>
		</view>
		<view style="border-top: 1px solid #d5d5d6;margin: 0px 10px 0 10px;"></view>
		<view class="metting-list-div" style="padding: 10px 20px 10px 20px;">
			<uni-row class="demo-uni-row">
				<uni-col :span="10">
					<view class="demo-uni-col"
						:style="{'font-size': '15px','font-weight': 900,color: auditStatusColor(item.auditStatus)}">
						{{ item.auditStatus }}
					</view>
				</uni-col>
				<uni-col :span="14">
					<view class="demo-uni-col" style="text-align: right;">
						<!-- 开会已结束还没上传照片 -->
						<nut-button size="mini" type="primary" icon="photograph" block @click="upload(item.id)"
							v-if="handleBtnShow(item)">
							上传图片
						</nut-button>

						<!-- 开会已结束并上传结束后的会议室照片 -->
						<nut-button size="mini" type="info" icon="image" block @click="showFn(item.id)"
							v-if="item.isUploadImg == '1'">
							查看图片
						</nut-button>

						<!-- 倒计时组件 -->
						<CountDown :key="item.id" :countDownTime="item.endTime"
							v-if="item.onState != '已结束' && item.auditStatus != '审核不通过'" />

						<!-- 审核不通过弹框 -->
						<view v-if="item.auditStatus == '审核不通过'">
							<nut-button type="default" size="mini" block @click="componentClick">原因</nut-button>
							<nut-dialog :noCancelBtn="nut_dialog" :noOkBtn="nut_dialog"
								:closeOnClickOverlay="nut_dialog" title="未通过原因" :content="item.auditRefuse"
								v-model:visible="visible">
							</nut-dialog>
						</view>

					</view>
				</uni-col>
			</uni-row>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		toRefs,
		inject
	} from 'vue';
	import {
		utils
	} from "@/static/js/utils.js";
	import {
		onReady,
		onShow
	} from '@dcloudio/uni-app'
	import CountDown from "/pages/component/time/CountDown.vue";
	//使用依赖注入
	const upIsUploadType = inject('uploadType')
	//props传递
	const props = defineProps(['item'])

	//处理上传图片按钮是否显示
	function handleBtnShow(item) {
		//只有自己预约的会议室使用结束后才可以上传图片，别人不可以
		if (item.isUploadImg == '2' && item.onState == '已结束' && item.auditStatus == "审核通过" && item.userId == utils
			.getCache("user").ID) {
			return true;
		}
	}
	//不同的审核状态展示不同的颜色
	function auditStatusColor(auditStatus) {
		if (auditStatus == '审核不通过') {
			return 'red';
		}
		if (auditStatus == '审核通过') {
			return 'green';
		}
		if (auditStatus == '待审核') {
			return 'blue';
		}
	}
	//审核不通过弹框控件  不显示取消、确定、关闭弹框按钮
	const nut_dialog = ref(true);
	//审核未通过 弹出框
	const visible = ref(false);
	const componentClick = () => {
		visible.value = true;
	};

	//查看图片
	const showFn = (makeMeetId) => {
		upIsUploadType(1);
		uni.showLoading({
			title: '请稍候'
		});
		uni.request({
			url: utils.serverUrl + utils.apiPath.meet_img,
			data: {
				makeMeetId
			},
			success: (res) => {
				uni.hideLoading();
				if (res.data.Code != 1) {
					return uni.showToast({
						"title": "图片获取失败",
						"icon": "error"
					});
				}
				if (res.data.Data == null) {
					return uni.showToast({
						"title": "暂无图片",
						"icon": "success"
					});
				}
				previewImage(res.data.Data);
			}
		});
	}
	// 预览图片
	function previewImage(info) {
		for (let [index, elem] of info.entries()) {
			info[index] = utils.serverUrl + elem;
		}
		// 预览图片
		uni.previewImage({
			urls: info,
			longPressActions: {
				itemList: ['发送给朋友', '保存图片', '收藏'],
			}
		});
	}
	//上传图片
	function upload(makeMeetId) {
		upIsUploadType(1);
		uni.chooseImage({
			count: 3, //最多上传三张
			// sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album'], //从相册选择
			success: (chooseImageRes) => {
				uni.showLoading({
					title: '请稍候'
				});
				const tempFilePaths = chooseImageRes.tempFilePaths;
				let arr = [];
				for (let [index, elem] of tempFilePaths.entries()) {
					uni.uploadFile({
						url: utils.serverUrl + utils.apiPath.createMakeMeetImg,
						filePath: elem,
						name: 'file',
						formData: {
							makeMeetId,
							"createId": utils.getCache("user").ID
						},
						success: (uploadFileRes) => {
							let info = JSON.parse(uploadFileRes.data);
							arr.push(info.Data);
							upIsUploadType(2);
						}
					});
				}
				setTimeout(function() {
					uni.hideLoading();
					if (tempFilePaths.length == arr.length) {
						uni.showToast({
							"title": "上传成功",
							"icon": "success"
						});
						props.item.isUploadImg = 1;
					}
				}, 5000);
			},
		});
	}
</script>
