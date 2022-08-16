<template>
	<view class="page">
		<!-- <goback></goback> -->
		<image v-if="type" :src="unitInstruction" style="width: 100%;"
			mode="widthFix"></image>
		<image v-else :src="myInstruction" style="width: 100%;"
			mode="widthFix"></image>
	</view>
</template>

<script>
	import {
		reportCmPV
	} from '@/utils/cloudMonitorHelper';
	export default {
		data() {
			return {
				type: false,
				// #ifdef MP-ALIPAY
				myInstruction: 'https://h5.dingjie-jr.com/ap/20220419/img_shiyongshouce.jpg',//个人自测
				unitInstruction: 'https://h5.dingjie-jr.com/ap/20220419/img_shiyongzhinan.png',//单位创建说明
				// #endif
				// #ifdef H5
				myInstruction: 'https://h5.dingjie-jr.com/antigen/zgt_wx_instructions.jpg',//个人自测
				unitInstruction: 'https://h5.dingjie-jr.com/antigen/zgt_unit_instructions.jpg',//单位创建说明
				// #endif
			};
		},
		onLoad(e) {
			// #ifdef MP-ALIPAY
			reportCmPV({ title: '使用指南', e});
			// #endif
			console.log(e);
			if (e.type == 'cz') {
				this.type = true
			} else {
				this.type = false
			}
		}
	};
</script>

<style scoped lang="scss">
	.page {
		background-color: #f9f9f9;
		width: 100%;
		overflow-y: auto;
		height: 100vh;
	}
</style>
