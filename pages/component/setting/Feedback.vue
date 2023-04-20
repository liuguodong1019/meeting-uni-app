<template>
	<view class="">
		<form style="display: flex;justify-content: center;">
			<view class="uni-form-item uni-column">
				<view class="uni-textarea">
					<textarea placeholder="请输入反馈内容,限制140字"
						style="border: 1px solid #ccc;border-radius: 5px;margin-top: 15px;" v-model="textVal"/>
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<view>
					<button type="warn" form-type="submit" style="margin-top: 20px;
					background: linear-gradient(135deg, #fa2c19 0%, #fa6419 100%);
					border-radius: 25px;" @click="submit">提交</button>
				</view>
			</view>
		</form>
	</view>
</template>

<script setup>
import { ref } from "vue";
import { utils } from "../../../static/js/utils.js";
	const textVal = ref('');
	function submit() {
		uni.request({
			url: utils.serverUrl + utils.apiPath.feedback,
			method:"POST",
			data: {
				"userId" : utils.getCache("user").ID,
				"content" : textVal.value
			},
			success: (res) => {
				uni.showToast({
					"title": "反馈成功",
					"icon": "success"
				});
				setTimeout(function() {
					uni.navigateBack();
				},500)
			}
		});	
	}
</script>

<style>
</style>
