<template>
  <view class="lb-tabbar">
    <view :class="[
        'lb-tabbar-content',
        fixed ? 'lb-tabbar--fixed' : ''
      ]"
      :style="{
        backgroundColor: bgColor,
        paddingBottom: `${safeAreaHeight}px`
      }">
      <view v-if="border"
        class="lb-tabbar-border"
        :style="{
          backgroundColor: borderColor,
          top: raisedeHeight + 'px'
        }">
      </view>
      <slot></slot>
    </view>
    <view v-if="placeholder"
      class="lb-tabbar-placeholder"
      :style="{
        height: `${tabbarHeight}px`
      }">
    </view>
  </view>
</template>

<script>
const SAFE_AREA_INSET_BOTTOM = 34
import { getPx } from './utils'
export default {
  props: {
    value: [String, Number],
    height: {
      type: String,
      default: '50px'
    },
    iconSize: {
      type: String,
      default: '22px'
    },
    textSize: {
      type: String,
      default: '12px'
    },
    textTop: {
      type: String,
      default: '5px'
    },
    dotColor: {
      type: String,
      default: '#F56C6C'
    },
    fixed: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: Boolean,
      default: true
    },
    animate: String,
    closeAnimateOnRaisede: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: true
    },
    borderColor: {
      type: String,
      default: '#DCDFE6'
    },
    bgColor: {
      type: String,
      default: '#FFF'
    },
    inactiveColor: {
      type: String,
      default: '#909399'
    },
    activeColor: {
      type: String,
      default: '#409EFF'
    },
    inactiveTextColor: String,
    activeTextColor: String,
    safeAreaInsetBottom: {
      type: Boolean,
      default: true
    },
    hideTabbar: {
      type: Boolean,
      default: true
    },
    raisedeScale: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      active: this.value,
      activeItem: {},
      tabbarItems: [],
      hasRaisede: false,
      isIphoneX: false
    }
  },
  computed: {
    tabbarItemsLength () {
      return this.tabbarItems.length
    },
    safeAreaHeight () {
      return this.isIphoneX && this.safeAreaInsetBottom ? SAFE_AREA_INSET_BOTTOM : 0 // ??????X????????????????????????
    },
    iconHeight () {
      return getPx(this.iconSize)
    },
    raisedeHeight () {
      return this.hasRaisede ? this.iconHeight * this.raisedeScale / 2 : 0 // ????????????
    },
    tabbarHeight () {
      const height = getPx(this.height) // ????????????
      const raisedeHeight = this.hasRaisede ? this.iconHeight * this.raisedeScale / 2 : 0 // ????????????
      const tabbarHeight = height + this.safeAreaHeight + raisedeHeight // ????????????
      return tabbarHeight
    }
  },
  provide () {
    return {
      tabbar: this
    }
  },
  created () {
    if (this.hideTabbar) {
      uni.hideTabBar()
    }
    const res = uni.getSystemInfoSync()
    const { model, statusBarHeight } = res
    if (
      (model.indexOf('iPhone') > -1 && statusBarHeight > 20) ||
      model.indexOf('iPhone X') > -1 ||
      model.indexOf('iPhone 1') > -1
    ) {
      this.isIphoneX = true
    }
    this.getTabbarHeight()
  },
  methods: {
    getTabbarHeight () {
      return this.tabbarHeight
    }
  },
  watch: {
    value (newVal) {
      this.active = newVal
    },
    active (newVal) {
      this.activeItem = this.tabbarItems.find(item => item.name === newVal)
      this.$emit('input', newVal)
      this.$emit('change', this.activeItem)
    },
    tabbarItemsLength () {
      this.hasRaisede = !!this.tabbarItems.find(item => item.raisede)
    }
  }
}
</script>

<style lang="scss">
@import "./style.scss";
</style>
