<template>
	<!-- 顶部导航栏部分 -->
	<view class="shopCart">
		<uni-nav-bar
		 leftText="购物车" 	
		 :rightText="hasItems === true ? ismanage === true ? '管理':'完成' : ''"
		 fixed="true"
		 height="52px"
		 statusBar="true" 
		 backgroundColor="#42b7fb" 
		 color="#FFFFFF"
		 leftFontSize="20"
		 rightFontSize="15"
		 :title="hasItems === true ? '共'+totalLength+'件宝贝' : ''"
		 @clickRight="ismanage = !ismanage"
		 class="navBar"
		 >				
		 </uni-nav-bar>		 
	<!-- 购物车商品待结算列表部分 -->
	<uni-card class="uniCard" v-for="(mainVal,mainIdx) in CartList" :key="mainIdx" v-if="hasItems === true">	
		<view class="shopCard-title">
			<view class="title-radio">
				<label class="radio">
					<radio color="#FF5000" ref="shopRadio" :checked="mainVal.isShopChecked" @tap="changeShopCheck(mainIdx)"></radio>		
				</label>
			</view>	
			<image :src="'http://img.alicdn.com/'+mainVal.shopperImg+''"></image>
			<text>{{mainVal.shopperName}}</text>
		</view>
		<view class="shopCard-content" v-for="(val,idx) in mainVal.itemList" :key="idx">
			<view class="content-left">
				<label class="radio">
					<radio color="#FF5000" ref="itemRadio" :checked="val.isChecked" @tap="changeCheck(mainIdx,idx)"></radio>		
				</label>
			</view>
		<view class="content-mid">
			<image :src="'http://img.alicdn.com/imgextra/'+val.cover+''" mode=""></image>
		</view>
		<view class="content-right">
			<view class="item-detail">
				<view class="item-name">
					{{val.name}}
				</view>
				<view class="item-info">
					<text>{{val.color}};{{val.rule}}</text>
				</view>
			</view>
			<view class="item-bottom">
				<text>￥{{val.price}}</text>
				<view class="count-button">
					<view class="iconfont icon-move" @tap="subMount(mainIdx,idx)"></view>
					<view class="count-input">
						<input type="text" class="itp" v-model="val.count" >
					</view>
					<view class="iconfont icon-add" @tap="addMount(mainIdx,idx)"></view>
				</view>
			</view>
		</view>
		</view>
	</uni-card>
	<!-- 底部结算栏部分 -->
	<view class="shopCard-footer" v-if="hasItems === true">
		<view class="footer-left">			
			<label class="radio">
				<radio color="#FF5000" ref="allRadio" :checked="allSelect" @tap="changeAllSelect"></radio>		
			</label>
			<text>全选</text>
		</view>
		<view class="footer-right" v-if="ismanage === true">
			<view class="cal-box">
				<text>合计：</text>
				<text>￥{{sum}}</text>
			</view>
			<view class="button-container">
				<view class="deal-button">
					结算({{mount}})
				</view>
			</view>		
		</view>
		<view class="footer-right-alter" v-else-if="ismanage === false">		
			<view class="button-container-alter">
				<text class="set-btn">移入收藏夹</text>
				<text class="set-btn" @tap="deleteItems">删除</text>	
			</view>
					
		</view>
		
	</view>
	<!-- 购物车为空时的界面  -->
	<view class="noItem" v-if="hasItems === false">
		<text>购物车竟然空空如也~</text>
    </view>
		<myTabbar firstName="cart"></myTabbar>
	</view>
</template>

