<template>
	<view>
		<view class="flex-col page">
			<view class="flex-col group_4">
				<view class="flex-col section_1">
					<view class="flex-col group_5">
						<view class="justify-center group_6">
							<view class="group_7">
								<text class="text_2">*</text>
								<text class="text_3">上传照片</text>
							</view>
							<helangCompress ref="helangCompress" />
							<view class="flex-col section_2" @click="chooseImage">
								<view class="flex-col" v-if="!selectImg">
									<image src="/static/images/icon_scan.png" class="image_5" />
									<text class="text_4">
										拍照/相册
										<br />
										上传试剂盒图片
									</text>
								</view>
								<view class="" v-if="selectImg"><image :src="selectImg" mode="widthFix" class="image_5_1"></image></view>
							</view>
						</view>
						<view class="text_5" @click="looksl">查看示例</view>
					</view>
					<view class="justify-between group_8" @click="pshow = true">
						<view class="left-group">
							<text class="text_6">*</text>
							<text class="text_8">采样方式</text>
						</view>
						<view class="flex-row group_9">
							<text :class="cyResult ? '' : 'text-999'">{{ cyResult ? cyResult :'请选择' }}</text>
							<image :src="right_icon" class="image_6" />
						</view>
					</view>
					<view class="justify-between group_10" @click="dataShow = true">
						<view class="left-group">
							<text class="text_6">*</text>
							<text class="text_8">采样时间</text>
						</view>
						<view class="flex-row group_11">
							<text :class="timeIput ? '' : 'text-999'">{{ timeIput || '请选择' }}</text>
							<image :src="right_icon" class="image_6" />
						</view>
					</view>
					<view class="justify-between group_12">
						<view class="left-group">
							<text class="text_6">*</text>
							<text class="text_8">检测结果</text>
						</view>
						<view class="flex-row group_13">
							<view class="flex-row" @click="result('1')">
								<view class="left-section" :class="isend == '1' ? 'section_2_curr' : ''"></view>
								<text class="text_16">阳性</text>
							</view>
							<view class="flex-row group_15" @click="result('2')">
								<view class="left-section" :class="isend == '2' ? 'section_2_curr' : ''"></view>
								<text class="text_17">阴性</text>
							</view>
							<view class="flex-row group_16" @click="result('3')">
								<view class="left-section" :class="isend == '3' ? 'section_2_curr' : ''"></view>
								<text class="text_18">无效结果</text>
							</view>
						</view>
					</view>
					<view class="exampleImgClass">
						<template v-for="(item, index) in exampleImg">
							<view class="eic-item">
								<image class="eic-img" :src="item.url" mode="widthFix"></image>
								<view class="eic-name-invaild" :class="index==0?'eic-name-postive':index==1?'eic-name-postive':index==2?'eic-name-negative':''">{{ item.name }}</view>
							</view>
						</template>
					</view>
					<view class="justify-between group_17">
						<text class="text_19">试剂编号</text>
						<view class="flex-row group_18">
							<input type="text" v-model="qrcode" class="qrcodeinput" placeholder-class="placeholder_qrcode" placeholder="请扫描试剂盒上条形码/二维码" />
							<image @click="scanCode" src="/static/images/icon_sys_scan.png" class="image_10" />
						</view>
					</view>
				</view>
				<view class="flex-col group_19">
					<view class="flex-row group_20" @click="clickLj">
						<view class="section_3" :class="isLj ? 'section_2_curr' : ''"></view>
						<view class="group_21">
							<text class="text_21">我确认所提交的信息准确无误，并同意桂原测使用我所提交的信息用于新冠抗原检测数据信息的存储及统计。</text>
							<text class="text_22"><br /></text>
							<view class="text_23"><br /></view>
							<text class="text_24">
								请知悉：您在桂原测提交、记录的个人信息及新冠抗原检测数据均由您自行提供，您需对信息数据的来源及内容的真实性、准确性、合法性承担全部法律责任，桂原测对此不承担任何责任！
							</text>
						</view>
					</view>
					<view class="flex-col items-center button" @click="submit"><text>确认提交</text></view>
				</view>
			</view>
		</view>

		<mx-date-picker
			:show="dataShow"
			type="datetime"
			:value="timeIput"
			:show-seconds="false"
			@confirm="d => (timeIput = d.value.replace(/\//g, '-')) && (dataShow = false)"
			@cancel="dataShow = false"
		/>


		<!-- 弹窗 -->
		<template>
			<u-picker :mode="mode" v-model="pshow" @confirm="confirm" :range="range" :range-key="rangKey"></u-picker>
		</template>

		<!--        <template>-->
		<!--            <u-picker mode="selector"-->
		<!--                    v-model="pshow"-->
		<!--                    :params="params"-->
		<!--                    @confirm="confirm"-->
		<!--                    :range="range"-->
		<!--                    :range-key="rangKey"-->
		<!--            ></u-picker>-->
		<!--        </template>-->

		<template>
			<u-popup :border-radius="40" v-model="addrshow" mode="bottom" :closeable="closeable" :close-icon-pos="closeIconPos" @close="close">
				<view class="up-title">图片示例</view>
				<view class="up-cont">
					<view class="up-cont-bg"><image class="up-img" src="/static/images/img_shili.png" mode="widthFix"></image></view>
				</view>
			</u-popup>
		</template>
	</view>
