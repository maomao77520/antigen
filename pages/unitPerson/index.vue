<template>
	<view class="flex-col page">
		<view class="flex-col group_2">
			<view class="flex-row section_3">
				<view class="flex-row group_3">
					<image src="/static/images/icon_unitName.png" class="image_4" />
					<view class="flex-col group_4">
						<text class="text_1">{{unitInfo.name}}</text>
						<text class="text_2" v-if="unitInfo.id" @click="open">撤销管理申请 ></text>
					</view>
				</view>
				<view @click="jcmHsow=true" class="flex-col items-end group_5">
						<view class="flex-col items-center text-wrapper" :class="list.length==0?'text-wrapper_11':''">
							<text>生成检测码</text>
						</view>
						<image v-if="list.length==0" src="/static/images/icon_unitPerson_grey.png" mode="widthFix" class="image_5" />
						<image v-else src="/static/images/icon_unitPerson_yell.png" mode="widthFix" class="image_5" />
				</view>
			</view>
			<scroll-view scroll-y="true" class="scrollclass" @scrolltolower="getMoreData">
				<view class="flex-col group_6">
					<template v-for="(item,index) in list">
						<view class="top-section flex-col view_10" :key="index" @click="toDetail(item)">
							<view class="justify-between">
								<text class="text_4">检测编码</text>
								<text class="text_6">{{item.batch_no}}</text>
							</view>
							<view class="bottom-group flex-col">
								<view class="flex-col">
									<view class="bottom-group_1 justify-between">
										<text class="text_12">上报人数</text>
										<text class="text_14">{{item.yang + item.yin + item.invalid}}人</text>
									</view>
								</view>
								<view class="bottom-group_2 flex-col">
									<view class="top-group justify-between">
										<text class="text_16">阳性/阴性/无效</text>
										<view class="right-group">
											<text class="text_18">{{item.yang}}</text>
											<text class="text_20">/</text>
											<text class="text_22">{{item.yin}}</text>
											<text class="text_24">/{{item.invalid}}</text>
										</view>
									</view>
									<view class="bottom-group_3 justify-between">
										<text class="text_26">发起检测时间</text>
										<text class="text_28">{{item.start_time}}</text>
									</view>
									<view class="group_13 justify-between" v-if="item.yang > 0" >
										<view class="flex-row group_14">
											<image src="/static/images/icon_waring.png" class="image_13" mode="widthFix" />
											<text>有阳性记录！请尽快联系所在居委会上报</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</template>
					<view v-show="isLoadMore" class="loadMore-item"><u-loadmore :status="loadStatus"></u-loadmore></view>
				</view>
			</scroll-view>
			<template>
				<!-- 生成检测码 -->
				<u-popup v-model="jcmHsow" mode="center" border-radius="20">
					<view style="width: 90vw;height: 86vh">
						<view class="flex-col section_5">
							<view class="flex-col">
								<view class="group_9">
									<text class="text_4">单位检测编码：</text>
									<text class="text_5">{{batchNo}}</text>
								</view>
								<text class="text_6_1">{{unitInfo.name}}</text>
							</view>
							<image src="/static/images/icon_yanzheng.png" class="image_6" />
							<view class="flex-col items-center group_10">
								<uqrcode ref="uQRCode" :text="batchNo" />
								<text class="text_7">单位人员扫描二维码进行检测信息上报</text>
							</view>
							<view class="flex-row group_11">
								<view @click="jcmHsow=false" class="flex-col items-center text-wrapper_1">
									<text>取消</text>
								</view>
								<view @click="save()" class="flex-col items-center text-wrapper_2">
									<text>保存</text>
								</view>
							</view>
						</view>
					</view>
				</u-popup>
				<!-- 无数据 -->
				<view class="nodata" v-if="list.length==0">
					<image class="nodata-img" src="/static/images/nodata.png" mode="widthFix"></image>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	import monitor from '@/utils/alipayLogger'
	import { reportCmPV } from '@/utils/cloudMonitorHelper';
	import ServiceApi from '@/api/api.js';
	import { execPlugin } from '@/utils/croods.js'
	export default {
		data() {
			return {
				unitInfo: {
					id: '',
					name: '未知'
				},
				batchNo: '',
				lstatus: '加载更多中~',
				list: [],
				page: 1,
				pageSize: 10,
				totleData:0,
				modalShow: false,
				jcmHsow: false,
				placeType: '',
				isLoadMore: false,
				loadStatus: 'loading'
			};
		},
		onLoad(e) {
			// #ifdef MP-ALIPAY
			reportCmPV({ title: '负责人', e});
			// #endif
			this.placeType = e.placeType
			this.getAdminRecord(e.placeType);
			this.getMyPlaceInfoByType(e.placeType);
			if(e.placeType === 'unit'){
				uni.setNavigationBarTitle({
				　　title: '单位负责人'
				})
			}else if(e.placeType === 'community'){
				uni.setNavigationBarTitle({
				　　title: '小区负责人'
				})
			}
		},
		methods: {
			async make() {
				let that = this
				// 可以在这加一个loading状态
				ServiceApi.createTestBatch(this.unitInfo.id).then(resp=>{
					if(resp.data.status==200){
						// #ifdef MP-ALIPAY
						monitor.api({api:"createTestBatch",success:true,c1:"taSR",time:0})
						// #endif
						that.batchNo = resp.data.result.batchNo
					}else{
						// #ifdef MP-ALIPAY
						monitor.api({api:"createTestBatch",success:false,c1:"taSR",time:0})
						// #endif
					}
				})
			},
			async save() {
				// #ifdef H5
				this.$refs
					.uQRCode
					.toTempFilePath({
						success: (res) => {
							// uni.showToast({
							// 	title: '已保存至相册',
							// 	icon: 'none'
							// });
							let noPrefix = res.tempFilePath.replace(/^data:image\/\w+;base64,/, '')
							execPlugin({
								action: 'UtilPlugin.saveImg',
								params: {type:'BASE64',file: noPrefix},
								success: function (res) {
									uni.showToast({
										title: '已保存至相册',
										icon: 'none'
									});
								},
								fail: function (msg) {
									console.log(msg)
									uni.showToast({
										title: '保存失败，请检查app权限',
										icon: 'none'
									});
								}
							})
						}
					})
				return
				// #endif
				
				// #ifdef MP-ALIPAY
				this.$refs.uQRCode.save({
					success: () => {
						uni.showToast({
							title: '已保存至相册',
							icon: 'none'
						});
					}
				})
				// #endif
			},
			getMyPlaceInfoByType(placeType){
				ServiceApi.getMyPlaceInfoByType(placeType).then(resp=>{
					if(resp.data.status==200){
						// #ifdef MP-ALIPAY
						monitor.api({api:"getMyPlaceInfoByType",success:true,c1:"taSR",time:0})
						// #endif
						this.unitInfo = resp.data.result
						this.make();
					}else{
						// #ifdef MP-ALIPAY
						monitor.api({api:"getMyPlaceInfoByType",success:false,c1:"taSR",time:0})
						// #endif
						uni.showToast({
							title: '查询失败！',
							icon: 'fail',
							content: resp.data.message
						});
					}
				})
			},
			getAdminRecord(placeType){
				let that = this
				let param = {
					placeType: placeType,
					page: that.page-1,
					size: that.pageSize
				}
				uni.showLoading()
				ServiceApi.adminRecord(param).then(res=>{
					uni.hideLoading()
					if(res.data.status==200){
						// #ifdef MP-ALIPAY
						monitor.api({api:"adminRecord",success:true,c1:"taSR",time:0})
						// #endif
						that.list = res.data.result.content
						that.totleData = res.data.result.totalElements
					}else{
						// #ifdef MP-ALIPAY
						monitor.api({api:"adminRecord",success:false,c1:"taSR",time:0})
						// #endif
					}
				})
			},
			toDetail(e) {
				uni.navigateTo({
					url: './detail?batchNo=' + e.batch_no,
				});
			},
			getMoreData() {
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
								this.list.push(...res.data.result.content);
								console.log(this.list.length);
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
					placeType: this.placeType
				};
				return ServiceApi.adminRecord(param);
			},
			open() {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定撤销管理员身份吗?',
					success: function (res) {
						if (res.confirm) {
							uni.showModal({
								title: '提示',
								content: '请再次确认',
								success: function (res) {
									if (res.confirm) {
										let param = {
											placeId: that.unitInfo.id
										}
										uni.showLoading()
										ServiceApi.unbindPlace(param).then(res=>{
											uni.hideLoading()
											uni.switchTab({
												url: '/pages/guanli/guanli'
											})
										}).catch(error=>{
											uni.hideLoading()
										})
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								}
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	.page {
		background-color: #f9f9f9 !important;
		height: 100vh !important;
	}
</style>
<style scoped lang="scss">
	.section_5 {
		margin-left: 36rpx;
		margin-right: 32rpx;
		padding: 40rpx 52rpx 54rpx;
		overflow: hidden;
		border-radius: 20rpx;
		background-color: rgb(255, 255, 255);
		position: relative;
	}

	.group_9 {
		white-space: nowrap;
	}

	.text_4 {
		color: rgb(51, 51, 51);
		font-size: 42rpx;
		font-weight: bold;
		line-height: 58rpx;
	}

	.text_5 {
		color: rgb(23, 119, 255);
		font-size: 42rpx;
		font-weight: bold;
		line-height: 58rpx;
	}

	.text_6_1 {
		margin-top: 4rpx;
		color: rgb(102, 102, 102);
		font-size: 28rpx;
		line-height: 40rpx;
		white-space: nowrap;
	}

	.image_6 {
		width: 180rpx;
		height: 180rpx;
		position: absolute;
		right: -30rpx;
		top: -20rpx;
	}

	.image_7 {
		width: 568rpx;
		height: 568rpx;
		margin-top: 60rpx;
	}

	.text_7 {
		margin-top: 26rpx;
	}

	.text-wrapper_1 {
		padding: 18rpx 0;
		color: rgb(153, 153, 153);
		font-size: 28rpx;
		font-weight: bold;
		line-height: 40rpx;
		white-space: nowrap;
		border-radius: 40rpx;
		width: 206rpx;
		height: 80rpx;
		border: solid 2rpx rgb(216, 216, 216);
	}

	.text-wrapper_2 {
		margin-left: 26rpx;
		margin-right: 6rpx;
		padding: 20rpx 0;
		flex: 1 1 auto;
		color: rgb(255, 255, 255);
		font-size: 28rpx;
		font-weight: bold;
		line-height: 40rpx;
		white-space: nowrap;
		background-color: rgb(23, 119, 255);
		border-radius: 40rpx;
		height: 80rpx;
	}

	.group_11 {
		margin-top: 74rpx;
		padding: 0 16rpx;
		position: relative;
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

	.top-section {
		padding: 26rpx 20rpx 30rpx;
		background-color: rgb(255, 255, 255);
		border-radius: 20rpx;
	}

	.top-group {
		padding: 0 2rpx;
	}

	.right-group {
		white-space: nowrap;
		height: 40rpx;
	}

	.text_4 {
		color: rgb(102, 102, 102);
		font-size: 28rpx;
		line-height: 40rpx;
		white-space: nowrap;
	}

	.text_6 {
		color: rgb(23, 119, 255);
		font-size: 28rpx;
		font-weight: bold;
		line-height: 40rpx;
		white-space: nowrap;
	}

	.text_8 {
		color: rgb(102, 102, 102);
		font-size: 28rpx;
		line-height: 40rpx;
		white-space: nowrap;
	}

	.text_10 {
		color: rgb(51, 51, 51);
		font-size: 28rpx;
		line-height: 40rpx;
		white-space: nowrap;
	}

	.text_12 {
		color: rgb(102, 102, 102);
		font-size: 28rpx;
		line-height: 40rpx;
		white-space: nowrap;
	}

	.text_14 {
		color: rgb(51, 51, 51);
		font-size: 28rpx;
		line-height: 40rpx;
		white-space: nowrap;
	}

	.text_16 {
		color: rgb(102, 102, 102);
		font-size: 28rpx;
		line-height: 40rpx;
		white-space: nowrap;
	}

	.text_26 {
		color: rgb(102, 102, 102);
		font-size: 28rpx;
		line-height: 40rpx;
		white-space: nowrap;
	}

	.text_28 {
		color: rgb(51, 51, 51);
		font-size: 28rpx;
		line-height: 40rpx;
		white-space: nowrap;
	}

	.text_18 {
		color: rgb(224, 32, 32);
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.text_20 {
		color: rgb(51, 51, 51);
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.text_22 {
		color: rgb(109, 212, 0);
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.text_24 {
		color: rgb(51, 51, 51);
		font-size: 28rpx;
		line-height: 40rpx;
	}
	.image_13 {
		width: 60rpx;
	}
	.bottom-group {
		margin-top: 28rpx;
	}

	.bottom-group_2 {
		margin-top: 28rpx;
	}

	.bottom-group_1 {
		margin-top: 18rpx;
	}

	.bottom-group_3 {
		margin-top: 28rpx;
	}

	.group_13 {
		margin-top: 10rpx;
		padding-top: 10rpx;
		border-top: solid 2rpx rgb(249, 249, 249);
	}

	.page {
		background-color: #f9f9f9;
		width: 100%;
		overflow-y: auto;
		height: 100%;
	}

	.group_2 {
		padding-bottom: 40rpx;
		flex: 1 1 auto;
		overflow-y: auto;
	}

	.section_3 {
		padding: 52rpx 0 62rpx 20rpx;
		background-color: rgb(23, 119, 255);
		border-radius: 0px 0px 60rpx 60rpx;
		box-shadow: 0px 8rpx 28rpx 0px rgba(224, 224, 224, 0.5);
	}

	.group_6 {
		margin-top: 20rpx;
		padding: 0 20rpx;
	}

	.group_3 {
		flex: 1 1 auto;
	}

	.group_5 {
		margin-left: 40rpx;
		padding-top: 2rpx;
		align-self: center;
		color: rgb(255, 255, 255);
		font-size: 28rpx;
		font-weight: bold;
		line-height: 40rpx;
		white-space: nowrap;
		width: 216rpx;
		position: relative;
	}

	.view_10 {
		margin-bottom: 20rpx;
	}

	.text_43 {
		margin-top: 36rpx;
		align-self: center;
		color: rgb(153, 153, 153);
		font-size: 24rpx;
		line-height: 34rpx;
		white-space: nowrap;
	}

	.image_4 {
		margin-top: 4rpx;
		border-radius: 50%;
		width: 80rpx;
		height: 80rpx;
	}

	.group_4 {
		margin-left: 12rpx;
		flex: 1 1 auto;
		justify-content: center;
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
		padding: 10rpx 0 14rpx;
		background-color: rgb(247, 181, 0);
		border-radius: 32rpx 0px 0px 32rpx;
		width: 184rpx;
	}

	.text-wrapper_11 {
		background-color: #d8d8d8 !important;
	}

	.image_5 {
		width: 66rpx;
		height: 66rpx;
		position: absolute;
		left: -12rpx;
		bottom: 0;
	}

	.text_1 {
		color: rgb(255, 255, 255);
		font-size: 32rpx;
		font-weight: bold;
		line-height: 44rpx;
		white-space: nowrap;
	}

	.text_2 {
		margin-top: 4rpx;
		color: rgb(160, 200, 255);
		font-size: 24rpx;
		line-height: 34rpx;
		white-space: nowrap;
	}
</style>
