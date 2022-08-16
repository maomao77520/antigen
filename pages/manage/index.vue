<template>
	<view class="flex-col page">
			<view class="flex-col group_1">
			<view class="flex-row section_3">
				<image :src="userInfo.avatarUrl" class="image_3" mode="widthFix" />
				<text class="text_1">{{userInfo.nickName}}</text>
			</view>
			<view class="flex-col group_2">
				<view class="flex-col section_4">
					<text class="text_2">发起检测</text>
					<view class="flex-row equal-division">
						<view class="flex-col equal-division-item" @click="gotoTest('unit')">
							<view class="flex-row group_3">
								<image
									src="/static/images/icon_unit_login.png"
									class="image_4" />
								<text class="text_3">单位登陆</text>
							</view>
							<text class="text_4">发起单位检测活动</text>
						</view>
						<view class="flex-col equal-division-item_1" @click="gotoTest('community')">
							<view class="flex-row group_4">
								<image
									src="/static/images/icon_community_login.png"
									class="image_4" />
								<text class="text_5">社区登陆</text>
							</view>
							<text class="text_6">发起社区检测活动</text>
						</view>
					</view>
				</view>
				<view class="flex-col section_5">
					<view class="justify-between group_6" @click="gotoLook">
						<text>单位/社区管理使用指南</text>
						<image
							src="/static/images/icon_right.png"
							class="image_7 image_9" />
					</view>
					<view class="justify-between group_5" @click="gotoFeedback">
						<text>意见反馈</text>
						<image
							src="/static/images/icon_right.png"
							class="image_7 image_8" />
					</view>
					<view class="justify-between group_5" @click="gotoFeedbackRecord">
						<text>反馈记录</text>
						<image
							src="/static/images/icon_right.png"
							class="image_7 image_8" />
					</view>
				</view>
				<auth ref='auth'></auth>
			</view>
		</view>
	</view>
</template>

<script>
	import monitor from '@/utils/alipayLogger'
	import { reportCmPV } from '@/utils/cloudMonitorHelper';
	import ServiceApi from '@/api/api.js'
	export default {
		data() {
			return {
				userInfo: {
					nickName : "",
					avatarUrl : "",
					isCommunityAdmin : "",
					isUnitAdmin : ""
				}
			};
		},
		onLoad() {
			// #ifdef MP-ALIPAY
			reportCmPV({ title: '管理页' });
			// #endif
			let userInfo = uni.getStorageSync('userInfo');
			this.userInfo = userInfo
		},
		methods: {
			gotoTest(e) {
				let that = this
				let flag = that.$refs.auth.getUserBaseInfo();
				console.log(flag)
				flag.then(r=>{
					console.info('r='+r)
					if(r){
						let userInfo = uni.getStorageSync('userInfo');
						that.userInfo = userInfo
						//判断用户是不是社区管理员，是则跳转到管理页
						ServiceApi.getMyPlaceInfo().then(resp=>{
							
							// #ifdef MP-ALIPAY
							monitor.api({api:"getMyPlaceInfo",success:true,c1:"taSR",time:0})
							// #endif
							
							console.info('resp='+resp)
							if(resp.data.result != null && resp.data.result.isCommunityAdmin && e === 'community'){
								//社区
								return uni.navigateTo({
									url: '/pages/unitPerson/index?placeType=' + e
								})
							}else if(resp.data.result != null && resp.data.result.isUnitAdmin && e === 'unit'){
								//单位
								return uni.navigateTo({
									url: '/pages/unitPerson/index?placeType=' + e
								})
							}else{
								return uni.navigateTo({
									url: '/pages/applyTest/index?stype=' + e
								})
							}
						}).catch(err => {
							uni.showToast({
								icon: 'none',
								title: err
							})
						})
					}else{
						uni.showToast({
							icon: 'none',
							title: '请您先授权'
						})
					}
				})
			},
			gotoFeedback(e) {
				let that = this
				let flag = that.$refs.auth.getUserBaseInfo();
				flag.then(r=>{
					console.info('r='+r)
					if(r){
						uni.navigateTo({
							url: '/pages/feedback/feedbackAdd?stype=' + e
						})
					}else{
						uni.showToast({
							icon: 'none',
							title: '请您先授权'
						})
					}
				})
			},
			gotoFeedbackRecord(e) {
				let that = this
				let flag = that.$refs.auth.getUserBaseInfo();
				flag.then(r=>{
					console.info('r='+r)
					if(r){
						uni.navigateTo({
							url: '/pages/feedback/index'
						})
					}else{
						uni.showToast({
							icon: 'none',
							title: '请您先授权'
						})
					}
				})
			},
			gotoLook() {
				uni.navigateTo({
					url: '/pages/manual/index?type=cz',
				});
			}
		}
	};
