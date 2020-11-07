import Vue from 'vue'
import App from './App.vue'
import router from './router'
/* 请求数据框架 */
import axios from 'axios'
/* 引入element 组件 */
import ElementUI from 'element-ui';
/* 引入element 样式 */
import 'element-ui/lib/theme-chalk/index.css'

/* 配置成全局的 */
Vue.prototype.$http = axios
Vue.config.productionTip = false
/* 配置成全局的 */
Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
