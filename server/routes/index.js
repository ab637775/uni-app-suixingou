var express = require('express');
var router = express.Router();
var connection = require('../db/mysql.js')
var user = require('../db/userSql.js')
// 通过ipconfig获取ip地址
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

// 用户手机号注册
router.post('/api/registerPhone', function(req, res, next){
	let param = req.body.phone
	// 验证手机号是否存在
	connection.query(user.queryUserPhone(param),function(error,results, fields) {
		if (error) throw error;
		if(results.length === 0){
			// 若手机号不存在，则在数据库中添加新用户的手机号和默认数据，默认数据可在下一步的用户信息注册中修改
			connection.query(user.insertData(param),function(err,result, fields) {
				if (err) throw err;
				res.send({
					"data": {
						statusCode:200,
						msg:'注册成功',
						data:result,
						param:param,
						results:results
					}
				})
			});
		}else{
			res.send({
				"data": {
					statusCode:405,
					msg:'该手机号已注册',
				}
			})
		}
	});
});
// 用户手机号查询是否存在
router.post('/api/queryPhone', function(req, res, next){
	let param = req.body.phone
	// 验证手机号是否存在
	connection.query(user.queryUserPhone(param),function(error,results) {
		if (error) throw error;
		if(results.length === 0){
			// 若手机号不存在，则
				res.send({
					"data": {
						statusCode:200,
						msg:'该手机号未注册',
					}
				})
		}else{
			res.send({
				"data": {
					statusCode:405,
					msg:'该手机号已注册',
				}
			})
		}
	});
});

// 用户名查询
router.post('/api/queryUserName', function(req, res, next){
	let param = req.body.userName
	// 验证手机号是否存在
	connection.query(user.queryUserName(param),function(error,results) {
		if (error) throw error;
		if(results.length === 0){
			// 若用户名不存在，则
				res.send({
					"data": {
						statusCode:200,
						msg:'该用户名不存在'
					}
				})
		}else{
			res.send({
				"data": {
					statusCode:405,
					msg:'该用户名已存在'
				}
			})
		}
	});
});

// 用户信息修改
router.post('/api/updateUserInfo', function(req, res, next){
	let param = {
		userName: req.body.userName,
		password: req.body.password,
		nickName: req.body.nickName,
		phone:req.body.phone
	}
	// 先判断修改的用户名是否存在
	connection.query(user.queryUserName(param.userName),function(error,results) {
		if (error) throw error;
		// 若不存在，则就修改对应用户数据
		if(results.length === 0){
			connection.query(user.updateUserInfo(param),function(err,result) {
				if (err) throw err;			
				res.send({
					"data": {
						statusCode:200,
						msg:'修改用户数据成功',
						data:result
					}
				})
			});	
		}else{
			// 若存在就报错
			res.send({
				"data": {
					statusCode:405,
					msg:'该用户名已存在',
				}
			})
		}
		
	});	

});


// 用户登录
router.post('/api/login', function(req, res, next) {
	let param = {
		userName: req.body.userName,
		password: req.body.password
	}
	// 验证用户名或手机号是否存在
	connection.query(user.queryUserNameOrPhone(param),function(error,results) {
			if (error) throw error;
			if(results.length > 0){
				// 若用户名或手机号存在，则进一步验证密码
				connection.query(user.queryUserPwd(param),function(err,result){
					if (err) throw err;
					if(result.length > 0){
						connection.query(user.generateToken(param),function(faults,ends){
							// 刷新登录后生成的token，把带有新生成token的用户数据返回
							connection.query(user.queryUserNameOrPhone(param),function(er,dataWithToken) {
								if (er) throw er;
								res.send({
									"data": {
										statusCode:200,
										msg:'登陆成功',
										data:dataWithToken[0],
										end:ends
									}
								})
							})			
						})
					
					}else{
						res.send({
							"data": {
								statusCode:404,
								msg:'密码错误'
							}
						})
					}
				})
			}else{
				res.send({
					"data": {
						statusCode:404,
						msg:'用户名或手机号不存在'
					}
				})
			}
		
		});	
});

// 用户头像上传
router.post('/api/updateAvatar', function(req, res, next){
	let param = {
		phone:req.body.phone,
		avatarImg:req.body.avatarImg
	}
	connection.query(user.updateAvatar(param),function(error,results) {
				if (error) throw error;
				res.send({
					"data": {
						statusCode:200,
						msg:'修改头像成功',
						data:results
					}
				})
	})

});


