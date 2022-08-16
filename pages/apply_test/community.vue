<template>
    <view class="flex-col page">
		<auth ref='auth'></auth>
        <view class="flex-col group_4">
            <view class="flex-col section_1">
                <view class="center-group justify-between" v-if="stype != 'person'">
                    <view class="left-group">
                        <text class="text_6">*</text>
                        <text class="text_8">检测编码</text>
                    </view>
                    <view class="flex-row group_18">
                        <input v-if="stype=='community'" type="text" v-model="qrcode" class="qrcodeinput"
                               placeholder-class="placeholder_qrcode" placeholder="扫描社区检测二维码" :disabled="true"/>
                        <image @click="scanCode"
                               src="/static/images/icon_sys_scan.png"
                               class="image_10"
                        />
                    </view>
                </view>
                <view class="center-group justify-between" v-if="stype=='community'">
                    <view class="left-group">
                        <text class="text_6">*</text>
                        <text class="text_8">社区名称</text>
                    </view>
                    <input class="text_input" type="text" v-model="obj.communityName" disabled
                           placeholder-class="placeholder_qrcode" placeholder="扫码后读取社区名称"/>
                </view>
                <view v-if="stype!='unit'" class="justify-between group_5">
                    <view class="left-group">
                        <text class="text_2">*</text>
                        <text class="text_3">检测人</text>
                    </view>
                    <view class="flex-row group_6">
                        <view class="flex-row" @click="ismine('1')">
                            <view class="section_2" :class="isme=='1'?'section_2_curr':''"></view>
                            <text class="text_4">本人</text>
                        </view>
                        <view class="flex-row group_8" @click="ismine('0')">
                            <view class="section_2" :class="isme=='0'?'section_2_curr':''"></view>
                            <text class="text_5">非本人</text>
                        </view>
                    </view>
                </view>
                <view class="center-group justify-between">
                    <view class="left-group">
                        <text class="text_6">*</text>
                        <text class="text_8">姓名</text>
                    </view>
                    <input class="text_input" type="text" v-model="obj.name" :disabled="disInput" placeholder="请输入"/>
                </view>
                <view class="flex-col group_9">
                    <view class="center-group justify-between">
                        <view class="left-group">
                            <text class="text_6">*</text>
                            <text class="text_8">手机号</text>
                        </view>
                        <input class="text_input" v-if="obj.phone" type="text" maxlength="11" v-model="obj.phone" :disabled="disInput"
                               placeholder="请输入"/>
                        <input class="text_input" v-else type="number" maxlength="11" v-model="obj.phone" :disabled="disInput"
                        	          placeholder="请输入"/>
                    </view>
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
                            <input class="text_input" type="text" v-model="obj.idcard" :disabled="disInput"
                                   placeholder="请输入"/>
                        </view>
                        <view class="justify-between group_11" @click="clickPicker">
                            <view class="left-group">
                                <text class="text_21">*</text>
                                <text class="text_22">采样地址</text>
                            </view>
                            <view class="flex-row group_12">
                                <text v-if="obj.reginput">{{obj.reginput}}</text>
                                <text v-else style="color: #999999">请选择</text>
                                <image
                                        src="/static/images/icon_right.png"
                                        class="image_6"
                                />
                            </view>
                        </view>
                        <view class="justify-between group_13">
                        	<view class="left-group view_10">
                        		<text class="text_24">*</text>
                        		<text class="text_25">详细地址</text>
                        	</view>
                        	<textarea class="textarea_1" maxlength="100" v-model="obj.address" placeholder="请详细地址"
                        		placeholder-class="input-place" />
                        </view>
                    </view>
                </view>
            </view>
            <view class="flex-col items-center button" @click="nextbtn">
                <text>下一步</text>
            </view>
        </view>
        <!-- popup -->
        <selectAddress ref='selectAddress' @selectAddress="regionchange"></selectAddress>
    </view>
</template>

