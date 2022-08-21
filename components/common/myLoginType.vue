<template>
	<view class="myLoginType">
		<view class="type-item" v-for="(val,idx) in data" :key="idx">
			<image :src="val.imgSrc" mode=""></image>
			<text>{{val.text}}</text>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			height:{
				type:String,
				default:'200rpx'
			},
			data:{
				type: Array,
				default: () => []
			}
		}
	}
</script>

<style lang="less" scoped>
 .myLoginType{
		display: flex;
		justify-content: space-around;
		width: calc(100%-50rpx);
		height: 200rpx;
		padding: 0 25rpx;
	.type-item{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 160rpx;
		image{
			width: 100rpx;
			height: 100rpx;
			margin-bottom: 10rpx;
		}
	}
}
</style>