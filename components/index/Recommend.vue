<template>
	<view class="recommend bg-color">
		<view class="recommend-item" v-for="(item,index) in datalist" :key="index">
			<image class="item-big" :src="item.imgBigUrl"></image>

			<view class="item-small">
				<block v-for="(value,i) in item.imgUrlArr" :key="i">
					<image class="item-big" :src="value"></image>
				</block>
				<!-- 				<image class="item-big" src="../../static/img/Children2.jpg"></image>
				<image class="item-big" src="../../static/img/Children3.jpg"></image> -->
			</view>
		</view>

		<!-- 		<view class="recommend-item">
			<image class="item-big" src="../../static/img/Furnishing.jpg"></image>
			<view class="item-small">
				<image class="item-big" src="../../static/img/Furnishing1.jpg"></image>
				<image class="item-big" src="../../static/img/Furnishing2.jpg"></image>
				<image class="item-big" src="../../static/img/Furnishing3.jpg"></image>
			</view>
		</view> -->
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

<style scoped>
	.recommend {
		padding: 20rpx;
	}

	.recommend-item {
		display: flex;
		flex-direction: column;
		/* justify-content: center; */
		border-radius: 20rpx;
		border: 2rpx solid #cccccc;
		margin: 20rpx 0;
		overflow: hidden;
	}

	.recommend-item .item-big {
		width: 100%;
		height: 300rpx;
	}

	.recommend-item .item-small {
		width: 100%;
		height: 240rpx;
		background-color: #ffffff;
	}

	.recommend-item .item-small .item-big {
		width: 33.334%;
		height: 240rpx;
	}
</style>
