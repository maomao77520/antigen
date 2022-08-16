<template>
	<view class="flex-col page">
		<auth ref='auth'></auth>
		<view class="flex-col group_4">
			<view class="flex-col section_1">
				<view class="center-group justify-between">
					<view class="left-group">
						<text class="text_6">*</text>
						<text class="text_8">姓名</text>
					</view>
					<input class="text_input" type="text" v-model="obj.name" placeholder="请输入" />
				</view>
				<view class="justify-between group_5" @click="modeChange()">
					<view class="left-group">
						<text class="text_2">*</text>
						<text class="text_3">关系</text>
					</view>
					<view class="flex-row group_6">
						<text>{{ obj.relatives ? obj.relatives : '请选择' }}</text>
						<image src="/static/images/icon_right.png" class="image_5 image_6" />
					</view>
				</view>
				<view class="flex-col group_9">
					<view class="flex-col">
						<view class="center-group justify-between">
							<view class="left-group">
								<text class="text_6">*</text>
								<text class="text_8">证件类型</text>
							</view>
							<text class="text_10">{{ obj.idType }}</text>
						</view>
						<view class="center-group justify-between">
							<view class="left-group">
								<text class="text_6">*</text>
								<text class="text_8">证件号码</text>
							</view>
							<input class="text_input" type="text" v-model="obj.idcard" placeholder="请输入" />
						</view>
						<view class="justify-between group_11" @click="clickPicker">
							<view class="left-group">
								<text class="text_21">*</text>
								<text class="text_22">采样地址</text>
							</view>
							<view class="flex-row group_12">
								<text v-if="obj.reginput">{{ obj.reginput }}</text>
								<text v-else style="color: #999999">请选择</text>
								<image src="/static/images/icon_right.png" class="image_6" />
							</view>
						</view>
						<view class="justify-between group_13">
							<view class="left-group view_10">
								<text class="text_24">*</text>
								<text class="text_25">详细地址</text>
							</view>
							<!-- <input class="text_input" type="text" v-model="obj.address" placeholder="请输入" /> -->
							<textarea class="text_4" maxlength="100" v-model="obj.address" placeholder="请详细地址"
								placeholder-class="input-place" />
						</view>
					</view>
				</view>
			</view>
			<view class="grd-1" v-if="familyList.length>0">
				<view class="item-1">{{familyList.length}}位家人</view>
					<view class="item-2">
						<template v-for="(item,index) in familyList">
						<view class="item-2-1">
							<view @click="clickItem(index)" :class="currFitem==index?'item-3-curr':''" class="item-3">{{item.user_name}}</view>
						</view>
						</template>
					</view>
			</view>
			<view class="flex-col items-center button" @click="nextbtn"><text>下一步</text></view>
		</view>
		<!-- 弹窗 -->
		<template>
			<u-picker :mode="mode" v-model="pshow" @confirm="confirm" :range="range" :range-key="rangKey"></u-picker>
		</template>
	</view>
</template>

