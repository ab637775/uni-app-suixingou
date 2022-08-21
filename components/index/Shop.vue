<template>
	<view class="shop">
		<view class="shop-item">
			<view class="shop-big">
				<image class="shop-bigImg" src="../../static/img/shop.jpg" mode=""></image>
			</view>

			<scroll-view class="shop-scroll" scroll-x="true">
				<view class="scroll-item">
					<Commodity :dataList="shopList" itemWidth='200' itemImgHeight='190' itemWrap="no-wrap"
						nameSize='20'>
					</Commodity>

				</view>

			</scroll-view>
		</view>

	</view>
</template>

<script>
	import Commodity from "@/components/common/Commodity.vue"
	export default {
		props: {
			datalist: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				shopList: this.datalist
			}
		},
		components: {
			Commodity
		},
	}
</script>

<style lang="less" scoped>
	.shop {
		.shop-big {
			width: 100%;
			height: 350rpx;

			.shop-bigImg {
				width: 100%;
				height: 350rpx;
			}
		}


		.shop-scroll {
			width: 100%;
			height: 410rpx;
			// white-space: nowrap;
		}

		.scroll-item {
			display: inline-block;
		}
	}
</style>
