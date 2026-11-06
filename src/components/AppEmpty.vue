<template>
  <view class="empty">
    <uni-icons type="checkbox" size="36" color="#12a182" />
    <text class="empty__title">{{ title }}</text>
    <text class="empty__description">{{ description }}</text>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: '暂无待办事项',
    description: '当前生产任务均已完成',
  },
)
</script>

<style lang="scss" scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 24rpx;
  gap: 16rpx;

  &__title {
    font-size: 28rpx;
    font-weight: 500;
  }

  &__description {
    color: $color-text-secondary;
    font-size: 24rpx;
  }
}
</style>
