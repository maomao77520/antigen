<template>
	<view class="top">
		<u-cell-group>
			<u-cell-item v-for="(item,index) in list" icon="setting-fill" :title="item.feedback.substring(0,10) + '.....'" :value="item.createTime" @click="goTo(item)"></u-cell-item>
		</u-cell-group>
		<view class="nodata" v-if="list.length == 0"><image class="nodata-img" src="/static/images/nodata.png" mode="widthFix"></image></view>
	</view>
</template>

<script>
	import ServiceApi from '@/api/api.js'
	export default {
		data() {
			return {
				list: [],
				page: 1,
				pageSize: 10,
				totleData: 0
			};
		},
		onLoad() {
			this.getData()
		},
		methods: {
			getData() {
				let param = {
					page: this.page - 1,
					size: this.pageSize
				};
				uni.showLoading()
				let that = this
				
				ServiceApi.getFeedbackRecord(param)
					.then(res => {
						uni.hideLoading()
						if (res.data.result) {
							that.list = res.data.result.content;
							that.totleData = res.data.result.totalElements;
						}
					})
					.catch(err => {
						uni.hideLoading()
						uni.showToast({
							icon: 'none',
							title: err
						});
					});
			},
			goTo(item){
				uni.navigateTo({
					url:'./feedbackDetail?id=' + item.id
				})
			}
		}
	};
</script>
<style>
.page {
	background-color: #f9f9f9 !important;
	height: 100vh !important;
}
</style>
<style scoped lang="scss">
	.top{
		margin: 20rpx;
	}
	.nodata {
		display: flex;
		justify-content: center;
		margin: 60rpx;
	}
	.nodata-img {
		width: 300rpx;
	}
</style>