<script>
	import monitor from '@/utils/alipayLogger'
	import { reportCmPV } from '@/utils/cloudMonitorHelper';
    import ServiceApi from '@/api/api.js'
    import selectAddress from '@/components/yixuan-selectAddress/yixuan-selectAddress.vue'
    import auth from '@/components/auth.vue'
	import { execPlugin } from '@/utils/croods.js'
    export default {
        components: {selectAddress, auth},
        data() {
            return {
                isme: '1',
                obj: {
				},
                isMeObj: {
					batchNo: '',
                    communityName: '',
                    name: '',
                    phone: '',
                    idcard: '',
                    idType: '居民身份证',
                    reginput: '',
                    address: '',
                },
                notMeObj: {
					communityName: '',
                    name: '',
                    phone: '',
					idType: '居民身份证',
                    idcard: '',
                    reginput: '',
                    address: '',
                },
                pickerShow: false,
                stype: null,
                qrcode: '',
				latitude: 0, //纬度
				longitude: 0, //经度
            };
        },
        computed: {
            disInput() {
                return this.isme == "1"
            }
        },
        onLoad(e) {
			this.stype = 'community'
            this.obj = this.isMeObj
            this.getUserInfo()
        },
        methods: {
            getUserInfo() {
				let that = this
				uni.showLoading()
				setTimeout(() => {
					uni.hideLoading()
					let flag = that.$refs.auth.getUserBaseInfo();
					console.log(flag)
					flag.then(r => {
						console.info('r=' + r)
						if (r) {
							ServiceApi.userInfo().then(res => {
							    if (res.data.status == 200) {
							        const {realName, idType, idNo, phone} = res.data.result
							        that.isMeObj.name = realName
							        that.isMeObj.idcard = idNo
							        that.isMeObj.idType = idType
							        that.isMeObj.phone = phone
							    } else {
							        uni.showToast({title: '获取登录信息失败', icon: 'none'});
							        that.ismine('0')
							    }
							})
						} else {
							uni.showToast({
								icon: 'error',
								title: '授权失败'
							})
						}
					})
				}, 1200);
            },
            scanCode() {
				let that = this
				// // #ifdef MP-ALIPAY
				// uni.scanCode({
				//     success: function (res) {
				//         console.log('条码类型：' + res.scanType);
				//         console.log('条码内容：' + res.result);
				// 		that.qrcode = res.result
				// 		that.obj.batchNo = res.result
				// 		that.getPlaceNameByBatchNo(res.result)
				//     }
				// })
				// // #endif
				// // #ifdef H5
				// execPlugin({
				// 	action: 'QRCodePlugin.scanCode',
				// 	params: {scanType: "1"},
				// 	success: function (res) {
				// 		that.qrcode = res.result
				// 		that.obj.batchNo = res.result
				// 		that.getPlaceNameByBatchNo(res.result)
				// 	}
				// })
				// // #endif
            },
			getPlaceNameByBatchNo(batchNo){
				let that = this
				//查询场所信息
				ServiceApi.getPlaceNameByBatchNo(batchNo).then(resp=>{
					if(resp.data.status==200){
						// #ifdef MP-ALIPAY
						monitor.api({api:"getPlaceNameByBatchNo",success:true,c1:"taSR",time:0})
						// #endif
						that.obj.communityName = resp.data.result.placeName
						that.isMeObj.communityName = resp.data.result.placeName
						that.notMeObj.communityName = resp.data.result.placeName
					}else{
						// #ifdef MP-ALIPAY
						monitor.api({api:"getPlaceNameByBatchNo",success:false,c1:"taSR",time:0})
						// #endif
					}
				})
			},
            clickPicker() {
            	let that = this
                // #ifdef H5
            	if(that.obj.reginput){
            		this.$refs.selectAddress.show()
            	}else{
					execPlugin({
						action: 'BaiduMapPlugin.getLocation',
						success: function (res) {
							console.log(res);
							that.obj.reginput = res.city + res.district
							that.obj.address = res.locationDescribe
						},
						fail: function (msg) {
							uni.showToast({
								title: '定位失败，请开启手机定位',
								icon: 'none'
							});
						}
					})
				}
            	// #endif
            	// #ifdef MP-ALIPAY
            	uni.getLocation({
            		type: 'gcj02',
            		geocode: true,
            		success: function (res) {
            			console.log('当前位置的经度：' + res.longitude);
            			console.log('当前位置的纬度：' + res.latitude);
            			console.log('当前位置的信息：' + res.address);
            			that.latitude = res.latitude
            			that.longitude = res.longitude
            			uni.chooseLocation({
            				success: function (res) {
            					console.log(res)
            					console.log('位置名称：' + res.name);
            					console.log('详细地址：' + res.address);
            					console.log('纬度：' + res.latitude);
            					console.log('经度：' + res.longitude);
            					that.obj.reginput = res.cityName + res.adName
            					that.obj.address = res.address
            				}
            			})
            		}
            	})
            	// #endif
            },
            regionchange(e) {
                this.obj.reginput = e;
            },
            ismine(e) {
                this.isme = e
                if (e == "1") {
					console.log('isMeObj=')
					console.log(this.isMeObj)
                    this.obj = this.isMeObj
                }
                if (e == "0") {
					console.log('notMeObj=')
					console.log(this.notMeObj)
                    this.obj = this.notMeObj
                }
            },
            nextbtn() {
                let idcardt = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/
                let phonet = /^1(3|4|5|7|8|9|6)\d{9}$/
                if (this.isme == '0') {
                    if (!this.obj.name) {
                        uni.showToast({
                            title: '请输入真实姓名',
                            icon: 'none'
                        });
                        return;
                    } else if (!phonet.test(this.obj.phone)) {
                        uni.showToast({
                            title: '请输入11位手机号',
                            icon: 'none'
                        });
                        return;
                    } else if (!idcardt.test(this.obj.idcard)) {
                        uni.showToast({
                            title: '请输入正确身份证号码',
                            icon: 'none'
                        });
                        return;
                    }
                }
                
				if (!this.obj.batchNo) {
					uni.showToast({
						title: '请扫描社区二维码',
						icon: 'none'
					});
					return;
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
                    uni.showToast({
						title: '请输入详细地址',
						icon: 'none'
					})
                    return;
                }

                uni.navigateTo({
                    url: '../querentijiao/querentijiao' + this.parseParamsToStr({...this.obj, isOther: this.isme == 0})
                });
            },


            /**
             * 处理参数对象转化成链接字符串
             * @param params 参数对象
             */
            parseParamsToStr(params, firstChar = '?') {
                if ((params instanceof Array) || typeof params != 'object' || Object.keys(params).length == 0) {
                    return ''
                }
                let paramsStr = ''
                for (let key in params) {
                    paramsStr += `&${key}=${params[key]}`
                }
                return firstChar + paramsStr.substring(1)
            },

            /**
             * 封装提示窗口
             */
            showToast(title, duration = 2000) {
                uni.showToast({ title, duration});
            }

        }
    };
</script>

<style scoped lang="scss">
    .group_18 {
        margin-right: 6rpx;
        color: rgb(0, 0, 0);
        font-size: 28rpx;
        line-height: 40rpx;
        white-space: nowrap;
    }

    .qrcodeinput {
        width: 420rpx;
        text-align: right;
        overflow: scroll;
    }

    .image_10 {
        margin: 5rpx 0 3rpx 9rpx;
        width: 34rpx;
        height: 34rpx;
    }

    .placeholder_qrcode {
        color: #999999 !important;
    }

    .center-group {
        padding: 35rpx 12rpx 33rpx;
        border-bottom: solid 2rpx rgb(249, 249, 249);
    }

    .left-group {
        white-space: nowrap;
        height: 40rpx;
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

	.textarea_1 {
		height: 150rpx;
		color: rgb(0, 0, 0);
		font-size: 28rpx;
		line-height: 40rpx;
		padding-right: 20rpx;
		text-align: right;
		width: 100% !important;
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
        border: solid 8rpx #347dff !important;
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
