import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick' // 处理移动端click事件300毫秒延迟
import VueLazyload from 'vue-lazyload'
import store from './store'
import Mui from 'vue-awesome-mui'

import 'lib-flexible/flexible'
import 'common/stylus/index.styl'

fastclick.attach(document.body)

Vue.use(VueLazyload, {
  loading: require('common/image/default.png'),
  error: require('common/image/default.png')
})

router.beforeEach((to, from, next) => {
  // 如果未匹配到路由
  if (to.matched.length === 0) {
    // 如果上级也未匹配到路由则跳转首页，如果上级能匹配到则转上级路由
    from.path ? next({ path: from.path }) : next('/')
  } else {
    // 如果匹配到正确跳转
    next()
  }
})

Vue.use(Mui)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
