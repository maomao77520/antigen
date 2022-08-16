<template>
	<view class="flex-col page">
		<view class="flex-col group_4">
			<view class="flex-col">
				<view class="flex-col section_1">
					<view class="group_6">
						<text class="text_2">*</text>
						<text class="text_3">建议反馈</text>
					</view>
					<textarea class="text_4" maxlength="500" v-model="textarea" placeholder="请详细描述您的建议及优化/改进方案（0/500字）"
						placeholder-class="input-place"/>
				</view>
				<view class="justify-between section_2">
					<text class="text_5">联系方式</text>
					<view class="flex-row group_7">
						<input class="ginput" type="number" maxlength="11" v-model="phone"
							placeholder="为了更好服务，请留下您的联系方式" placeholder-class="input-place" />
					</view>
				</view>
			</view>
			<view @click="submit()" class="flex-col items-center button">
				<text>提交</text>
			</view>
		</view>
	</view>
</template>

<script>
	import ServiceApi from '@/api/api.js'
	export default {
		data() {
			return {
				textarea: '',
				phone: ''
			};
		},
		methods: {
			submit() {
				if (!this.textarea) {
					uni.showToast({
						title: '请输入内容',
						icon: 'none'
					});
					return;
				}
				if(this.textarea.length<10){
					uni.showToast({
						title: '内容不少于10个字',
						icon: 'none'
					});
					return;
				}
				if(this.textarea.length>500){
					uni.showToast({
						title: '内容不多于500个字',
						icon: 'none'
					});
					return;
				}
				
				if (!this.phone) {
					uni.showToast({
						title: '请输入联系方式',
						icon: 'none'
					});
					return;
				}
				
				let that = this
				const params = {
					contactInformation: this.phone,
					feedback: this.textarea
				}
				uni.showLoading()
				ServiceApi.addFeedback(params).then(resp=>{
					console.info("addFeedback_resp="+resp)
					uni.hideLoading()
					if(resp.data.status == 200){
						uni.showToast({
							title: '提交成功',
							success: function (res) {
								that.textarea = ''
								that.phone = ''
								setTimeout(() => {
									uni.navigateBack({
										delta: 1
									})
								},1200)
							}
						});
					}else{
						uni.showToast({
							title: '添加失败',
							duration: 2000,
							icon: 'error'
						});
					}
				})
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

	.group_4 {
		padding-bottom: 288rpx;
		flex: 1 1 auto;
		overflow-y: auto;
	}

	.button {
		margin: 144rpx 28rpx 0 30rpx;
		padding: 24rpx 0 22rpx;
		color: rgb(255, 255, 255);
		font-size: 32rpx;
		font-weight: 500;
		line-height: 44rpx;
		white-space: nowrap;
		background-color: rgb(23, 119, 255);
		border-radius: 45rpx;
	}

	.section_1 {
		padding: 28rpx 24rpx 40rpx;
		background-color: rgb(255, 255, 255);
	}

	.section_2 {
		margin-top: 18rpx;
		padding: 34rpx 24rpx;
		background-color: rgb(255, 255, 255);
	}

	.group_6 {
		white-space: nowrap;
	}

	.text_4 {
		height: 500rpx;
		margin-top: 14rpx;
		color: rgb(0, 0, 0);
		font-size: 28rpx;
		line-height: 40rpx;
		width: 100% !important;
	}

	.text_5 {
		color: rgb(51, 51, 51);
		font-size: 28rpx;
		line-height: 40rpx;
		white-space: nowrap;
	}

	.group_7 {
		margin-right: 6rpx;
		color: rgb(153, 153, 153);
		font-size: 28rpx;
		line-height: 40rpx;
		white-space: nowrap;
		width: 550rpx;
	}

	.group_7 .ginput {
		text-align: right;
		width: 100%;
		color: #333333 !important;
	}

	.input-place {
		color: #999;
	}

	.text_2 {
		color: rgb(250, 100, 0);
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.text_3 {
		color: rgb(51, 51, 51);
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.image_5 {
		margin: 7rpx 0 5rpx 10rpx;
		width: 16rpx;
		height: 28rpx;
	}
</style>
