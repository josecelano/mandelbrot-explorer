import Vue from 'vue'
import VueKonva from 'vue-konva'
import AppLayout from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

Vue.config.productionTip = false

Vue.use(VueKonva)

new Vue({
  vuetify,
  router,
  render: h => h(AppLayout)
}).$mount('#app')
