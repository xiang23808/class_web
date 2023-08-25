import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import axios from 'axios'
import Sortable from 'sortablejs'
import VueWechatTitle from 'vue-wechat-title'
import store from './store'
import VueClipboard from 'vue-clipboard2'
import moment from 'moment'
import JwChat from 'jwchat';
Vue.prototype.$moment = moment

Vue.use(VueWechatTitle)
Vue.prototype.$http = axios
Vue.config.productionTip = false

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
Vue.use(JwChat)

new Vue({
  router,
  store,
  render: h => h(App),
  data: {
    eventBus: new Vue()
  }
}).$mount('#app')
