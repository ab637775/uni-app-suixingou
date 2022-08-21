<template>
	<view class="myTabbar">
		<u-tabbar
			:value="value1"
			@change="changeName"
			:fixed="true"
			:placeholder="false"
			:safeAreaInsetBottom="false"
			class="uTabbar"
		>
			<u-tabbar-item v-for="(val,idx) in tabbars" :key="idx" :name="val.name" :text="val.text" @click="goToPage" :icon="val.icon"  class="uTabbarItem"></u-tabbar-item>
		<!-- 	<u-tabbar-item text="首页" icon="home" name="home" @click="click1" class="uTabbarItem" ></u-tabbar-item>
			<u-tabbar-item text="列表" icon="grid" name="list" @click="click1" class="uTabbarItem" ></u-tabbar-item>
			<u-tabbar-item text="购物车" icon="shopping-cart" name="cart" @click="click1" class="uTabbarItem" ></u-tabbar-item>
			<u-tabbar-item text="我的" icon="account" name="mine" @click="click1" class="uTabbarItem"></u-tabbar-item> -->
		</u-tabbar>

		
	</view>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
	export default{
		props:{
			firstName:{
				type:String,
				default:'home'
			}
		},
		data(){
			return{
			// active: 'home',
			value1: this.firstName,
			tabbars: [
			  {
			    name: 'home',
			    text: '首页',
			    icon: 'home'
			  },
			  {
			    name: 'list',
			    text: '分类',
			    icon: 'grid'
			  },
			  {
			    name: 'cart',
			    text: '购物车',
			    icon: 'shopping-cart'
			  },		
			  {
			    name: 'mine',
			    text: '我的',
			    icon: 'account'
			  }
			]
		}
	},
computed:{
	...mapState(['tabbarName'])
},
methods:{
	...mapMutations(['updateTabbarName']),

	goToPage(e){
		// 注意：四个tabbar图标页面都有这个组件 数据也就分成了四份 初始值不能始终为home
		// 所以必须设置自定义属性，在每个页面设置对应的初始激活项，如list页面就是设置初始value1为list

		console.log('goToPage value1',this.value1);
		console.log('this.tabbarName',this.tabbarName);
		
	},
	changeName(name){
		// console.log('name',name);
		// console.log('this.value1',this.value1);
		switch (name){
			case 'home':
				uni.navigateTo({
					url:'/pages/index/index'
				})
				break;
			case 'list':
				uni.navigateTo({
					url:'/pages/list/list'
				})
				break;	
			case 'cart':
				uni.navigateTo({
					url:'/pages/shopCart/shopCart'
				})
				break;
			case 'mine':
				uni.navigateTo({
					url:'/pages/personal/personal'
				})
				break;		
			default:
			uni.showToast({
				title: '出错了'			
			})
				break;
		}
	}
 }
}
</script>

<style lang="less" scoped>
/deep/ .u-tabbar-item__text{
	font-size: 30rpx;
	height: 30rpx;
}
/deep/ .u-icon__icon{
	font-size: 50rpx!important;
	
}
/deep/ .u-tabbar__content__item-wrapper{
	height: 120rpx;
}
/deep/ .u-tabbar-item__icon{
	font-size: 40rpx;
}
	.myTabbar{
			.uTabbar{		
			
				.uTabbarItem{
					
				}
			}
	}

</style>