// 分类商品列表接口
router.get('/api/goods/list', function(req, res, next) {
	res.send({
		"code": "0",
		"data": {
			datalist: [{
					id: 1,
					name: '家装',
					list: [{
							id: 11,
							title: '桌台',
							children: [{
									id: 1,
									name: '电脑桌',
									imgUrl: '../../static/img/catalog/desk1.jpg'
								},
								{
									id: 2,
									name: '茶几',
									imgUrl: '../../static/img/catalog/desk2.jpg'
								},
								{
									id: 3,
									name: '书桌',
									imgUrl: '../../static/img/catalog/desk3.jpg'
								},
								{
									id: 4,
									name: '梳妆台',
									imgUrl: '../../static/img/catalog/desk4.jpg'
								},
								{
									id: 5,
									name: '餐桌',
									imgUrl: '../../static/img/catalog/desk5.jpg'
								},
								{
									id: 6,
									name: '折叠桌',
									imgUrl: '../../static/img/catalog/desk6.jpg'
								},
								{
									id: 7,
									name: '炕几',
									imgUrl: '../../static/img/catalog/desk7.jpg'
								},
								{
									id: 8,
									name: '和室几桌',
									imgUrl: '../../static/img/catalog/desk8.jpg'
								},
								{
									id: 9,
									name: '升降桌',
									imgUrl: '../../static/img/catalog/desk9.jpg'
								}
							]
						},
						{
							id: 12,
							title: '坐具',
							children: [{
									id: 1,
									name: '布艺沙发',
									imgUrl: '../../static/img/catalog/chair1.jpg'
								},
								{
									id: 2,
									name: '电脑椅',
									imgUrl: '../../static/img/catalog/chair2.jpg'
								},
								{
									id: 3,
									name: '皮艺沙发',
									imgUrl: '../../static/img/catalog/chair3.jpg'
								},
								{
									id: 4,
									name: '实木沙发',
									imgUrl: '../../static/img/catalog/chair4.jpg'
								},
								{
									id: 5,
									name: '餐椅',
									imgUrl: '../../static/img/catalog/chair5.jpg'
								},
								{
									id: 6,
									name: '摇椅',
									imgUrl: '../../static/img/catalog/chair6.jpg'
								},
								{
									id: 7,
									name: '和室椅',
									imgUrl: '../../static/img/catalog/chair7.jpg'
								},
							]
						},
						{
							id: 13,
							title: '架子',
							children: [{
									id: 1,
									name: '书架',
									imgUrl: '../../static/img/catalog/shelf1.jpg'
								},
								{
									id: 2,
									name: '鞋架',
									imgUrl: '../../static/img/catalog/shelf2.jpg'
								},
								{
									id: 3,
									name: '花架',
									imgUrl: '../../static/img/catalog/shelf3.jpg'
								},
								{
									id: 4,
									name: '衣帽架',
									imgUrl: '../../static/img/catalog/shelf4.jpg'
								},
								{
									id: 5,
									name: '牙刷架',
									imgUrl: '../../static/img/catalog/shelf5.jpg'
								},
								{
									id: 6,
									name: '毛巾架',
									imgUrl: '../../static/img/catalog/shelf6.jpg'
								},
								{
									id: 7,
									name: '卫生纸架',
									imgUrl: '../../static/img/catalog/shelf7.jpg'
								}, {
									id: 8,
									name: '酒架',
									imgUrl: '../../static/img/catalog/shelf8.jpg'
								},
								{
									id: 9,
									name: '微波炉支架',
									imgUrl: '../../static/img/catalog/shelf9.jpg'
								}, {
									id: 10,
									name: '剃须刀架',
									imgUrl: '../../static/img/catalog/shelf10.jpg'
								},
							]
						}

					]
				},
				{
					id: 2,
					name: '女装',
					list: [{
							id: 21,
							title: '女裙',
							children: [{
									id: 1,
									name: '连衣裙',
									imgUrl: '../../static/img/catalog/skirt1.jpg'

								},
								{
									id: 2,
									name: '半身裙',
									imgUrl: '../../static/img/catalog/skirt2.jpg'

								},
								{
									id: 3,
									name: '旗袍',
									imgUrl: '../../static/img/catalog/skirt3.jpg'

								}
							]
						},
						{
							id: 22,
							title: '上装',
							children: [{
									id: 1,
									name: 'T恤',
									imgUrl: '../../static/img/catalog/w_clothing1.jpg'

								},
								{
									id: 2,
									name: '衬衫',
									imgUrl: '../../static/img/catalog/w_clothing2.jpg'

								},
								{
									id: 3,
									name: '毛衣',
									imgUrl: '../../static/img/catalog/w_clothing3.jpg'

								},
								{
									id: 4,
									name: '雪纺衫',
									imgUrl: '../../static/img/catalog/w_clothing4.jpg'
								},
								{
									id: 5,
									name: '卫衣',
									imgUrl: '../../static/img/catalog/w_clothing5.jpg'
								},
								{
									id: 6,
									name: '马甲',
									imgUrl: '../../static/img/catalog/w_clothing6.jpg'
								}
							]
						},
						{
							id: 23,
							title: '女裤',
							children: [{
									id: 1,
									name: '休闲裤',
									imgUrl: '../../static/img/catalog/w_trousers1.jpg'

								},
								{
									id: 2,
									name: '牛仔裤',
									imgUrl: '../../static/img/catalog/w_trousers2.jpg'

								},
								{
									id: 3,
									name: '打底裤',
									imgUrl: '../../static/img/catalog/w_trousers3.jpg'

								},
								{
									id: 4,
									name: '棉裤羽绒裤',
									imgUrl: '../../static/img/catalog/w_trousers4.png'
								}
							]
						},
						{
							id: 24,
							title: '特色女装',
							children: [{
									id: 1,
									name: '大码女装',
									imgUrl: '../../static/img/catalog/w_special1.jpg'

								},
								{
									id: 2,
									name: '中老年女装',
									imgUrl: '../../static/img/catalog/w_special2.jpg'

								}
							]
						}

					]

				},
				{
					id: 3,
					name: '手机',
					list: [{
						id: 31,
						title: '手机',
						children: [{
								id: 1,
								name: 'OPPO',
								imgUrl: '../../static/img/catalog/phone1.jpg'
							}, {
								id: 2,
								name: 'iQOO',
								imgUrl: '../../static/img/catalog/phone2.jpg'
							}, {
								id: 3,
								name: 'realme',
								imgUrl: '../../static/img/catalog/phone3.jpg'
							}, {
								id: 4,
								name: 'vivo',
								imgUrl: '../../static/img/catalog/phone4.jpg'
							}, {
								id: 5,
								name: '一加',
								imgUrl: '../../static/img/catalog/phone5.jpg'
							},
							{
								id: 6,
								name: '三星',
								imgUrl: '../../static/img/catalog/phone6.png'
							},
							{
								id: 7,
								name: '华为',
								imgUrl: '../../static/img/catalog/phone7.jpg'
							},
							{
								id: 8,
								name: '小米',
								imgUrl: '../../static/img/catalog/phone8.jpg'
							},
							{
								id: 9,
								name: '苹果',
								imgUrl: '../../static/img/catalog/phone9.jpg'
							},
							{
								id: 10,
								name: '荣耀',
								imgUrl: '../../static/img/catalog/phone10.jpg'
							},
							{
								id: 11,
								name: '魅族',
								imgUrl: '../../static/img/catalog/phone11.png'
							},
						]
					}, {
						id: 32,

						title: '手机配件',
						children: [{
								id: 1,
								name: '手机壳',
								imgUrl: '../../static/img/catalog/accessory1.jpg'
							},
							{
								id: 2,
								name: '手机贴膜',
								imgUrl: '../../static/img/catalog/accessory2.jpg'
							},
							{
								id: 3,
								name: '手机耳机',
								imgUrl: '../../static/img/catalog/accessory3.jpg'
							},
							{
								id: 4,
								name: '数据线',
								imgUrl: '../../static/img/catalog/accessory4.jpg'
							},
							{
								id: 5,
								name: '充电宝',
								imgUrl: '../../static/img/catalog/accessory5.jpg'
							},
							{
								id: 6,
								name: '手机支架',
								imgUrl: '../../static/img/catalog/accessory6.jpg'
							},
							{
								id: 7,
								name: '手机挂件',
								imgUrl: '../../static/img/catalog/accessory7.jpg'
							},
							{
								id: 8,
								name: '自拍杆',
								imgUrl: '../../static/img/catalog/accessory8.jpg'
							},
							{
								id: 9,
								name: '手机电池',
								imgUrl: '../../static/img/catalog/accessory9.jpg'
							},
							{
								id: 10,
								name: '手机镜头',
								imgUrl: '../../static/img/catalog/accessory10.jpg'
							},
							{
								id: 11,
								name: '手机贴纸',
								imgUrl: '../../static/img/catalog/accessory11.jpg'
							},
							{
								id: 12,
								name: '防尘塞',
								imgUrl: '../../static/img/catalog/accessory12.jpg'
							},
							{
								id: 13,
								name: '车载支架',
								imgUrl: '../../static/img/catalog/accessory13.jpg'
							},
						]
					}]

				}
			]

		}
	});
});


