import { hookCloudMonitor, _reportCmPV, CM_TYPE_H5 } from '../../utils/cloudMonitorHelper';

const queryString = require('query-string');

Page({
  data: {
    url: '',
  },

  async onLoad(query) {
    // 页面加载
    console.info(`H5 Page onLoad with query: ${JSON.stringify(query)}`);

    const { url, title } = query;

    const { tag, extQueryString} = await hookCloudMonitor(CM_TYPE_H5, query);
    console.info('>>>> hookCloudMonitor', tag, extQueryString);

    let visitUrl = url

    if (extQueryString) {
      const qs = queryString.stringify(extQueryString);

      if (qs && qs.length > 0) {
        if (visitUrl.indexOf('?') >= 0) {
          visitUrl += '&';
        } else {
          visitUrl += '?';
        }

        visitUrl += qs;
      }
    }

    this.setData({
      url: visitUrl,
    });

    _reportCmPV({ title, query }, tag, url);
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
});
