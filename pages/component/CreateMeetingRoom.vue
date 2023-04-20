<template>
	<view>
		<nut-form>
			<nut-form-item label="名称" required>
				<input class="nut-input-text" placeholder="请输入会议室名称" type="text" />
			</nut-form-item>
			<nut-form-item label="审核" required>
				<nut-radiogroup direction="horizontal" v-model="radioVal">
					<nut-radio label="1">是</nut-radio>
					<nut-radio label="2">否</nut-radio>
				</nut-radiogroup>
			</nut-form-item>
			<nut-form-item label="审核人" required>
				<input class="nut-input-text" placeholder="请选择审核人" type="text" :value="desc" @click="()=>{show=true}" disabled/>
				<nut-picker v-model:visible="show" :columns="columns" title="审核人选择" @change="change" @confirm="confirm">
				</nut-picker>
			</nut-form-item>
			<nut-form-item label="备注" required>
				<input class="nut-input-text" placeholder="请输入备注" type="text" />
			</nut-form-item>
			<nut-form-item>
				<nut-button block type="primary">提交</nut-button>
			</nut-form-item>
		</nut-form>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	const radioVal = ref('1');
	const show = ref(false);
	const desc = ref('');
	const columns = ref([{
			text: '南京市',
			value: 'NanJing'
		},
		{
			text: '无锡市',
			value: 'WuXi'
		},
		{
			text: '海北藏族自治区',
			value: 'ZangZu'
		},
		{
			text: '北京市',
			value: 'BeiJing'
		},
		{
			text: '连云港市',
			value: 'LianYunGang'
		},
		{
			text: '浙江市',
			value: 'ZheJiang'
		},
		{
			text: '江苏市',
			value: 'JiangSu'
		}
	]);

	const confirm = ({
		selectedValue,
		selectedOptions
	}) => {
		desc.value = selectedValue.join(',');
		console.log(desc.value);
	}
	const change = ({
		selectedValue,
		selectedOptions
	}) => {
		console.log(selectedValue);
	};
</script>

<style>

</style>