<script>
import ServiceApi from '@/api/api.js';
export default {
	data() {
		return {
			obj: {
				name: '',
				isOther: true,
				phone: '',
				idcard: '',
				relatives:'',
				idType: '身份证',
				reginput: '',
				address: '',
				relativesId: ''
			},
			pshow: false,
			rangKey: 'name',
			mode: 'selector',
			range: ['夫妻', '父子', '父女', '母子', '母女', '兄弟', '姐妹'],
			familyList:[],
			currFitem:'99',
			latitude: 0, //纬度
			longitude: 0, //经度
		};
	},
	onLoad(e) {
		this.getRelatives()
	},
	methods: {
		clickItem(index){
			this.currFitem = index
			this.obj.name = this.familyList[index].user_name
			this.obj.idcard = this.familyList[index].id_card
			this.obj.relatives = this.familyList[index].relationship
			this.obj.idType = this.familyList[index].id_card_type
			this.obj.relativesId = this.familyList[index].user_info_id
		},
		modeChange() {
			this.pshow = true;
		},
		getRelatives(){
			let that = this
			uni.showLoading()
			setTimeout(() => {
				uni.hideLoading()
				let flag = that.$refs.auth.getUserBaseInfo();
				console.log(flag)
				flag.then(r => {
					ServiceApi.getRelatives().then(resp=>{
						if(resp.data.status==200){
							// #ifdef MP-ALIPAY
							monitor.api({api:"getRelatives",success:true,c1:"taSR",time:0})
							// #endif
							that.familyList = []
							that.familyList = resp.data.result
						}else{
							// #ifdef MP-ALIPAY
							monitor.api({api:"getRelatives",success:false,c1:"taSR",time:0})
							// #endif
						}
					})
				})
			}, 1200);
		},
		confirm(e) {
			this.obj.relatives = this.range[e[0]];
		},
		clickPicker() {
			let that = this
			uni.chooseLocation({
				success: function (res) {
					console.log(res)
					console.log('位置名称：' + res.name);
					console.log('详细地址：' + res.address);
					
					var reg = /.+?(省|市|自治区|自治州|县|区)/g;
					var addressList = res.address.match(reg).toString().split(",");
					var province = addressList[0]
					var city = addressList[1]
					var region = addressList[2]
					
					console.log('详细地址：' + province);
					console.log('详细地址：' + city);
					console.log('详细地址：' + region);
					
					that.obj.reginput = city + region
					that.obj.address = res.address + res.name
				}, fail(error) {
					this.$refs.selectAddress.show()
				}
			})
		},
		regionchange(e) {
			this.obj.reginput = e;
		},
		nextbtn() {
			let idcardt = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/;
			let phonet = /^1(3|4|5|7|8|9|6)\d{9}$/;
			let regName = /^\d/;
			if (!this.obj.name) {
				uni.showToast({
					title: '请输入真实姓名',
					icon: 'none',
					complete: function (res) {
						return;
					}
				})
			}
			if (regName.test(this.obj.name)) {
				uni.showToast({
					title: '请输入真实姓名',
					icon: 'none'
				});
				return;
			} else if (!this.obj.relatives) {
				uni.showToast({
					title: '请选择关系',
					icon: 'none'
				});
				return;
			} else if (!this.obj.relativesId) {
				if(!idcardt.test(this.obj.idcard)){
					uni.showToast({
						title: '请输入正确身份证号码',
						icon: 'none'
					});
					return;
				}
			}
			// 验证地址是否完整
			if (!this.obj.reginput) {
			    uni.showToast({
					title: '请输入采样地址',
					icon: 'none'
				})
			    return;
			}

			// 验证地址是否完整
			if (!this.obj.address) {
				uni.showToast('请输入详细地址');
				return;
			}
			
			uni.navigateTo({
			    url: '../querentijiao/querentijiao' + this.parseParamsToStr({...this.obj})
			});
		},

		/**
		 * 处理参数对象转化成链接字符串
		 * @param params 参数对象
		 */
		parseParamsToStr(params, firstChar = '?') {
			if (params instanceof Array || typeof params != 'object' || Object.keys(params).length == 0) {
				return '';
			}
			let paramsStr = '';
			for (let key in params) {
				paramsStr += `&${key}=${params[key]}`;
			}
			return firstChar + paramsStr.substring(1);
		},

		/**
		 * 封装提示窗口
		 */
		showToast(title, duration = 2000) {
			uni.showToast({ title, duration });
		}
	}
};
</script>

<style scoped lang="scss">
.grd-1 {
	padding: 50rpx 30rpx 40rpx 0;
}
.item-1 {
	padding: 0 30rpx;
	margin-bottom: 30rpx;
	color: #1777FF;
}
.item-2 {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 20rpx;
}
.item-2-1{
	width: 33.33%;
	padding: 0rpx 0rpx 0 30rpx;
}
.item-3-curr {
	border: 1px solid #1777FF !important;
	color: #1777FF!important;
	background-color: #D6E7FF!important;
}
.item-3 {
	width: 100%;
	border-radius: 20rpx;
	border: 1px solid #EEEEEE;
	color: #000;
	background-color: #EEEEEE;
	text-align: center;
	padding: 20rpx 0;
	font-weight: bold;
	margin-bottom: 30rpx;
}
.group_18 {
	margin-right: 6rpx;
	color: rgb(0, 0, 0);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
}

