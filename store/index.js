import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		commoditylist: [1, 2, 3],
		test: 321,
		flag: false,
		shopCartList:[],
		isLogin: false,
		userInfo:{},
		avatar:'',
		token:null,
		// 注册手机号
		phone:''

	},
	mutations: {
		// 更新商品列表
		updateCommoditylist(state, value) {
			state.commoditylist = value
		},
		isflag(value) {
			state.flag = !state.flag
		},
		updateShopCartList(state, value) {
			state.shopCartList.push(value)
		},
		removeShopCartList(state, value) {
			state.shopCartList = [] 
		},
		// 改变购物车列表
		changeShopCartList(state, value){
			console.log('我执行了');
			state.shopCartList = value 
		},
		// 初始化用户数据
		initUserInfo(state){
			// #ifdef H5
	    	let userInfo =	localStorage.getItem("userInfo");
			// #endif			
			
			// #ifndef H5
				let userInfo = uni.getStorage({
					key:'userInfo',
						success: function (res) {
							console.log('userInfo',res.data);
						}
					})
			// #endif
			if(userInfo){
				userInfo = JSON.parse(userInfo)
				state.userInfo = userInfo
				state.isLogin = true
				state.token = userInfo.token

			}else{
				uni.showToast({
					title:'未发现userInfo数据，请先登录',
					icon:'none'
				})
			}
		},
		updataIsLogin(state,value){
			state.isLogin = value
		},
		// 退出登录时移除token
		removeToken(state){
			state.token = null
		},
		// 在登录成功时存储用户数据至vuex和localStorage
		updateUserVuex(state, value) {
			state.userInfo = value,
			state.isLogin = true,
			state.token =  value.token,
			// #ifdef H5
			localStorage.setItem("userInfo", JSON.stringify(value));
			localStorage.setItem("token", JSON.stringify(value.token));
			// #endif
			
			// #ifndef H5
				uni.setStorage({
					key:'userInfo',
					data:JSON.stringify(value)
				})
				uni.setStorage({
					key:'token',
					data:JSON.stringify(value.token)
				})			
			// #endif
		},
		//更新头像数据
		 updateAvatar(state,value){
			 state.avatar = value
		 }
		,
		getPhone(state,value){
			state.phone = value
		}
	}
})
export default store
