<template>
	<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
		<swiper-item v-for="(item,index) in datalist" :key="index">
			<view class="swiper-item">
				<image class="swiper-img" :src="item" alt=""></image>
			</view>
		</swiper-item>
		<!-- 		<swiper-item>
			<view class="swiper-item">
		    	<image class="swiper-img" src="../../static/img/swiper2.jpg" alt=""></image>
			</view>
		</swiper-item>
		<swiper-item>
			<view class="swiper-item">
		    	<image class="swiper-img" src="../../static/img/swiper3.jpg" alt=""></image>
			</view>
		</swiper-item> -->
	</swiper>
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
	swiper {
		width: 100%;
		height: 400rpx;
	}

	.swiper-img {
		width: 100%;
		height: 400rpx;
	}
</style>