// 请求搜索结果的接口
router.get('/api/goods/search', function(req, res, next) {
	// desc降序 asc升序
	//获取对象的key
	let [goodsName, orderName] = Object.keys(req.query)
	// name参数的值
	let name = req.query.name
	// orderName的key的值
	let order = req.query[orderName]

	connection.query("SELECT * FROM goods_search where name like '%" + name + "%' order by " + orderName + " " +
		order + "",
		function(error,
			results, fields) {
			if (error) throw error;
			console.log('The solution is: ', results);
			res.send({
				"code": "0",
				"data": results
			})
		});

});
// 商品详情页接口
router.get('/api/goods/detail', function(req, res, next) {

	//获取对象的key
	console.log('query', Object.keys(req.query));
	// req参数的值
	let name = req.query.name
	let id = req.query.id
	connection.query("SELECT * FROM goods_detail where id like " + id + " and name like '%" + name + "%'",
		function(error,
			results, fields) {
			if (error) throw error;
			console.log('The solution is: ', results);
			res.send({
				"code": "0",
				"data": results
			})
		});
});
//首页推荐的接口
router.get('/api/index_list/data', function(req, res, next) {
	res.send({
		"code": "0",
		"data": {
			topBar: [{
					id: 1,
					name: '推荐'
				},
				{
					id: 2,
					name: '运动户外'
				},
				{
					id: 3,
					name: '服饰内衣'
				},
				{
					id: 4,
					name: '鞋靴箱包'
				},
				{
					id: 5,
					name: '美妆个护'
				},
				{
					id: 6,
					name: '家居数码'
				},
				{
					id: 7,
					name: '食品母婴'
				}
			],
			datalist: [{
					type: "swiperList",
					data: ["../../static/img/swiper1.jpg", "../../static/img/swiper2.jpg",
						"../../static/img/swiper3.jpg"
					]
				},
				{
					type: "recommendList",
					data: [{
							imgBigUrl: "../../static/img/Children.jpg",
							imgUrlArr: ["../../static/img/Children1.jpg",
								"../../static/img/Children2.jpg",
								"../../static/img/Children3.jpg"
							]
						},
						{
							imgBigUrl: "../../static/img/Furnishing.jpg",
							imgUrlArr: ["../../static/img/Furnishing1.jpg",
								"../../static/img/Furnishing2.jpg",
								"../../static/img/Furnishing3.jpg"
							]
						}
					]
				},
				{
					type: "commodityList",
					data: [{
							id: 8,
							imgSrc: '../../static/img/detail/detail1.jpg',
							name: '怕麻烦十字架刺绣开衫卫衣女2022春秋新款宽松bf美式复古潮牌外套',
							now_price: 142,
							ori_price: 199

						},
						{
							id: 9,
							imgSrc: '../../static/img/detail/detail6.jpg',
							name: '条纹连帽卫衣oversize女春秋2022新款宽松休闲ins设计感小众上衣',
							now_price: 163,
							ori_price: 173
						},
						{
							id: 10,
							imgSrc: '../../static/img/detail/detail11.jpg',
							name: '【买一送一】oversize华夫格卫衣女早秋2022新款宽松情侣连帽外套',
							now_price: 128,
							ori_price: 199
						},
						{
							id: 11,
							imgSrc: '../../static/img/detail/detail16.jpg',
							name: '港风独特别致短袖衬衫女装夏季2022新款小众设计感绿色上衣小个子',
							now_price: 75,
							ori_price: 129,
						}
					]
				}
			]
		}

	});
});

