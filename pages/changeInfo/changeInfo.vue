<template>
	<view class="changeInfo">
		<view class="avatarImg-box">
			<image :src="avatar" mode="" class="avatarImg"></image>
			<u-button  class="upImg-btn" :plain="true" customStyle="width:300rpx" @tap="uploadAvatar">上传头像</u-button>

<!-- 			<image :src="uploadImg"></image>
			<u-button type="primary" @tap="testAvatar">显示上传图片</u-button> -->
		</view>
 <view class="changeInfo-form">
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
	</view>
</template>

<script>
	import { mapState,mapMutations } from 'vuex'
	import { updateUserInfo,changeAvatar,queryUserName,updateAvatar } from '@/request/api/index.js'
	import { pathToBase64 } from 'image-tools'
	export default {
		data() {
			return {
				// avatarImg:'../../static/img/user/defaultUser.png',
				avatarImg:'',
				avatarBase64:'',					
				formData:{
					userInfo:{
						userName:'',
						password:'',
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
					isDisabled:false,
					
			}
		},
		computed:{
			...mapState(['userInfo','avatar'])
		},
		methods: {
			...mapMutations(['updateUserVuex','updateAvatar']),
			// 上传修改头像
			uploadAvatar(){
			
				uni.chooseImage({
						count: 6, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album'], //从相册选择
						success:  (res)=> {
							console.log(JSON.stringify(res.tempFilePaths));
							console.log('res',JSON.stringify(res));
							console.log(this.userInfo.phone);
						this.avatarImg = res.tempFilePaths[0]
							
						 pathToBase64(res.tempFilePaths[0]).then(base64 => {
							 this.avatarBase64 = base64
							 this.updateAvatar(base64)
							//  let sendData = {
							// 	 phone:this.userInfo.phone,
							// 	 avatarImg:base64
							//  }
							// console.log(sendData);			
									
										
						}).catch((err)=>{
							console.log('err',err);
						})								
					}
				});
			},
			submit() {
						this.$refs.uForm.validate().then(res => {
							let sendData = {
								userName:this.formData.userInfo.userName,
								password:this.formData.userInfo.password,
								nickName:this.formData.userInfo.nickName,
								phone:this.userInfo.phone
							}
							let sendAvatarData = {
								phone:this.userInfo.phone,
								avatarImg:this.avatarBase64
							}
							let newData = {
								userName:this.formData.userInfo.userName,
								password:this.formData.userInfo.password,
								nickName:this.formData.userInfo.nickName,
								phone:this.userInfo.phone,
								avatarImg:this.avatarBase64,
								token:this.userInfo.token
							}
						uni.showModal({
							title: '提示',
							content: '确认提交以上的用户信息？',								
							success:  (res)=> {
								if (res.confirm) {

								// 判断用户名是否已存在
									queryUserName({userName:this.formData.userInfo.userName}).then((res)=>{

										if(res.statusCode != 200){
											// 若用户名存在则提交失败，头像改回原来头像
											this.updateAvatar(this.userInfo.avatarImg)
											 uni.showToast({
												icon:'none',
												title: res.msg 						
											})
											return
										}else{
											// 更新头像
											changeAvatar(sendAvatarData).then((ava_res)=>{
												console.log(ava_res);
											})
										// 更新昵称、用户名和密码
											updateUserInfo(sendData).then((result)=>{
												console.log(result);
											})	
									
										// 提交成功后，禁用提交按钮
										 this.isDisabled = true
										 // 提交成功后，自动登录
										  uni.showToast({
											icon:'loading',
										  	title:'修改用户信息成功',
											success: () => {
												setTimeout(()=>{										  
												    this.updateUserVuex(newData)
												    uni.navigateTo({
												 	url:'/pages/personal/personal'
												  }) 
												 
												},2000)										
											}
										  })		
										}
									})																																						
								} else if (res.cancel) {
									console.log('用户点击取消');
								}									
						  }
						});																				
						}).catch(errors => {
							uni.$u.toast('填写信息格式不正确')
						})
					}
		},
		onLoad(){
			this.updateAvatar(this.userInfo.avatarImg)
			console.log('this.userInfo.avatarImg',this.userInfo.avatarImg);
		}
	}
</script>

<style lang="less" scoped>
.changeInfo{
	width: 100%;
	color: #333333;
	font-family: Arial, Helvetica, sans-serif;
	margin-top: 40rpx;
	.avatarImg-box{
		display: flex;
		flex-direction: column;
		align-items: center;
		.avatarImg{
			width: 300rpx;
			height: 300rpx;
			border-radius: 50%;
		}
		.upImg-btn{
			margin-top: 40rpx;
		}
	}

	.changeInfo-form{
		width: 100%;
		height: 460rpx;
		margin-top: 80rpx;
			.uform{
				width: calc(100% - 40rpx);
				margin: 0 20rpx;			
			 }
	}
}
</style>
