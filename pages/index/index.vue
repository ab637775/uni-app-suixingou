<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="navBox">
			<view class="iconfont icon-sousuo"></view>
			<view class="iconfont icon-iconfontzhizuobiaozhun023110" @tap="search"></view>
		</view>
		<!-- #endif -->

		<view class="index">
			<!-- 导航栏滑块 -->
			<scroll-view scroll-x="true" class="scroll-content" :scroll-into-view="scrollIntoIndex">
				<view :id="'top'+index" class="scroll-item " v-for="(item,index) in topBar" :key="index"
					@tap="changeTopIndex(index)">
					<text :class="topBarIndex === index ? 'f-active-color' : 'f-color'">{{item.name}}</text>
				</view>
			</scroll-view>

			<!-- 页面左右滑动 -->
			<swiper @change="onChangeTab" :current="topBarIndex" :style="'height:'+clientHeight+'px;'">
				<swiper-item v-for="(item,index) in newTopBar" :key="index">
					<!-- {{item.datalist}} -->
					<!-- 推荐部分 -->
					<scroll-view scroll-y="true" :style="'height:'+clientHeight+'px;'" @scrolltolower="loadMore(index)">
						<block v-if="item.datalist.length>0">
							<block v-for="(value,i) in item.datalist" :key="i">
								<IndexSwiper v-if="value.type === 'swiperList'" :datalist="value.data"></IndexSwiper>
								<template v-if="value.type === 'recommendList'">
									<Recommend :datalist="value.data"></Recommend>
									<Card cardTitle="猜你喜欢">
									</Card>
								</template>
								<!-- 运动户外等其他部分 -->
								<Banner v-if="value.type === 'bannerList'" :datalist=" value.data"></Banner>
								<template v-if="value.type === 'iconsList'">
									<Icons :datalist=" value.data">
									</Icons>
									<Card cardTitle="热销爆品"></Card>
								</template>
								<template v-if="value.type === 'hotList'">
									<Hot :datalist="value.data"></Hot>
									<Card cardTitle="推荐店铺"></Card>
								</template>
								<template v-if="value.type === 'shopList'">
									<Shop :datalist="value.data"></Shop>
									<Card cardTitle="为您推荐"></Card>
								</template>

								<CommodityList v-if="value.type === 'commodityList'" :datalist="value.data">
								</CommodityList>
							</block>
						</block>
						<view v-else class="nullData">
							未发现数据
						</view>
						<view class="load-text f-color" v-if="item.datalist.length>0">
							{{item.loadText}}
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>

		</view>
		<myTabbar></myTabbar>
	</view>

</template>

