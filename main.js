import Vue from 'vue';
import App from './App';

Vue.config.productionTip = false;
App.mpType = 'app';

import goback from '@/components/goback.vue'
Vue.component('goback', goback)

import auth from '@/components/auth.vue'
Vue.component('auth', auth)

import share from '@/utils/share.js'
Vue.mixin(share)
// import uQRCode from '@/uni_modules/Sansnn-uQRCode/components/uqrcode/common/uqrcode.js';
// Vue.component('uQRCode', uQRCode)

// #ifdef H5
// 开启开发控制台
import vcnsole from 'vconsole';
if (process.env.NODE_ENV === 'development') {
  Vue.prototype.$vconsole = new vcnsole();
}
// #endif

import uView from 'uview-ui';
Vue.use(uView);
uni.$u.config.unit = 'rpx';

const app = new Vue({
  ...App,
});
app.$mount();
