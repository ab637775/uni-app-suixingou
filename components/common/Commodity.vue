<template>
	<view class="commodity" :style="'flex-wrap:'+itemWrap+';'">
		<view class="commodity-item" :style="'width:'+itemWidth+'rpx;'" v-for="item in dataList" :key="item.id"
			@tap="goToDetail(item.id,item.name)">
			<image :style="'height:'+itemImgHeight+'rpx;'" class="commodity-img" :src="item.imgSrc">
			</image>
			<view class="commodity-content">
				<text class="commodity-name" :style="'font-size:'+nameSize+'rpx;'">
					{{item.name}}
				</text>
				<view>
					<text class="now_price">￥{{item.now_price}}</text>
					<text class="ori_price">￥{{item.ori_price}}</text>
				</view>
				<text class="discount">{{item.discount}}折</text>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	export default {
		props: {
			dataList: {
				type: Array,
				default: []
			},
			itemWidth: {
				type: String,
				default: '358'
			},
			itemImgHeight: {
				type: String,
				default: '534'
			},
			itemWrap: {
				typr: String,
				default: "wrap"
			},
			nameSize: {
				type: String,
				default: '26'
			}
		},
		data() {
			return {

				// itemList: [],
				itemList: this.dataList
			}
		},
		// computed: {
		// 	discount() {
		// 		let discount = 0
		// 		this.dataList.forEach(val => {
		// 			discount = parseFloat(val.now_price / val.ori_price * 10).toFixed(1)
		// 		})
		// 		return discount
		// 	}
		// },
		methods: {
			goToDetail(id, name) {
				uni.navigateTo({
					url: '/pages/detail/detail?id=' + id + '&name=' + name + '',
				})
				console.log(this.dataList);
			}
		},
		created() {
			this.dataList.forEach(val => {
				val.discount = parseFloat(val.now_price / val.ori_price * 10).toFixed(1)
			})
		},
		mounted() {
			console.log('this.dataList', this.dataList);
			console.log('commodity里的itemList', this.itemList);
			// this.dataList.forEach(val => {
			// 	val.discount = parseFloat(val.now_price / val.ori_price * 10).toFixed(1)
			// })
			// if (this.itemList.length === 0) {
			// 	// #ifdef H5
			// 	//手动设置延时器，防止页面丢失数据
			// 	setTimeout(() => {
			// 		this.itemList = JSON.parse(localStorage.getItem('searchResult'))
			// 		this.itemList.forEach(val => {
			// 			val.discount = parseFloat(val.now_price / val.ori_price * 10).toFixed(1)
			// 		})
			// 		console.log('重新接收的itemList', this.itemList);
			// 	}, 30)
			// 	// #endif
			// 	// #ifndef H5
			// 	setTimeout(() => {
			// 		uni.getStorage({
			// 			key: 'searchResult',
			// 			success: (res) => {
			// 				this.itemList = JSON.parse(res.data)
			// 				this.itemList.forEach(val => {
			// 					val.discount = parseFloat(val.now_price / val.ori_price * 10)
			// 						.toFixed(1)
			// 				})
			// 				console.log('res.data', this.itemList);
			// 			}
			// 		})
			// 	}, 30)
			// 	// #endif
			// }

		}
	}
</script>

<style lang="less" scoped>
	.commodity {
		display: flex;
		justify-content: space-between;
		padding: 0 10rpx;
		flex-wrap: wrap;

		.commodity-item {
			// width: 375rpx;
			padding-bottom: 20rpx;


			.commodity-img {
				width: 100%;
				// height: 375rpx;
				border-radius: 20rpx;
			}

			.commodity-content {
				text-align: center;

				.commodity-name {
					display: -webkit-box;
					text-overflow: ellipsis;
					overflow: hidden;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					color: #333333;
					word-break: break-all;
					padding: 6rpx 20rpx;
					font-weight: bold;
				}

				.now_price {
					font-weight: bold;
					color: #FF5000;
				}

				.ori_price {
					text-decoration: line-through;
					font-size: 24rpx;
					margin-left: 6rpx;
					color: #999999;
				}

				.discount {
					border-radius: 4rpx;
					border: 1px solid #ff3333;
					padding: 2rpx 10rpx;
					font-size: 20rpx;
					color: #ff3333;
				}
			}
		}
	}
</style>
