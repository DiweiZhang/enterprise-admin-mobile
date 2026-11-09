<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import AppTabBar from '@/components/AppTabBar.vue'
import { useUserStore } from '@/stores/modules/user'
import { useSettingsStore } from '@/stores/modules/settings'
import { getDashboard } from '@/api/dashboard'
import { notifyError } from '@/utils/error'

const userStore = useUserStore()
const settingsStore = useSettingsStore()
const { profile, factoryName } = storeToRefs(userStore)
const today = ref('')
const greeting = ref('你好')

const cellStyle =
  '--wot-cell-title-fs:14px;--wot-cell-title-color:#344e61;--wot-cell-value-fs:12px;--wot-cell-value-color:#8d9eaa'

onMounted(() => {
  const hour = new Date().getHours()
  greeting.value = hour < 12 ? '早安' : hour < 18 ? '下午好' : '晚上好'
  void getDashboard()
    .then((dashboard) => {
      today.value = dashboard.date
    })
    .catch(notifyError)
})

function logout() {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出当前账号吗？',
    confirmColor: '#168e80',
    success: ({ confirm }) => {
      if (confirm) {
        userStore.logout()
        uni.reLaunch({ url: '/pages/login/index' })
      }
    },
  })
}
function previewOperator() {
  uni.showModal({
    title: '切换角色预览',
    content: '以一线员工身份预览权限工作台，共 8 个业务分组。',
    confirmText: '切换预览',
    confirmColor: '#168e80',
    success: ({ confirm }) => {
      if (confirm) {
        void userStore
          .login('line-operator', 'mes2026')
          .then(() => uni.reLaunch({ url: '/pages/workbench/index' }))
      }
    },
  })
}
</script>

<template>
  <view class="page profile-page">
    <view class="profile-header safe-top">
      <view class="profile-header__nav">
        <view class="profile-header__welcome">
          <text class="profile-header__greeting"
            >{{ greeting }}，{{ profile?.name || '同事' }}</text
          >
          <text class="profile-header__factory">
            {{ factoryName }} · {{ profile?.department || '制造运营中心' }}
          </text>
        </view>
        <view class="profile-header__actions">
          <view class="profile-header__avatar">{{ profile?.name?.slice(0, 1) || '员' }}</view>
        </view>
      </view>
      <view class="shift-bar">
        <view class="shift-bar__main">
          <text class="shift-bar__label">早班</text>
          <text class="shift-bar__time">08:00 – 20:00</text>
          <text class="shift-bar__date">{{ today }}</text>
        </view>
        <view class="shift-bar__status"><view class="status-dot" />生产中</view>
      </view>
    </view>
    <view class="profile-content"
      ><view class="profile-section"
        ><text class="profile-section__label">账号与安全</text
        ><view class="profile-card"
          ><wd-cell title="个人资料" value="查看" :custom-style="cellStyle" clickable
            ><template #icon><wd-icon name="user" size="20px" /></template></wd-cell
          ><wd-cell
            title="角色权限预览"
            :value="`${userStore.permissions.length} 个业务分组`"
            :custom-style="cellStyle"
            clickable
            @click="previewOperator"
            ><template #icon><wd-icon name="usergroup" size="20px" /></template></wd-cell
          ><wd-cell
            title="修改密码"
            :custom-style="cellStyle"
            clickable
            @click="notifyError('请通过企业管理后台或联系管理员修改密码')"
            ><template #icon><wd-icon name="lock-on" size="20px" /></template></wd-cell></view
      ></view>
      <view class="profile-section"
        ><text class="profile-section__label">偏好设置</text
        ><view class="profile-card"
          ><wd-cell title="消息通知" :custom-style="cellStyle"
            ><template #icon><wd-icon name="notification" size="20px" /></template
            ><wd-switch v-model="settingsStore.notificationsEnabled" /></wd-cell
          ><wd-cell title="数据自动同步" :custom-style="cellStyle"
            ><template #icon><wd-icon name="chart" size="20px" /></template
            ><wd-switch v-model="settingsStore.autoSync" /></wd-cell
          ><wd-cell
            title="清除缓存"
            value="仅清理业务缓存"
            :custom-style="cellStyle"
            clickable
            @click="notifyError('当前没有需要清理的业务缓存')"
            ><template #icon><wd-icon name="delete" size="20px" /></template></wd-cell></view
      ></view>
      <view class="profile-section"
        ><text class="profile-section__label">支持与关于</text
        ><view class="profile-card"
          ><wd-cell
            title="使用帮助"
            :custom-style="cellStyle"
            clickable
            @click="notifyError('使用手册正在整理中')"
            ><template #icon><wd-icon name="help" size="20px" /></template></wd-cell
          ><wd-cell title="关于企业智造" value="V1.0.0" :custom-style="cellStyle"
            ><template #icon><wd-icon name="info-circle" size="20px" /></template></wd-cell></view
      ></view>
      <button class="logout-button" @click="logout">
        <wd-icon name="logout" size="19px" />退出登录</button
      ><text class="profile-copyright">企业智造 · 让制造更简单</text></view
    >
    <AppTabBar current="profile" />
  </view>
