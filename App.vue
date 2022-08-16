<script>
const monitor = require('./utils/alipayLogger.js');
const { setCMHookFunc } = require('./utils/cloudMonitorHelper');
const { _cmHookFunc } = require('./cm_hook');

export default monitor.hookApp({
  onLaunch: function (options) {
    console.log('App Launch');
	// #ifdef MP-ALIPAY
	////////// 政务标准H5数据上报
	monitor.init({
	pid: "ad/kdrmlzta8d47d/gt54g==",      // TODO,
	options: options,
	sample: 1,
	autoReportApi: true,
	// autoReportApi: false,
	autoReportPage: true,
	// autoReportPage: false,
	// Http请求返回数据中状态码字段名称
	code: ["status"],
	// Http返回数据中的error message字段名称
	msg: ["message"],
	//小程序版本号
	miniVersion:"0.0.12"
	});
	//////////////////////
	// 设置光华平台hook函数
	setCMHookFunc(_cmHookFunc);
	// #endif
  },
  onShow: function () {
    console.log('App Show');
  },
  onHide: function () {
    console.log('App Hide');
  }
});
</script>

<style>
/************************************************************
** 请将全局样式拷贝到项目的全局 CSS 文件或者当前页面的顶部 **
** 否则页面将无法正常显示                                  **
************************************************************/

  html {
    font-size: 16px;
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'Microsoft Yahei', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  view, image, text {
    box-sizing: border-box;
    flex-shrink: 0;
  }

  #app {
    width: 100vw;
    height: 100vh;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
  }

  .flex-col {
    display: flex;
    flex-direction: column;
  }

  .justify-start {
    display: flex;
    justify-content: flex-start;
  }

  .justify-center {
    display: flex;
    justify-content: center;
  }

  .justify-end {
    display: flex;
    justify-content: flex-end;
  }

  .justify-evenly {
    display: flex;
    justify-content: space-evenly;
  }

  .justify-around {
    display: flex;
    justify-content: space-around;
  }

  .justify-between {
    display: flex;
    justify-content: space-between;
  }

  .items-start {
    display: flex;
    align-items: flex-start;
  }

  .items-center {
    display: flex;
    align-items: center;
  }

  .items-end {
    display: flex;
    align-items: flex-end;
  }
</style>
<style lang="scss">
	@import "uview-ui/index.scss";
</style>
