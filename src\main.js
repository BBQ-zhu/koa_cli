import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
import router from './router';
import {get,post} from './request/http';
import commonJS from './assets/js/common';
import api from './request/api';
import store from './store';
import VueParticles from 'vue-particles' //动态粒子插件
// import 'vue-particle-line/dist/vue-particle-line.css'

//Ueditor富文本编辑器引入
import '../public/UE/ueditor.config.js'
import '../public/UE/ueditor.all.min.js'
import '../public/UE/lang/zh-cn/zh-cn.js'
import '../public/UE/ueditor.parse.min.js'


Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$axios = {get,post}
Vue.prototype.$common = commonJS
Vue.prototype.$api = api
Vue.use(VueRouter);
Vue.use(VueParticles)


new Vue({
  router,
  store,
  render: h => h(App),
  created(){
    store.dispatch('getNav', router)
  },
}).$mount('#app')


