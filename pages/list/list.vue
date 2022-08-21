<template>
	<view>
		<LineBetween></LineBetween>
		<view class="list">
			<!-- 左侧滑动 -->
			<scroll-view scroll-y="true" class="list-left" :style="'height:'+clientHeight+'px;'">
				<view class="left-item" v-for="value in tabtitle" :key="value.id" @tap="changeLeftTab(value.id)">
					<view class="left-name" :class="tabIndex === value.id ? 'left-name-active' : ''">{{value.name}}
					</view>
				</view>
			</scroll-view>
			<!-- 右侧滑动 -->
			<scroll-view scroll-y="true" class="list-right" :style="'height:'+clientHeight+'px;'">
				<view class="right-list" v-for="value in mainData " :key="value.title">
					<view class="list-title">
						{{value.title}}
					</view>
					<view class="right-container">
						<view class="right-content" v-for="subValue in value.children" :key="subValue.id">
							<image class="right-img" :src="subValue.imgUrl"></image>
							<view class="right-name">
								{{subValue.name}}
							</view>
						</view>
					</view>

				</view>

			</scroll-view>

		</view>
			<myTabbar firstName = "list"></myTabbar>
	</view>
</template>

<script>
	import LineBetween from "@/components/common/LineBetween.vue"
	import {
		getListData
	} from '@/request/api/index.js'
	export default {
		data() {
			return {
				clientHeight: 0,
				tabIndex: 1,
				tabtitle: [],
				mainData: []

			}
		},
		components: {
			LineBetween
		},
		methods: {
			changeLeftTab(index) {
				this.tabIndex = index
				console.log(this.tabIndex);
				this.getData(index)
			},
			getData(id) {

				setTimeout(() => {
					getListData().then(res => {
						this.tabtitle = []
						this.mainData = []
						let data = res.datalist
						console.log('res', data);
						const selectedData = data.filter((val) => id === val.id)
						// console.log('selectedData[0].list', selectedData[0].list);
						this.mainData = selectedData[0].list
						data.forEach((val) => {
							let obj = {}
							obj.id = val.id
							obj.name = val.name
							this.tabtitle.push(obj)
						})

						console.log(this.tabtitle);
						console.log('this.mainData', this.mainData);
					})
				}, 250)

			}
		},
		onNavigationBarSearchInputClicked() {
			uni.navigateTo({
				url: '@/pages/search/search'
			})
		},
		// 获取可视高度，为滚动区域定高
		onReady() {
			uni.getSystemInfo({
				success: (res) => {
					this.clientHeight = res.windowHeight
					console.log('list的clientHeight', this.clientHeight);
				}
			})
		},
		onLoad() {
			this.getData(1)
		}
		// mounted() {
		// 	getListData().then(res => {
		// 		console.log('res', res);
		// 	})
		// }
	}
</script>

<style scoped>
	.list {
		display: flex;
	}

	.list-left {
		width: 200rpx;
	}

	.left-item {
		border-bottom: 2rpx solid #ffffff;
		font-size: 28rpx;
		font-weight: bold;
		background-color: #f7f7f7;
	}

	.left-name {
		padding: 30rpx 6rpx;
		text-align: center;
	}

	.left-name-active {
		border-left: 8rpx solid #49bdfb;
		background-color: #ffffff;
	}

	.list-right {
		flex: 1;
	}

	.list-title {
		font-weight: bold;
		padding: 30rpx 0;
	}

	.right-container {
		display: flex;
		flex-wrap: wrap;
		/* justify-content: space-between; */

	}

	.right-content {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		align-items: center;
		margin: 0 14rpx;
	}

	.right-name {
		padding: 16rpx 0;
	}

	.right-img {
		width: 150rpx;
		height: 150rpx;
	}
</style>
