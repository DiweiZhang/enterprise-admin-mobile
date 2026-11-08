<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppTabBar from '@/components/AppTabBar.vue'
import { useUserStore } from '@/stores/modules/user'
import { useSettingsStore } from '@/stores/modules/settings'
import { notifyError } from '@/utils/error'

const userStore = useUserStore()
const settingsStore = useSettingsStore()
const { profile, factoryName, permissions } = storeToRefs(userStore)
const { notificationsEnabled, autoSync } = storeToRefs(settingsStore)
const cellStyle =
  '--wot-cell-title-fs:14px;--wot-cell-title-color:#344e61;--wot-cell-value-fs:12px;--wot-cell-value-color:#8d9eaa'

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
    <view class="profile-hero safe-top"
      ><text class="profile-hero__title">我的</text
      ><view class="profile-identity"
        ><view class="profile-identity__avatar"
          >{{ profile?.name?.slice(0, 1) || '员' }}<view /></view
        ><view class="profile-identity__info"
          ><text class="profile-identity__name">{{ profile?.name || '演示用户' }}</text
          ><text class="profile-identity__department"
            >{{ profile?.department }} · {{ profile?.team }}</text
          ><view class="profile-identity__role"
            ><wd-icon name="user-circle" size="12px" />{{
              profile?.roles.includes('line-operator') ? '一线员工' : '工厂管理员'
            }}</view
          ></view
        ><wd-icon name="arrow-right" size="20px" color="#a6c6cf" /></view
      ><view class="profile-factory"
        ><wd-icon name="home1" size="16px" /><text>{{ factoryName }}</text
        ><text>已认证</text></view
      ></view
    >
    <view class="profile-content"
      ><view class="profile-section"
        ><text class="profile-section__label">账号与安全</text
        ><view class="profile-card"
          ><wd-cell title="个人资料" value="查看" :custom-style="cellStyle" clickable
            ><template #icon><wd-icon name="user" size="20px" /></template></wd-cell
          ><wd-cell
            title="角色权限预览"
            :value="`${permissions.length} 个业务分组`"
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
            ><wd-switch v-model="notificationsEnabled" /></wd-cell
          ><wd-cell title="数据自动同步" :custom-style="cellStyle"
            ><template #icon><wd-icon name="chart" size="20px" /></template
            ><wd-switch v-model="autoSync" /></wd-cell
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
.profile-hero {
  padding: 56rpx 32rpx 62rpx;
  color: #fff;
  background: linear-gradient(125deg, #102a43, #17485a 72%, #176464);
  border-radius: 0 0 36rpx 36rpx;
}
.profile-hero__title {
  font-size: 40rpx;
  font-weight: 600;
}
.profile-identity {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-top: 44rpx;
}
.profile-identity__avatar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 108rpx;
  height: 108rpx;
  font-size: 44rpx;
  color: #c1f3e2;
  border: 2rpx solid #548e94;
  border-radius: 50%;
  background: #286271;
}
.profile-identity__avatar view {
  position: absolute;
  right: 3rpx;
  bottom: 4rpx;
  width: 18rpx;
  height: 18rpx;
  border: 4rpx solid #1b4a5a;
  background: #55d2ae;
  border-radius: 50%;
}
.profile-identity__info {
  flex: 1;
}
.profile-identity__name {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
}
.profile-identity__department {
  display: block;
  margin-top: 10rpx;
  color: #b0c9d3;
  font-size: 22rpx;
}
.profile-identity__role {
  display: flex;
  align-items: center;
  gap: 6rpx;
  width: fit-content;
  margin-top: 12rpx;
  padding: 5rpx 12rpx;
  color: #a4e0d2;
  font-size: 19rpx;
  border-radius: 6rpx;
  background: rgba(87, 205, 177, 0.13);
}
.profile-factory {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-top: 34rpx;
  padding-top: 24rpx;
  font-size: 23rpx;
  color: #afc7d2;
  border-top: 1rpx solid rgba(178, 211, 218, 0.13);
}
.profile-factory text:last-child {
  margin-left: auto;
  font-size: 20rpx;
  color: #77d9bd;
}
.profile-content {
  padding: 10rpx 24rpx 40rpx;
}
.profile-section {
  margin-top: 28rpx;
}
.profile-section__label {
  display: block;
  margin: 0 8rpx 16rpx;
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