</template>

<style scoped lang="scss">
.profile-page {
  background: #f4f7f9;
}
.profile-header {
  padding: 32rpx 32rpx 22rpx;
  color: #19364c;
  border-bottom: 1rpx solid #e5ecef;
}
.profile-header__nav,
.profile-header__actions,
.shift-bar,
.shift-bar__main,
.shift-bar__status {
  display: flex;
  align-items: center;
}
.profile-header__nav,
.shift-bar {
  justify-content: space-between;
}
.profile-header__actions {
  flex-shrink: 0;
  gap: 18rpx;
  margin-left: 20rpx;
}
.profile-header__welcome {
  min-width: 0;
}
.profile-header__greeting {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
}
.profile-header__factory {
  display: block;
  margin-top: 10rpx;
  overflow: hidden;
  color: #8298a5;
  font-size: 22rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.profile-header__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  color: #168e80;
  font-size: 27rpx;
  border: 1rpx solid #d8e9e4;
  border-radius: 50%;
  background: #e6f3ef;
}
.shift-bar {
  margin-top: 26rpx;
  padding: 18rpx 22rpx;
  border: 1rpx solid #e1ece9;
  border-radius: 14rpx;
  background: #edf5f3;
}
.shift-bar__main {
  flex-wrap: wrap;
  gap: 12rpx;
}
.shift-bar__label {
  color: #285a59;
  font-size: 25rpx;
  font-weight: 600;
}
.shift-bar__time {
  color: #6d8b92;
  font-size: 22rpx;
}
.shift-bar__date {
  color: #91a5ad;
  font-size: 21rpx;
}
.shift-bar__status {
  gap: 8rpx;
  margin-left: 12rpx;
  color: #168e80;
  font-size: 21rpx;
}
.status-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: #35b897;
}
.profile-content {
  padding: 0 32rpx 40rpx;
}
.profile-section {
  margin-top: 28rpx;
}
.profile-section__label {
  display: block;
  margin: 0 0 16rpx;
  font-size: 23rpx;
  color: #91a2af;
}
.profile-card {
  overflow: hidden;
  border: 1rpx solid #e8eef1;
  border-radius: 18rpx;
  background: #fff;
}
.profile-card :deep(.wd-cell__left) {
  color: #648593;
  margin-right: 8rpx;
}
.logout-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  height: 88rpx;
  margin-top: 40rpx;
  color: #d26661;
  font-size: 28rpx;
  border: 1rpx solid #f0e5e3;
  border-radius: 16rpx;
  background: #fff;
}
.profile-copyright {
  display: block;
  margin-top: 32rpx;
  text-align: center;
  color: #afbbc4;
  font-size: 20rpx;
}
</style>