</script>

<style scoped lang="scss">
	.authorizeBt{
		display: none;
	}

	.left-group {
		height: 82rpx;
	}

	.image_10 {
		width: 54rpx;
		height: 54rpx;
	}

	.image_7 {
		width: 16rpx;
		height: 28rpx;
	}

	.image_4 {
		border-radius: 50%;
		width: 64rpx;
		height: 64rpx;
	}

	.page {
		background-color: #f9f9f9;
		width: 100%;
		overflow-y: auto;
		height: 100%;
	}

	.group_1 {
		padding-bottom: 536rpx;
		flex: 1 1 auto;
		overflow-y: auto;
	}

	.tab-bar {
		padding: 12rpx 135rpx 18rpx;
		background-color: rgb(255, 255, 255);
	}

	.section_3 {
		padding: 40rpx 24rpx 82rpx;
		color: rgb(255, 255, 255);
		font-size: 32rpx;
		line-height: 44rpx;
		white-space: nowrap;
		background-color: rgb(23, 119, 255);
	}

	.group_2 {
		margin-top: -44rpx;
		padding: 0 18rpx;
		position: relative;
	}

	.view_2 {
		color: rgb(153, 153, 153);
		font-size: 24rpx;
		line-height: 34rpx;
		white-space: nowrap;
	}

	.view_3 {
		margin-right: 20rpx;
		color: rgb(23, 119, 255);
		font-size: 24rpx;
		font-weight: 500;
		line-height: 34rpx;
		white-space: nowrap;
	}

	.image_3 {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}

	.text_1 {
		margin-left: 10rpx;
		align-self: center;
	}

	.section_4 {
		margin-right: 4rpx;
		padding: 36rpx 22rpx 26rpx 28rpx;
		background-image: linear-gradient(0deg,
				rgb(255, 255, 255) 0%,
				rgb(255, 255, 255) -16.49%,
				rgb(233, 255, 251) 100%,
				rgb(233, 255, 251) 100%);
		border-radius: 20rpx;
		border: solid 2rpx rgb(238, 238, 238);
	}

	.section_5 {
		margin-right: 4rpx;
		margin-top: 20rpx;
		padding-left: 32rpx;
		color: rgb(51, 51, 51);
		font-size: 28rpx;
		line-height: 40rpx;
		white-space: nowrap;
		background-color: rgb(255, 255, 255);
		border-radius: 20rpx;
	}

	.text_2 {
		color: rgb(51, 51, 51);
		font-size: 36rpx;
		font-weight: 500;
		line-height: 50rpx;
		white-space: nowrap;
	}

	.equal-division {
		margin-top: 26rpx;
	}

	.group_5 {
		padding: 32rpx 0 35rpx;
		border-bottom: solid 2rpx rgb(249, 249, 249);
	}

	.group_6 {
		padding: 37rpx 0 32rpx;
	}

	.equal-division-item {
		padding: 14rpx 18rpx 40rpx;
		flex: 1 1 316rpx;
		background-color: rgb(255, 255, 255);
		border-radius: 20rpx;
		height: 188rpx;
	}

	.equal-division-item_1 {
		margin-left: 24rpx;
		padding: 14rpx 20rpx 38rpx 20rpx;
		flex: 1 1 316rpx;
		background-color: rgb(255, 255, 255);
		border-radius: 20rpx;
		height: 188rpx;
	}

	.image_8 {
		margin: 7rpx 28rpx 5rpx 0;
	}

	.image_9 {
		margin: 5rpx 26rpx 7rpx 0;
	}

	.group_3 {
		color: rgb(51, 51, 51);
		font-size: 32rpx;
		font-weight: 500;
		line-height: 44rpx;
		white-space: nowrap;
	}

	.text_4 {
		margin-top: 8rpx;
		color: rgb(102, 102, 102);
		font-size: 28rpx;
		line-height: 40rpx;
		white-space: nowrap;
	}

	.group_4 {
		color: rgb(51, 51, 51);
		font-size: 32rpx;
		font-weight: 500;
		line-height: 44rpx;
		white-space: nowrap;
	}

	.text_6 {
		margin-top: 10rpx;
		color: rgb(102, 102, 102);
		font-size: 28rpx;
		line-height: 40rpx;
		white-space: nowrap;
	}

	.text_3 {
		margin-left: 32rpx;
		margin-top: 42rpx;
	}

	.text_5 {
		margin-left: 32rpx;
		margin-top: 42rpx;
	}
</style>
