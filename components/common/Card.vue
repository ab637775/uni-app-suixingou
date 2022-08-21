<template>
	<view>
		<view class="card" :style="'color:'+color+';'+'font-weight:'+bold+';'">
			<view>-</view>
			<slot>
				<view class="card-name" :style="'font-size:'+fontSize+'px;'">{{cardTitle}}</view>
			</slot>
			<view>-</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			cardTitle: {
				type: String,
				default: ""
			},
			color: {
				type: String,
				default: "black"
			},
			bold: {
				type: String,
				default: ""
			},
			fontSize: {
				type: String,
				default: "16"
			}
		},
		data() {
			return {
				myTitle: this.cardTitle
			}
		}
	}
</script>

<style lang="less" scoped>
	.card {
		display: flex;
		justify-content: center;
		align-items: center;
		// font-weight: bold;
		padding: 20rpx 0;

		.card-name {
			padding: 0 20rpx;
			// font-size: 32rpx;
		}
	}
</style>
