<template>
	<view class="authorizeBt">
		<button open-type="getAuthorize" scope="userInfo" @getAuthorize="getUserBaseInfo()"
			@error="errorUserBaseInfo()"></button>
	</view>
</template>

<script>
	import ServiceApi from '@/api/api.js'
	import { execPlugin } from '@/utils/croods.js'
	export default {
		data() {
			return {
				firstIn: true
			};
		},
		methods: {
			async getUserBaseInfo() {
				return new Promise((resolve, reject) =>{
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
							// #ifdef MP-ALIPAY
							my.getAuthCode({
								scopes: ['auth_user'],
								success: async (res) => {
									uni.hideLoading()
									console.log('授权成功', res)
									//调用后端接口
									ServiceApi.alipayMiniAppAuth(res).then(res => {
										if (res.data.status === 200) {
											uni.setStorage({
												key: 'id_token',
												data: res.data.id_token,
												success: function() {
													//查询获取用户信息
													console.log('查询获取用户信息')

													ServiceApi.userInfo().then(resp => {
														uni.setStorageSync('userInfo', resp
															.data);
													})
													resolve(true)
												}
											});
										}else{
											console.log('查询获取用户信息失败')
											resolve(false);
										}
									}).catch(error=>{
										console.log('查询获取用户信息失败error='+error)
										resolve(false);
									})
								},
								fail: (err) => {
									//授权失败，返回首页
									uni.hideLoading()
									console.log('授权失败', err)
									resolve(false)
								}
							})
							// #endif
							// #ifdef H5
							execPlugin({
								action: 'UserPlugin.login',
								params: {},
								success: function (res) {
									// let res = {token: 'c30d0040-c40a-4f63-bd2d-07f424ee6008'}
									ServiceApi.getZhiGuiTongUserInfo({token: res.token}).then(res => {
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
													resolve(true)
												}
											});
										}else{
											console.log('查询获取用户信息失败')
											resolve(false);
										}
									}).catch(error => {
										console.log('查询获取用户信息失败error = ' + error)
										resolve(false);
									})
								}
							})
							// #endif

						}else{
							//token存在，尝试直接调用接口
							//console.log('token存在，尝试直接调用接口')
							ServiceApi.userInfo().then(resp => {
								//console.log('token存在，尝试直接调用接口resp='+resp)
								if (resp.data.status === 200) {
									uni.setStorageSync('userInfo', resp.data);
									resolve(true)
								}else if(resp.data.status === 401){
									//token已经失效,重新调用授权接口
									//console.log('token已经失效,重新调用授权接口')
									that.getUserBaseInfo().then(r=>{
										//console.log('重新调用授权接口r'+r)
										if (r) {
											resolve(true)
										}else{
											resolve(false);
										}
									})
								}else{
									console.log('其他错误直接返回失败')
									//其他错误直接返回失败
									resolve(false)
								}
							}).catch(error=>{
								console.log('查询获取用户信息失败error='+error)
								resolve(false);
							})
						}
				})
			},
			errorUserBaseInfo() {
				console.log('拒绝授权', e)
				return false
			}
		}
	};
</script>

<style lang="scss">
	.authorizeBt {
		display: none;
	}
</style>
