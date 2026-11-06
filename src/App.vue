<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/modules/user'

onLaunch(() => {
  useUserStore().restoreSession()
})

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
</style>
