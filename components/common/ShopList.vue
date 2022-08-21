<template>
	<view class="shop-list">
		<!-- 		<view>
			{{keyword}}
		</view> -->
		<!-- <view>
			{{this.orderBy}}
		</view> -->
		<!-- 	<view>
			{{this.commodityList}}
		</view> -->
		<view class="shop-title f-color">
			<view class="shop-item" v-for="(item,index) in shopList.data" :key="index" @tap="changeTap(index)">
				<view :class="shopList.currentIndex === index ? 'f-active-color':''">
					{{item.name}}
				</view>
				<view class="shop-icon">
					<view class="iconfont icon-shangjiantou up" :class="item.status === 1 ? 'f-active-color':''">
					</view>
					<view class="iconfont icon-xiajiantou down" :class="item.status === 2 ? 'f-active-color':''">
					</view>
				</view>
			</view>
		</view>
		<LineBetween></LineBetween>
		<CommodityList :datalist="commodityList"></CommodityList>
	</view>
</template>

<script>
	import {
		searchData
	} from "@/request/api/index.js"

	import LineBetween from "@/components/common/LineBetween.vue"
	import CommodityList from "./CommodityList.vue"
	export default {
		props: ['keyword'],
		components: {
			LineBetween,
			CommodityList
		},
		data() {
			return {
				shopList: {
					currentIndex: 0,
					data: [{
							name: "价格",
							status: 1,
							key: "now_price"
						},
						{
							name: "折扣",
							status: 0,
							key: "discount"
						},
						{
							name: "品牌",
							status: 0
						}
					]
				},
				commodityList: [],
				KeyWord: this.keyword
			}
		},
		computed: {
			orderBy() {
				let obj = this.shopList.data[this.shopList.currentIndex]
				let val = obj.status === 1 ? "asc" : "desc"
				return {
					[obj.key]: val
				}
			}
		},

		methods: {
			async changeTap(index) {
				setTimeout(() => {
					this.getSearchList();
				}, 50)

				//点击切换排序状态				
				let idx = this.shopList.currentIndex
				//记录的上次点击的item
				let item = this.shopList.data[idx]
				if (index === idx) {
					return item.status = item.status === 1 ? 2 : 1
				}
				//当前点击的item
				let newItem = this.shopList.data[index]
				item.status = 0
				newItem.status = 1
				this.shopList.currentIndex = index

			},
			async getSearchList() {
				const res = await searchData({
					name: this.KeyWord,
					// now_price: 'desc'
					...this.orderBy
				})

				this.commodityList = res
				this.commodityList.forEach(val => {
					val.discount = parseFloat(val.now_price / val.ori_price * 10).toFixed(1)
				})
				console.log("commodityList", this.commodityList)
				// #ifdef H5
				localStorage.setItem('searchResult', JSON.stringify(this.commodityList))
				console.log('set了');
				// #endif

				// #ifndef H5
				uni.setStorage({
					key: 'searchResult',
					data: JSON.stringify(this.commodityList)
				})
				// #endif
			}
		},
		mounted() {
			this.getSearchList();
		}

	}
</script>

<style lang="less" scoped>
	.shop-title {
		display: flex;

	}

	.shop-item {
		display: flex;
		flex: 1;
		justify-content: center;
		align-items: center;
		height: 80rpx;
	}

	.shop-icon {
		position: relative;
		margin-left: 10rpx;
	}

	.iconfont {
		position: absolute;
		width: 16rpx;
		height: 8rpx;
		left: 20rpx;
	}

	.up {
		top: -36rpx;
	}

	.down {
		top: -20rpx
	}
</style>
