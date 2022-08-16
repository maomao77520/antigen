import {FRONTSERVICE_URL} from '@/utils/config.js';
import mpServiceClient from '@/utils/request.js';



const ServiceApi = {
	alipayMiniAppAuth(params){
		return mpServiceClient.post(FRONTSERVICE_URL +"/auth/alipay-mini-app",params);
	},
	//用户信息
	userInfo(){
	    return mpServiceClient.get(FRONTSERVICE_URL +"/auth/userinfo/query.do");
	},
	//创建用户查询token
	createToken(){
	    return mpServiceClient.post(FRONTSERVICE_URL +"/auth/userinfo/create-token");
	},
	// 智桂通获取用户信息
	getZhiGuiTongWxUserInfo(params){
	    return mpServiceClient.post(FRONTSERVICE_URL +"/auth/zgt-wx", params);
	},
	//智桂通获取用户信息
	getZhiGuiTongUserInfo(params){
	    return mpServiceClient.post(FRONTSERVICE_URL +"/auth/zgt-app", params);
	},
	//个人检测记录
	getAntigenTestRecord(params){
	    return mpServiceClient.get(FRONTSERVICE_URL +"/antigenTest/record", {params});
	},
	//家人检测记录
	getAntigenTestFamilyRecord(params){
	    return mpServiceClient.get(FRONTSERVICE_URL +"/antigenTest/familyRecord", {params});
	},
	//社区申请
	addCommunity(params){
		return mpServiceClient.post(FRONTSERVICE_URL +"/antigenTest/addCommunity",params);
	},
	//单位申请
	addUnit(params){
		return mpServiceClient.post(FRONTSERVICE_URL +"/antigenTest/addUnit",params);
	},
	//上传检测结果
	uploadCheckResult(params){
	    return mpServiceClient.post(FRONTSERVICE_URL +"/antigenTest/upload", params);
	},
	//查询我的场所信息
	getMyPlaceInfo(){
	    return mpServiceClient.get(FRONTSERVICE_URL +"/antigenTest/getMyPlaceInfo");
	},
	//查询我的场所信息
	getMyPlaceInfoByType(param){
	    return mpServiceClient.get(FRONTSERVICE_URL +"/antigenTest/getMyPlaceInfo/" + param);
	},
	//管理员检测列表
	adminRecord(params){
	    return mpServiceClient.get(FRONTSERVICE_URL +"/antigenTest/adminRecord", {params});
	},
	//管理员检测列表详情
	adminRecordDetail(params){
		return mpServiceClient.get(FRONTSERVICE_URL +"/antigenTest/adminRecordDetail", {params});
	},
	//创建检测批次
	createTestBatch(param){
	    return mpServiceClient.get(FRONTSERVICE_URL +"/antigenTest/createTestBatch/" + param);
	},
	//根据批次号查询场所信息
	getPlaceNameByBatchNo(param){
	    return mpServiceClient.get(FRONTSERVICE_URL +"/antigenTest/getPlaceNameByBatchNo/" + param);
	},
	//查询亲属信息
	getRelatives(){
	    return mpServiceClient.get(FRONTSERVICE_URL +"/antigenTest/getRelatives");
	},
	//最近检测结果
	getMyLastRecord(){
	    return mpServiceClient.get(FRONTSERVICE_URL +"/antigenTest/getMyLastRecord");
	},
	//申请解绑
	unbindPlace(params){
	    return mpServiceClient.post(FRONTSERVICE_URL +"/antigenTest/unbindPlace", params);
	},
	//上传Base64图片
	uploadBase64(params){
	    return mpServiceClient.post(FRONTSERVICE_URL +"/file/image/uploadBase64.do", params);
	},
	//意见反馈提交
	addFeedback(params){
		return mpServiceClient.post(FRONTSERVICE_URL +"/feedback/add.do",params);
	},
	//意见反馈提交
	getFeedbackRecord(params){
		return mpServiceClient.get(FRONTSERVICE_URL +"/feedback/feedbackRecord", {params});
	},
	//意见反馈提交
	getFeedback(param){
		return mpServiceClient.get(FRONTSERVICE_URL +"/feedback/getFeedback/"+ param);
	}
}

export default ServiceApi;
