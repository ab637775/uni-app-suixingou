<template>
	<view class="personal">
		<view class="personal-top">
			<view class="top-left">
				<image :src="isLogin === true ? userInfo.avatarImg : '../../static/img/user/defaultUser.png'" mode="" class="userImg" @tap="goToLogin"></image>
				 <view class="textBox">
				 	<text class="nickName">{{isLogin === true ? userInfo.nickName : "未登录"}}</text>
				 	<text class="userName">{{isLogin === true ? '用户名:'+userInfo.userName : ""}}</text>	
				 </view>
			</view>
			<view class="top-right" >	
				<view class="iconfont icon-settings" @tap="goToLogout"></view>
			</view>
		</view>
		<view class="personal-own">
			<view class="own-body">
				<view class="iconfont icon-favor"></view>
				<text>收藏</text>
			</view>	
			<view class="own-body">
				<view class="iconfont icon-squarecheck"></view>
				<text>订阅店铺</text>
			</view>	
			<view class="own-body">
				<view class="iconfont icon-time"></view>
				<text>足迹</text>
			</view>
		</view>
		<myCard height="206rpx" class="personal-order">
			<view class="order-title">
				<view class="title-left">
					我的订单
				</view>
				<view class="title-right">
					全部
				</view>
			</view>
			<view class="order-content">
				<view class="order-content-item">
					<view class="iconfont icon-vipcard"></view>
					<text>待付款</text>
				</view>
				<view class="order-content-item">
					<view class="iconfont icon-send"></view>
					<text>待发货</text>
				</view>
				<view class="order-content-item">
					<view class="iconfont icon-deliver"></view>
					<text>待收货</text>
				</view>
				<view class="order-content-item">
					<view class="iconfont icon-comment"></view>
					<text>待评价</text>
				</view>
				<view class="order-content-item">
					<view class="iconfont icon-refund"></view>
					<text>退款/售后</text>
				</view>
			</view>
		</myCard>
<!-- 		<view>{{userInfo}}</view>
		<view>{{isLogin}}</view> -->
		<myTabbar firstName="mine"></myTabbar>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import { base64ToPath } from 'image-tools'
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			goToLogin(){
				uni.navigateTo({
			    	url:'/pages/login/login'
				})
			},
			goToLogout(){
				uni.navigateTo({
					url:'/pages/logout/logout'
				})
			}
		},
		computed:{
			...mapState(['userInfo','isLogin'])
		},
		onShow() {
			// console.log(this.userInfo.avatarImg);
		// 转换后端发来的头像图片base64格式为路径格式 
		// (貌似不需要进一步转换，uimage标签已经自动转换了)
		// base64ToPath(this.userInfo.avatarImg).then(path => {
		//     console.log('path',path)
		//   })
		//   .catch(error => {
		//     console.error(error)
		//   })	
		}
	}
</script>
<style lang="less" scoped>
	.personal{
		color: #333333;
		.personal-top{
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 100rpx;
			margin-top: 64rpx;
			.top-left{
				display: flex;
				align-items: center;
				margin-left: 30rpx;
				.userImg{
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					margin-right: 24rpx;
				}
				.textBox{
					display: flex;
					flex-direction: column;
					.nickName{
						font-weight: bold;
					}
					.userName{
						font-size: 20rpx;
						color: #999999;
					}
				}
				
			}
			.top-right{
				display: flex;
				align-items: center;
				height: 100rpx;
				margin-right: 40rpx;
				.icon-settings{
					font-size: 40rpx;
					// padding-bottom: 40rpx;
				}
			}
		}
		.personal-own{
			display: flex;
			justify-content: space-around;
			width: 100%;
			height: 164rpx;
			margin-top: 40rpx;
			margin-bottom: 12rpx;
			.own-body{
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
				width: 130rpx;
				height: 164rpx;
				.iconfont{
					font-size: 50rpx;
				}
				text{
					margin-bottom: 26rpx;
				}
			}
		}
		.personal-order{
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.order-title{
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 30rpx;
				font-size: 30rpx;
				.title-left{
					color: #111111;
					font-weight: bold;
				}
				.title-right{
					color: #999999;
					font-size: 24rpx;
				}
			}
			.order-content{
				display: flex;
				align-items: center;
				height: 144rpx;
				
				.order-content-item{
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: center;
					width: 20%;
					height: 144rpx;
					.iconfont{
						font-size: 50rpx;
					}
					text{
						margin-bottom: 26rpx;
					}
				}
			}
		}
	}
</style>

<style>
	page {
		background-color: #F4F4F4;
	}
</style>
