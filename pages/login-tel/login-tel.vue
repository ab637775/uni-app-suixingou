<template>
	<view class="loginTel">
		<view class="loginTel-form">
			<u--form
						labelPosition="left"
						:model="telData"
						:rules="rules"
						ref="form1"
						class="uform"
				>
					<u-form-item
							label="手机号"
							prop="phone.number"
							labelWidth="140"
							borderBottom
							ref="item1"
					>
						<u--input
								v-model="telData.phone.number"
								placeholder="请输入手机号"
								border="none"
								style="margin-left: 10rpx;"
						></u--input>
					</u-form-item>
					<u-form-item
							label="验证码"
							prop="phone.code"
							labelWidth="140"
							borderBottom
							ref="item1"
					>
						<u--input
								v-model="telData.phone.code"
								placeholder="请输入验证码"
								border="none"
								style="margin-left: 10rpx;"
						></u--input>
					</u-form-item>
				</u--form>
		</view>
		<view class="btn-box">
			<!-- 发送验证码按钮 -->
			<view class="getCode-btn">
				<u-toast ref="uToast"></u-toast>
				<u-code :seconds="seconds" @end="end" @start="start" ref="uCode" 
				@change="codeChange" :keepRunning = "true"></u-code>
				<u-button type="success" :disabled="isSendSms" @tap="getCode" shape="circle" customStyle="width:250rpx">{{tips}}</u-button>
			</view>
				<!-- 提交按钮 -->
			<view class="submit-btn">
			<u-button type="primary" @tap="submit" shape="circle" customStyle="width:200rpx" class="submit">下一步</u-button>	
			</view>		
		</view>
	

	</view>
</template>

<script>
	import {userRegister,queryUserPhone} from "@/request/api/index.js"
	import {mapMutations} from "vuex"
	export default {
		data() {
			return {
				telData:{
					phone:{
						number:'',
						code:''
					},				
				},				
				rules:{
					'phone.number': [
							{
								required: true, 
								message: '请输入手机号',
								trigger: ['change','blur'],
							},
							{
								// 自定义验证函数，见上说明
								validator: (rule, value, callback) => {
									// 上面有说，返回true表示校验通过，返回false表示不通过
									// uni.$u.test.mobile()就是返回true或者false的
									return uni.$u.test.mobile(value);
								},
								message: '手机号码不正确',
								// 触发器可以同时用blur和change
								trigger: ['change','blur'],
							}
					],
					'phone.code': [
						{
						type: 'string',
						required: true,
						message: '请填写验证码',
						trigger: ['blur', 'change']
						}
					]	
				},
				tips: '',
				seconds: 30,
				newCode: '',
				isSendSms:false
			}
		},
		methods: {
			...mapMutations(['getPhone']),
			submit() {
				this.$refs.form1.validate().then(res => {				
					if(this.telData.phone.code === this.newCode){
						userRegister({phone:this.telData.phone.number}).then((res)=>{
							console.log('手机号注册的结果',res);
							uni.showToast({
								icon:'none',
								title:res.msg
							})
							this.getPhone(this.telData.phone.number)
							if(res.statusCode === 200){
								uni.navigateTo({
									url:'/pages/login-register/login-register'
								})
							}
						})
						// uni.$u.toast('注册成功')
						
					
					}else{
						uni.$u.toast('验证码输入错误')
					}											
				}).catch(errors => {
					uni.$u.toast('请填写相关信息后再提交')
				})
			},
			codeChange(text) {
							this.tips = text;
						},
			getCode() {
				if(!this.telData.phone.number){
					return	uni.showToast({
							icon:'none',
							title:'请输入完整信息'
						})
					
					}
				queryUserPhone({phone:this.telData.phone.number}).then((res)=>{
					if(res.statusCode !== 200){
						return	uni.showToast({
							icon:'none',
							title:res.msg
						})
					
					}else{
						if(this.$refs.uCode.canGetCode) {
							// 调用云函数发送短信验证码
							
							// code	随机生成的验证码，如1234
							// action校验类型为“注册”
							// expMinute短信的有效期，5分钟
							// 注意：不要在uniCloud函数里写注释，转为JSON格式时会出错
							uniCloud.callFunction({
								name: 'sendSms',  
								data: {
									phone: this.telData.phone.number,
									data: {
										name: '随心购',
										code: this.randomSms(),		
										action: '注册',			
										expMinute: '5',			
							        }
								}
							}).then(res => {
								console.log('success', res);
							}).catch(msg => {
								console.error(msg);
							});
							// 	console.log('this.telData.phone.number', this.telData.phone.number);			
							
							// this.randomSms()	//测试验证码											
							uni.showLoading({
								title: '正在获取验证码'
							})
							setTimeout(() => {
								uni.hideLoading();
								// 这里此提示会被this.start()方法中的提示覆盖
								uni.$u.toast('验证码已发送');
								// 通知验证码组件内部开始倒计时
								this.$refs.uCode.start();
							}, 2000);
						} else {
							this.isSendSms = true
							setTimeout(() => {
								this.isSendSms = false
							}, 5000);
							uni.$u.toast('倒计时结束后再发送');
						}
					}
				})
			
			},
			end() {
				// uni.$u.toast('倒计时结束');
			},
			start() {
				// uni.$u.toast('倒计时开始');
			},
			randomSms(){
				let res = '';
				for(let i = 0; i < 4; i++) {
				  res += Math.floor(Math.random()*10);
				}	
				this.newCode = res
				// 调试时再解开
				// console.log('新产生的验证码为',this.newCode);
				return res;
			}
		
		}
		
	}
</script>

<style lang="less" scoped>
	.loginTel{
		width: 100%;
		margin-top: 40rpx;
	.uform{
		width: calc(100% - 40rpx);
		margin: 0 20rpx;
		.formItem{
			margin-right: 20rpx;
		}
	 }
	 .btn-box{
		 display: flex;
		 justify-content: space-between;
		 margin: 40rpx 40rpx  0;
	 }
	}

</style>
<style>
	 
</style>
