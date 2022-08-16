<template>
	<view class="flex-col page">
		<scroll-view scroll-y="true" class="scrollclass" @scrolltolower="getMoreData">
			<view class="flex-col group_4">
				<view class="group_5">
					<text class="text_2">检测编码：</text>
					<text class="text_3">{{batchNo}}</text>
				</view>
				<view class="flex-col group_6">
					<view class="flex-col section_1">
						<view class="justify-between section_2">
							<view class="flex-row">
								<view class="flex-row">
									<text>序号</text>
									<text class="text_5">姓名</text>
								</view>
								<text class="text_6">手机号码</text>
								<text class="text_7">检测结果</text>
							</view>
							<text class="text_8">提交时间</text>
							<text class="text_8">照片</text>
						</view>
						<view class="flex-col group_9">
							<template v-for="(item,index) in list">
								<view class="justify-between group_10" :key="index">
									<text class="text_9">{{index+1}}</text>
									<text class="text_10">{{item.name}}</text>
									<text
										class="text_11">{{item.phone}}</text>
									<text class="text_12" :class="item.testResult==1?'text_12_1':item.testResult==2?'text_12_2':''">{{item.testResultDesc}}</text>
									<text class="text_13">{{item.testTime}}</text>
									<image style="height: 40rpx;width: 40rpx;" @click="looking(item.testImg)"
										src="../../static/images/icon_looking.png"
										class="image_7">
									</image>
								</view>
							</template>
						</view>
					</view>
					<view v-show="isLoadMore" class="loadMore-item"><u-loadmore :status="loadStatus"></u-loadmore></view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import monitor from '@/utils/alipayLogger'
	import { reportCmPV } from '@/utils/cloudMonitorHelper';
	import ServiceApi from '@/api/api.js';
	export default {
		data() {
			return {
				batchNo: '',
				list: [],
				page: 1,
				pageSize: 15,
				totleData:0,
				isLoadMore: false,
				loadStatus: 'loading'
			};
		},
		onLoad(e) {
			// #ifdef MP-ALIPAY
			reportCmPV({ title: '检测详情', e});
			// #endif
			console.log(e);
			this.batchNo = e.batchNo;
			this.getData();
		},
		methods: {
			getData() {
				let that = this
				let param = {
					batchNo: that.batchNo,
					page: that.page-1,
					size: that.pageSize
				}
				uni.showLoading()
				ServiceApi.adminRecordDetail(param).then(res=>{
					uni.hideLoading()
					if(res.data.status == 200){
						// #ifdef MP-ALIPAY
						monitor.api({api:"adminRecordDetail",success:true,c1:"taSR",time:0})
						// #endif
						that.list = res.data.result.content
						that.totleData = res.data.result.totalElements
					}else{
						// #ifdef MP-ALIPAY
						monitor.api({api:"adminRecordDetail",success:false,c1:"taSR",time:0})
						// #endif
					}
				})
			},
			getMoreData() {
				// if (this.lstatus != '加载更多') return;
				// console.log('---加载数据---');
				// return;
				if (!this.isLoadMore) {
					//此处判断，上锁，防止重复请求
					this.isLoadMore = true;
					let nowTotle = this.page * this.pageSize;
					this.page += 1;
					if (this.totleData < 10) {
						setTimeout(() => {
							this.isLoadMore = true;
							this.loadStatus = 'nomore';
						}, 1000);
						return;
					}
					if (nowTotle < this.totleData) {
						setTimeout(() => {
							this.isLoadMore = false;
							this.loadStatus = 'loading';
							this.getNewData().then(res => {
								if(res.data.status==200){
									// #ifdef MP-ALIPAY
									monitor.api({api:"adminRecordDetail",success:true,c1:"taSR",time:0})
									// #endif
									this.list.push(...res.data.result.content);
								}else{
									// #ifdef MP-ALIPAY
									monitor.api({api:"adminRecordDetail",success:false,c1:"taSR",time:0})
									// #endif
								}
							});
						}, 1000);
					} else {
						setTimeout(() => {
							this.isLoadMore = true;
							this.loadStatus = 'nomore';
						}, 1000);
					}
				}
			},
			getNewData() {
				let param = {
					page: this.page - 1,
					size: this.pageSize,
					batchNo: this.batchNo
				};
				return ServiceApi.adminRecordDetail(param);
			},
			looking(url){
				console.log(url)
				if(url){
					// 预览图片
					uni.previewImage({
						urls: [url]
					})
				}else{
					uni.showToast({
						title: '未上传照片',
						icon: 'none'
					});
				}
				
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
		padding: 46rpx 20rpx 60rpx;
		flex: 1 1 auto;
		overflow-y: auto;
	}

	.group_5 {
		white-space: nowrap;
	}

	.group_6 {
		margin-top: 34rpx;
	}

	.text_2 {
		color: rgb(51, 51, 51);
		font-size: 36rpx;
		font-weight: 500;
		line-height: 50rpx;
	}

	.text_3 {
		color: rgb(23, 119, 255);
		font-size: 36rpx;
		font-weight: 500;
		line-height: 50rpx;
	}

	.section_1 {
		background-color: rgb(255, 255, 255);
		border-radius: 20rpx;
	}

	.text_19 {
		margin-top: 42rpx;
		align-self: center;
		color: rgb(153, 153, 153);
		font-size: 24rpx;
		line-height: 34rpx;
		white-space: nowrap;
	}

	.section_2 {
		padding: 34rpx 22rpx 32rpx;
		color: rgb(51, 51, 51);
		font-size: 24rpx;
		font-weight: 500;
		line-height: 34rpx;
		white-space: nowrap;
		background-color: rgb(238, 238, 238);
		border-radius: 20rpx 20rpx 0px 0px;
	}

	.group_9 {
		padding-left: 22rpx;
	}

	.text_8 {
		margin-right: 52rpx;
	}

	.group_10 {
		padding: 38rpx 10rpx 35rpx;
		border-bottom: solid 2rpx rgb(249, 249, 249);
	}

	.text_6 {
		margin-left: 60rpx;
	}

	.text_7 {
		margin-left: 54rpx;
	}

	.text_9 {
		color: rgb(51, 51, 51);
		font-size: 24rpx;
		line-height: 34rpx;
		white-space: nowrap;
	}

	.text_10 {
		color: rgb(51, 51, 51);
		font-size: 24rpx;
		line-height: 34rpx;
		white-space: nowrap;
	}

	.text_11 {
		color: rgb(51, 51, 51);
		font-size: 24rpx;
		line-height: 34rpx;
		white-space: nowrap;
	}

	.text_12 {
		color: rgb(109, 212, 0);
		font-size: 24rpx;
		line-height: 34rpx;
		white-space: nowrap;
	}

	.text_12_1 {
		color: #E02020 !important;
	}

	.text_12_2 {
		color: #51d605 !important;
	}
	
	.text_12_3 {
		color: #666666 !important;
	}

	.text_13 {
		margin-right: 10rpx;
		color: rgb(51, 51, 51);
		font-size: 24rpx;
		line-height: 34rpx;
		white-space: nowrap;
	}

	.text_14 {
		color: rgb(51, 51, 51);
		font-size: 24rpx;
		line-height: 34rpx;
		white-space: nowrap;
	}

	.text_15 {
		color: rgb(51, 51, 51);
		font-size: 24rpx;
		line-height: 34rpx;
		white-space: nowrap;
	}

	.text_16 {
		color: rgb(51, 51, 51);
		font-size: 24rpx;
		line-height: 34rpx;
		white-space: nowrap;
	}

	.text_17 {
		color: rgb(109, 212, 0);
		font-size: 24rpx;
		line-height: 34rpx;
		white-space: nowrap;
	}

	.text_18 {
		margin-right: 14rpx;
		color: rgb(51, 51, 51);
		font-size: 24rpx;
		line-height: 34rpx;
		white-space: nowrap;
	}

	.text_5 {
		margin-left: 44rpx;
	}
</style>
