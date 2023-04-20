<template>
	<view>
		<nut-form :model-value="arr">
			<nut-form-item label="头像" required v-if="isShowHeadNick">
				<button class="avatar-button" open-type="chooseAvatar" @chooseavatar="onChooseAvatar" style="width: 110px;
				height: 110px;padding-left: 0px;padding-right: 0px;display: flex;align-items: center;margin-left: 0px;">
					<image style="width: 100%; border-radius: 5px;" :class="arr.avatarUrl ==''?'avatar-img':'' "
						:src="arr.avatarUrl" mode="aspectFit"></image>
				</button>
			</nut-form-item>
			<nut-form-item label="昵称" required v-if="isShowHeadNick">
				<input type="nickname" class="weui-input" placeholder="请输入昵称" v-model="arr.nickname"
					@blur="onNickname" />
			</nut-form-item>
			<!-- <nut-form-item label="学校" prop="school" required :rules="[{ required: true, message: '请填写学校名称' }]">
				<input class="nut-input-text" placeholder="请输入所属学校" type="text" v-model="arr.school" />
			</nut-form-item> -->
			<nut-form-item label="姓名" prop="name" required :rules="[{ required: true, message: '请填写姓名' }]">
				<input class="nut-input-text" placeholder="请输入姓名" type="text" v-model="arr.name" />
			</nut-form-item>
			<nut-form-item label="手机号" prop="mobile" required :rules="[{ required: true, message: '请填写手机号' }]">
				<input class="nut-input-text" placeholder="请输入联系电话" type="number" v-model="arr.mobile" />
			</nut-form-item>
			<nut-form-item label="工号" prop="number" required :rules="[{ required: true, message: '请填写职工号' }]">
				<input class="nut-input-text" placeholder="请输入职工号" type="text" v-model="arr.number" />
			</nut-form-item>
			<nut-form-item>
				<nut-button block type="primary" @click="userFormSub(arr)">保存</nut-button>
			</nut-form-item>
		</nut-form>
	</view>
</template>
<script setup>
	import {
		reactive,
		ref
	} from "vue";
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		utils
	} from '@/static/js/utils.js';
	const arr = reactive({
		"name": "",
		"mobile": "",
		"number": "",
		"avatarUrl": "",
		"nickname": "",
	});

	// const arr = reactive({
	// 	"name": "欧阳",
	// 	"mobile": "15678945661",
	// 	"number": "123456",
	// 	"avatarUrl": "",
	// 	"nickname": "",
	// });
	//是否显示头像昵称框，默认不显示
	const isShowHeadNick = ref(false);
	//获取用户头像
	function onChooseAvatar(e) {
		utils.pathToBase64(e.detail.avatarUrl).then(base64 => {
			arr.avatarUrl = base64;
		}).catch(error => {
			console.error(error)
		})
	}
	//监听昵称变化
	function onNickname(e) {
		arr.nickname = e.detail.value;
	}
	//创建用户
	function createUser(field) {
		let requestParam = {
			url: utils.serverUrl + utils.apiPath.register,
			data: field,
			method: "POST",
			header: {
				'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
			},
			success: (res) => {
				uni.hideLoading();
				if (res.data.Code != 1) {
					return uni.showToast({
						"title": res.data.Msg,
						"icon": "error"
					});
				}
				uni.showToast({
					"title": res.data.Msg,
					"icon": "success"
				});
				let data = JSON.parse(res.data.Data);
				data = {
					...data,
					"expiredTime": utils.expiredTime
				};
				//添加本地缓存
				utils.setCache({
					"user": data
				});
				clearInterval(getApp().globalData.setInterval);
				utils.timerLoginStatus();
				//500毫秒后返回上一页面
				setTimeout(function() {
					uni.navigateBack({
						delta: 1
					});
				}, 500);
			},
			fail: (res) => {
				uni.hideLoading();
				uni.showToast({
					"title": "服务器连接失败",
					"icon": "error"
				});
			}
		};
		utils.getCode((code) => {
			requestParam.data = {
				...requestParam.data,
				code
			};
			uni.request(requestParam);
		})
	}
	//更新用户
	function upDateUser(field) {
		field = {...field,"id" : utils.getCache("user").ID}
		let requestParam = {
			url: utils.serverUrl + utils.apiPath.upUser,
			data: field,
			method: "POST",
			success: (res) => {
				uni.hideLoading();
				if (res.data.Code != 1) {
					return uni.showToast({
						"title": res.data.Msg,
						"icon": "error"
					});
				}
				uni.showToast({
					"title": res.data.Msg,
					"icon": "success"
				});
				let {keys} = Object;
				let data = utils.getCache("user");
				for (let key of keys(field)) {
					data[key] = field[key]
				}
				//添加本地缓存
				utils.setCache({
					"user": data
				});
				//500毫秒后返回上一页面
				setTimeout(function() {
					uni.navigateBack({
						delta: 1
					});
				}, 500);
			},
			fail: (res) => {
				uni.hideLoading();
				uni.showToast({
					"title": "服务器连接失败",
					"icon": "error"
				});
			}
		};
		uni.request(requestParam);
	}
	//提交表单信息
	function userFormSub(arr) {
		uni.showLoading({
			title: '加载中'
		});
		let field = {
			"name": arr.name,
			"mobile": arr.mobile,
			"jobNumber": arr.number,
			"avatarUrl": arr.avatarUrl,
			"nickname": arr.nickname,
		};
		let user = utils.getCache("user");
		if (user != "" && user.ID > 0) {
			upDateUser(field);
		}else {
			createUser(field)
		}
	}

	onLoad(() => {
		// isShowHeadNick.value = true;
		let userInfo = utils.getCache("user");
		arr.name = userInfo.name;
		arr.mobile = userInfo.mobile;
		arr.number = userInfo.jobNumber;
	});
</script>
<style>

</style>