//分类部分的接口
//运动户外
router.get('/api/index_list/2/data/1', function(req, res, next) {
		res.send({
			"code": "0",
			"data": {
				datalist: [{
					type: "bannerList",
					data: ["../../static/img/banner1.jpg"]

				}, {
					type: "iconsList",
					data: [{
							name: "运动户外",
							urlImg: "../../static/img/icons1.png"
						},
						{
							name: "运动户外",
							urlImg: "../../static/img/icons2.png"
						},
						{
							name: "运动户外",
							urlImg: "../../static/img/icons3.png"
						},
						{
							name: "运动户外",
							urlImg: "../../static/img/icons4.png"
						},
						{
							name: "运动户外",
							urlImg: "../../static/img/icons5.png"
						},
						{
							name: "运动户外",
							urlImg: "../../static/img/icons6.png"
						},
						{
							name: "运动户外",
							urlImg: "../../static/img/icons7.png"
						},
						{
							name: "运动户外",
							urlImg: "../../static/img/icons8.png"
						},

					]
				}, {
					type: "hotList",
					data: [{
							id: 1,
							imgSrc: '../../static/img/hot1.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 297,
							ori_price: 620,
							discount: 5.2
						},
						{
							id: 2,
							imgSrc: '../../static/img/hot2.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 297,
							ori_price: 620,
							discount: 5.2
						},
						{
							id: 3,
							imgSrc: '../../static/img/hot3.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 297,
							ori_price: 620,
							discount: 5.2
						}
					]
				}, {
					type: "shopList",
					data: [{
							id: 1,
							imgSrc: '../../static/img/shop1.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 297,
							ori_price: 620,
							discount: 5.2
						},
						{
							id: 2,
							imgSrc: '../../static/img/shop2.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 297,
							ori_price: 620,
							discount: 5.2
						},
						{
							id: 3,
							imgSrc: '../../static/img/shop3.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 297,
							ori_price: 620,
							discount: 5.2
						},
						{
							id: 4,
							imgSrc: '../../static/img/shop4.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 297,
							ori_price: 620,
							discount: 5.2
						}
					]
				}, {
					type: "commodityList",
					data: [{
							id: 1,
							imgSrc: '../../static/img/commodity1.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 297,
							ori_price: 620,
							discount: 5.2
						},
						{
							id: 2,
							imgSrc: '../../static/img/commodity2.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 297,
							ori_price: 620,
							discount: 5.2
						},
						{
							id: 3,
							imgSrc: '../../static/img/commodity3.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 297,
							ori_price: 620,
							discount: 5.2
						},
						{
							id: 4,
							imgSrc: '../../static/img/commodity4.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 297,
							ori_price: 620,
							discount: 5.2
						}
					]

				}],
			}

		})
	}),
	//服饰内衣
	router.get('/api/index_list/3/data/1', function(req, res, next) {
		res.send({
			"code": "0",
			"data": {
				datalist: [{
					type: "bannerList",
					data: ["../../static/img/banner1.jpg"]

				}, {
					type: "iconsList",
					data: [{
							name: "服饰内衣",
							urlImg: "../../static/img/icons1.png"
						},
						{
							name: "服饰内衣",
							urlImg: "../../static/img/icons2.png"
						},
						{
							name: "服饰内衣",
							urlImg: "../../static/img/icons3.png"
						},
						{
							name: "服饰内衣",
							urlImg: "../../static/img/icons4.png"
						},
						{
							name: "服饰内衣",
							urlImg: "../../static/img/icons5.png"
						},
						{
							name: "服饰内衣",
							urlImg: "../../static/img/icons6.png"
						},
						{
							name: "服饰内衣",
							urlImg: "../../static/img/icons7.png"
						},
						{
							name: "服饰内衣",
							urlImg: "../../static/img/icons8.png"
						},

					]
				}, {
					type: "hotList",
					data: [{
							id: 1,
							imgSrc: '../../static/img/hot1.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 297,
							ori_price: 620,
							discount: 5.2
						},
						{
							id: 2,
							imgSrc: '../../static/img/hot2.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 310,
							ori_price: 620,
							discount: 5
						},
						{
							id: 3,
							imgSrc: '../../static/img/hot3.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 333,
							ori_price: 620,
							discount: 4.7
						}
					]
				}, {
					type: "shopList",
					data: [{
							id: 1,
							imgSrc: '../../static/img/shop1.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 297,
							ori_price: 620,
							discount: 5.2
						},
						{
							id: 2,
							imgSrc: '../../static/img/shop2.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 297,
							ori_price: 620,
							discount: 5.2
						},
						{
							id: 3,
							imgSrc: '../../static/img/shop3.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 297,
							ori_price: 620,
							discount: 5.2
						},
						{
							id: 4,
							imgSrc: '../../static/img/shop4.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 297,
							ori_price: 620,
							discount: 5.2
						}
					]
				}, {
					type: "commodityList",
					data: [{
							id: 1,
							imgSrc: '../../static/img/commodity1.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 297,
							ori_price: 620,
							discount: 5.2
						},
						{
							id: 2,
							imgSrc: '../../static/img/commodity2.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 297,
							ori_price: 620,
							discount: 5.2
						},
						{
							id: 3,
							imgSrc: '../../static/img/commodity3.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 297,
							ori_price: 620,
							discount: 5.2
						},
						{
							id: 4,
							imgSrc: '../../static/img/commodity4.jpg',
							name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
							now_price: 297,
							ori_price: 620,
							discount: 5.2
						}
					]

				}]
			}

		})
	})

