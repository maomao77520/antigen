<template>
	<view class="flex-col page">
		<view class="flex-col group_4">
			<view class="flex-col section_1">
				<template v-if="stype == 'unit'">
					<view class="justify-between group_5" @click="modeChange('selector')">
						<view class="left-group">
							<text class="text_2">*</text>
							<text class="text_3">单位类型</text>
						</view>
						<view class="flex-row group_6">
							<text>{{ obj.unitType ? obj.unitType : '请选择'}}</text>
							<image
								src="/static/images/icon_right.png"
								class="image_5 image_6"
							/>
						</view>
					</view>
					<view class="group_7 justify-between">
						<view class="left-group">
							<text class="text_5">*</text>
							<text class="text_7">统一社会信用代码</text>
						</view>
						<input class="text_input" type="text" v-model="obj.xyid" placeholder-class="placeholder_qrcode" placeholder="请输入" />
					</view>
					<view class="justify-between group_8">
						<view class="left-group">
							<text class="text_11">*</text>
							<text class="text_12">单位名称</text>
						</view>
						<input class="text_input" type="text" v-model="obj.unitName" placeholder-class="placeholder_qrcode" placeholder="请输入" />
					</view>
					<view class="group_7 justify-between">
						<view class="left-group">
							<text class="text_5">*</text>
							<text class="text_7">单位联系人</text>
						</view>
						<input class="text_input" type="text" v-model="obj.unitUserName" placeholder-class="placeholder_qrcode" placeholder="请输入" />
					</view>
				</template>
				<template v-if="stype == 'community'">
					<view class="justify-between group_8">
						<view class="left-group">
							<text class="text_11">*</text>
							<text class="text_12">社区名称</text>
						</view>
						<input class="text_input" type="text" v-model="obj.communityName" placeholder-class="placeholder_qrcode" placeholder="请输入" />
					</view>
					<view class="group_7 justify-between">
						<view class="left-group">
							<text class="text_5">*</text>
							<text class="text_7">社区联系人</text>
						</view>
						<input class="text_input" type="text" v-model="obj.communityUserName" placeholder-class="placeholder_qrcode" placeholder="请输入" />
					</view>
				</template>
				<view class="justify-between group_9">
					<view class="left-group">
						<text class="text_17">*</text>
						<text class="text_18">手机号码</text>
					</view>
					<input class="text_input" type="number" maxlength="11" v-model="obj.phone" placeholder-class="placeholder_qrcode" placeholder="请输入" />
				</view>
				<view class="justify-between group_10" @click="clickPicker">
					<view class="left-group">
						<text class="text_20">*</text>
						<text class="text_21" v-if="stype=='unit'">单位地址</text>
						<text class="text_21" v-if="stype=='community'">社区地址</text>
					</view>
					<view class="flex-row group_11">
						<text v-if="obj.regInput">{{obj.regInput}}</text>
						<text v-else style="color: #999999">请选择</text>
						<image
							src="/static/images/icon_right.png"
							class="image_5 image_7"
						/>
					</view>
				</view>
				<view class="justify-between group_12">
					<view class="left-group view_8">
						<text class="text_23">*</text>
						<text class="text_24">详细地址</text>
					</view>
					<input class="text_input" type="text" v-model="obj.address" placeholder-class="placeholder_qrcode" placeholder="请输入" />
				</view>
				<view class="flex-row group_13">
					<view class="left-group">
						<text class="text_26">*</text>
						<text class="text_27">证件上传</text>
					</view>
					<text class="text_28" @click="looksl">查看同意书</text>
				</view>
				<view class="flex-row equal-division">
					<view v-if="stype=='unit'" @click="chooseImage('yyzz')" class="equal-division-item flex-col items-center">
						<view v-if="selectImg_yyzz" class="flex-col items-center"><image :src="selectImg_yyzz" class="image_8_1" /></view>
						<view v-else class="flex-col items-center u-padding-top">
							<image src="/static/images/icon_scan.png" class="image_8" />
							<text class="text_29">营业执照</text>
						</view>
					</view>
					<view @click="chooseImage('tys')" class="equal-division-item flex-col items-center section_3">
						<view v-if="selectImg_tys" class="flex-col items-center"><image :src="selectImg_tys" class="image_8_1" /></view>
						<view v-else class="flex-col items-center u-padding-top">
							<image src="/static/images/icon_scan.png" class="image_8" />
							<text class="text_29">同意书</text>
						</view>
					</view>
				</view>
			</view>
			<view class="flex-col group_14">
				<view class="flex-row group_15" @click="clickLj">
					<view class="section_4" :class="isLljie ? 'section_2_curr' : ''"></view>
					<text class="text_32">
						本人确认所提交信息准确无误。本人承若履行单位管理员职责妥善保管单位上报人员的个人信息，若管理员变更，本人会及时联系平台进行信息变更，如因本人未妥善保管或未及时变更造成单位上报人员个人信息泄漏，由本人及单位自行承担责任。
					</text>
				</view>
				<view @click="submit" class="flex-col items-center button"><text>下一步</text></view>
			</view>
		</view>
		<!-- 弹窗 -->
		<template>
			<u-picker :mode="mode" v-model="pshow" @confirm="confirm" :range="range" :range-key="rangKey"></u-picker>
		</template>
		<template>
			<u-popup :border-radius="40" v-model="addrshow" mode="bottom" :closeable="closeable" :close-icon-pos="closeIconPos" @close="close">
				<view>
					<view class="up-title">同意书示例</view>
					<view class="up-cont"><image class="up-img" :src="tysImg" mode="widthFix"></image></view>
					<view class="up-btn">
						<view class="up-cane" @click="addrshow=false"> 取消 </view>
						<view class="up-config" @click="saveImg"> 保存 </view>
					</view>
				</view>
			</u-popup>
		</template>
		<template>
			<!-- popup -->
			<selectAddress ref="selectAddress" @selectAddress="regionchange"></selectAddress>
		</template>
	</view>
