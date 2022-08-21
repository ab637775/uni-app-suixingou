<template>
	<view class="myLogout">
		<myCard class="myCard" >
			<view class="avatarImg" >
				<image :src="isLogin === true ? userInfo.avatarImg : '../../static/img/user/defaultUser.png'" mode="" class="userImg"></image>
				<view class="userInfo">
					<text class="nickName">{{isLogin === true ? userInfo.nickName : "未登录"}}</text>		
					<text class="userName" v-if="isLogin === true">用户名：{{userInfo.userName}}</text>
				</view>					
			</view>
			<u-icon name="arrow-right" color="#999999" @tap="goToChangeInfo"></u-icon>
		</myCard>
		<view class="logout-button" v-if="isLogin === true" @tap="logout">
			退出登录
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default{
		data(){
			return{
				
			}
		},
		computed:{
			...mapState(['userInfo','isLogin'])
		},
		methods:{
			...mapMutations(['updataIsLogin','removeToken']),
			logout(){
				this.updataIsLogin(false)	
				this.removeToken()
				//#ifdef H5
				localStorage.removeItem('userInfo')
				localStorage.removeItem('token')
				// #endif		
				
				//#ifndef H5
				uni.removeStorage({
					key:'userInfo'
				})
				uni.removeStorage({
					key:'token'
				})
				// #endif	
				uni.showToast({
					title:"您已成功退出登录"
				})
			},
			goToChangeInfo(){
				uni.navigateTo({
					url:'/pages/changeInfo/changeInfo'
				})
			}
		},
		onReady() {
			
		}
	}
</script>

<style lang="less" scoped>
	.myLogout{
		.myCard{
			display: flex;
			margin-top: 60rpx;
			.avatarImg{
				display: flex;
				flex: 1;
				align-items: center;
				margin-left: 30rpx;
				.userImg{
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					margin-right: 24rpx;
				}
				.userInfo{
					display: flex;
					flex-direction: column;
					.nickName{
						font-weight: bold;
					}
					.userName{
						font-size: 24rpx;
						color:#999999
					}
				}
		
			}
		}
		.logout-button{
			width: 100%;
			height: 90rpx;
			text-align: center;
			line-height: 90rpx;
			background-color: #FFFFFF;
			margin-top: 100rpx;
		}
	}
</style>
<style>
	page {
		background-color: #F4F4F4;
	}
</style>
