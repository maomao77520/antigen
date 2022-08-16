<template>
	<view class="flex-col page">
		<view style="margin: 10rpx;">
			<u-subsection :list="list" mode="button" activeColor="#1777ff" :current="current" @change="sectionChange"></u-subsection>
		</view>
		<scroll-view scroll-y="true" class="scrollclass" @scrolltolower="getMoreData">
			<view class="flex-col group_4">
				<view class="list-item flex-col section_1" v-for="(item, index) in list" :key="index">
					<view class="flex-col">
						<view v-if="item.test_result == '2'" class="justify-between section_2">
							<text class="text_2">检测结果</text>
							<text class="text_4 text_5">阴性</text>
						</view>
						<view v-if="item.test_result == '3'" class="justify-between section_4">
							<text class="text_2 text_22">检测结果</text>
							<text class="text_4">无效结果</text>
						</view>
						<view v-if="item.test_result == '1'" class="justify-between section_6">
							<text class="text_2">检测结果</text>
							<text class="text_4">阳性</text>
						</view>
						<view class="bottom-group justify-between">
							<text class="text_6">姓名</text>
							<view class="right-group flex-row">
								<text>{{ item.user_name }}</text>
							</view>
						</view>
					</view>
					<view class="bottom-group_1 flex-col">
						<view class="justify-between">
							<text class="text_9">采样时间</text>
							<text class="right text_11">{{ item.test_time }}</text>
						</view>
						<view class="center-group justify-between" v-if="item.batch_no">
							<text class="text_13">试剂编码</text>
							<text class="right_1 text_15">{{ item.batch_no }}</text>
						</view>
						<view class="bottom-group_2 flex-col">
							<view class="top-group justify-between">
								<text class="text_17">检测项目</text>
								<view class="right-group_1 flex-row">
									<text class="text_19">{{ item.test_type }}</text>
									<image @click="looking(item.test_img)"
										src="../../static/images/icon_looking.png"
										class="image_7">
									</image>
								</view>
							</view>

							<view class="justify-between group_13" v-if="item.test_result == '1'" >
								<view class="flex-row group_14">
									<image src="/static/images/icon_waring.png" class="image_13" mode="widthFix" />
									<text class="text_43">请尽快联系所在居委会上报</text>
								</view>
								<!-- <view @click="deletel(item.id)" class="flex-col items-center text-wrapper"><text>删除</text></view> -->
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view v-show="isLoadMore" class="loadMore-item"><u-loadmore :status="loadStatus"></u-loadmore></view>
		<view class="nodata" v-if="list.length == 0"><image class="nodata-img" src="/static/images/nodata.png" mode="widthFix"></image></view>
	</view>
</template>

