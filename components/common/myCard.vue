<template>
	<view 
		class="myCard" 
		:style="'height:'+height+''"
	>
		<slot></slot>
	</view>
</template>

<script>
	export default{
		props:{
			height:{
				type:String,
				default:"100rpx"
			}
		}
	}
</script>

<style lang="less" scoped>
	.myCard{
		width: calc(100% - 32rpx- 48rpx);
		// min-height: 100rpx;
		margin: 16rpx;
		padding: 24rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
	}
</style>