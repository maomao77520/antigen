<template>
	<view class="flex-col page">
		<view class="flex-col section_1">
			<!-- <view class="flex-col group"> -->
				<view class="flex-col group_2">
					<view class="flex-row list">
						<view v-for="(item, i) in list" :key="i" @click="gotoLink(item)" class="list-item flex-row"
							:class="i==0?'list-item_1':i==1?'list-item_2':''">
							<image :src="item.img" class="image" mode="widthFix" />
							<view class="right-group flex-col">
								<text class="text_3" :class="i==0?'text_3_1':i==1?'text_3_1':''">{{item.title}}</text>
								<text class="text_5" :class="i==0?'text_5_1':i==1?'text_3_1':''">{{item.tips}}</text>
							</view>
						</view>
					</view>
					<!-- 结果 -->
					<view class="group_11">
						<view class="group-item" @click="gotoLink(resultQuery)">
							<image :src="resultQuery.img" class="image" mode="widthFix" />
							<view class="right-group flex-col">
								<text class="text_3">{{resultQuery.title}}</text>
								<text class="text_5">{{resultQuery.tips}}</text>
							</view>
						</view>
						<view v-if="hsResultQuery.testResult === 1" class="group-item"
							@click="gotoLink(resultQuery)">
							<image src="/static/images/icon_index_query_yang.png" class="image" mode="widthFix" />
							<view class="right-group flex-col">
								<text class="text_3_yang">{{hsResultQuery.testResultDesc}}<text class="text_5">48小时</text></text>
								<text class="text_5">{{hsResultQuery.testDay}}</text>
							</view>
						</view>
						<view v-if="hsResultQuery.testResult === 2" class="group-item"
							@click="gotoLink(resultQuery)">
							<image src="/static/images/icon_index_query_yin.png" class="image" mode="widthFix" />
							<view class="right-group flex-col">
								<text class="text_3_yin">{{hsResultQuery.testResultDesc}}<text class="text_5">48小时</text></text>
								<text class="text_5">{{hsResultQuery.testDay}}</text>
							</view>
						</view>
						<view v-if="hsResultQuery.testResult === 3" class="group-item"
							@click="gotoLink(resultQuery)">
							<image src="/static/images/icon_index_query_wu.png" class="image" mode="widthFix" />
							<view class="right-group flex-col">
								<text class="text_3">{{hsResultQuery.testResultDesc}}<text class="text_5">48小时</text></text>
								<text class="text_5">{{hsResultQuery.testDay}}</text>
							</view>
						</view>
						<view v-else class="group-item" @click="gotoLink(list[0])">
							<view class="right-group flex-col">
								<text class="text_3">48小时内未检测</text>
								<text class="text_5">立即检测></text>
							</view>
						</view>
					</view>
					<!-- 手册 -->
					<view class="flex-col items-start group_3">
						<view class="flex-col section_6" @click="gotoLook('1')">
							<text class="text_13">使用手册</text>
							<text class="text_14">如何上报结果</text>
							<image class="img_15" src="/static/images/icon_index_shiyongsc.png" mode="widthFix"></image>
						</view>
						<view class="flex-col items-center group_4" @click="gotoLook('2')">
							<image mode="widthFix" src="/static/images/img_index_kjyq.png" class="image_5" />
							<view class="flex-col group_5">
								<image src="/static/images/icon_bofang.png" class="image_6" />
								<view class="flex-col items-center text-wrapper">
									<text>如何使用视频</text>
								</view>
							</view>
						</view>
					</view>

					<!-- ==== -->
					<view style="background-color: white;margin-top: 20rpx;border-radius: 12rpx;padding-bottom: 40rpx;">
						<view class="mall-title flex-row justify-between">
							<text class="text_3">购买抗原试剂</text>
							<text class="text_5" @click="goPage">我的订单></text>
							<!-- <view class="text_3 flex-row">
								<image src="/static/images/icon_mall.png" class="image" ></image>
							</view> -->
						</view>
						<view class="conpon-body" v-for="(item, indexa) in couponList" :key="indexa">
							<view class="list-bg" @click.stop="goPage(item.id)">
								<image src="/static/images/shopList_bg.png" mode="widthFix" style="width: 690rpx;"></image>
								<view class="left-space"><u-image :showLoading="true" border-radius="10" :src="item.image" width="132rpx" height="132rpx"></u-image></view>
								<view class="right-space">
									<view class="title">{{ item.storeName }}</view>
									<view class="flex align-center justify-between">
										<view class="flex align-center right-widht">
											<view class="used-price">
												<view class="tlitt">￥</view>
												<view class="tbig">{{ splitFun(item.price)[0] }}</view>
												<view class="tlitt" v-if="splitFun(item.price)[1]">.{{ splitFun(item.price)[1] }}</view>
											</view>
											<view class="justify-between align-center" :class="item.price == '0.00' ? 'mag-left' : ''">
												<view class="origin-price" v-if="item.otPrice">
													原价
													<view class="origin-price-text">￥{{ item.otPrice }}</view>
												</view>
												<view v-else></view>
											</view>
										</view>
										<view class="button-buy button_opacity">去购买</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			<!-- </view> -->
		</view>
	</view>