<script>
import ServiceApi from '@/api/api.js';
export default {
	data() {
		return {
			modalShow: false,
			list: [],
			mcontent: '确定删除该信息吗？删除后该信息不可恢复！',
			deletid: null,
			page: 1,
			pageSize: 10,
			totleData: 0,
			isLoadMore: false,
			loadStatus: 'loading',
			list: ['我的提交记录', '家人检测记录'],
			// 或者如下，也可以配置keyName参数修改对象键名
			// list: [{name: '未付款'}, {name: '待评价'}, {name: '已付款'}],
			current: 0
		};
	},
	onLoad() {
		this.getAntigenTestRecord();
	},
	methods: {
		// sectionChange(){
		// 	if(this.current==0){
		// 		this.getAntigenTestRecord();
		// 	}else{
		// 		this.getAntigenTestRecord();
		// 	}
		// },
		sectionChange(index){
			this.current=index
			if(this.current==0){
				this.getAntigenTestRecord();
			}else{
				this.getAntigenTestFamilyRecord();
			}
		},
		getAntigenTestFamilyRecord() {
			let param = {
				page: this.page - 1,
				size: this.pageSize
			};
			uni.showLoading()
			let that = this
			ServiceApi.getAntigenTestFamilyRecord(param)
				.then(res => {
					uni.hideLoading()
					if (res.data.result) {
						// #ifdef MP-ALIPAY
						monitor.api({api:"getAntigenTestFamilyRecord",success:true,c1:"taSR",time:0})
						// #endif
						that.list = res.data.result.content;
						that.totleData = res.data.result.totalElements;
					}
				})
				.catch(err => {
					uni.hideLoading()
					// #ifdef MP-ALIPAY
					monitor.api({api:"getAntigenTestFamilyRecord",success:false,c1:"taSR",time:0})
					// #endif
					uni.showToast({
						icon: 'none',
						title: err
					});
				});
		},
		getAntigenTestRecord() {
			let param = {
				page: this.page - 1,
				size: this.pageSize
			};
			uni.showLoading()
			let that = this
			ServiceApi.getAntigenTestRecord(param)
				.then(res => {
					uni.hideLoading()
					if (res.data.result) {
						// #ifdef MP-ALIPAY
						monitor.api({api:"getAntigenTestRecord",success:true,c1:"taSR",time:0})
						// #endif
						that.list = res.data.result.content;
						that.totleData = res.data.result.totalElements;
					}
				})
				.catch(err => {
					uni.hideLoading()
					// #ifdef MP-ALIPAY
					monitor.api({api:"getAntigenTestRecord",success:false,c1:"taSR",time:0})
					// #endif
					uni.showToast({
						icon: 'none',
						title: err
					});
				});
		},
		deletel(id) {
			this.deletid = id;
			this.modalShow = true;
		},
		modalconfirm() {
			this.modalShow = false;
			console.log(this.deletid);
			uni.showToast({
				title: '删除成功！',
				icon: 'none'
			});
		},
		modalcancel() {
			this.modalShow = false;
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
							// #ifdef MP-ALIPAY
							monitor.api({api:"getAntigenTestRecord",success:true,c1:"taSR",time:0})
							// #endif
							this.list.push(...res.data.result.content);
							console.log(this.list.length);
						}).catch(err => {
							// #ifdef MP-ALIPAY
							monitor.api({api:"getAntigenTestRecord",success:false,c1:"taSR",time:0})
							// #endif
							uni.showToast({
								icon: 'none',
								title: err
							});
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
				size: this.pageSize
			};
			return ServiceApi.getAntigenTestRecord(param);
		},
		looking(url){
			if(url){
				// 预览图片
				uni.previewImage({
					urls: [url]
				});
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

<style>
.page {
	background-color: #f9f9f9 !important;
	height: 100vh !important;
}
</style>
<style scoped lang="scss">
.loadMore-item{
	margin-bottom: 35rpx;
}
.nodata {
	display: flex;
	justify-content: center;
	margin: 60rpx;
}
.nodata-img {
	width: 300rpx;
}
.scrollclass {
	overflow: scroll;
}
.list-item {
	padding-bottom: 36rpx;
	background-color: rgb(255, 255, 255);
	border-radius: 20rpx;
}
.bottom-group_1 {
	margin-top: 32rpx;
	padding-left: 24rpx;
}
.bottom-group {
	padding: 28rpx 19rpx 0 24rpx;
}
.group_11 {
	padding: 0 4rpx;
}
.top-group {
	padding-bottom: 25rpx;
}
.bottom-text-wrapper {
	margin-right: 20rpx;
	margin-top: 33rpx;
	align-self: flex-end;
	color: rgb(51, 51, 51);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
	padding: 8rpx 0 10rpx;
	border-radius: 31rpx;
	width: 160rpx;
	border: solid 2rpx rgb(216, 216, 216);
}
.image_5 {
	margin-left: 17rpx;
	align-self: center;
	width: 30rpx;
	height: 16rpx;
}
.image_7 {
	margin-left: 14rpx;
	width: 46rpx;
	height: 46rpx;
}
.text_2 {
	color: rgb(255, 255, 255);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
}
.text_4 {
	color: rgb(255, 255, 255);
	font-size: 32rpx;
	font-weight: 500;
	line-height: 44rpx;
	white-space: nowrap;
}
.text_6 {
	color: rgb(102, 102, 102);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
}
.right-group {
	color: rgb(51, 51, 51);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
}
.text_9 {
	color: rgb(102, 102, 102);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
}
.right {
	color: rgb(51, 51, 51);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
}
.text_13 {
	color: rgb(102, 102, 102);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
}
.right_1 {
	color: rgb(51, 51, 51);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
}
.center-group {
	margin-top: 24rpx;
}
.bottom-group_2 {
	margin-top: 28rpx;
}
.text_11 {
	margin-right: 18rpx;
}
.text_15 {
	margin-right: 18rpx;
}
.text_17 {
	margin-top: 6rpx;
	color: rgb(102, 102, 102);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
}
.right-group_1 {
	margin-right: 22rpx;
	color: rgb(51, 51, 51);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
}
.text_19 {
	margin-bottom: 4rpx;
}
.page {
	background-color: #f9f9f9;
	width: 100%;
	overflow-y: auto;
	height: 100%;
}
.group_4 {
	padding: 16rpx 14rpx 50rpx;
	flex: 1 1 auto;
	overflow-y: auto;
}
.section_1 {
	margin: 0 6rpx 20rpx;
}
.section_3 {
	margin: 20rpx 6rpx 0;
}
.section_5 {
	margin-right: 12rpx;
	margin-top: 20rpx;
}
.group_10 {
	margin-top: 32rpx;
	padding-left: 20rpx;
}
.section_2 {
	padding: 20rpx 24rpx;
	background-color: rgb(23, 119, 255);
	border-radius: 20rpx 20rpx 0px 0px;
}
.section_4 {
	padding: 22rpx 20rpx 18rpx 24rpx;
	background-color: rgb(216, 216, 216);
	border-radius: 20rpx 20rpx 0px 0px;
}
.section_6 {
	padding: 20rpx 20rpx 20rpx 24rpx;
	background-color: rgb(247, 181, 0);
	border-radius: 20rpx 20rpx 0px 0px;
}
.group_13 {
	margin-top: 23rpx;
	padding-top: 37rpx;
	border-top: solid 2rpx rgb(249, 249, 249);
}
.text_5 {
	margin-right: 8rpx;
}
.text_22 {
	margin-bottom: 4rpx;
}
.text_38 {
	margin-right: 14rpx;
}
.text_40 {
	margin-right: 14rpx;
}
.text_41 {
	margin-top: 6rpx;
	color: rgb(102, 102, 102);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
}
.group_12 {
	margin-right: 16rpx;
	color: rgb(51, 51, 51);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
}
.group_14 {
	align-self: center;
	color: rgb(224, 32, 32);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
	align-items: center;
}
.text-wrapper {
	margin-right: 22rpx;
	padding: 8rpx 0 10rpx;
	color: rgb(51, 51, 51);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
	border-radius: 31rpx;
	width: 160rpx;
	height: 62rpx;
	border: solid 2rpx rgb(216, 216, 216);
}
.text_42 {
	margin-bottom: 4rpx;
}
.image_13 {
	width: 60rpx;
}
.text_43 {
	margin-left: 12rpx;
}
</style>