</template>

<script>
import { reportCmPV } from '@/utils/cloudMonitorHelper';
import monitor from '@/utils/alipayLogger'
import {FRONTSERVICE_URL} from '@/utils/config.js';
import ServiceApi from '@/api/api.js';
import selectAddress from '@/components/yixuan-selectAddress/yixuan-selectAddress.vue';
import { execPlugin } from '@/utils/croods.js'
export default {
	components: { selectAddress },
	data() {
		return {
			isLljie: false,
			pshow: false,
			rangKey: 'name',
			mode: 'selector',
			range: ['企业单位', '民营单位'],
			obj: {
				unitType: '',
				unitName: '',
				unitUserName: '',
				communityName: '',
				communityUserName: '',
				xyid: '',
				phone: '',
				regInput: '',
				address: '',
				licenseImageUrl: '',
				authLetterUrl: ''
			},
			addrshow: false,
			closeable: true,
			closeIconPos: 'top-right',
			selectImg_yyzz: null,
			selectImg_tys: null,
			stype: 'unit',
			tysImg:'https://h5.dingjie-jr.com/ap/20220419/img_tongyishu.jpg'
		};
	},
	onLoad(e) {
		// #ifdef MP-ALIPAY
		reportCmPV({ title: '单位或社区申请', e });
		// #endif
		if (e.stype) {
			this.stype = e.stype;
			if (e.type == 'unit') {
				console.log('单位检测');
			} else if (e.type == 'community') {
				console.log('社区检测');
			}
		}
	},
	methods: {
		/* 保存同意书 */
		saveImg(){
			// #ifdef H5
			execPlugin({
				action: 'UtilPlugin.saveImg',
				params: {type:'URL',file: this.tysImg},
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
			// #endif
			// #ifdef MP-ALIPAY
			uni.saveImageToPhotosAlbum({
				filePath:this.tysImg,
				success: () => {
					console.log("保存成功==",this.tysImg);
					this.addrshow = false
					uni.showToast({
						title: '已保存至相册',
						icon: 'none'
					});
				},
				fail: () => {
					console.log('保存失败');
					this.addrshow = false
					uni.showToast({
						title: '保存失败',
						icon: 'none'
					});
				},
				complete: () => {
					this.addrshow = false
				}
			})
			// #endif
		},
		submit() {
			let phonet = /^1(3|4|5|7|8|9|6)\d{9}$/;
			let that = this
			if (this.stype == 'unit') {
				if (this.obj.unitType === '') {
					uni.showToast({
						title: '请选择单位类型',
						icon: 'none'
					});
					return;
				} else if (!this.obj.xyid) {
					uni.showToast({
						title: '请输入信用代码',
						icon: 'none'
					});
					return;
				} else if (!this.obj.unitName) {
					uni.showToast({
						title: '请输入单位名称',
						icon: 'none'
					});
					return;
				} else if (!this.obj.unitUserName) {
					uni.showToast({
						title: '请输入单位联系人',
						icon: 'none'
					});
					return;
				} else if (!this.obj.regInput) {
					uni.showToast({
						title: '请选择单位地址',
						icon: 'none'
					});
					return;
				} else if (!this.selectImg_yyzz) {
					uni.showToast({
						title: '请上传营业执照',
						icon: 'none'
					});
					return;
				} 
			}
			if (this.stype == 'community') {
				if (!this.obj.communityName) {
					uni.showToast({
						title: '请输入社区名称',
						icon: 'none'
					});
					return;
				} else if (!this.obj.communityUserName) {
					uni.showToast({
						title: '请输入社区联系人',
						icon: 'none'
					});
					return;
				} else if (this.obj.regInput === '') {
					uni.showToast({
						title: '请选择社区地址',
						icon: 'none'
					});
					return;
				}
			}
			if (!phonet.test(this.obj.phone)) {
				uni.showToast({
					title: '请输入11位手机号',
					icon: 'none'
				});
				return;
			}
			if (!this.obj.address) {
				uni.showToast({
					title: '请输入详细地址',
					icon: 'none'
				});
				return;
			} else if (!this.selectImg_tys) {
				uni.showToast({
					title: '请上传同意书',
					icon: 'none'
				});
				return;
			}
			if (!this.isLljie) {
				uni.showToast({
					title: '请勾选确认信息',
					icon: 'none'
				});
				return;
			}
			//提交申请信息
			if (this.stype == 'community') {
				uni.showLoading({
					title:'提交中'
				})
				ServiceApi.addCommunity(this.obj).then(resp=>{
					uni.hideLoading()
					console.info("community_resp="+resp)
					if(resp.data.status == 200){
						// #ifdef MP-ALIPAY
						monitor.api({api:"addCommunity",success:true,c1:"taSR",time:0})
						// #endif
						//跳转页面
						uni.redirectTo({
							url: '../unitPerson/index?placeType=' + this.stype
						})
					}else{
						// #ifdef MP-ALIPAY
						monitor.api({api:"addCommunity",success:false,c1:"taSR",time:0})
						// #endif
					}
				}).catch(err=>{
					uni.hideLoading()
				})
			}else if(this.stype == 'unit'){
				uni.showLoading({
					title:'提交中'
				})
				ServiceApi.addUnit(this.obj).then(resp=>{
					uni.hideLoading()
					console.info("unit_resp="+resp)
					if(resp.data.status == 200){
						// #ifdef MP-ALIPAY
						monitor.api({api:"addCommunity",success:true,c1:"taSR",time:0})
						// #endif
						//跳转页面
						uni.redirectTo({
							url: '../unitPerson/index?placeType=' + this.stype
						})
					}else{
						// #ifdef MP-ALIPAY
						monitor.api({api:"addCommunity",success:false,c1:"taSR",time:0})
						// #endif
					}
				}).catch(err=>{
					uni.hideLoading()
				})
			}
		},
		looksl() {
			this.addrshow = true;
		},
		close() {
			this.addrshow = false;
		},
		clickLj() {
			this.isLljie = !this.isLljie;
		},
		modeChange(e) {
			this.mode = e;
			this.pshow = true;
		},
		confirm(e) {
			if (this.mode == 'selector') {
				this.obj.unitType = this.range[e[0]];
			}
		},
		clickPicker() {
			// #ifdef H5
			this.$refs.selectAddress.show()
			// #endif
			// #ifdef MP-ALIPAY
			let that = this
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
							that.obj.regInput = res.cityName + res.adName
							that.obj.address = res.address
						}
					})
			    }
			})
			// #endif
		},
		regionchange(e) {
			console.log(e)
		    this.obj.regInput = e;
		},
		chooseImage(e) {
			let _this = this;
			// #ifdef H5
			execPlugin({
				action: 'ServicePermissionPlugin.uploadMaterial',
				params: {reason:'获取相机权限',imgCount: '1',uploadTitle:'图片上传',uploadType:'4'},
				success: function (res) {
					console.log(res)
					if(!res.files && !res.files[0]){
						return
					}
					if(!res.files[0].file){
						return
					}
					uni.showLoading()
					const tempFile = res.files[0].file;
					ServiceApi.uploadBase64({file: tempFile}).then(uploadFileRes=>{
						uni.hideLoading()
						if(uploadFileRes.status === 200){
							if (e == 'yyzz') {
								_this.obj.licenseImageUrl = uploadFileRes.data.url
								_this.selectImg_yyzz = uploadFileRes.data.url
							}
							if (e == 'tys') {
								_this.obj.authLetterUrl = uploadFileRes.data.url
								_this.selectImg_tys = uploadFileRes.data.url
							}
						}else{
							uni.hideLoading()
							uni.showToast({ title: '照片上传失败', icon: 'none' })
						}
					}).catch(err => {
						uni.hideLoading()
						uni.showToast({
							icon: 'none',
							title: err
						});
					});
				},
				fail: function (msg) {
					console.log('ios测试')
				}
			})
			// #endif
			
			// #ifdef MP-ALIPAY
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'],
				sourceType: ['camera', 'album'], //这要注意，camera掉拍照，album是打开手机相册
				success: res => {
					const tempFilePaths = res.tempFilePaths;
					uni.showLoading()
					uni.uploadFile({
						url: FRONTSERVICE_URL+'/file/image/upload.do', //服务器地址
						fileType: 'image', //ZFB必填,不然报错
						filePath: tempFilePaths[0], //这个就是我们上面拍照返回或者先中照片返回的数组
						name: 'file',
						header: {'Authorization':'Bearer ' + uni.getStorageSync("id_token")},
						success: (uploadFileRes) => {
							uni.hideLoading()
							if (e == 'yyzz') {
								_this.selectImg_yyzz = res.tempFilePaths[0];
							}
							if (e == 'tys') {
								_this.selectImg_tys = res.tempFilePaths[0];
							}
							if(uploadFileRes.statusCode === 200){
								if (e == 'yyzz') {
									_this.obj.licenseImageUrl = JSON.parse(uploadFileRes.data).url
								}
								if (e == 'tys') {
									_this.obj.authLetterUrl = JSON.parse(uploadFileRes.data).url
								}
							}else{
								uni.showToast({ title: '照片上传失败', icon: 'none' })
							}
						},
						fail: (r) => {
							uni.hideLoading()
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
 .group_7 {
   padding: 35rpx 12rpx 33rpx;
   border-bottom: solid 2rpx rgb(249, 249, 249);
 }
 .left-group {
   white-space: nowrap;
   height: 40rpx;
 }
 .equal-division-item {
   width: 334rpx;
   padding: 20rpx 0rpx;
   background-color: rgb(249, 249, 249);
   border-radius: 20rpx;
   height: 200rpx;
 }
 .image_5 {
   width: 16rpx;
   height: 28rpx;
 }
 .image_8 {
   box-shadow: 0px 6rpx 10rpx 0px rgba(204, 204, 204, 0.5);
   border-radius: 50%;
   width: 90rpx;
   height: 90rpx;
 }
 .text_5 {
   color: rgb(250, 100, 0);
   font-size: 28rpx;
   line-height: 40rpx;
 }
 .text_7 {
   color: rgb(102, 102, 102);
   font-size: 28rpx;
   line-height: 40rpx;
 }
 .text_9 {
   margin-right: 16rpx;
   color: rgb(153, 153, 153);
   font-size: 28rpx;
   line-height: 40rpx;
   white-space: nowrap;
 }
 .text_29 {
   margin-top: 18rpx;
 }
 .page {
   background-color: #f9f9f9;
   width: 100%;
   overflow-y: auto;
   height: 100vh;
 }
 .group_4 {
   padding-bottom: 32rpx;
   flex: 1 1 auto;
   overflow-y: auto;
 }
 .section_1 {
   padding-left: 14rpx;
   padding-bottom: 38rpx;
   background-color: rgb(255, 255, 255);
 }
 .group_14 {
   padding: 0 26rpx 36rpx;
 }
 .group_5 {
   padding: 34rpx 12rpx 33rpx;
   border-bottom: solid 2rpx rgb(249, 249, 249);
 }
 .group_8 {
   padding: 41rpx 12rpx;
   border-bottom: solid 2rpx rgb(249, 249, 249);
 }
 .group_9 {
   padding: 41rpx 12rpx 33rpx;
   border-bottom: solid 2rpx rgb(249, 249, 249);
 }
 .group_10 {
   padding: 33rpx 12rpx 35rpx;
   border-bottom: solid 2rpx rgb(249, 249, 249);
 }
 .group_12 {
   padding: 29rpx 12rpx 33rpx;
   border-bottom: solid 2rpx rgb(249, 249, 249);
 }
 .group_13 {
   margin-top: 41rpx;
   padding: 0 12rpx;
   align-items: center;
 }
 .equal-division {
   margin: 14rpx 28rpx 0 14rpx;
   color: rgb(153, 153, 153);
   font-size: 20rpx;
   line-height: 28rpx;
   white-space: nowrap;
 }
 .group_15 {
   margin-right: 20rpx;
   padding: 36rpx 0 54rpx;
   color: rgb(102, 102, 102);
   font-size: 24rpx;
   line-height: 34rpx;
 }
 .button {
   margin-left: 4rpx;
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
   margin-right: 16rpx;
   color: rgb(51, 51, 51);
   font-size: 28rpx;
   line-height: 40rpx;
   white-space: nowrap;
 }
 .text_13 {
   margin-right: 16rpx;
   color: rgb(153, 153, 153);
   font-size: 28rpx;
   line-height: 40rpx;
   white-space: nowrap;
 }
 .text_19 {
   margin-right: 20rpx;
   color: rgb(153, 153, 153);
   font-size: 28rpx;
   line-height: 40rpx;
   white-space: nowrap;
 }
 .group_11 {
   margin-right: 20rpx;
   color: rgb(51, 51, 51);
   font-size: 28rpx;
   line-height: 40rpx;
   white-space: nowrap;
 }
 .view_8 {
   margin-top: 6rpx;
 }
 .text_25 {
   margin-right: 20rpx;
   margin-bottom: 6rpx;
   color: rgb(153, 153, 153);
   font-size: 28rpx;
   line-height: 40rpx;
   white-space: nowrap;
 }
 .text_28 {
   margin: 8rpx 0 4rpx 28rpx;
   color: rgb(250, 100, 0);
   font-size: 28rpx;
   line-height: 28rpx;
   white-space: nowrap;
 }
 .section_3 {
   margin-left: 22rpx;
 }
 .section_4 {
   margin-top: 6rpx;
   flex-shrink: 0;
   background-color: rgb(255, 255, 255);
   border-radius: 50%;
   width: 40rpx;
   height: 40rpx;
   border: solid 2rpx rgb(216, 216, 216);
 }
 .text_32 {
   margin-left: 14rpx;
   flex: 1 1 auto;
   text-align: left;
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
 .image_6 {
   margin: 7rpx 0 5rpx 16rpx;
 }
 .text_11 {
   color: rgb(250, 100, 0);
   font-size: 28rpx;
   line-height: 40rpx;
 }
 .text_12 {
   color: rgb(102, 102, 102);
   font-size: 28rpx;
   line-height: 40rpx;
 }
 .text_17 {
   color: rgb(250, 100, 0);
   font-size: 28rpx;
   line-height: 40rpx;
 }
 .text_18 {
   color: rgb(102, 102, 102);
   font-size: 28rpx;
   line-height: 40rpx;
 }
 .text_20 {
   color: rgb(250, 100, 0);
   font-size: 28rpx;
   line-height: 40rpx;
 }
 .text_21 {
   color: rgb(102, 102, 102);
   font-size: 28rpx;
   line-height: 40rpx;
 }
 .image_7 {
   margin: 7rpx 0 5rpx 10rpx;
 }
 .text_23 {
   color: rgb(250, 100, 0);
   font-size: 28rpx;
   line-height: 40rpx;
 }
 .text_24 {
   color: rgb(102, 102, 102);
   font-size: 28rpx;
   line-height: 40rpx;
 }
 .text_26 {
   color: rgb(250, 100, 0);
   font-size: 28rpx;
   line-height: 40rpx;
 }
 .text_27 {
   color: rgb(102, 102, 102);
   font-size: 28rpx;
   line-height: 40rpx;
 }
.text-999{color: #999;}
.text_input{
	text-align: right;
	padding-right: 20rpx;
}
.placeholder_qrcode{
	color: #999999 !important;
}
.up-title{padding: 30rpx;border-bottom: 1px solid #F9F9F9;border-radius: 20rpx 20rpx 0 0;font-size: 36rpx;color: #333333;}
.up-cont{display: flex;justify-content: center;align-items: center;margin: 0 30rpx;height: 72vh;overflow: hidden;overflow-y: scroll;}
.up-img{width: 500rpx;margin-top: 2vh;background-color: white;border-radius: 20rpx;}
.section_2_curr{
	border: solid 8rpx #347dff !important;
}
.image_8_1{
	width: 300rpx;
	height: 160rpx;
	border-radius: 10rpx;
}
.u-padding-top{
	padding-top: 10rpx;
}
.up-btn{
	display: flex;
	padding: 30rpx 120rpx;
	justify-content: space-between;
}
.up-cane{
	width: 180rpx;
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 46rpx;
	border: 1px solid #D8D8D8;
	color: #999;
	text-align: center;
	font-size: 28rpx;
}
.up-config{
	width: 260rpx;
	height: 80rpx;
	line-height: 80rpx;
	background: #1777FF;
	border-radius: 46rpx;
	text-align: center;
	color: white;
	font-size: 28rpx;
}
</style>
