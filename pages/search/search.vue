<template>
	<view>
		<!-- <view class="line-between"></view> -->
		<line-between></line-between>
		<view class="search-item">
			<view class="search-title">
				<view class="f-color">
					最近搜索
				</view>
				<view class="iconfont icon-icon-shanchu" @click="removeSearchList">
				</view>
			</view>
			<view v-if="searchList.length>0">
				<view class="search-name f-color" v-for="(item,index) in searchList" :key="index"
					@click="clickSearch(item)">
					{{item}}
				</view>
			</view>
			<view class="nullSearch" v-else>
				无搜索记录
			</view>
		</view>
		<view class="search-item">
			<view class="search-title">
				<view class="f-color">
					热门搜索
				</view>
			</view>
			<view>
				<view class="search-name f-color">
					四件套
				</view>
				<view class="search-name f-color">
					衣柜
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import LineBetween from "@/components/common/LineBetween.vue"
	export default {
		data() {
			return {
				searchList: [],
				keyword: ''
			}
		},
		methods: {
			// 判断关键词是否为空，是否跳转页面
			search() {
				if (this.keyword === "") {
					return uni.showToast({
						title: "关键词不能为空",
						icon: "none"
					})
				} else {
					uni.navigateTo({
						url: "../search-list/search-list?keyword=" + this.keyword + "",
					})
				}
				uni.hideKeyboard()
				this.generateSearchList()
			},
			clickSearch(item) {
				uni.navigateTo({
					url: "../search-list/search-list?keyword=" + item + ""
				})
			},
			// 创建搜索列表
			generateSearchList() {
				// 利用正则表达式过滤纯空格输入内容
				const reg1 = /(^\s+$)/
				if (reg1.test(this.keyword)) {
					return
				}
				this.searchList.unshift(this.keyword.trim());
				// 利用Set来去重
				this.searchList = [...new Set(this.searchList)]
				// 固定长度，总记录超过一定长度就删除旧的记录,从最早的记录开始删除
				if (this.searchList.length > 10) {
					this.searchList.splice(this.searchList.length - 1, 1);
				}
				// #ifdef H5
				localStorage.setItem("searchList", JSON.stringify(this.searchList));
				// #endif
				// #ifndef H5
				uni.setStorage({
					key: 'searchList',
					data: JSON.stringify(this.searchList)
				})
				// #endif
			},
			removeSearchList() {
				uni.showModal({
					title: "删除提示",
					content: "是否清除最近的搜索记录",
					cancelText: "取消",
					confirmText: "确定",
					success: (res) => {
						// #ifdef H5
						localStorage.removeItem("searchList");
						// #endif
						// #ifndef H5
						uni.removeStorage({
							key: 'searchList',
						})
						// #endif
						this.searchList = [];
					}
				})
			}
		},
		components: {
			LineBetween
		},
		// 监听搜素框输入内容
		onNavigationBarSearchInputChanged(e) {
			this.keyword = e.text
		},
		// 监听搜素按键
		onNavigationBarButtonTap(e) {
			this.search()
		},
		// 监听软键盘输入内容
		onNavigationBarSearchInputConfirmed(e) {
			this.search()
		},
		onReady() {
			// #ifdef H5
			this.searchList = JSON.parse(localStorage.getItem("searchList")) || []
			// #endif
			// #ifndef H5
			uni.getStorage({
				key: 'searchList',
				success: (res) => {
					this.searchList = JSON.parse(res.data)
				}
			})
			// #endif
		},
	}
</script>

<style lang="less" scoped>
	.nullSearch {
		text-align: center;
	}

	.search-item {
		padding: 20rpx;
	}

	.search-title {
		display: flex;
		justify-content: space-between;
	}

	.search-name {
		display: inline-block;
		padding: 4rpx 24rpx;
		background-color: #E1E1E1;
		border-radius: 26rpx;
		margin: 10rpx;
	}
</style>
