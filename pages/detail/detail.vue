<template>
	<view class="detail" :class="{popupShow:showItem===true||showPara===true}">
		<!-- 商品轮播图片 -->
		<u-swiper :list="imgList" @change="getCurrentNum" :autoplay="false" height="1000rpx"
			indicatorStyle="right: 20px">
			<view slot="indicator" class="indicator-num">
				<text class="indicator-num__text">{{ currentNum + 1 }}/{{ imgList.length }}</text>
			</view>
		</u-swiper>
		<!-- 商品购买详细信息 -->
		<view class="detail-container">
			<view class="detail-top">
				<view class="detail-top-content">
					<view class="price">
						<view class="now_price">￥{{datalist.now_price}}</view>
						<view class="ori_price">￥{{datalist.ori_price}}</view>
					</view>
					<view class="sell-count">
						月销{{datalist.sell_count}}
					</view>
				</view>
				<view class="tip">
					<view class="left-tip">
						<text class="tipMsg">跨店每300减30</text>
					</view>
					<view class="right-tip">
						查看&gt;
					</view>
				</view>
				<view class="title">
					{{datalist.name}}
				</view>
			</view>

			<view class="detail-selection">
				<view class="choice" @tap='showItem = true'>
					<view class="choice-title d-s-color">
						<text>选择</text>
					</view>
					<view class="choice-content">
						<view class="choice-content-title">
							<text>颜色分类/尺码</text>
							<image src="../../static/img/rightArrow.png" mode=""></image>
						</view>
						<view class="choice-content-imgs">
							<block v-for="(value,index) in colorImg" :key="index">
								<image :src="'http://img.alicdn.com/imgextra/'+value.imgUrl+''"></image>
							</block>
							<view class="choice-intro">
								共{{colorImg.length}}种颜色分类可选
							</view>
						</view>
					</view>
				</view>
				<view class="deliver">
					<view class="deliver-title d-s-color">
						发货
					</view>
					<view class="deliver-content">
						<text>{{datalist.address}}</text>
						<text class="content-sec">|</text>
						<text v-if="datalist.hasDeliver===1">快递：快递包邮</text>
						<text v-else>快递：不支持快递包邮</text>
					</view>
				</view>
				<view class="guarantee">
					<view class="guarantee-title d-s-color">
						保障
					</view>
					<view class="guarantee-content">
						<text v-if="datalist.hasGurantee===1">7天无理由</text>
						<text v-else>不支持7天无理由</text>
					</view>
					<image src="../../static/img/rightArrow.png" mode="">
					</image>
				</view>
				<view class="parameter" @tap="showPara = true">
					<view class="parameter-left">
						<view class="parameter-title d-s-color">
							参数
						</view>
						<view class="parameter-content">
							<!-- 品牌 尺码 面料 领子 风格 颜色分类 袖型 组合形式 -->
							{{parameterTitle}}
						</view>
					</view>
					<image src="../../static/img/rightArrow.png" mode=""></image>
				</view>
			</view>
			<!-- 商家内容 -->
			<view class="detail-shopper">
				<view class="shopper-top">
					<image :src="'http://img.alicdn.com/'+datalist.shopperImg+''" mode=""></image>
					<view class="shopper-top-content">
						{{datalist.shopperName}}
					</view>
					<view class="shopper-top-rate">
						<!-- 因为拿到的数据比较深，页面挂载的时候数据在发送请求时rateArr是undefined, -->
						<!-- 用`逻辑与`判断rateArr是否有数据，有数据再进行渲染 -->
						<view>宝贝描述 {{rateArr[0] && rateArr[0].rate}} <text class="d-color">{{' '}}{{rateArr[0] && rateArr[0].text}}</text></view>
						<view>卖家服务 {{rateArr[1] && rateArr[1].rate}} <text class="d-color">{{' '}}{{rateArr[1] && rateArr[1].text}}</text></view>
						<view>物流服务 {{rateArr[2] && rateArr[2].rate}} <text class="d-color">{{' '}}{{rateArr[2] && rateArr[2].text}}</text></view>

					</view>
				</view>
				<view class="shopper-bottom">
					<text class="shopper-button">进店逛逛</text> <text class="shopper-button">全部宝贝</text>
				</view>
			</view>
			<!-- 商品介绍详情图片(多图) -->
			<Card cardTitle="详情" color="#999999" fontSize="12"></Card>
			<view class="infoImg-container">
				<!-- <image src="http://img.alicdn.com/imgextra/i1/191052046/O1CN01UYsd6M1Qz77XJaNT3_!!191052046.jpg"
					mode="widthFix" class="infoImg"></image> -->
				<image :src="'http://img.alicdn.com/imgextra/' +infoImg_val+''" mode="widthFix" class="infoImg"
					v-for="(infoImg_val,inforImg_idx) in infoImgList" :key="inforImg_idx"></image>
			</view>
		</view>

		<!-- 购买弹出层 -->
		<!-- 注意不要把弹出层嵌套写在其他组件中，它会受父组件影响的 -->
		<u-popup :show="showItem" :round="30" mode="bottom" :closeOnClickOverlay="true" @close="popupClose" @open="open">
			<view class="purchase-container">
				<view class="purchase-top">
					<!-- 一开始显示默认封面，点击对应颜色类别后切换至对应封面 -->
					<image :src="imgList[0]" mode="" v-if="showCover === true"></image>
					<image :src="'http://img.alicdn.com/imgextra/'+cover+''" mode="" v-else></image>
					<view class="top-right">
						<view class="price-box">
							<view class="price">
								￥{{datalist.now_price}}
							</view>
							<view v-if="datalist.available===1">
								有货
							</view>
							<view v-else>
								没货了
							</view>
							<!-- 	<view class="infor" v-if="rule_active===-1 && color_active===-1">
								请选择：尺码 颜色分类
							</view>	 -->
							<view class="infor">
								<!-- 请选择：尺码 颜色分类 -->
								<!-- 设置对应选项的购物提示 -->
								<text v-if="rule_active!==-1 || color_active!==-1">已选：<text v-if="rule_active!==-1"
										style="padding: 0 3px;">
										{{ruleArr[rule_active]}}</text><text v-if="color_active!==-1"
										style="padding-right: 3px;">
										{{colorImg[color_active].color}}</text></text>
								<text v-if="rule_active==-1 || color_active==-1">请选择：<text v-if="rule_active ==-1"
										style="padding-left: 3px;"> 尺码</text> <text v-if="color_active ==-1"
										style="padding-left: 3px;">颜色分类</text></text>
							</view>
						</view>
					</view>
					<view class="iconfont icon-roundclose" @tap="popupClose">
					</view>
				</view>
				<view class="purchase-rule">
					<view class="rule-title">
						尺码
					</view>
					<view class="rule-selection">
						<view class="rule-button" v-for="(item,index) in ruleArr" :key="index" @tap="changeRule(index)"
							:class="{'button-active':rule_active===index}">
							{{item}}
						</view>
					</view>
				</view>
				<view class="purchase-color">
					<view class="color-title">
						颜色分类
					</view>
					<view class="color-selection">
						<view class="color-button" v-for="(val,idx) in colorImg" :key="idx"
							@tap="changeColor(val.imgUrl,idx)" :class="{'button-active':color_active===idx}">
							{{val.color}}
						</view>
					</view>
				</view>
				<view class="purchase-count">
					<view class="count-title">
						购买数量
					</view>
					<view class="count-button">
						<view class="iconfont icon-move" @tap="subMount"></view>
						<view class="count-input">
							<input type="text" class="itp" v-model="mount">
						</view>
						<view class="iconfont icon-add" @tap="addMount"></view>
					</view>
				</view>
				<view class="purchase-footer">
					<view class="footer-box">
						<view class="bar-left" @tap="addItemToShopCart">
							加入购物车
						</view>
						<view class="bar-right" @tap="goToShopCart">
							立即购买
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		<!-- 参数详情弹出层 -->
		<u-popup :show="showPara" round="30" @close="showPara = false" @open="open" mode="bottom"
			:closeOnClickOverlay="true">
			<view class="parameter-container">
				<view class="para-title">
					参数
				</view>
				<scroll-view scroll-y="true" class="para-scroll" :style="'height:434px;'">
					<view v-for="(para_val,paraIndex) in parameterArr" :key="paraIndex" class="para-scroll-box">
						<view class="para-left">{{para_val.key}}</view>
						<view class="para-right">{{para_val.value}}</view>
					</view>
				</scroll-view>
				<view class="para-footer">
					<view class="confirm-button" @click="showPara = false">
						完成
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 商品购买footerbar -->
		<view class="detail-footer f-color">
			<view class="footer-left">
				<view class="footer-content">
					<view class="iconfont icon-shop d-color">
					</view>
					<text>店铺</text>
				</view>
				<view class="footer-content">
					<view class="iconfont icon-wang">
					</view>
					<text>客服</text>
				</view>
				<view class="footer-content">
					<view class="iconfont icon-favor">
					</view>
					<text>收藏</text>
				</view>
			</view>
			<view class="footer-right">
				<view class="bar-left" @tap="showItem = true">
					加入购物车
				</view>
				<view class="bar-right">
					立即购买
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getDetailData
	} from '@/request/api/index.js'
	import Card from "@/components/common/Card.vue"
	import { mapMutations, mapState } from 'vuex'
	export default {
		data() {
			return {
				currentNum: 0,
				imgList: [],
				datalist: {},
				colorImg: [],
				ruleArr: [],
				parameterArr: [],
				parameterTitle: '',
				parameterTitleArr: [],
				infoImgList: [],
				rateArr: [],
				showItem: false,
				showPara: false,
				//弹出层点击颜色分类后显示的对应封面
				cover: '',
				showCover: true,
				//弹出层按键点击判断参数
				rule_active: -1,
				color_active: -1,
				// 购买数量
				mount: 1,
				temp:null,
				tempItemList:{},
				currentItem:{},
				i:0

			}
		},
		components: {
			Card
		},
		computed:{
			...mapState(['shopCartList','token'])
		},
		methods: {
			...mapMutations(['updateShopCartList','addCartId','changeShopCartList']),
			getCurrentNum(e) {
				this.currentNum = e.current
			},
			// 将数据库传来的参数中被str包裹的JSON数据转换为object格式
			transformStringToObj(str) {
				const resultArr = []
				const temp = str.split(' ')
				// 打印temp检查输出的参数数组是否有误
				// console.log('temp', temp);
				temp.forEach(val => {
					resultArr.push(JSON.parse(val))
				})
				return resultArr
			},
			open() {
			},
			close() {
				this.showItem = false
			},
			goToShopCart(){
				// 在Vuex里存储购物车商品数据
							
				//简易深拷贝
				let temp_list = JSON.parse(JSON.stringify(this.temp))
				let temp_itemList = JSON.parse(JSON.stringify(this.temp.itemList))
						
				if(this.shopCartList.length === 0){
						this.updateShopCartList(temp_list)
				}else{
					if(this.shopCartList.some((val,idx)=> {
							this.i = idx
							return val.shopperName === this.datalist.shopperName
						})){
							const new_temp_itemList  = [...this.shopCartList[this.i].itemList,...temp_itemList]
							temp_list.itemList = new_temp_itemList
							let save = JSON.parse(JSON.stringify(this.shopCartList))
							save[this.i] = temp_list
							console.log('save',save);
							this.changeShopCartList(save)																																						
						}else{
							this.updateShopCartList(temp_list)
						}
				}
				uni.navigateTo({
					url:'/pages/shopCart/shopCart'
				})
			},
			popupClose(){
				this.showItem = false
				// 在Vuex里存储购物车商品数据
			
				//简易深拷贝
				let temp_list = JSON.parse(JSON.stringify(this.temp))
				let temp_itemList = JSON.parse(JSON.stringify(this.temp.itemList))
		
				if(this.shopCartList.length === 0){
						this.updateShopCartList(temp_list)
				}else{
					if(this.shopCartList.some((val,idx)=> {
							this.i = idx
							return val.shopperName === this.datalist.shopperName
						})){
							console.log('ok');
							console.log('this.i',this.i);
							// let newId = this.shopCartList[this.i].itemList.length
							// console.log('newId',newId);
							const new_temp_itemList  = [...this.shopCartList[this.i].itemList,...temp_itemList]
							temp_list.itemList = new_temp_itemList
							let save = JSON.parse(JSON.stringify(this.shopCartList))
							save[this.i] = temp_list
							console.log('save',save);
							this.changeShopCartList(save)
								console.log('temp_itemList',temp_itemList);
								console.log('temp_list',temp_list);
		
					// console.log('new_temp_itemList',new_temp_itemList);
					
							console.log('在同一家店添加的shopCartList',this.shopCartList);																								
						}else{
							this.updateShopCartList(temp_list)
						}
				}
			console.log('shopCartList',this.shopCartList);
				
			},
			changeRule(index) {
				this.rule_active = this.rule_active === index ? -1 : index
			},
			changeColor(imgUrl, index) {
				this.showCover = false
				// this.cover = colorIndex - 1
				this.cover = imgUrl
				this.color_active = this.color_active === index ? -1 : index
			},
			subMount() {
				if (this.mount > 0) {
					this.mount--
				}
			},
			addMount() {
				if (this.mount < 99) {
					this.mount++
				}
			},

			addItemToShopCart(){
				if(!this.token){
					uni.showToast({
						title:'您还没有登录，正在为您跳转到登录界面',
						icon:'loading',
						duration:2000,
						success: () => {
							setTimeout(()=>{		
								uni.reLaunch({
									url:'/pages/login/login'
								})
							},2100)	
						}
					})
				}else{
					if(this.rule_active === -1 && this.color_active === -1){
							uni.showToast({
								title: '请选择尺码 颜色分类',
								icon:'none',
								duration: 2000
							});
						}else if(this.rule_active === -1){
							uni.showToast({
								title: '请选择尺码',
								icon:'none',
								duration: 2000
							});
						}else if (this.color_active === -1){
							uni.showToast({
								title: '请选择颜色分类',
								icon:'none',
								duration: 2000
							});
						}
						uni.showToast({
							title: '加入成功！',
							icon:'none',
							duration: 1000
						});
							// console.log('rule',this.rule_active);
							// console.log('color',this.color_active);
							let last = this.shopCartList.length - 1 
							let idNum = 1
						
					// this.temp用于存储当前商品页面的购买数据总览 
					if(this.temp === null){
						// 初始化temp
							this.temp = {
							shopperImg:this.datalist.shopperImg,
							shopperName:this.datalist.shopperName,
							isShopChecked:false,
							itemList:[
								{
									name:this.datalist.name,
									rule:this.ruleArr[this.rule_active],
									color:this.colorImg[this.color_active].color,
									price:this.datalist.now_price,
									count:this.mount,
									cover:this.cover,
									isChecked:false
								}
							]							
						}	
					}else{		
						// 在当前页面继续购买商品，更新temp
					this.currentItem =  {
									name:this.datalist.name,
									rule:this.ruleArr[this.rule_active],
									color:this.colorImg[this.color_active].color,
									price:this.datalist.now_price,
									count:this.mount,
									cover:this.cover,
									isChecked:false
								}
					this.temp.itemList.push(this.currentItem)
					console.log('this.currentItem',this.currentItem);			
					console.log('非零的itemList',this.temp.itemList);
					}
					 
					// console.log('itemList',this.temp.itemList);
					// console.log('this.saveShopCart',this.saveShopCart);
				}
											
			}
		},
		onLoad(option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option.id); //打印出上个页面传递的参数。
			console.log(option.name); //打印出上个页面传递的参数。
			console.log('原始的shopCartList',this.shopCartList);
			setTimeout(() => {
				getDetailData({
					id: option.id,
					name: option.name
				}).then(res => {
					console.log('data', res[0]);
					let data = res[0]
					this.datalist = data
					this.imgList = data.imgUrlList.split(',')
					this.ruleArr = data.rule.split(',')
					this.infoImgList = data.infoImg.split(',')
					this.rateArr = this.transformStringToObj(data.shopperQuality)
					console.log('rateArr', this.rateArr);
					console.log('ruleArr', this.ruleArr);
					// console.log('infoImgList', this.infoImgList);
					this.colorImg = this.transformStringToObj(data.color)
					this.parameterArr = this.transformStringToObj(data.parameter)
					this.parameterArr.forEach(val => {
						this.parameterTitleArr.push(val.key)
					})

					//拼接参数关键词显示标题
					this.parameterTitleArr.forEach(val => {
						this.parameterTitle += val + " "
					})
					console.log('colorImg', this.colorImg);
					// console.log('parameterArr', this.parameterArr);
					// console.log('parameterTitle', this.parameterTitle);
					// console.log('parameterTitleArr', this.parameterTitleArr);
					console.log('imgList', this.imgList);

				})
			}, 100)

		}
	
	}
