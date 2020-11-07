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

// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到DOM中时
  update: function (el, binding, vnode, oldVnode) {
    console.log(el);
    console.log(binding);
    console.log(vnode);
    console.log(oldVnode);
    // 聚焦元素
    //   el.focus();
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')