.image_10 {
	margin: 5rpx 0 3rpx 9rpx;
	width: 34rpx;
	height: 34rpx;
}

.center-group {
	padding: 35rpx 12rpx 33rpx;
	border-bottom: solid 2rpx rgb(249, 249, 249);
}

.left-group {
	white-space: nowrap;
	height: 40rpx;
}
.text_4 {
	height: 150rpx;
	color: rgb(0, 0, 0);
	font-size: 28rpx;
	line-height: 40rpx;
	padding-right: 20rpx;
	text-align: right;
	width: 100% !important;
}
.text_6 {
	color: rgb(250, 100, 0);
	font-size: 28rpx;
	line-height: 40rpx;
}

.text_8 {
	color: rgb(102, 102, 102);
	font-size: 28rpx;
	line-height: 40rpx;
}

.text_10 {
	margin-right: 20rpx;
	color: rgb(51, 51, 51);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
}

.text_input {
	width: 100%;
	text-align: right;
	padding-right: 20rpx;
	color: #333333 !important;
}

input:disabled {
	color: #333 !important;
	opacity: 1; //默认的不透明级别为0.3
	-webkit-text-fill-color: #666; //字体颜色安卓与IOS适配
	-webkit-opacity: 1; //不透明级别安卓与IOS适配
}

.page {
	background-color: #f9f9f9;
	width: 100%;
	overflow-y: auto;
	height: 100%;
}

.group_4 {
	flex: 1 1 auto;
	overflow-y: auto;
}

.section_1 {
	padding-left: 14rpx;
	background-color: rgb(255, 255, 255);
}

.button {
	margin: 80rpx 28rpx 0 30rpx;
	padding: 24rpx 0 22rpx;
	color: rgb(255, 255, 255);
	font-size: 32rpx;
	font-weight: 500;
	line-height: 44rpx;
	white-space: nowrap;
	background-color: rgb(23, 119, 255);
	border-radius: 45rpx;
}

.group_5 {
	padding: 34rpx 12rpx 33rpx;
	border-bottom: solid 2rpx rgb(249, 249, 249);
}

.group_9 {
	padding-top: 2rpx;
}

.group_6 {
	margin-right: 20rpx;
	color: rgb(51, 51, 51);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
}

.text_2 {
	color: rgb(250, 100, 0);
	font-size: 28rpx;
	line-height: 40rpx;
}

.text_3 {
	color: rgb(102, 102, 102);
	font-size: 28rpx;
	line-height: 40rpx;
}

.group_8 {
	margin-left: 64rpx;
}

.group_11 {
	padding: 29rpx 12rpx 35rpx;
	border-bottom: solid 2rpx rgb(249, 249, 249);
}

.group_13 {
	padding: 28rpx 12rpx 35rpx;
}

.image_5 {
	border-radius: 50%;
	width: 40rpx;
	height: 40rpx;
}

.text_4 {
	margin-left: 10rpx;
}

.section_2 {
	border-radius: 50%;
	width: 40rpx;
	height: 40rpx;
	border: solid 2rpx rgb(216, 216, 216);
}

.section_2_curr {
	border: solid 8rpx #1777FF !important;
}

.text_5 {
	margin-left: 10rpx;
}

.group_12 {
	margin-right: 20rpx;
	color: rgb(51, 51, 51);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
}

.view_10 {
	margin-top: 6rpx;
}

.text_26 {
	margin-right: 20rpx;
	margin-bottom: 6rpx;
	color: rgb(153, 153, 153);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
}

.text_21 {
	color: rgb(250, 100, 0);
	font-size: 28rpx;
	line-height: 40rpx;
}

.text_22 {
	color: rgb(102, 102, 102);
	font-size: 28rpx;
	line-height: 40rpx;
}

.image_6 {
	margin: 7rpx 0 5rpx 10rpx;
	width: 16rpx;
	height: 28rpx;
}

.text_24 {
	color: rgb(250, 100, 0);
	font-size: 28rpx;
	line-height: 40rpx;
}

.text_25 {
	color: rgb(102, 102, 102);
	font-size: 28rpx;
	line-height: 40rpx;
}
</style>
