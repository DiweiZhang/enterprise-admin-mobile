<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/modules/user'
import { notifyError } from '@/utils/error'

const userStore = useUserStore()
const submitting = ref(false)
const agreed = ref(true)
const form = reactive({ username: 'factory-manager', password: 'mes2026' })

onLoad((query) => {
  if (query?.demo === 'operator') {
    form.username = 'line-operator'
    form.password = 'mes2026'
  }
})

async function submit() {
  if (!form.username.trim() || !form.password) {
    notifyError('请输入账号和密码')
    return
  }
  if (!agreed.value) {
    notifyError('请阅读并同意服务协议与隐私政策')
    return
  }
  submitting.value = true
  try {
    await userStore.login(form.username, form.password)
    uni.showToast({ title: '登录成功', icon: 'success' })
    uni.reLaunch({ url: '/pages/dashboard/index' })
  } catch (error) {
    notifyError(error)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <view class="login-page">
    <view class="login-visual safe-top">
      <view class="login-visual__grid" />
      <view class="brand">
        <view class="brand__logo"
          ><view class="brand__logo-line" /><view class="brand__logo-line" /><view
            class="brand__logo-line"
        /></view>
        <view
          ><text class="brand__name">企业智造</text
          ><text class="brand__en">ENTERPRISE MES</text></view
        >
      </view>
      <view class="login-visual__content">
        <text class="login-visual__eyebrow">CONNECTED · EFFICIENT · INTELLIGENT</text>
        <text class="login-visual__title">让生产现场，</text>
        <text class="login-visual__title">尽在掌握。</text>
        <text class="login-visual__desc">连接人、机、料、法、环，让每一次执行都有回应</text>
      </view>
      <view class="login-visual__footer"><view class="status-dot" />工业数字化协同平台</view>
    </view>

    <view class="login-form">
      <text class="login-form__title">欢迎回来</text>
      <text class="login-form__desc">登录账号，开启今日工作</text>
      <view class="form-field">
        <text class="form-field__label">账号</text>
        <view class="form-field__control"
          ><wd-icon name="user" size="21px" /><input
            v-model="form.username"
            class="form-field__input"
            placeholder="请输入账号"
            placeholder-class="input-placeholder"
        /></view>
      </view>
      <view class="form-field">
        <text class="form-field__label">密码</text>
        <view class="form-field__control"
          ><wd-icon name="lock-on" size="21px" /><input
            v-model="form.password"
            password
            class="form-field__input"
            placeholder="请输入密码"
            placeholder-class="input-placeholder"
        /></view>
      </view>
      <view class="login-form__options">
        <view class="agreement" @click="agreed = !agreed"
          ><wd-icon
            :name="agreed ? 'check-circle-filled' : 'check-circle'"
            size="18px"
            :color="agreed ? '#0c9b82' : '#b0bec9'"
          /><text>同意服务协议与隐私政策</text></view
        >
        <text class="login-form__help" @click="notifyError('请联系系统管理员重置密码')"
          >忘记密码？</text
        >
      </view>
      <button class="login-button" :loading="submitting" :disabled="submitting" @click="submit">
        登 录<wd-icon v-if="!submitting" name="arrow-right" size="20px" />
      </button>
      <view class="demo-note"
        ><wd-icon name="info-circle" size="15px" /><text>演示账号已预填，可直接登录体验</text></view
      >
      <view class="login-form__footer"><text>Enterprise MES Mobile</text><text>V1.0.0</text></view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background: #f5f7fa;
}
.login-visual {
  position: relative;
  height: 470rpx;
  overflow: hidden;
  padding: 58rpx 48rpx;
  color: #fff;
  background: linear-gradient(130deg, #0c2339 0%, #163c54 60%, #155e64 100%);
}
.login-visual__grid {
  position: absolute;
  inset: 0;
  opacity: 0.13;
  background-image:
    linear-gradient(rgba(130, 222, 206, 0.4) 1rpx, transparent 1rpx),
    linear-gradient(90deg, rgba(130, 222, 206, 0.4) 1rpx, transparent 1rpx);
  background-size: 64rpx 64rpx;
  transform: perspective(300px) rotateX(35deg) scale(1.4);
}
.brand {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.brand__logo {
  display: flex;
  align-items: flex-end;
  gap: 6rpx;
  width: 58rpx;
  height: 58rpx;
  padding: 12rpx;
  border-radius: 16rpx;
  background: #27b99e;
  transform: skewY(-8deg);
}
.brand__logo-line {
  width: 8rpx;
  height: 18rpx;
  border-radius: 2rpx;
  background: #fff;
}
.brand__logo-line:nth-child(2) {
  height: 32rpx;
}
.brand__logo-line:nth-child(3) {
  height: 26rpx;
}
.brand__name {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  letter-spacing: 4rpx;
}
.brand__en {
  display: block;
  margin-top: 6rpx;
  font-size: 16rpx;
  letter-spacing: 3rpx;
  color: #96b6c4;
}
.login-visual__content {
  position: relative;
  margin-top: 62rpx;
}
.login-visual__eyebrow {
  font-size: 15rpx;
  letter-spacing: 2rpx;
  color: #74d9c7;
}
.login-visual__title + .login-visual__title {
  margin-top: 0;
}
.login-visual__title {
  display: block;
  margin-top: 18rpx;
  font-size: 52rpx;
  font-weight: 700;
  line-height: 1.42;
  white-space: pre-line;
  letter-spacing: 3rpx;
}
.login-visual__desc {
  display: block;
  margin-top: 16rpx;
  font-size: 23rpx;
  line-height: 1.8;
  color: #afc7d2;
  white-space: pre-line;
}
.login-visual__footer {
  position: absolute;
  bottom: 25rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
  font-size: 20rpx;
  color: #9cb9c6;
}
.status-dot {
  width: 10rpx;
  height: 10rpx;
  background: #4adebd;
  border-radius: 50%;
}
.login-form {
  position: relative;
  z-index: 1;
  margin: -12rpx 24rpx 0;
  padding: 44rpx 36rpx 30rpx;
  border-radius: 28rpx;
  background: #fff;
  box-shadow: 0 12rpx 50rpx rgba(16, 42, 67, 0.08);
}
.login-form__title {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: #152e42;
}
.login-form__desc {
  display: block;
  margin-top: 12rpx;
  font-size: 25rpx;
  color: #8a9aa8;
}
.form-field {
  margin-top: 34rpx;
}
.form-field__label {
  display: block;
  margin-bottom: 14rpx;
  color: #42576a;
  font-size: 25rpx;
  font-weight: 500;
}
.form-field__control {
  display: flex;
  align-items: center;
  gap: 20rpx;
  height: 92rpx;
  padding: 0 24rpx;
  color: #8ba1b0;
  background: #f5f8fa;
  border: 1rpx solid #e7edf1;
  border-radius: 14rpx;
}
.form-field__input {
  flex: 1;
  font-size: 28rpx;
  color: #213d52;
}
.input-placeholder {
  color: #a5b2bd;
}
.login-form__options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 26rpx;
  font-size: 21rpx;
}
.agreement {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #8a9aa8;
}
.login-form__help {
  color: #2a8c87;
}
.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22rpx;
  height: 94rpx;
  margin-top: 38rpx;
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
  border-radius: 14rpx;
  background: linear-gradient(105deg, #123c53, #159582);
  box-shadow: 0 10rpx 24rpx rgba(21, 149, 130, 0.2);
}
.login-button::after {
  border: 0;
}
.demo-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  margin-top: 24rpx;
  color: #94a2ae;
  font-size: 21rpx;
}
.login-form__footer {
  display: flex;
  justify-content: space-between;
  margin-top: 40rpx;
  color: #b1bec8;
  font-size: 20rpx;
}
</style>
