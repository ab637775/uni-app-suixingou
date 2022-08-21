import config from './config/config.js'
import store from '../store/index.js'

// 请求拦截器
uni.addInterceptor('request', {
	invoke(args) {
		// 发送请求前
	},
	success(args) {
		// 请求成功响应后
	}, 
	fail(err) {
		// 请求失败
		console.log('interceptor-fail',err)
	}, 
	complete(res) {
		// 完成请求后
	}
})
// 创建请求服务
// function createSerive (config) {
// 	let reuest = new Promise((resolve, reject) => {
// 		uni.request({
// 			url: configData.baseUrl  + config.url,
// 			header: config.header,
// 			method: config.method,
// 			data: JSON.stringify(config.data) !== "{}" ?  config.data : config.params,
// 			timeout: config.timeout,
// 			dataType: config.dataType,
// 			responseType: config.responseType,
// 			success:(res) => {
// 				if(res.data.code === 200) {
// 					resolve(res.data.data)
// 				} else {
// 					// 其他情况的错误提示
// 					uni.showToast({
// 						title: res.data.msg,
// 						icon: 'none',
// 						duration: 2000
// 					});
// 					reject(res)
// 				}
// 			},
// 			fail: () => {
// 				reject()
// 			},
// 			complete: () => {
// 			}
// 		})
// 	})
// 	return reuest
// }
// // 请求方法
// function request (option) {
// 	const optionDefault = {
// 	  header:  options.header ? options.header : configData.header,
// 	  timeout: option.timeout ? option.timeout : configData.timeout, // 请求接口超时设置
// 	  dataType:  option.dataType ? option.dataType : configData.dataType, // 对返回的数据做一次 JSON.parse
// 	  responseType: option.responseType ? option.responseType : configData.responseType, // 设置响应的数据类型。合法值：text、arraybuffer
// 	  data: {}
// 	}
// 	return createSerive(Object.assign(optionDefault, option))
// }
//  export default request

export default {
	request(options = {}) {
		options.url = config.baseUrl + options.url
		options.method = options.method || config.method
		options.data = options.data || config.data
		options.header = options.header || config.header
		options.dataType = options.dataType || config.dataType
		console.log(options);
		let promise = new Promise((resolve, reject) => {
			uni.request(
				options
			).then((response) => {
				if (response[1].statusCode == 404) {
					reject({
						message: '未发现数据',
						code: 404
					})
				} else {
					// console.log('获取的response', response);
					let newData = response[1].data.data
					resolve(newData)
				}
			}).catch((error) => {
				reject(error)
			})

		})
		return promise
	}
}
