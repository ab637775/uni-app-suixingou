<template>
	<view class="hot">
		<Commodity :dataList="hotList" itemWidth="240" itemImgHeight="220"></Commodity>
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
				hotList: this.datalist
			}
		},
		components: {
			Commodity
		}
	}
</script>

<style>
</style>
