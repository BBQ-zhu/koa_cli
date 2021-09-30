import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
import router from './router';
import {get,post} from './request/http';
import commonJS from './assets/js/common';
import api from './request/api';
import {createlogsImg} from './request/logs';
import store from './store';
import VueParticles from 'vue-particles' //动态粒子插件
// import mixin from './components/mixins/mixin';
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
Vue.prototype.$logsImg = {createlogsImg}
Vue.use(VueRouter);
Vue.use(VueParticles)
// Vue.mixin(mixin)


// 全局混入

Vue.mixin({
  data(){
    return{
      meth:[false,false,false,false] // 增 删 改 查
    }
  },
  methods:{
    mixinMethod(path){
      let nav = JSON.parse(sessionStorage.getItem('userPermission') || '{}').navList
      this.meth = [false,false,false,false]
      for(let i =0;i<nav.length;i++){
        for(let j =0;j<nav[i].children.length;j++){
          if(path == nav[i].children[j].path){
            let val = nav[i].children[j].meth || []
            val.map(item=>{
              if(item == '新增'){
                this.meth[0] = true
              }else if(item == '删除'){
                this.meth[1] = true
              }else if(item == '修改'){
                this.meth[2] = true
              }else if(item == '查询'){
                this.meth[3] = true
              }
            })
          }
        }
      }
      
    }
  }
})




new Vue({
  router,
  store,
  render: h => h(App),
  created(){
    store.dispatch('getNav', router)
  },
}).$mount('#app')

