import axios from '@/vendor/uni-axios'

// 创建自定义接口服务实例
const mpServiceClient = axios.create({
    // baseURL:
    timeout: 30 * 1000,  // 不可超过 manifest.json 中配置 networkTimeout的超时时间
    // #ifdef H5
    withCredentials: true,
    // #endif
    headers: {
        'Content-Type': 'application/json'
    },
})

// 拦截器 在请求之前拦截
mpServiceClient.interceptors.request.use(req => {
	req.headers['Authorization'] = 'Bearer ' + uni.getStorageSync("id_token");
    return req;
}, (error, res) => {
    return Promise.reject(error.message, res);
})

// 拦截器 在请求之后拦截
mpServiceClient.interceptors.response.use(res => {
	console.log('response==',res);
	if(res.data.status === 401) {
		// 401 返回码表示用户没登录
		// 在这里做重新登录，最好能自动重登录，比如自动重定向到登录页面
		try {
			uni.removeStorageSync('id_token');
			uni.clearStorageSync()
		} catch(e) {
			console.log("clearStorageSync error");
			return;
		}
		console.log('清除缓存完毕！');
		// setTimeout(()=>{
		// 	uni.reLaunch({
		// 		url:'/pages/index/index'
		// 	})
		// },1000)
		return res
	}
	if(res.data.status === 200) {
		return res
	}
	if(res.data.status && res.data.status != 200) {
		console.log('!200 ==',res.data)
		uni.showToast({
			icon:'none',
			duration:2000,
			title:res.data.message||res.data.msg
		})
		console.log(res.data.message||res.data.msg)
	}
    return res
}, (error, res) => {
    return Promise.reject(error.message, res);
})
export default mpServiceClient