<script>
	import IndexSwiper from "@/components/index/IndexSwiper.vue"
	import Recommend from "@/components/index/Recommend.vue"
	import Card from "@/components/common/Card.vue"
	import CommodityList from "@/components/common/CommodityList.vue"
	import Banner from "@/components/index/Banner.vue"
	import Icons from "@/components/index/Icons.vue"
	import Hot from "@/components/index/Hot.vue"
	import Shop from "@/components/index/Shop.vue"

	import {
		getInitData,
		addNewPages
	} from '@/request/api/index.js'
	export default {
		data() {
			return {
				title: 'Hello',
				topBarIndex: 0,
				scrollIntoIndex: 'top0',
				//代码块的高度
				clientHeight: 0,
				topBar: [],
				newTopBar: []

			}
		},
		components: {
			IndexSwiper,
			Recommend,
			Card,
			CommodityList,
			Banner,
			Icons,
			Hot,
			Shop
		},
		onLoad() {
			getInitData().then((res) => {
				console.log('getInitData收到的res', res);
				this.topBar = res.topBar
				console.log('this.topBar', this.topBar);
				this.newTopBar = this.initTopBar(res)
				console.log('newTopBar', this.newTopBar);
			})
		},
		onReady() {
			uni.getSystemInfo({
				success: (res) => {
					this.clientHeight = res.windowHeight - uni.upx2px(80)
					console.log('clientHeight', this.clientHeight);
				}
			})
		},
		onNavigationBarButtonTap(e) {
			console.log(e);
			if (e.float === "left") {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			}
		},
		methods: {
			//微信小程序的搜索
			search() {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
			//点击顶栏
			changeTopIndex(index) {
				if (this.topBarIndex === index) {
					return
				}
				this.topBarIndex = index
				this.scrollIntoIndex = 'top' + index
				if (this.newTopBar[this.topBarIndex].isFirst === true) {
					this.addData()
				}
				console.log('newTopBar', this.newTopBar);
			},
			//同步切换顶栏
			onChangeTab(e) {
				this.changeTopIndex(e.detail.current)
			},
			//获取接口数据  (未封装时)
			// getData() {
			// 	uni.request({
			// 		url: 'http://192.168.1.3:3000/api/index_list/data',
			// 		success: (res) => {
			// 			console.log('res', res);
			// 			let data = res.data.data
			// 			this.topBar = data.topBar
			// 			console.log('this.topBar', this.topBar);
			// 			this.newTopBar = this.initTopBar(data)
			// 			console.log('newTopBar', this.newTopBar);
			// 		}

			// 	})
			// },
			//初始化顶栏数据
			initTopBar(res) {
				let arr = []
				for (let i = 0; i < this.topBar.length; i++) {
					let obj = {
						datalist: [],
						isFirst: true,
						loadText: "上拉加载更多...",
						page: 1
					}
					if (i == 0) {
						obj.datalist = res.datalist
					}
					arr.push(obj)
				}
				return arr
			},
			addData(callback) {
				if (typeof callback === 'function') {
					callback()
				}
				let index = this.topBarIndex
				let id = this.topBar[index].id
				console.log(id);
				let now_page = this.newTopBar[index].page
				console.log('now_page', now_page);
				addNewPages(id, now_page).then((res) => {
					console.log('addNewPages收到的res', res);
					console.log('data', res.datalist);

					this.newTopBar[index].datalist.push(...res.datalist)
					console.log('this.newTopBar', this.newTopBar)

				}).catch(err => {
					if (err.code === 404) {
						this.newTopBar[index].page--
						return
					}
				})
				//  获取分页数据 (未封装时)
				// uni.request({
				// 	url: 'http://192.168.1.3:3000/api/index_list/' + id + '/data/' + page + '',
				// 	success: (res) => {
				// 		let data = res.data.data
				// 		console.log(res.statusCode);
				// 		if (res.statusCode === 404) {
				// 			alert('未发现数据')
				// 			return
				// 		} else {
				// 			console.log('data', data.datalist);

				// 			this.newTopBar[index].datalist.push(...data.datalist)
				// 			console.log('this.newTopBar', this.newTopBar)
				// 			this.newTopBar[index].page++
				// 		}
				// 	}
				// })
				this.newTopBar[index].isFirst = false


			},
			loadMore(index) {
				this.addData(() => {
					this.newTopBar[index].loadText = "已经到底了"
					this.newTopBar[index].page++
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.nullData {
		text-align: center;
	}

	.navBox {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 100rpx;

		.icon-sousuo {
			margin-left: 20rpx;
		}

		.icon-iconfontzhizuobiaozhun023110 {
			margin-right: 20rpx;
		}
	}

	.scroll-content {
		width: 100%;
		height: 80rpx;
		margin-bottom: 6rpx;
		white-space: nowrap;

		.scroll-item {
			display: inline-block;
			padding: 10rpx 30rpx;
			font-size: 32rpx;
		}

		.f-active-color {
			padding: 10rpx 0;
			border-bottom: 6rpx solid #49bdfb;
		}

	}

	.load-text {
		border-top: 2rpx solid #636263;
		line-height: 60rpx;
		text-align: center;
	}
</style>
