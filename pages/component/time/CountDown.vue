<template>
	<view>
		<nut-countdown v-model="countDown.resetTime" :endTime="countDown.end"
			style="display: inline-flex;font-size: 12px;">
			<div class="countdown-part-box">
				<div class="part-item-symbol" v-if="countDown.resetTime.d > 0">{{ countDown.resetTime.d }}天</div>
				<div class="part-item h">{{ countDown.resetTime.h }}</div>
				<span class="part-item-symbol">:</span>
				<div class="part-item m">{{ countDown.resetTime.m }}</div>
				<span class="part-item-symbol">:</span>
				<div class="part-item s">{{ countDown.resetTime.s }}</div>
			</div>
		</nut-countdown>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		toRefs
	} from 'vue';
	const props = defineProps(['countDownTime'])
	// console.log(props.countDownTime);
	//倒计时
	const countDown = reactive({
		end: props.countDownTime,
		resetTime: {
			d: '0',
			h: '00',
			m: '00',
			s: '00'
		}
	});
</script>

<style>
	.countdown-part-box {
		display: flex;
		align-items: center;
	}
	
	.countdown-part-box .part-item {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		background: #e8220e;
		color: #fff;
		font-size: 12px;
		border-radius: 6px;
	}
	
	.countdown-part-box .part-item-symbol {
		margin: 0 5px;
	}
</style>