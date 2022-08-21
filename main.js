import App from './App'
import store from './store/index.js'
// #ifndef VUE3
import Vue from 'vue'
import uView from 'uview-ui'
Vue.use(uView)
uni.$u.config.unit = 'rpx'
Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'
const app = new Vue({
	uView,
	store,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import uView from 'uview-ui'
Vue.use(uView)
uni.$u.config.unit = 'rpx'
Vue.prototype.$store = store
export function createApp() {
	const app = createSSRApp(App)
	return {
		uView,
		store,
		app
	}
}
// #endif
