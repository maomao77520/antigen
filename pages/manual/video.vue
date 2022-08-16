<template>
	<view class="page">
		<!-- <goback></goback> -->
		<video src="https://h5.dingjie-jr.com/ap/20220419/1650422556017130.mp4" autoplay="true"></video>
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
			};
		},
		onLoad(e) {
			// #ifdef MP-ALIPAY
			reportCmPV({ title: '视频教程', e});
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
		width: 100vw;
		overflow-y: auto;
		height: 100vh;
	}

	video {
		width: 100vw;
		height: 100vh;
	}
</style>