</template>

<script>
import monitor from '@/utils/alipayLogger'
import { reportCmPV } from '@/utils/cloudMonitorHelper';
import ServiceApi from '@/api/api.js';
import {FRONTSERVICE_URL} from '@/utils/config.js';
import mxDatePicker from '@/components/mx-datepicker/mx-datepicker';
import helangCompress from '@/components/helang-compress/helang-compress';
export default {
	components: { mxDatePicker,helangCompress },
	data() {
		return {
			isCommitted: false,
			prePageData: '',
			isend: '0',
			isLj: false,
			pshow: false,
			dataShow: false,
			rangKey: 'name',
			mode: 'selector',
			imgDataUrl: '',
			range: ['鼻腔拭子', '鼻咽拭子','口腔拭子'],
			params: {
				year: true,
				month: true,
				day: true,
				hour: true,
				minute: true,
				second: false
			},
			timeIput: '',
			cyResult: '',
			testType: '',
			qrcode: '',
			selectImg: '',
			addrshow: false,
			closeable: true,
			closeIconPos: 'top-right',
			right_icon: '/static/images/icon_right.png',
			exampleImg: [
				{
					url: '/static/images/icon_positive_1.png',
					name: '阳性'
				},
				{
					url: '/static/images/icon_positive_2.png',
					name: '阳性'
				},
				{
					url: '/static/images/icon_negative.png',
					name: '阴性'
				},
				{
					url: '/static/images/icon_invalid_1.png',
					name: '无效'
				},
				{
					url: '/static/images/icon_invalid_2.png',
					name: '无效'
				}
			]
		};
	},
	onLoad(params) {
		// #ifdef MP-ALIPAY
		reportCmPV({ title: '抗原检测确认提交', params});
		// #endif
		console.info(params)
		if(params.qrcode){
			this.qrcode = params.qrcode
		}
		this.prePageData = params || {}
	},
	methods: {
		submit() {
			this.isCommitted = true
			if (!this.imgDataUrl) {
				this.isCommitted = false
			    uni.showToast({
			        title: '请选上传照片',
			        icon: 'none'
			    });
			    return;
			}
			if (this.cyResult === '') {
				this.isCommitted = false
				uni.showToast({
					title: '请选择采样方式',
					icon: 'none'
				});
				return;
			} else if (this.timeIput === '') {
				this.isCommitted = false
				uni.showToast({
					title: '请选择采样时间',
					icon: 'none'
				});
				return;
			} else if (this.isend == '0') {
				this.isCommitted = false
				uni.showToast({
					title: '请选择检测结果',
					icon: 'none'
				});
				return;
			} else if (!this.isLj) {
				this.isCommitted = false
				uni.showToast({
					title: '请勾选确认信息',
					icon: 'none'
				});
				return;
			}

			const { timeIput, isend, qrcode, imgDataUrl, testType } = this;
			const { reginput, address, phone, idcard, name, isOther,relatives,relativesId,idType,testImg,batchNo } = this.prePageData;
			uni.showLoading()
			ServiceApi.uploadCheckResult({
				batchNo,
				testType: testType,
				testTime: timeIput,
				testResult: isend,
				testBoxInfo: qrcode,
				name,
				idNo: idcard,
				phone,
				address,
				area: reginput,
				isOther,
				relatives,
				idType,
				relativesId,
				testImg: imgDataUrl
			}).then(res => {
				uni.hideLoading()
				if (res.data.status === 200) {
					uni.showToast({
						title:'提交成功',
						icon:'none',
						duration:1000
					})
					setTimeout(()=>{
						uni.reLaunch({
							url: '/pages/index/index'
						});
					},1000)
				} else {
					this.isCommitted = false
				}
			}).catch(error=>{
				this.isCommitted = false
			})
		},
		looksl() {
			console.log('rini');
			this.addrshow = true;
		},
		close() {
			this.addrshow = false;
		},
		clickLj() {
			this.isLj = !this.isLj;
		},
		confirm(e) {
			console.log(e)
			this.pshow = false;
			this.cyResult = this.range[e[0]];
			this.testType = e[0] + 1
		},
		scanCode() {
			let that = this
			// // #ifdef MP-ALIPAY
			// uni.scanCode({
			// 	success: function(res) {
			// 		console.log('条码类型：' + res.scanType);
			// 		console.log('条码内容：' + res.result);
			// 		that.qrcode = res.result;
			// 	}
			// });
			// // #endif
			// // #ifdef H5
			// execPlugin({
			// 	action: 'QRCodePlugin.scanCode',
			// 	params: {scanType: "1"},
			// 	success: function (res) {
			// 		// let res = {token: 'c30d0040-c40a-4f63-bd2d-07f424ee6008'}
			// 		that.qrcode = res.result;
			// 	}
			// })
			// // #endif
		},
		chooseImage() {
			let _this = this;
			// #ifdef H5
			// 单张压缩
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['camera', 'album'], //这要注意，camera掉拍照，album是打开手机相册
				success: res => {
					const tempFilePaths = res.tempFilePaths;
					this.$refs.helangCompress.compress({
					    src:tempFilePaths[0],
					    maxSize:800,
					    fileType:'jpg',
					    quality:0.85,
					    minSize:640 //最小压缩尺寸，图片尺寸小于该时值不压缩，非H5平台有效。若需要忽略该设置，可设置为一个极小的值，比如负数。
					}).then((res)=>{
					    // 压缩成功回调
						console.info(res)
						var res = res.substring(res.indexOf(",")+1)
						ServiceApi.uploadBase64({file: res, type: 'antigen'}).then(uploadFileRes=>{
							uni.hideLoading()
							if(uploadFileRes.status === 200){
								_this.selectImg = uploadFileRes.data.url
								_this.imgDataUrl = uploadFileRes.data.url
								let resultStr = uploadFileRes.data.result
								if(resultStr){
									let result = JSON.parse(resultStr)
									result.output[0].body.forEach(b=>{
										let conf = b.conf
										let label = b.label
										if(conf == 1){
											switch (label){
												case 'NAGATIVE':
													_this.isend = '2'  // 阴性
													break;
												case 'INVALID':
													_this.isend = '3'  // 无效
													break;
												case 'POSITIVE':
													_this.isend = '1'  // 阳性
													break;
												default :
													_this.isend = '3'  // 无效
											}
										}
									})
								}
							}else{
								uni.showToast({ title: '照片上传失败', icon: 'none' })
							}
						})
						
					}).catch((err)=>{
					    // 压缩失败回调
					})
				}
			})
			// #endif
			// #ifdef MP-ALIPAY
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['camera', 'album'], //这要注意，camera掉拍照，album是打开手机相册
				success: res => {
					console.log(res);
					const tempFilePaths = res.tempFilePaths;
					uni.uploadFile({
						url: FRONTSERVICE_URL+'/file/image/uploadAntigenImg.do', //服务器地址
						fileType: 'image', //ZFB必填,不然报错
						filePath: tempFilePaths[0], //这个就是我们上面拍照返回或者先中照片返回的数组
						name: 'file',
						header: {'Authorization':'Bearer ' + uni.getStorageSync("id_token")},
						success: (uploadFileRes) => {
							if(uploadFileRes.statusCode === 200){
								console.log(uploadFileRes.data)
								// #ifdef MP-ALIPAY
								monitor.api({api:"upload.do",success:true,c1:"taSR",time:0})
								// #endif
								_this.selectImg = res.tempFilePaths[0];
								_this.imgDataUrl = JSON.parse(uploadFileRes.data).url
								let resultStr = JSON.parse(uploadFileRes.data).result
								let result = JSON.parse(resultStr)
								result.output[0].body.forEach(b=>{
									let conf = b.conf
									let label = b.label
									if(conf == 1){
										switch (label){
											case 'NAGATIVE':
												_this.isend = '2'  // 阴性
												break;
											case 'INVALID':
												_this.isend = '3'  // 无效
												break;
											case 'POSITIVE':
												_this.isend = '1'  // 阳性
												break;
											default :
												_this.isend = '3'  // 无效
										}
									}
								})
							}else{
								// #ifdef MP-ALIPAY
								monitor.api({api:"upload.do",success:false,c1:"taSR",time:0})
								// #endif
								uni.showToast({ title: '照片上传失败', icon: 'none' })
							}
						},
						fail: (r) => {
							console.log('试剂盒照片上传错误='+r);
							uni.showToast({ title: '照片上传失败', icon: 'none' });
						}
					});
				}
			});
			// #endif
		},
		result(e) {
			this.isend = e;
		}
	}
};
</script>