//分页接口
router.get('/api/index_list/1/data/2', function(req, res, next) {
	res.send({
		"code": "0",
		"data": {
			datalist: [{
				type: "commodityList",
				data: [{
						id: 1,
						imgSrc: '../../static/img/commodity1.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					},
					{
						id: 2,
						imgSrc: '../../static/img/commodity2.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					},
					{
						id: 3,
						imgSrc: '../../static/img/commodity3.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					},
					{
						id: 4,
						imgSrc: '../../static/img/commodity4.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					}
				]
			}],
		},
	})
});
router.get('/api/index_list/2/data/2', function(req, res, next) {
	res.send({
		"code": "0",
		"data": {
			datalist: [{
				type: "commodityList",
				data: [{
						id: 1,
						imgSrc: '../../static/img/commodity1.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					},
					{
						id: 2,
						imgSrc: '../../static/img/commodity2.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					},
					{
						id: 3,
						imgSrc: '../../static/img/commodity3.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					},
					{
						id: 4,
						imgSrc: '../../static/img/commodity4.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					}
				]
			}]
		}
	})
});
router.get('/api/index_list/2/data/3', function(req, res, next) {
	res.send({
		"code": "0",
		"data": {
			datalist: [{
				type: "commodityList",
				data: [{
						id: 1,
						imgSrc: '../../static/img/commodity1.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					},
					{
						id: 2,
						imgSrc: '../../static/img/commodity2.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					},
					{
						id: 3,
						imgSrc: '../../static/img/commodity3.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					},
					{
						id: 4,
						imgSrc: '../../static/img/commodity4.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					}
				]
			}],
		},
	})
});
router.get('/api/index_list/2/data/4', function(req, res, next) {
	res.send({
		"code": "0",
		"data": {
			datalist: [{
				type: "commodityList",
				data: [{
						id: 1,
						imgSrc: '../../static/img/commodity1.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					},
					{
						id: 2,
						imgSrc: '../../static/img/commodity2.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					},
					{
						id: 3,
						imgSrc: '../../static/img/commodity3.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					},
					{
						id: 4,
						imgSrc: '../../static/img/commodity4.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					}
				]
			}],
		},
	})
});

router.get('/api/index_list/3/data/2', function(req, res, next) {
	res.send({
		"code": "0",
		"data": {
			datalist: [{
				type: "commodityList",
				data: [{
						id: 1,
						imgSrc: '../../static/img/commodity1.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					},
					{
						id: 2,
						imgSrc: '../../static/img/commodity2.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					},
					{
						id: 3,
						imgSrc: '../../static/img/commodity3.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					},
					{
						id: 4,
						imgSrc: '../../static/img/commodity4.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					}
				]
			}]
		}
	})
});
router.get('/api/index_list/3/data/3', function(req, res, next) {
	res.send({
		"code": "0",
		"data": {
			datalist: [{
				type: "commodityList",
				data: [{
						id: 1,
						imgSrc: '../../static/img/commodity1.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					},
					{
						id: 2,
						imgSrc: '../../static/img/commodity2.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					},
					{
						id: 3,
						imgSrc: '../../static/img/commodity3.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					},
					{
						id: 4,
						imgSrc: '../../static/img/commodity4.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					}
				]
			}],
		},
	})
});
router.get('/api/index_list/3/data/4', function(req, res, next) {
	res.send({
		"code": "0",
		"data": {
			datalist: [{
				type: "commodityList",
				data: [{
						id: 1,
						imgSrc: '../../static/img/commodity1.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					},
					{
						id: 2,
						imgSrc: '../../static/img/commodity2.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					},
					{
						id: 3,
						imgSrc: '../../static/img/commodity3.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					},
					{
						id: 4,
						imgSrc: '../../static/img/commodity4.jpg',
						name: '绒毛大衣2022年春季最新款超量降价，买到就是赚到！',
						now_price: 297,
						ori_price: 620,
						discount: 5.2
					}
				]
			}],
		},
	})
});


module.exports = router;
