/*接口地址*/
const FRONTSERVICE_URL = getFRONTSERVICE_URL();
function getFRONTSERVICE_URL(){
	/*正式环境*/
	//return "https://zgtkang.caih.com/antigen/api"
	/*测试环境*/
	return "http://antigenapi.dev.gxyingan.com/antigen/api"
}

/*商城接口地址*/
const MALLSERVICE_URL = getMALLSERVICE_URL();
function getMALLSERVICE_URL(){
	/*正式环境*/
	return "https://zgtkang.caih.com/mall/api"
}

/*商城H5地址*/
const MALLH5_URL = getMALLH5_URL();
function getMALLH5_URL(){
	/*正式环境*/
	return "https://zgtkang.caih.com/mall/h5"
}

export {FRONTSERVICE_URL,MALLSERVICE_URL,MALLH5_URL}