<style scoped lang="scss">
.up-title {
	padding: 30rpx;
	border-bottom: 1px solid #f9f9f9;
	border-radius: 20rpx 20rpx 0 0;
	font-size: 36rpx;
	color: #333333;
}

.up-cont {
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 30rpx;
}

.up-cont-bg {
	width: 400rpx;
	height: 500rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.up-img {
	width: 400rpx;
	background-color: white;
	border-radius: 20rpx;
}

.section_2_curr {
	border: solid 8rpx #347dff !important;
}

.left-group {
	white-space: nowrap;
	height: 40rpx;
}

.image_6 {
	margin: 5rpx 0 7rpx 10rpx;
	width: 16rpx;
	height: 28rpx;
}

.left-section {
	border-radius: 50%;
	width: 40rpx;
	height: 40rpx;
	border: solid 2rpx rgb(216, 216, 216);
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

.text-999 {
	color: #999;
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
	padding-top: 36rpx;
	background-color: rgb(255, 255, 255);
}

.group_19 {
	padding: 44rpx 26rpx;
}

.group_5 {
	padding: 0 26rpx 80rpx;
}

.group_8 {
	padding: 0 26rpx;
}

.group_10 {
	margin-top: 31rpx;
	padding: 37rpx 26rpx 31rpx;
	border-top: solid 2rpx rgb(249, 249, 249);
	border-bottom: solid 2rpx rgb(249, 249, 249);
}

.group_12 {
	padding: 29rpx 26rpx 35rpx;
}

.group_17 {
	padding: 35rpx 26rpx 36rpx;
}

.group_20 {
	margin-right: 20rpx;
}

.button {
	margin-left: 4rpx;
	margin-top: 180rpx;
	padding: 22rpx 0 24rpx;
	color: rgb(255, 255, 255);
	font-size: 32rpx;
	font-weight: 500;
	line-height: 44rpx;
	white-space: nowrap;
	background-color: rgb(23, 119, 255);
	border-radius: 45rpx;
}

.group_6 {
	position: relative;
}

.text_5 {
	cursor: pointer;
	margin-top: 20rpx;
	align-self: center;
	color: rgb(250, 100, 0);
	font-size: 20rpx;
	line-height: 28rpx;
	white-space: nowrap;
}

.group_9 {
	margin-right: 6rpx;
	color: rgb(51, 51, 51);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
}

.group_11 {
	margin-right: 6rpx;
	color: rgb(51, 51, 51);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
}

.group_13 {
	color: rgb(51, 51, 51);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
}

.text_19 {
	color: rgb(102, 102, 102);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
}

.group_18 {
	margin-right: 6rpx;
	color: rgb(0, 0, 0);
	font-size: 28rpx;
	line-height: 40rpx;
	white-space: nowrap;
}

.qrcodeinput {
	width: 420rpx;
	font-size: 30rpx;
	text-align: right;
	overflow: scroll;
}

.placeholder_qrcode {
	color: #999999 !important;
}

.section_3 {
	margin-top: 12rpx;
	flex-shrink: 0;
	background-color: rgb(255, 255, 255);
	border-radius: 50%;
	width: 40rpx;
	height: 40rpx;
	border: solid 2rpx rgb(216, 216, 216);
}

.group_21 {
	margin-left: 14rpx;
	flex: 1 1 auto;
	line-height: 34rpx;
	text-align: left;
	height: 238rpx;
}

.group_7 {
	align-self: center;
	white-space: nowrap;
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
}

.section_2 {
	padding: 22rpx 28rpx 22rpx 32rpx;
	color: rgb(153, 153, 153);
	font-size: 20rpx;
	line-height: 28rpx;
	background-color: rgb(249, 249, 249);
	border-radius: 20rpx;
}

.group_15 {
	margin-left: 42rpx;
}

.group_16 {
	margin-left: 42rpx;
}

.image_10 {
	margin: 5rpx 0 3rpx 9rpx;
	width: 34rpx;
	height: 34rpx;
}

.text_21 {
	color: rgb(102, 102, 102);
	font-size: 24rpx;
	line-height: 34rpx;
}

.text_22 {
	color: rgb(153, 153, 153);
	font-size: 24rpx;
	line-height: 34rpx;
}

.text_23 {
	color: rgb(153, 153, 153);
	font-size: 24rpx;
	line-height: 34rpx;
	margin-bottom: 20rpx;
}

.text_24 {
	color: rgb(153, 153, 153);
	font-size: 24rpx;
	line-height: 34rpx;
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

.image_5 {
	align-self: center;
	box-shadow: 0px 6rpx 10rpx 0px rgba(204, 204, 204, 0.5);
	border-radius: 50%;
	width: 90rpx;
	height: 90rpx;
}

.image_5_1 {
	width: 160rpx;
}

.text_4 {
	margin-top: 10rpx;
	text-align: center;
}

.text_16 {
	margin-left: 10rpx;
}

.image_9 {
	border-radius: 50%;
	width: 40rpx;
	height: 40rpx;
}

.text_17 {
	margin-left: 12rpx;
}

.text_18 {
	margin-left: 10rpx;
}
.exampleImgClass {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10rpx 30rpx 30rpx;
	border-bottom: solid 2rpx rgb(249, 249, 249);
}
.eic-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.eic-img {
	width: 100rpx;
}
.eic-name-postive{
	color: #E02020 !important;
}
.eic-name-negative{
	color: #6DD400 !important;
}
.eic-name-invaild{
	color: #999999;
	padding-left: 30rpx;
	padding-top: 10rpx;
}
</style>
