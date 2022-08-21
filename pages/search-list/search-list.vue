<template>
	<view>
		<ShopList :keyword="keyword"></ShopList>
	</view>
</template>

<script>
	import ShopList from '@/components/common/ShopList.vue'
	export default {
		data() {
			return {
				keyword: ''
			}
		},
		methods: {

		},
		components: {
			ShopList
		},
		// 在APP端保留搜索关键字
		onLoad(e) {
			this.keyword = e.keyword
			console.log(e.keyword);
			// #ifdef APP-PLUS
			var webView = this.$mp.page.$getAppWebview();
			webView.setTitleNViewSearchInputText(e.keyword)
			// #endif


		},
		// 在H5端保留搜索关键字
		onReady() {
			// #ifdef H5
			var searchInputDom = document.querySelector(".uni-input-input[type=search]");
			var evt = new UIEvent('input', {
				bubbles: false,
				cancelable: false
			});
			searchInputDom.value = this.keyword.toString();
			searchInputDom.dispatchEvent(evt);
			// #endif
		}
	}
</script>

<style>

</style>
