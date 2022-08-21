<template>
	<view class="login-register">
		<view class="loginReg-form">
			<u--form
						labelPosition="left"
						:model="formData"
						:rules="rules"
						ref="uForm"
						class="uform"
				>
					<u-form-item
							label="用户名"
							prop="userInfo.userName"
							labelWidth="150"
							borderBottom
							ref="item1"
					>
						<u--input
								v-model="formData.userInfo.userName"
								placeholder="请输入用户名"
								border="none"
								style="margin-left: 20rpx;"
						></u--input>
					</u-form-item>
					<u-form-item
							label="密码"
							prop="userInfo.password"
							labelWidth="150"
							borderBottom
							ref="item1"
					>
						<u--input
								v-model="formData.userInfo.password"
								placeholder="请输入密码"
								type="password"
								border="none"
								style="margin-left: 20rpx;"
						></u--input>
					</u-form-item>	
					<u-form-item
							label="确认密码"
							prop="userInfo.checkPwd"
							labelWidth="150"
							borderBottom
							ref="item1"
					>
						<u--input
								v-model="formData.userInfo.checkPwd"
								placeholder="请再次输入密码"
								type="password"
								border="none"
								style="margin-left: 20rpx;"
						></u--input>
					</u-form-item>
					<u-form-item
							label="昵称"
							prop="userInfo.nickName"
							labelWidth="150"
							borderBottom
							ref="item1"
					>
						<u--input
								v-model="formData.userInfo.nickName"
								placeholder="请输入昵称"
								border="none"
								style="margin-left: 20rpx;"
						></u--input>
					</u-form-item>
				</u--form>
		</view>
		<u-button type="primary" @tap="submit" :disabled="isDisabled" shape="circle" customStyle="width:700rpx" class="submit">提交</u-button>
		<view class="tipBox">注意：点击跳过可以快速创建用户，具体用户信息可以在用户中心设置里修改</view>
	</view>
</template>

<script>
	import {updateUserInfo,userLogin,queryUserName} from '@/request/api/index.js'
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				formData:{
					userInfo:{
						userName:'',
						password:'',
						checkPwd:'',
						nikName:''
					}
				},
				rules: {
							'userInfo.userName': [{
								type: 'string',
								required: true,
								message: '账号名不能为空',
								trigger: ['blur', 'change']
							},							
							{
								pattern: /^[A-Za-z0-9]{5,8}$/,
								message: '用户名长度要在5~8之间，且只能使用字母、数字',
								trigger: ['blur', 'change']
							},
							{
								asyncValidator: (rule, value, callback) => {
									queryUserName({userName: value}).then(res => {
													// 如果验证不通过，需要在callback()抛出new Error('错误提示信息')
													if(res.statusCode !== 200) {
														callback(new Error('用户名已存在'));
													} else {
														// 如果校验通过，也要执行callback()回调
														callback();
													}
												})
									},
								trigger: ['blur']
							}
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
						'userInfo.checkPwd': [{
								type: 'string',
								required: true,
								message: '确认密码不能为空',
								trigger: ['blur', 'change']
							}
						],
						'userInfo.nickName': [{
								type: 'string',
								required: true,
								message: '昵称不能为空',
								trigger: ['blur', 'change']
							},
							{
								min: 2,
								max: 10,
								message: '昵称长度要在2~10之间',
								trigger: ['blur', 'change']
							}
						],						
					},
					isDisabled:false
			};
		},
		computed:{
			...mapState(['phone'])
		},
		methods:{
			...mapMutations(['updateUserVuex']),
			submit(){			
					this.$refs.uForm.validate().then(res => {
							if(this.formData.userInfo.password !== this.formData.userInfo.checkPwd){
								uni.showToast({
									icon:'error',
									title:"密码和确认密码不一致，请重新输入"
								})
							}else{
								// console.log(this.formData.userInfo.userName,this.formData.userInfo.password);
								let sendData = {
									userName:this.formData.userInfo.userName,
									password:this.formData.userInfo.password,
									nickName:this.formData.userInfo.nickName,
									phone:this.phone
								}
								let nowUserData = {
									userName:this.formData.userInfo.userName,
									password:this.formData.userInfo.password,
									nickName:this.formData.userInfo.nickName,
									phone:this.phone,
									token:null,
									avatarImg:"../../static/img/user/defaultUser.png"
								}	
								let loginData = {
									userName:this.formData.userInfo.userName,
									password:this.formData.userInfo.password,
								}
								console.log(sendData);
								uni.showModal({
									title: '提示',
									content: '确认提交以上的用户信息？',								
									success:  (res)=> {
										if (res.confirm) {
											// console.log('后面的',sendData);						
											updateUserInfo(sendData).then((result)=>{
												console.log(result);
												// 判断用户名是否已存在
												if(result.statusCode != 200){
												 	return uni.showToast({		
														icon:'none',
														title: result.msg 						
													})
												}else{
													// 提交成功后，禁用提交按钮
													 this.isDisabled = true
													 // 提交成功后，自动登录
													  uni.showToast({
														icon:'loading',
													  	title:'注册成功！自动为您登录',
														success: () => {
															setTimeout(()=>{											 
																	userLogin(loginData).then((res)=>{
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
															},2000)																
														}
													  })
													console.log('loginData',loginData);			
			
												}
											})		
																						
										} else if (res.cancel) {
											console.log('用户点击取消');
										}									
								  }
								});
								// 在localStorage和vuex中存储注册待登录用户的数据	
								this.updateUserVuex(nowUserData)																				
							}
						}).catch(errors => {
							uni.$u.toast('填写信息格式不正确')
					})
			}
		},
		onNavigationBarButtonTap : function (e) {
			// console.log(e);
		
			let loginData = {
				password:"aaa123456",
				userName:this.phone
			}
				console.log('loginData',loginData);
			userLogin(loginData).then((res)=>{
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
		}
	}
</script>

<style lang="less">
	
.login-register{
	width: 100%;
	color: #333333;
	font-family: Arial, Helvetica, sans-serif;
	margin-top: 40rpx;
	.loginReg-form{
		width: 100%;
		height: 460rpx;
			.uform{
				width: calc(100% - 40rpx);
				margin: 0 20rpx;			
			 }
	}
	.submit{
		margin-top: 160rpx;
	}
	.tipBox{
		width: calc(100% - 40rpx);
		margin: 40rpx 20rpx 10rpx 20rpx;
		color:#999999;
		font-size: 24rpx;
	}
}
</style>