</script>

<style lang="scss" scoped>
	.banner {
		width: 750rpx;
		height: 1000rpx;
	}

	.button-active {
		background-image: linear-gradient(90deg, #ff7a00 100%, #fe560a 0);
		color: #FFFFFF;
	}

	.popupShow {
		overflow: hidden;
		position: fixed;
		height: 100%;
		width: 100%;
	}

	.detail {
		width: 100%;

		.detail-container {
			width: 750rpx;
			min-height: 2000rpx;

			.detail-top {
				width: calc(750rpx- 32rpx- 48rpx);
				min-height: 260rpx;
				margin: 16rpx;
				padding: 24rpx;
				background-color: #FFFFFF;
				border-radius: 20rpx;

				.detail-top-content {
					position: relative;

					.now_price {
						display: inline-block;
						font-weight: bold;
						font-size: 48rpx;
						color: #FF5000;
					}

					.ori_price {
						display: inline-block;
						text-decoration: line-through;
						font-size: 26rpx;
						margin-left: 10rpx;
						color: #999999;
					}

					.sell-count {
						position: absolute;
						font-size: 24rpx;
						color: #999999;
						top: 0;
						right: 10rpx;
					}
				}
			}

			.tip {
				display: flex;
				width: 100%;
				height: 40rpx;
				justify-content: space-between;
				align-items: center;

				.left-tip {
					width: 196rpx;
					height: 40rpx;
					background-color: #FFEDE5;
					text-align: center;
					line-height: 40rpx;
					border-radius: .8vw;

					.tipMsg {
						font-size: 24rpx;
						color: #FF5000;
					}
				}

				.right-tip {
					font-size: 26rpx;
					color: #FF5000;
				}
			}

			.title {
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				margin-top: 12rpx;
				color: #333333;
				font-weight: bold;
				font-size: 36rpx;
			}

			.detail-selection {
				width: calc(100% - 32rpx- 48rpx);
				min-height: 340rpx;
				margin: 16rpx;
				padding: 24rpx;
				background-color: #FFFFFF;
				border-radius: 20rpx;
				font-size: 28rpx;

				// height: 500rpx;
				.choice {
					display: flex;

					height: 108rpx;
					margin-top: 16rpx;

					.choice-title {
						width: 96rpx;
						padding-right: 39rpx;
						line-height: 26rpx;
						text-align: center;
					}

					.choice-content {
						width: 596rpx;

						.choice-content-title {
							display: flex;
							justify-content: space-between;
							align-items: center;
							height: 28rpx;

							image {
								width: 10rpx;
								height: 18rpx;
							}
						}

						.choice-content-imgs {
							display: flex;
							margin-top: 18rpx;

							image {
								width: 60rpx;
								height: 60rpx;
								border-radius: 15rpx;
								margin-right: 12rpx;
							}

							.choice-intro {
								width: 208rpx;
								height: 24rpx;
								line-height: 24rpx;
								font-size: 24rpx;
								color: #999999;
								background-color: #f2f2f2;
								padding: 12rpx;
								border-radius: 12rpx;
								margin-top: 14rpx;
							}
						}
					}
				}

				.deliver {
					display: flex;
					height: 40rpx;
					line-height: 28rpx;
					margin-top: 40rpx;

					.deliver-title {
						width: 96rpx;
						padding-right: 39rpx;
						text-align: center;
					}

					.deliver-content {
						width: 596rpx;

						.content-sec {
							padding: 0 12rpx;
							color: #EEEEEE;
						}
					}
				}

				.guarantee {
					display: flex;
					height: 40rpx;
					align-items: center;
					margin-top: 40rpx;

					.guarantee-title {
						width: 96rpx;
						padding-right: 39rpx;
						text-align: center;
					}

					.guarantee-content {
						width: 560rpx;

					}

					image {
						width: 10rpx;
						height: 18rpx;
					}
				}

				.parameter {
					display: flex;
					justify-content: space-between;
					height: 28rpx;
					align-items: center;
					margin-top: 40rpx;

					.parameter-left {
						display: flex;

						.parameter-title {
							width: 96rpx;
							padding-right: 39rpx;
							text-align: center;
						}

						.parameter-content {
							width: 500rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}

					image {
						width: 10rpx;
						height: 18rpx;
					}
				}

			}

			//商家详情
			.detail-shopper {
				width: calc(100% - 32rpx);
				min-height: calc(270rpx - 16rpx);
				margin: 0 16rpx 16rpx 16rpx;
				background-color: #FFFFFF;
				border-radius: 20rpx;

				/deep/ uni-view {
					font-size: 24rpx;
					line-height: 1.2;
				}

				.shopper-top {
					display: flex;
					height: 96rpx;
					padding: 40rpx 24rpx 0 24rpx;

					image {
						width: 96rpx;
						height: 96rpx;
						border-radius: 12rpx;
					}

					.shopper-top-content {
						display: flex;
						align-items: center;
						font-size: 36rpx;
						font-weight: bold;
						padding-left: 24rpx;
					}

					.shopper-top-rate {
						display: flex;
						flex-direction: column;
						justify-content: center;
						height: 100%;
						margin-left: 30rpx;
					}
				}

				.shopper-bottom {
					display: flex;
					justify-content: center;
					height: 52rpx;
					margin-top: 42rpx;

					.shopper-button {
						font-size: 28rpx;
						padding: 10rpx 20rpx;
						border: 2rpx solid #FF5000;
						border-radius: 28rpx;
						color: #FF5000;
					}

					.shopper-button:nth-child(2) {
						margin-left: 20rpx;
					}
				}
			}

			// 商品详情图片
			.infoImg-container {
				background-color: #FFFFFF;
				margin-bottom: 308rpx;

				.infoImg {
					width: 100%;
					height: 100%;
				}
			}
		}

		// 商品详情底部模块
		.detail-footer {
			position: fixed;
			display: flex;
			justify-content: space-around;
			width: 100%;
			height: 94rpx;
			background-color: #FFFFFF;
			bottom: 0;
			padding-top: 14rpx;

			.footer-left {
				display: flex;
				width: 288rpx;
				justify-content: space-around;

				.footer-content {
					display: flex;
					flex-direction: column;
					width: 48rpx;
					height: 94rpx;
					justify-content: center;
					align-items: center;
					margin: 0 24rpx;

					.iconfont {
						width: 38rpx;
						height: 38rpx;
						text-align: center;
						line-height: 38rpx;
						margin-top: 10rpx;
					}

					text {
						font-size: 24rpx;
					}
				}
			}

			.footer-right {
				display: flex;
				width: 448rpx;
				background-color: #FFFFFF;
				margin-right: 14rpx;
				color: #FFFFFF;
				align-items: center;

				.bar-left,
				.bar-right {
					flex: 1;
					height: 80rpx;
					text-align: center;
					line-height: 80rpx;

				}

				.bar-left {
					background: linear-gradient(to right, #ffcb00, #ff9402);
					border-radius: 80rpx 0 0 80rpx;
				}

				.bar-right {
					background: linear-gradient(to right, #ff7700, #ff4900);
					border-radius: 0 80rpx 80rpx 0;
				}
			}
		}
	}

	.purchase-container {
		width: calc(100% - 40rpx);
		min-height: 826rpx;
		padding: 20rpx;
		background-color: #FFFFFF;
		border-radius: 30rpx 30rpx 0 0;

		// font-size: 24rpx !important;
		/deep/ uni-view {
			font-size: 24rpx;
			line-height: 1;
		}

		.purchase-top {
			position: relative;
			display: flex;
			height: 220rpx;
			padding-bottom: 32rpx;
			border-bottom: 2rpx solid #F2F2F2;

			.top-right {
				margin-left: 20rpx;

				.price-box {
					display: flex;
					flex-direction: column;
					height: 84rpx;
					margin-top: 140rpx;

					.price {
						font-size: 36rpx;
						color: #FF5000;
					}
				}
			}

			image {
				width: 220rpx;
				height: 220rpx;
			}

			.icon-roundclose {
				position: absolute;
				top: 0;
				right: 0;
				color: #999999;
				font-size: 48rpx;
			}
		}

		.purchase-rule {
			display: flex;
			flex-direction: column;
			height: 156rpx;

			.rule-title {
				font-size: 30rpx;
				padding: 25rpx 0;
			}

			.rule-selection {
				display: flex;

				.rule-button {
					width: 82rpx;
					height: 56rpx;
					text-align: center;
					line-height: 56rpx;
					border-radius: 5.33333vw;
					background-color: #F8F8F8;
					margin: 0 28rpx 20rpx 0
				}
			}
		}

		.purchase-color {
			display: flex;
			flex-direction: column;
			margin-top: 40rpx;
			border-top: 2rpx solid #F2F2F2;
			height: 156rpx;

			.color-title {
				font-size: 30rpx;
				padding: 25rpx 0;
			}

			.color-selection {
				display: flex;

				.color-button {
					// width: 82rpx;
					height: 56rpx;
					padding: 0 29rpx;
					text-align: center;
					line-height: 56rpx;
					border-radius: 5.33333vw;
					background-color: #F8F8F8;
					margin: 0 28rpx 20rpx 0
				}
			}
		}

		.purchase-count {
			display: flex;
			align-items: center;
			height: 80rpx;
			margin-top: 40rpx;
			border-top: 2rpx solid #F2F2F2;

			.count-title {
				width: 500rpx;
				font-size: 30rpx;
				padding: 25rpx 0;
			}

			.count-button {
				display: flex;

				.iconfont,
				.count-input {
					width: 64rpx;
					height: 64rpx;
					text-align: center;
					line-height: 64rpx;
				}

				.icon-move {
					background-color: #FBFBFB;
				}

				.icon-add,
				.count-input {
					background-color: #F6F6F6;
				}

				.count-input {
					margin: 0 4rpx;

					.itp {
						width: 64rpx;
						height: 64rpx;
						text-align: center;
						line-height: 64rpx;
					}
				}

			}
		}

		.purchase-footer {
			margin-top: 40rpx;
			height: 80rpx;

			.footer-box {
				display: flex;
				background-color: #FFFFFF;
				margin-right: 14rpx;
				color: #FFFFFF;
				align-items: center;
				font-size: 30rpx;

				.bar-left,
				.bar-right {
					flex: 1;
					height: 80rpx;
					text-align: center;
					line-height: 80rpx;

				}

				.bar-left {
					background: linear-gradient(to right, #ffcb00, #ff9402);
					border-radius: 80rpx 0 0 80rpx;
				}

				.bar-right {
					background: linear-gradient(to right, #ff7700, #ff4900);
					border-radius: 0 80rpx 80rpx 0;
				}

			}

		}

	}

	.parameter-container {
		width: 100%;

		min-height: 900rpx;

		.para-title {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 120rpx;
			border-radius: 30rpx 30rpx 0 0;
		}

		.para-scroll {
			width: calc(100% - 40rpx);
			padding: 0 20rpx;

			.para-scroll-box {
				display: flex;
				height: 30rpx;
				padding: 20rpx 0;

				.para-left {
					width: 136rpx;
				}

				.para-right {
					width: 544rpx;
					padding-left: 30rpx
				}
			}
		}

		.para-footer {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80rpx;
			padding: 20rpx 0;

			.confirm-button {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 676rpx;
				height: 76rpx;
				padding: 2rpx 6rpx;
				font-size: 30rpx;
				border-radius: 60rpx;
				background-image: linear-gradient(90deg, #ff9000 0, #ff5000);
				color: #FFFFFF
			}
		}
	}

// 轮播图右下角黑色圆角框索引样式
	.indicator {
		@include flex(row);
		justify-content: center;

		&__dot {
			height: 6px;
			width: 6px;
			border-radius: 100px;
			background-color: rgba(255, 255, 255, 0.35);
			margin: 0 5px;
			transition: background-color 0.3s;

			&--active {
				background-color: #ffffff;
			}
		}
	}

	.indicator-num {
		padding: 2px 0;
		background-color: rgba(0, 0, 0, 0.35);
		border-radius: 100px;
		width: 35px;
		@include flex;
		justify-content: center;

		&__text {
			color: #FFFFFF;
			font-size: 12px;
		}
	}
</style>
<style>
	page {
		background-color: #F4F4F4;
	}
</style>
