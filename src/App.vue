<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/modules/user'

onLaunch(() => {
  const userStore = useUserStore()
  userStore.restoreSession()
  const pages = getCurrentPages()
  const currentRoute = pages[pages.length - 1]?.route || 'pages/login/index'
  const target =
    userStore.isLoggedIn && currentRoute === 'pages/login/index'
      ? '/pages/dashboard/index'
      : !userStore.isLoggedIn && currentRoute !== 'pages/login/index'
        ? '/pages/login/index'
        : ''
  if (target) uni.reLaunch({ url: target })
})

// 自定义底部导航让扫码成为主操作，并统一 App、H5 和小程序的页面结构。

onShow(() => {
  // 可在此刷新需要回到前台后立即同步的数据。
})

onHide(() => {
  // 页面离开时，业务缓存由各 Store 负责，不在 App 中聚合业务逻辑。
})
</script>

<style lang="scss">
page {
  min-height: 100%;
  background: $color-bg-page;
  color: $color-text-primary;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: $font-size-md;
}

view,
text,
button,
input,
scroll-view {
  box-sizing: border-box;
}

button::after {
  border: none;
}

.safe-top {
  padding-top: calc(24rpx + var(--status-bar-height));
}
</style>
