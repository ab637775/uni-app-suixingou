<template>
	<view class="icons">
		<view class="icons-item" v-for="(item,index) in datalist" :key="index">
			<image class="icons-img" :src="item.urlImg" mode=""></image>
			<view class="icons-name f-color">
				{{item.name}}
			</view>
		</view>


	</view>
</template>

<script>
	export default {
		props: {
			datalist: {
				type: Array,
				default: []
			}
		}
	}
</script>

<style lang="less" scoped>
	.icons {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;

		.icons-item {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			width: 25%;
			padding-top: 20rpx;

			.icons-img {
				width: 100rpx;
				height: 100rpx;
			}
		}
	}
</style>