<script>
	import {mapState,mapMutations} from "vuex"
	export default {
		data() {
			return {
				// 管理按键控制符
				ismanage:true,
				// 判断是否有商品
				hasItems:false,
				radioCheck:false,
				// 从Vuex接收的购物车数据
				CartList: this.shopCartList,
				// 全选判断符
				allSelect:false,
				// 总价
				sum:0,
				// 结算物品数量
				mount:0
			}
		},
		computed:{
			...mapState(['shopCartList','isLogin']),
			// 购物车里所有商品的数量
			totalLength(){
				let sum = 0
				if(this.CartList !== undefined){
					this.CartList.forEach((val)=>{
						sum += val.itemList.length
					})
				}	
				return sum
			}
		},
		components: {
			
		},
		methods: {
		...mapMutations(['removeShopCartList']),
		// 判断是否全选
		setAllSelected(){
				// 全选判断符
	      		let flag = true
	      		this.CartList.forEach((val)=>{
				// 利用与运算符来计算是否所有商家都勾选了，只要商家勾选了，下面的所有商品也就一并勾选了
	      			flag = val.isShopChecked & flag
	      		})      		
	      		if(flag){
	      			this.allSelect = true
	      		}else{
					this.allSelect = false
				}	
		 },
		// 判断同一家店所有商品的选择状态
		changeShopCheck(index){
			this.CartList[index].isShopChecked = !this.CartList[index].isShopChecked
				
			if(this.CartList[index].isShopChecked === true){
				this.CartList[index].itemList.forEach((val)=>{
					val.isChecked = true
				})
			}else{
				this.CartList[index].itemList.forEach((val)=>{
					val.isChecked = false
				})
			}
				// console.log('itemRadio',this.$refs.itemRadio);
		
				// 这种方法会慢一拍，永远取到还未更新的点击数据。。。
				// const isAllselected = this.$refs.itemRadio.every((val)=>{
				// 	val.radioChecked === true				
				// })
				// console.log(isAllselected);
				this.calTotalPrice()
				this.setAllSelected()
		},
	    // 判断单独商品的选择状态
		changeCheck(mainIndex,index){
			this.CartList[mainIndex].itemList[index].isChecked = !this.CartList[mainIndex].itemList[index].isChecked
			if(this.CartList[mainIndex].itemList.every(val=>{return val.isChecked === true})){
				this.CartList[mainIndex].isShopChecked = true
			}else{
				this.CartList[mainIndex].isShopChecked = false
			}
			this.calTotalPrice()
			this.setAllSelected()
		},
		// 判断结算栏的全选状态
		changeAllSelect(){
			this.allSelect = !this.allSelect		
				// #ifndef H5
				  console.log('shopRadio',this.$refs.shopRadio[0]);	
				// #endif	
			// 手机端全选有问题，问题的关键出在 this.$refs.shopRadio[0]输出的格式不正确 变成了[object object]
			 // console.log('shopRadio',JSON.stringify(this.$refs)); 
			// if(this.allSelect === true){				
			// 	for(let i = 0;i<this.CartList.length;i++){
			// 		if(this.$refs.shopRadio[i].checked === false){
			// 			this.$refs.shopRadio[i]._events.click[0]()						
			// 		}					
			// 	}
			// }else{
			// 	for(let i = 0;i<this.CartList.length;i++){
			// 		if(this.$refs.shopRadio[i].checked === true){
			// 			this.$refs.shopRadio[i]._events.click[0]()
			// 		}				
			// 	}
			// }
			if(this.allSelect === true){	
				this.CartList.forEach((val,idx)=>{
					if(val.isShopChecked === false){
						this.changeShopCheck(idx)
					}
				})			
			}else{
				this.CartList.forEach((val,idx)=>{
					if(val.isShopChecked === true){
						this.changeShopCheck(idx)
					}
				})	
			}
			
			
			this.calTotalPrice()
		},
		// 计算商品合计价格
		calTotalPrice(){
			this.sum = 0
			this.mount = 0
			this.CartList.forEach((val)=>{
				val.itemList.forEach((element)=>{
					if(element.isChecked === true){
						this.sum += element.price * element.count
						this.mount++
					}
				})
			})
		// console.log('sum',this.sum);
		},
		// 购物车商品数量减
		subMount(mainIndex,index) {
			if (this.CartList[mainIndex].itemList[index].count > 1) {
				this.CartList[mainIndex].itemList[index].count--
			}else{
				uni.showToast({
					title: '商品数量不能为空！',
					icon:'none',
					duration: 2000
				})
			}
			this.calTotalPrice()
		},
		// 购物车商品数量加
		addMount(mainIndex,index) {
			if (this.CartList[mainIndex].itemList[index].count < 99) {
				this.CartList[mainIndex].itemList[index].count++
			}
			this.calTotalPrice()
		},
		// 删除购物车里的商品
		 deleteItems(){
			 if(this.allSelect === true){
				 this.CartList =[]
				 this.hasItems=false,
				 this.removeShopCartList()
			 }
			 this.CartList.forEach((val,idx)=>{
				 if(val.isShopChecked === true){
					 this.CartList.splice(idx,1)
				 }else{
					 val.itemList.forEach((element,index)=>{
						if( element.isChecked === true){
							 val.itemList.splice(index,1)
						}
					 })
				 }
			 })
		 }
 },
		onShow(){
			console.log('this.islogin',this.isLogin);
			// 判断是否登录
			// if(this.isLogin === false){
			// 	console.log('检测到未登录');
			// 	uni.showToast({
			// 		title:'您还没有登录，正在为您跳转到登录界面',
			// 		icon:'loading',
			// 		duration:2000,
			// 		success: () => {
			// 			setTimeout(()=>{
			// 				uni.navigateTo({
			// 					url:'/pages/login/login'
			// 				})
			// 			},2100)					
			// 		}
			// 	})
			// }
			
			this.CartList = this.shopCartList
			console.log('this.CartList',this.CartList);
			if(this.CartList.length>0){
				this.hasItems = true		
			}else{
				this.hasItems = false
			}
			// console.log('this.$refs.allRadio',this.$refs.allRadio);
		},
		onReady() {
	
		}
	}
