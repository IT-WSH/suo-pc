import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import './plugins'
import '@/layouts/export'
import dayjs from 'dayjs'
/**
''
 * @description 生产环境默认都使用mock，如果正式用于生产环境时，记得去掉
 */
// Vue.filter('formatTime', (value, format = 'yyyy-MM-dd HH:mm:ss') => {
//   return new Date(value).Format(format)

// })
Vue.filter('formatTime', (value, format = 'yyyy-MM-dd HH:mm:ss') => {
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
})
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('@/utils/static')
  mockXHR()
}

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
})