</template>

<script>
	import ServiceApi from '@/api/api.js'
	import {MALLSERVICE_URL, MALLH5_URL} from '@/utils/config.js';
	export default {
		data() {
			return {
				list: [{
						img: '/static/images/icon_zice.png',
						title: '抗原自测',
						tips: '个人抗原检测',
						url: '/pages/apply_test/my'
					},
					{
						img: '/static/images/icon_family.png',
						title: '家人代办',
						tips: '为家人代办',
						url: '/pages/apply_test/family'
					},
					// {
					// 	img: '/static/images/icon_index_unit.png',
					// 	title: '单位检测',
					// 	tips: '上报单位检测',
					// 	url: '/pages/apply_test/unit'
					// },
					// {
					// 	img: '/static/images/icon_index_community.png',
					// 	title: '社区检测',
					// 	tips: '上报社区检测',
					// 	url: '/pages/apply_test/community'
					// }
				],
				resultQuery: {
					img: '/static/images/icon_index_select.png',
					title: '结果查询',
					tips: '记录检测结果',
					url: '/pages/query_result/index'
				},
				hsResultQuery: '',
				hsReserve: {
					img: '/static/images/icon_index_yuyue.png',
					title: '核酸预约',
					tips: '预约省时间',
					url: '/pages/query_result/index'
				},
				x: 0,
				y: 0,
				zgtToken: '',
				couponList: []
			};
		},
		onShow() {
			this.getMyLastRecord()
		},
		onLoad(req) {
			console.info(req)
			this.getNat()
			if(req.token){
				console.info("token="+req.token)
				this.zgtToken = req.token
				this.login()
			}
		},
		methods: {
			login(){
				let that = this
				//判断用户是否已经授权
				try {
					that.token = uni.getStorageSync('id_token')
				} catch (e) {
					return uni.showToast({
						title: "获取用户缓存异常",
						icon: "error"
					})
				}
				//用户未授权，先进行授权操作
				if (!that.token) {
					uni.showLoading({
						title: '加载中'
					})
					ServiceApi.getZhiGuiTongWxUserInfo({token: that.zgtToken}).then(res => {
						uni.hideLoading()
						if (res.data.status === 200) {
							uni.setStorage({
								key: 'id_token',
								data: res.data.id_token,
								success: function() {
									//查询获取用户信息
									console.log('查询获取用户信息')
									ServiceApi.userInfo().then(resp => {
										uni.setStorageSync('userInfo', resp.data);
									})
								}
							});
							// this.getdata()
						}else{
							console.log('查询获取用户信息失败')
						}
					}).catch(error => {
						uni.showToast({
							icon: 'error',
							title: '授权失败'
						})
						uni.hideLoading()
						console.log('查询获取用户信息失败error = ' + error)
					})

				}else{
					//token存在，尝试直接调用接口
					//console.log('token存在，尝试直接调用接口')
					ServiceApi.userInfo().then(resp => {
						//console.log('token存在，尝试直接调用接口resp='+resp)
						if (resp.data.status === 200) {
							uni.setStorageSync('userInfo', resp.data);
						}else if(resp.data.status === 401){
							//token已经失效,重新调用授权接口
							console.log('token已经失效,重新调用授权接口')
							//that.login()
						}else{
							console.log('其他错误直接返回失败')

						}
					}).catch(error=>{
						console.log('查询获取用户信息失败error='+error)
						resolve(false);
					})
				}
			},
			getNat(){
				//查询商城前端接口地址
				uni.request({
				    url: MALLSERVICE_URL + '/front/nat?cateId=742', //仅为示例，并非真实接口地址。
				    success: (res) => {
				        console.log(res.data);
						this.couponList=res.data
				    }
				});
			},
			splitFun(num) {
				let p = num.split('.');
				let numA = p[0];
				let numB = p[1];
				return p;
			},
			gotoLink(e) {
				uni.navigateTo({
					url: e.url
				})
			},
			getMyLastRecord() {
				//判断用户是否已经授权
				try {
					let token = uni.getStorageSync('id_token')
					if(token){
						ServiceApi.getMyLastRecord().then(resp => {
							if (resp.data.status == 200) {
								this.hsResultQuery = resp.data.result
								console.log(this.hsResultQuery)
							}
						})
					}
				} catch (e) {
					console.error(e)
				}
			},
			goPage(id){
				// #ifdef H5
				//调用接口获取token,将token携带到商城h5地址
				ServiceApi.createToken().then(res => {
					let token = res.data.result.token
					console.info(token)
					console.info(MALLH5_URL + "/pages/users/login/index?token="+ token)
					window.location.href= MALLH5_URL + "/pages/users/login/index?token="+ token;
					// if(id){
					// 	window.location.href=  MALLH5_URL + "/pages/goods_details/index?token="+ token + "&id=" + id;
					// }else{
					// 	window.location.href= MALLH5_URL + "?token="+ token;
					// }
				})
				// #endif
			},
			gotoLook(e) {
				if (e == '1') {
					uni.navigateTo({
						url: '/pages/manual/index?type=sc',
					});
				}
				if (e == '2') {
					uni.navigateTo({
						url: '/pages/manual/video',
					});
				}
			},
		}
	};
