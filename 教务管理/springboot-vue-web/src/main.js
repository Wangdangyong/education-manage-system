import Vue from 'vue'
import App from './App.vue'
import ElementUi from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import "./assets/global.css"
import axios from "axios"
import VueRouter from 'vue-router'
import router from "./router";
import store from "./store"
Vue.prototype.$axios=axios
Vue.prototype.$httpUrl='http://localhost:8081'

Vue.use(ElementUi)
Vue.use(VueRouter)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")