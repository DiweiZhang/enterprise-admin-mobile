<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>

<template>
  <view class="app-header safe-top">
    <view class="app-header__top">
      <view>
        <text class="app-header__title">{{ title }}</text>
        <text v-if="subtitle" class="app-header__subtitle">{{ subtitle }}</text>
      </view>
      <view class="app-header__mark"><wd-icon name="home1" size="20px" /></view>
    </view>
    <slot />
  </view>
</template>

<style scoped lang="scss">
.app-header {
  position: relative;
  margin: 0 32rpx;
  padding: 32rpx 0 26rpx;
  color: #19364c;
  border-bottom: 1rpx solid #e5ecef;
  background: #f4f7f9;
}
.app-header__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.app-header__title {
  font-size: 40rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
}
.app-header__mark {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  height: 60rpx;
  color: #168e80;
  border: 1rpx solid #dcebe7;
  border-radius: 16rpx;
  background: #eaf5f2;
}
.app-header__subtitle {
  display: block;
  margin-top: 10rpx;
  color: #8a9ba7;
  font-size: 22rpx;
}
</style>