</script>

<style scoped lang="scss">
	.movableArea {
		position: fixed;
		z-index: 999;
		width: 100%;
		height: 750rpx;

		pointer-events: none; //设置area元素不可点击，则事件便会下移至页面下层元素

		.movableView {
			left: 80%;
			top: 65%;
			width: 120rpx;
			height: 120rpx;
			pointer-events: auto; //可以点击
		}
	}

	.fixed-jkm-img {
		cursor: pointer;
		width: 120rpx;
		border-radius: 50%;
		box-shadow: 0px 8px 16px 0px rgba(210, 210, 210, 0.5);
	}

	.group_11 {
		display: flex;
		justify-content: space-between;
		background-color: white;
		margin-bottom: 20rpx;
		padding: 30rpx 44rpx;
		border-radius: 20rpx;
		border: 1px solid #F5F5F5;
		// box-shadow: 0px 8px 16px 0px rgba(210, 210, 210, 0.5);
		width: 710rpx;
		overflow: hidden;
		position: relative;
	}

	.group-item {
		width: 350rpx;
		overflow: hidden;
		display: flex;
	}

	.line-col {
		width: 2rpx;
		height: 60rpx;
		border: 2rpx solid #F5F5F5;
		position: absolute;
		left: 50%;
		top: 30%;
	}

	.left-group {
		height: 82rpx;
	}

	.image_7 {
		width: 54rpx;
		height: 54rpx;
	}

	.list-item_1 {
		background-image: linear-gradient(94.8deg,
				rgb(50, 215, 178) 0%,
				rgb(50, 215, 178) -5.96%,
				rgb(0, 199, 255) 83.63%,
				rgb(0, 199, 255) 100%);
	}

	.list-item_2 {
		background: linear-gradient(90deg, #887AF6 0%, #0D8DFD 100%);
	}

	.list-item {
		width: 320rpx;
		padding: 24rpx 24rpx;
		// filter: drop-shadow(0px 8rpx 8rpx #d2d2d280);
		// box-shadow: 0px 8px 16px 0px rgba(210, 210, 210, 0.5);
		background-color: white;
		border-radius: 20rpx;

		&:nth-of-type(n+3) {
			margin-top: 20rpx;
		}
	}

	.image {
		border-radius: 50%;
		width: 92rpx;
		height: 92rpx;
	}

	.right-group {
		margin-left: 16rpx;
		margin-bottom: 8rpx;
		flex: 1 1 auto;
	}

	.text_3 {
		color: #333;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 44rpx;
		white-space: nowrap;
	}
	.text_3_yang {
		color: #de1730;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 44rpx;
		white-space: nowrap;
	}
	.text_3_yin {
		color: #36c81a;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 44rpx;
		white-space: nowrap;
	}

	.text_3_1 {
		color: white !important
	}

	.text_5_1 {
		color: white !important
	}

	.text_5 {
		color: #999;
		font-size: 28rpx;
		line-height: 40rpx;
		white-space: nowrap;
	}

	.page {
		background-color: #f9f9f9;
		width: 100%;
		// overflow-y: auto;
		height: 100%;
	}

	.section_1 {
		padding: 100rpx 20rpx 120rpx;
		flex: 1 1 auto;
		background-image: url('@/static/images/index_bg.jpg');
		background-position: 0px 0px;
		background-size: 750rpx 1458rpx;
		background-repeat: no-repeat;
		// overflow-y: auto;
	}

	.tab-bar {
		padding: 12rpx 135rpx 18rpx;
		background-color: rgb(255, 255, 255);
	}

	.text {
		margin-left: 4rpx;
		color: rgb(255, 255, 255);
		font-size: 36rpx;
		line-height: 50rpx;
		white-space: nowrap;
	}

	.group_2 {
		margin-top: 302rpx;
	}

	.text_1 {
		font-size: 48rpx;
		line-height: 58rpx;
		white-space: nowrap;
	}

	.text_2 {
		margin-top: 4rpx;
		color: transparent;
		font-size: 42rpx;
		line-height: 50rpx;
		white-space: nowrap;
		background-image: linear-gradient(180deg,
				rgb(255, 255, 255) 0%,
				rgb(255, 255, 255) 0%,
				rgb(100, 188, 255) 119.13%,
				rgb(100, 188, 255) 100%);
		-webkit-background-clip: text;
	}

	.list {
		padding: 22rpx;
		flex-wrap: wrap;
		justify-content: space-between;
		background: linear-gradient(360deg, #F6FBFF 0%, #E8F4FF 100%);
		border-radius: 20rpx;
		margin-bottom: 20rpx;
	}

	.group_3 {
		filter: drop-shadow(0px 8rpx 8rpx #d2d2d280);
		position: relative;
	}

	.section_6 {
		padding: 22rpx 22rpx 140rpx;
		border-radius: 20rpx;
		width: 270rpx;
		background-color: white;
		position: relative;
	}

	.img_15 {
		width: 136rpx;
		position: absolute;
		right: -12rpx;
		bottom: -20rpx;
	}

	.group_4 {
		color: rgb(255, 255, 255);
		font-size: 28rpx;
		font-weight: 500;
		line-height: 40rpx;
		white-space: nowrap;
		border-radius: 20rpx;
		width: 474rpx;
		position: absolute;
		right: -30rpx;
		top: 50%;
		transform: translateY(-50%);
	}

	.text_13 {
		color: rgb(51, 51, 51);
		font-size: 32rpx;
		font-weight: 500;
		line-height: 44rpx;
		white-space: nowrap;
	}

	.text_14 {
		color: rgb(102, 102, 102);
		font-size: 28rpx;
		line-height: 40rpx;
		white-space: nowrap;
	}

	.image_5 {
		border-radius: 20rpx;
		width: 420rpx;
	}

	.group_5 {
		width: 420rpx;
		position: absolute;
		right: 28rpx;
		bottom: 0rpx;
	}

	.image_6 {
		align-self: center;
		width: 66rpx;
		height: 66rpx;
	}

	.text-wrapper {
		margin-top: 53rpx;
		padding: 13rpx 0 14rpx;
		background-color: rgba(23, 119, 255, 0.68);
		border-radius: 0px 0px 20rpx 20rpx;
		width: 420rpx;
	}
	
	.mall-title {
		margin: 30rpx;
		font-size: 36rpx;
		font-weight: bold;
	}
	
	.conpon-body {
		margin-top: 22rpx;
		padding-left: 20rpx;
		border-radius: 16rpx;
		height: 160rpx;
		position: relative;

		.fly-mid {
			display: inline-block;
			height: 190rpx;
			width: 1px;
			margin-top: 15rpx;
			vertical-align: middle;
			background-color: #f2f2f2;
			position: relative;
			left: 84rpx;
		}

		.circle-top {
			margin-top: -15rpx;
			align-self: center;
			background-color: #fff;
			border-radius: 50%;
			width: 28rpx;
			height: 28rpx;
			left: 176rpx;
			position: absolute;
		}
		.dotted-line {
			width: 1px;
			height: 160rpx;
			border-left: 3px dotted #eee;
			border-bottom: none;
			border-top: none;
			border-right: none;
			top: 16rpx;
			left: 188rpx;
			position: absolute;
		}

		.circle-botton {
			// margin-top: -14rpx;
			align-self: center;
			background-color: #fff;
			border-radius: 50%;
			width: 28rpx;
			height: 28rpx;
			left: 176rpx;
			bottom: -13rpx;
			position: absolute;
		}

		.left-space {
			position: absolute;
			left: 36rpx;
			top: 16rpx;
		}

		.right-space {
			font-size: 24rpx;
			white-space: nowrap;
			position: absolute;
			left: 210rpx;
			top: 28rpx;
			width: 484rpx;

			.title {
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: bold;
				color: #333333;
				font-size: 30rpx;
				width: 310rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.used-price {
				display: flex;
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #f93323;
			}
			.tbig {
				font-size: 40rpx;
				font-weight: bold;
				margin-left: 4rpx;
				margin-top: -4rpx;
			}
			.tlitt {
				font-size: 26rpx;
				font-weight: bold;
				margin-top: 8rpx;
			}
			.mag-left {
				margin-left: 12rpx;
			}
			.origin-price {
				margin-left: 12rpx;
				font-weight: 400;
				color: #999999;
				font-size: 24rpx;
				display: flex;
				align-items: center;
				.origin-price-text {
					// text-decoration: line-through;
				}
				.origin-money-price-text {
					font-size: 24rpx;
				}
			}

			.money-button-buy {
				margin-left: 260rpx;
				margin-top: 118rpx;
				padding: 8rpx 24rpx;
				color: rgb(255, 255, 255);
				font-size: 28rpx;
				font-weight: 500;
				line-height: 40rpx;
				white-space: nowrap;
				background-image: linear-gradient(115.5deg, rgb(250, 100, 0) 0%, rgb(250, 100, 0) 3.15%, rgb(240, 38, 11) 104.62%, rgb(240, 38, 11) 100%);
				border-radius: 28rpx;
				width: 148rpx;
				height: 56rpx;
			}

			.button-buy {
				margin-top: -10rpx;
				color: rgb(255, 255, 255);
				font-size: 28rpx;
				font-weight: bold;
				width: 152rpx;
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				background: #f93323;
				border-radius: 30px;
			}
		}
	}
</style>
