<script setup lang="ts">
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()
onShow(() => {
  userStore.restoreSession()
  if (!userStore.isLoggedIn) uni.reLaunch({ url: '/pages/login/index' })
})

const props = defineProps<{ current: string }>()
const items = [
  { path: 'dashboard', label: '首页', icon: 'home' },
  { path: 'workbench', label: '工作台', icon: 'app' },
  { path: 'scan', label: '扫码', icon: 'scan1' },
  { path: 'messages', label: '消息', icon: 'notification' },
  { path: 'profile', label: '我的', icon: 'user' },
]
const tabs = computed(() => items.map((item) => ({ ...item, active: props.current === item.path })))
function navigate(path: string) {
  if (path === props.current) return
  uni.reLaunch({ url: `/pages/${path}/index` })
}
</script>

<template>
  <view class="tabbar-placeholder"
    ><view class="tabbar"
      ><view
        v-for="item in tabs"
        :key="item.path"
        class="tabbar__item"
        :class="{ 'tabbar__item--scan': item.path === 'scan', 'tabbar__item--active': item.active }"
        @click="navigate(item.path)"
        ><view v-if="item.path === 'scan'" class="tabbar__scan-icon"
          ><wd-icon :name="item.icon" size="29px" /></view
        ><wd-icon v-else :name="item.icon" size="23px" /><text>{{ item.label }}</text
        ><view v-if="item.path === 'messages'" class="tabbar__badge">3</view></view
      ></view
    ></view
  >
</template>

<style scoped lang="scss">
.tabbar-placeholder {
  height: calc(112rpx + env(safe-area-inset-bottom));
}
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  display: flex;
  height: calc(108rpx + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background: rgba(255, 255, 255, 0.98);
  border-top: 1rpx solid #e9eef1;
  box-shadow: 0 -4rpx 20rpx rgba(26, 60, 80, 0.035);
}
.tabbar__item {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7rpx;
  color: #94a3af;
  font-size: 20rpx;
}
.tabbar__item--active {
  color: #168e80;
}
.tabbar__item--scan {
  color: #78909f;
}
.tabbar__scan-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 82rpx;
  height: 82rpx;
  margin-top: -52rpx;
  margin-bottom: 1rpx;
  color: #fff;
  border: 7rpx solid #f4f7f9;
  border-radius: 25rpx;
  background: linear-gradient(135deg, #17465b, #27aa91);
  box-shadow: 0 6rpx 14rpx rgba(22, 142, 128, 0.22);
}
.tabbar__badge {
  position: absolute;
  top: 13rpx;
  left: calc(50% + 9rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24rpx;
  height: 24rpx;
  color: #fff;
  font-size: 16rpx;
  border: 2rpx solid #fff;
  border-radius: 50%;
  background: #e66d64;
}
</style>
