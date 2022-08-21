<template>
	<view>
		<Commodity :dataList="datalist"></Commodity>
	</view>
</template>

<script>
	import Commodity from './Commodity.vue'
	export default {
		props: {
			datalist: {
				type: Array,
				default: []
			}
		},
		components: {
			Commodity
		},
		data() {
			return {
				commodityList: [],
			}
		},
		mounted() {
			console.log('排序触发的datalist', this.datalist);
			if (this.commodityList.length === 0) {
				// #ifdef H5
				this.commodityList = JSON.parse(localStorage.getItem('searchResult'))
				// console.log('重新接收的commodityList', this.commodityList);
				// #endif
				// #ifndef H5
				setTimeout(() => {
					uni.getStorage({
						key: 'searchResult',
						success: (res) => {
							this.commodityList = JSON.parse(res.data)
						}
					})
				}, 30)
				// #endif
			}
		}
	}
</script>

<style>
</style>
