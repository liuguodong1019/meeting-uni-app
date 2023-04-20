<template>
	<view class="">
		<uni-grid :column="3" :highlight="true">
			<uni-grid-item :index="index" v-for="(item,index) in meetList" :key="index">
				<view class="grid-item-box" style="background-color: #fff;">
					<view style="display: contents;" @click="meeting(item.ID)">
						<nut-icon name="order" color="#fa2c19" size="40"></nut-icon>
						<text class="text">{{ item.mName }}</text>
					</view>
					<view class="grid-dot" @click="del(item.ID)" v-if="handleBtn">
						<uni-icons type="trash" :size="25" color="#777" />
					</view>
				</view>
			</uni-grid-item>
			<uni-grid-item index="-1" v-if="handleBtn">
				<view class="grid-item-box" style="background-color: #fff;">
					<nut-icon name="uploader" color="#ccc" size="40" @click="createRoom"></nut-icon>
				</view>
			</uni-grid-item>
		</uni-grid>
	</view>

</template>
<script setup>
	import {
		reactive, ref
	} from "vue";
	import { onReady,onShow } from '@dcloudio/uni-app'
	import { utils } from '../../static/js/utils.js';
	const meetList = ref([]);
	onReady(() => {
		meetList.value = utils.getCache("meetList");
		judgeBtnShow();
	});
	//点击某个会议室触发
	const meeting = (id) => {
		uni.navigateTo({
			url: '../component/Details?id='+id,
		});
		// console.log(id)
	}
	const handleBtn = ref(false);
	//是否展示删除按钮
	function judgeBtnShow() {
		if (utils.getCache("user").roleAlias != "admin") {
			handleBtn.value = false;
		}else {
			handleBtn.value = true;
		}
	}
	//删除会议室
	function del (id) {
		if (utils.getCache("user").roleAlias != "admin") {
			uni.showToast({title:"没有权限",icon: 'error'});
			return
		}
		uni.showToast({title:`删除${id}会议室`,icon: 'none'});
	}
	//创建会议室
	const createRoom = () => {
		if (utils.getCache("user").roleAlias != "admin") {
			uni.showToast({title:"没有权限",icon: 'error'});
			return
		}
		uni.navigateTo({
			url: '../component/CreateMeetingRoom',
			events: {
				// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
				acceptDataFromOpenedPage: function(data) {
					console.log(data)
				},
				someEvent: function(data) {
					console.log(data)
				},
			},
			success: function(res) {
				// 通过eventChannel向被打开页面传送数据
				res.eventChannel.emit('acceptDataFromOpenerPage', {
					data: '66666'
				})
			}
		});
	};
</script>
<style lang="scss">
	.image {
		width: 25px;
		height: 25px;
	}

	.text {
		font-size: 14px;
		margin-top: 5px;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		// display: block;
		/* #endif */
	}

	.grid-dynamic-box {
		margin-bottom: 15px;
	}

	.grid-item-box {
		flex: 1;
		// position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15px 0;
	}

	.grid-item-box-row {
		flex: 1;
		// position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 15px 0;
	}

	.grid-dot {
		position: absolute;
		// top: 5px;
		// right: 15px;
		top: 0px;
		right: 0px;
	}

	.swiper {
		height: 420px;
	}

	/* #ifdef H5 */
	@media screen and (min-width: 768px) and (max-width: 1425px) {
		.swiper {
			height: 630px;
		}
	}

	@media screen and (min-width: 1425px) {
		.swiper {
			height: 830px;
		}
	}

	/* #endif */
</style>
