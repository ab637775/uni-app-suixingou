<template>
	<view class="login">
		<swiper vertical="true" style="height: 100vh;">
		<!-- 页面上半部分 -->
			<swiper-item>
			<view class="login-up-section">
				<view class="close" @tap="goBack">
					<image src="../../static/img/close.png" mode=""></image>
				</view>
				<!-- 登录手机注册部分 -->
				<view class="login-tel">
					<image src="../../static/img/logo.png" mode=""></image>
					<u-button type="primary" shape="circle" text="手机号注册" customStyle="width:700rpx" @tap="goToLoginTel"></u-button>	
				</view>
				<u-divider 
					text="或者用以下方式登录"
					textSize="28"
				></u-divider>
				<!-- 自定义登录类别选择组件 -->
				<myLoginType :data="typeData"></myLoginType>
				<view class="login-tip">
					<text>已有账号？滑动前往下方登录</text>
					<view class="iconfont icon-xiajiantou"></view>
				</view>
			</view>
			</swiper-item>
			<!-- 页面下半部分 -->
			<swiper-item>
				<scroll-view scroll-y="true" >
				<view class="login-down-section">
					<view class="close-box" @tap="goBack">
						<view class="closeImg">
							<image src="../../static/img/close.png" mode=""></image>
						</view>
						
						<view class="login-another-tip">
							<view class="iconfont icon-shangjiantou"></view>
							<text>没有账号？滑动前往上方注册</text>
						</view>
					</view>
					<view class="login-cover">
							<image src="../../static/img/logo.jpg" mode=""></image>
					</view>
					<view class="login-main">
							<u--form
										labelPosition="left"
										:model="formData"
										:rules="rules"
										ref="form1"
										class="uform"
								>
									<u-form-item
											label="账号"
											prop="userInfo.userName"
											labelWidth="100"
											borderBottom
											ref="item1"
									>
										<u-input
												v-model="formData.userInfo.userName"
												placeholder="请输入账号名"
												border="none"
										></u-input>
									</u-form-item>
									
									<u-form-item
											label="密码"
											prop="userInfo.password"
											labelWidth="100"
											borderBottom							
											ref="item1"
											class="pwdformItem"
									>
										<u-input
												v-model="formData.userInfo.password"
												:type="itptype"
												placeholder="请输入密码"
												border="none"
												ref="pwdInput"
										>
											<template slot="suffix">
													<image src="../../static/img/openEye.png" class="pwdEye" mode="" v-if="isopen" @tap="switchEye"></image>
													<image src="../../static/img/closeEye.png" class="pwdEye" mode="" v-else @tap="switchEye"></image>
											</template>
										</u-input>
									</u-form-item>
								</u--form>
								<view class="input-bottom">
									<text>忘记密码</text>
									<text>免密登录</text>
								</view>
								<u-button type="primary" @tap="submit" shape="circle" customStyle="width:700rpx" class="submit">提交</u-button>
					</view>
					
				</view>
				<u-divider
					text="或者用以下方式登录"
					textSize="28"
				></u-divider>
						<myLoginType :data="typeData" class="myLoginType"></myLoginType>
				</scroll-view>		
			</swiper-item>
		</swiper>

	
	</view>
</template>

<script>
	import {userLogin} from '@/request/api/index.js'
	import {mapMutations} from 'vuex'
	export default {
		data() {
			return {
				// 密码是否显示
				isopen:false,
				itptype:"password",
				typeData:[
					{
						text:'QQ登录',
						imgSrc:'../../static/img/QQ.png'
					},		
					{
						text:'微信登录',
						imgSrc:'../../static/img/wechat.png'
					},		
					{
						text:'微博登录',
						imgSrc:'../../static/img/weibo.png'
					}
				],
				formData:{
					userInfo:{
						userName:'',
						password:''
					}
				},
					rules: {
								'userInfo.userName': [{
									type: 'string',
									required: true,
									message: '账号名不能为空',
									trigger: ['blur', 'change']
								},
								// {
								// 	pattern: /^[A-Za-z0-9]{5,8}$/,
								// 	message: '用户名长度要在5~8之间，且只能使用字母、数字',
								// 	trigger: ['blur', 'change']
								// },
							],
								'userInfo.password': [{
									type: 'string',
									required: true,
									message: '密码不能为空',
									trigger: ['blur', 'change']
								},
								{
									pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
									message: '密码长度要在6~18之间，且必须包含字母、数字',
									trigger: ['blur', 'change']
								},
							],
						},
			};
		},

		methods:{
			...mapMutations(['updateUserVuex']),
			goBack(){
				uni.navigateTo({
					url:'/pages/personal/personal'
				})
				},
			switchEye(){
				// console.log('this.isopen',this.isopen);
				// console.log(this.$refs.pwdInput.type);
				if( this.isopen === false ){
					this.itptype = "text"
					this.isopen = true
				}else{
					this.itptype = "password"
					this.isopen = false
				}
			},
			submit() {
				console.log(this.formData.userInfo.userName,this.formData.userInfo.password);
				let send = {
					userName:this.formData.userInfo.userName,
					password:this.formData.userInfo.password
				}
			
			this.$refs.form1.validate().then(res => {
				userLogin(send).then((res)=>{
							console.log(res);
							console.log('res.data',res.data);
					// 登录成功时，存储登录用户的数据
						if(res.statusCode != 404){
								this.updateUserVuex(res.data)
								uni.navigateTo({
								url:'/pages/personal/personal'
							})
						}				
						uni.$u.toast(res.msg)
					})
				}).catch(errors => {
					uni.$u.toast('输入内容不符合规则')
				})
			},
			goToLoginTel(){
				uni.navigateTo({
					url:'/pages/login-tel/login-tel'
				})
			}
		}
	
	}
</script>

<style lang="less" scoped>
.login{
	width: 100%;
	color: #333333;
	font-family: Arial, Helvetica, sans-serif;
	.login-up-section{
		.close{
			width: 100%;
			height: 60rpx;
			margin-top: 60rpx;
			image{
				width: 60rpx;
				height: 60rpx;
				margin-left: 20rpx;
			}
		}
		.login-tel{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 600rpx;
			// margin-top: 100rpx;
			margin: 80rpx 0;
			image{
				width: 680rpx;
				height: 480rpx;
			}
		}
		.login-tip{
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 40rpx;
			.iconfont{
				font-size: 60rpx;
			}
		}
	}
 .login-down-section{
	.close-box{
		display: flex;		
		width: calc(100% - 40rpx);
		height: 160rpx;
		padding: 0 20rpx;
		.closeImg{
		     width: 60rpx;
		     height: 100%;

			 image{
				width: 60rpx;
				height: 60rpx;
							 margin-top: 60rpx;
			 }
		}
		.login-another-tip{
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			.iconfont{
				font-size: 60rpx;
			}
		}
	}
	.login-cover{
		width: 100%;
		display: flex;
		justify-content: center;
		image{
			width: 640rpx;
			height: 360rpx;
		}
	}
	.login-main{
		width: 100%;
		height: 460rpx;
			.uform{
				width: calc(100% - 40rpx);
				margin: 0 20rpx;
			
			 }
			 .input-bottom{
				 display: flex;
				 justify-content: space-between;
			     width: calc(100% - 40rpx);
				 padding: 20rpx 20rpx;					
			 }
			 .pwdformItem{
						padding-right: 20rpx;	 
				 	 .pwdEye{
				 	 	 width: 48rpx;
				 	 	 height: 48rpx;			 				 	 
				 }
			 }		 		
	}

 }


}
</style>
