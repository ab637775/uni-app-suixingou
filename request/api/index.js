import ajax from "../request.js"
//获取首页初始数据
export function getInitData() {
	return ajax.request({
		url: '/api/index_list/data',
	})
}
//添加分页数据
export function addNewPages(id, page) {
	return ajax.request({
		url: '/api/index_list/' + id + '/data/' + page + ''
	})
}
// 请求搜索数据
// data需要传入对象，两个必要属性：name和 nowprice或oriprice或discount
export function searchData(data) {
	return ajax.request({
		url: '/api/goods/search',
		data: data
	})
}
// 分类商品数据
export function getListData() {
	return ajax.request({
		url: '/api/goods/list',	
	})
}
// 请求详情页数据
// data需要传入对象，两个必要属性：name和 id
export function getDetailData(data) {
	return ajax.request({
		url: '/api/goods/detail',
		// header:{token:true},
		data: data
	})
}

// 用户登录
// data需要传入对象，两个必要属性：userName和 password
export function userLogin(data){
	return ajax.request({
		url: '/api/login',
		data: data,
		method:'POST'
	})
} 

// 用户手机号注册
// data需要传入手机号对象属性：phone
export function userRegister(data){
	return ajax.request({
		url: '/api/registerPhone',
		data: data,
		method:'POST'
	})
} 
// 用户手机号查询是否存在
export function queryUserPhone(data){
	return ajax.request({
		url: '/api/queryPhone',
		data: data,
		method:'POST'
	})
} 
// 用户数据更新
// data需要传入对象，三个必要属性：userName、password和nickName
export function updateUserInfo(data){
	return ajax.request({
		url: '/api/updateUserInfo',
		data: data,
		method:'POST'
	})
} 
// 修改用户头像
// data需要传入对象，两个必要属性：phone和avatarImg
export function changeAvatar(data){
	return ajax.request({
		url: '/api/updateAvatar',
		data: data,
		method:'POST'
	})
} 

// 用户名查询
// data需要传入userName
export function queryUserName(data){
	return ajax.request({
		url: '/api/queryUserName',
		data: data,
		method:'POST'
	})
} 