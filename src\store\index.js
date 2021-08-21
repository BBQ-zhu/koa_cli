import Vue from 'vue'
import Vuex from 'vuex'
const {getNavMenus} = require("../router/navmenu")
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
    oldNavMenu: [],
    newNavMenu: []
  },
  mutations: {
    storageUserInfo(state, e) {
      e.token = "Bearer " + e.token
      sessionStorage.setItem('userInfo', JSON.stringify(e))
      state.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    }
  },
  actions: {
    async getNav(contxt,router){
      let userInfo = JSON.parse(sessionStorage.getItem('userInfo')||{})
      await getNavMenus(userInfo,router)
    }
  },
  modules: {}
})