</script>

<style lang="less" scoped>
.shopCart{
	padding-bottom: 230rpx;
	.uniCard{
		.shopCard-title{
			display: flex;
			align-items: center;
			width: 100%;
			height: 100rpx;
			margin-bottom: 30rpx;
			color: #333333;
			.title-radio{
				display: flex;
				justify-content: center;
				align-items: center;
				width: 60rpx;
				margin-right: 20rpx;
				/deep/ .uni-radio-input{
					margin-right: 0;
				}
			}
			image{
				width: 80rpx;
				height: 80rpx;
			}
			text{
				font-size: 36rpx;
				padding-left: 20rpx;
			}
		}
		.shopCard-content{
			display: flex;
			align-items: center;
			height: 300rpx;
			margin-bottom: 40rpx;
			.content-left{
				display: flex;
				justify-content: center;
				align-items: center;
				width: 60rpx;
				height: 200rpx;
				margin-bottom: 100rpx;
			}
			/deep/ .uni-radio-input{
				margin-right: 0;
			}
			.content-mid{
				width: 180rpx;
				height: 100%;
				margin-left: 20rpx;
				image{
					width: 180rpx;
					height: 180rpx;
				}
			}
			.content-right{
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				width: 340rpx;
				height: 100%;
				margin-left: 20rpx;
				.item-detail{
					width: 100%;
					height: 160rpx;
					.item-name{
						display: -webkit-box;
						text-overflow: ellipsis;
						overflow: hidden;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						color: #333333;
						word-break: break-all;	
						line-height: 36rpx;
						font-weight: bold;
					}	
					.item-info{
						display: -webkit-box;
						text-overflow: ellipsis;
						overflow: hidden;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						color: #333333;
						word-break: break-all;	
						line-height: 1;
						background-color: rgba(236, 236, 236, 0.298);;
						color: rgb(153, 153, 153);
						margin-top: 40rpx;
						padding: 0 12rpx;
						font-size: 26rpx;
					}
				}
		
			}
			.item-bottom{
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 80rpx;
				text{
					color: #42b7fb;
				}
				.count-button{
					display: flex;
					height: 44rpx;
					.iconfont{
						width: 44rpx;
						height: 44rpx;
						text-align: center;
						line-height: 44rpx;
						border: 2rpx solid #999999;
					}
					.count-input{
						width: 80rpx;
						height: 44rpx;
						text-align: center;
						border-top: 2rpx solid #999999;
						border-bottom: 2rpx solid #999999;
					}
				}
			}
		}
	}
	.shopCard-footer{
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: fixed;
		bottom: 116rpx;
		width: calc(100% - 48rpx);
		height: 108rpx;
		padding: 0 24rpx;
		font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
		color: #333333;
		background-color: #FFFFFF;
		.footer-left{
			width: 120rpx;
			height: 48rpx;
			font-size: 24rpx;
		}
		.footer-right{
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 420rpx;
			height: 100%;
			.cal-box{
				display: flex;
				align-items: center;
				height: 60rpx;
				// margin-left: 40rpx;
				text{
					line-height: 1;
				}
				text:nth-child(1){
					
					padding-bottom: 10rpx;
					
				}
				text:nth-child(2){
					font-size: 30rpx;
					
					color: #FF5000;
				}
			}
			.button-container{
				display: flex;
				justify-content: center;			
				width: 200rpx;
				// margin-left: 30rpx;
				.deal-button{
					    background-image: linear-gradient(90deg, #FF9000 0%, #FF5000 98%);
					    width: 100rpx;
						font-size: 30rpx;
					    line-height: 30rpx;
					    padding: 16rpx 36rpx;
					    text-align: center;
					    border-radius: 160rpx;
					    color: #FFFFFF;
					    white-space: nowrap;
					   
				}
			}		
		}
		.footer-right-alter{
				display: flex;
				width: 320rpx;
				height: 100%;
				// background-color: red;
				.button-container-alter{
					display: flex;
					align-items: center;
					margin-left: 20rpx;
					.set-btn{
						    padding: 8rpx 18rpx;
						    border: 2rpx solid #FF5000;
						    color: #FF5000;
						    border-radius: 66rpx;
						    font-size: 26rpx;
						    line-height: 30rpx;
					}
					text:nth-child(2){
						    margin-left: 20rpx;
					}
				}
			
		}
	}
     .noItem{
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 500rpx;
		height: 200rpx;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
		color: #333333;
		font-size: 36rpx;
	}
}
</style>
<style>
	page {
		background-color: #F4F4F4;
	}
</style>

