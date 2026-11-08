<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>

<template>
  <view class="app-header safe-top">
    <view class="app-header__top">
      <view>
        <text class="app-header__eyebrow">ENTERPRISE · MES</text>
        <text class="app-header__title">{{ title }}</text>
      </view>
      <view class="app-header__mark"><wd-icon name="home1" size="22px" /></view>
    </view>
    <text v-if="subtitle" class="app-header__subtitle">{{ subtitle }}</text>
    <slot />
  </view>
</template>

<style scoped lang="scss">
.app-header {
  position: relative;
  overflow: hidden;
  padding: 56rpx 32rpx 44rpx;
  color: #fff;
  background: linear-gradient(125deg, #102a43 0%, #173e58 68%, #155b63 100%);
  border-radius: 0 0 40rpx 40rpx;
}
.app-header::after {
  position: absolute;
  right: -70rpx;
  top: -90rpx;
  width: 280rpx;
  height: 280rpx;
  border: 1rpx solid rgba(75, 218, 196, 0.22);
  border-radius: 50%;
  content: '';
}
.app-header__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.app-header__eyebrow {
  display: block;
  margin-bottom: 12rpx;
  font-size: 18rpx;
  letter-spacing: 4rpx;
  color: #91c6cf;
}
.app-header__title {
  font-size: 44rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}
.app-header__mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.14);
  border-radius: 22rpx;
  color: #6ee7d0;
  background: rgba(255, 255, 255, 0.08);
}
.app-header__subtitle {
  display: block;
  margin-top: 16rpx;
  color: #b6cbd6;
  font-size: 24rpx;
}
</style>
