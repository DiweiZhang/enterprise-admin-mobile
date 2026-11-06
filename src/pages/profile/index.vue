<template>
  <view class="page profile">
    <view class="profile__intro">
      <view class="profile__avatar">{{ displayName.slice(0, 1) }}</view>
      <view>
        <text class="profile__name">{{ displayName }}</text>
        <text class="profile__role">{{ roleName }}</text>
      </view>
    </view>

    <view class="card">
      <text class="section-title">偏好设置</text>
      <wd-cell-group border>
        <wd-cell title="消息通知" center>
          <wd-switch v-model="settings.notificationsEnabled" />
        </wd-cell>
        <wd-cell title="前台自动同步" center>
          <wd-switch v-model="settings.autoSync" />
        </wd-cell>
        <wd-cell title="紧凑列表" center>
          <wd-switch v-model="settings.compactMode" />
        </wd-cell>
      </wd-cell-group>
      <text class="setting-note">以上设置通过 Pinia + uni Storage 跨端持久化。</text>
    </view>

    <view class="card">
      <text class="section-title">运行环境</text>
      <wd-cell-group border>
        <wd-cell title="应用版本" value="0.1.0" />
        <wd-cell title="编译模式" :value="buildMode" />
        <wd-cell title="数据模式" :value="appConfig.useMock ? '演示数据' : '后端接口'" />
        <wd-cell title="持久化设置" :value="settings.compactMode ? '紧凑' : '标准'" />
      </wd-cell-group>
    </view>

    <wd-button block type="primary" @click="showArchitecture"> 查看工程能力 </wd-button>
    <wd-toast />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToast } from 'wot-design-uni'
import { appConfig } from '@/config'
import { useSettingsStore } from '@/stores/modules/settings'
import { useUserStore } from '@/stores/modules/user'

const settings = useSettingsStore()
const userStore = useUserStore()
const toast = useToast()
const displayName = computed(() => userStore.profile?.name || '演示管理员')
const roleName = computed(() => userStore.profile?.roles.join(' · ') || 'factory-manager')
const buildMode = computed(() => (process.env.NODE_ENV === 'production' ? '生产' : '开发'))

function showArchitecture() {
  toast.show('Vue 3 · TypeScript · Pinia · Wot UI · ECharts')
}
</script>

<style lang="scss" scoped>
.profile {
  &__intro {
    display: flex;
    align-items: center;
    padding: 24rpx 4rpx 36rpx;
    gap: 24rpx;
  }

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 104rpx;
    height: 104rpx;
    color: #fff;
    font-size: 42rpx;
    font-weight: 600;
    background: $uni-color-primary;
    border-radius: 32rpx;
  }

  &__name,
  &__role {
    display: block;
  }

  &__name {
    margin-bottom: 8rpx;
    font-size: 36rpx;
    font-weight: 600;
  }

  &__role {
    color: $color-text-secondary;
    font-size: 24rpx;
  }
}

.setting-note {
  display: block;
  padding-top: 20rpx;
  color: $color-text-secondary;
  font-size: 24rpx;
  line-height: 1.6;
}
</style>
