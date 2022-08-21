<template>
	<view class="banner">
		<image class="banner-img" :src="imgUrl" mode=""></image>
		<!-- <image class="banner-img" src="../../static/img/banner1.jpg" mode=""></image> -->
	</view>
</template>

<script>
	export default {
		props: {
			datalist: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				imgUrl: this.datalist[0]
			}
		}
	}
</script>

<style lang="less" scoped>
	.banner {
		width: 100%;
		height: 300rpx;

		.banner-img {
			width: 100%;
			height: 100%;
		}
	}
</style>
