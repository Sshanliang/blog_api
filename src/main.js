import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'

import '@/styles/index.scss' // global css

import api from './../src/utils/api.js'
import utils from './../src/utils/utils.js'

import App from './App'
import router from './router'
import store from './store'


import vueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'
Vue.use(vueQuillEditor)



import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI, { locale })
// 将工具方法绑定到全局
Vue.prototype.$api = api
Vue.prototype.$utils = utils

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})
