<template>
	<view>
		<view class="dingwei">
			<image src="/static/images/left-arrow.png" @click="goback" class="image" />
		</view>
		
	</view>
</template>

<script>
	export default{
		props: [],
		data(){
			return{
				
			}
		},
		methods:{
			goback(){
				const pages = getCurrentPages();
				if (pages.length === 2) {
					uni.navigateBack({
						delta: 1
					});
				} else if (pages.length === 1) {
					uni.switchTab({
						url: '/',
					})
				} else {
					uni.navigateBack({
						delta: 1
					});
				}
			},
		}
	}
	
</script>

<style lang="scss">
	.image {
		width: 24rpx;
		height: 40rpx;
	}
	.dingwei{
		position: absolute;top: 30rpx;left: 30rpx;z-index: 999
	}
</style>
