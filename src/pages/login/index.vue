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
  <view class="login-page safe-top">
    <view class="login-decoration" aria-hidden="true">
      <view class="login-decoration__grid" />
      <view class="login-decoration__glow login-decoration__glow--top" />
      <view class="login-decoration__glow login-decoration__glow--bottom" />
      <view class="login-decoration__ring login-decoration__ring--large" />
      <view class="login-decoration__ring login-decoration__ring--small" />
    </view>
    <view class="login-content">
      <view class="brand">
        <view class="brand__logo">
          <wd-icon name="setting" size="40px" color="#ffffff" />
        </view>
        <view
          ><text class="brand__name">MES智能智造</text
          ><text class="brand__en">INTELLIGENT MANUFACTURING</text></view
        >
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
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.login-page {
  position: relative;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  /* App 端使用动态视口高度，避免浏览器工具栏造成底部溢出。 */
  min-height: 100dvh;
  overflow: hidden;
  padding: 32px 0;
  background: linear-gradient(130deg, #0c2339 0%, #163c54 60%, #155e64 100%);
}
.login-content {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: calc(100% - 48rpx);
  max-width: 560px;
}
.login-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.login-decoration__grid {
  position: absolute;
  inset: 0;
  opacity: 0.09;
  background-image:
    linear-gradient(rgba(130, 222, 206, 0.4) 1rpx, transparent 1rpx),
    linear-gradient(90deg, rgba(130, 222, 206, 0.4) 1rpx, transparent 1rpx);
  background-size: 72rpx 72rpx;
  mask-image: linear-gradient(to bottom, #000, transparent 85%);
}
.login-decoration__glow {
  position: absolute;
  width: 560rpx;
  height: 560rpx;
  border-radius: 50%;
  filter: blur(80rpx);
}
.login-decoration__glow--top {
  top: -240rpx;
  right: -200rpx;
  background: rgb(42 199 169 / 16%);
}
.login-decoration__glow--bottom {
  bottom: -240rpx;
  left: -180rpx;
  background: rgb(41 126 157 / 20%);
}
.login-decoration__ring {
  position: absolute;
  border: 1rpx solid rgb(124 211 193 / 12%);
  border-radius: 50%;
}
.login-decoration__ring--large {
  top: 9%;
  right: -180rpx;
  width: 400rpx;
  height: 400rpx;
}
.login-decoration__ring--small {
  bottom: 7%;
  left: -90rpx;
  width: 240rpx;
  height: 240rpx;
}
.brand {
  position: relative;
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin: 0 0 48rpx;
  color: #fff;
}
.brand__logo {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 84rpx;
  height: 84rpx;
  border: 1rpx solid rgb(255 255 255 / 25%);
  border-radius: 24rpx;
  background: linear-gradient(135deg, #36cfb0, #14947f);
  box-shadow: 0 10rpx 24rpx rgb(0 0 0 / 15%);
}
.brand__name {
  display: block;
  font-size: 42rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}
.brand__en {
  display: block;
  margin-top: 8rpx;
  font-size: 18rpx;
  letter-spacing: 2rpx;
  color: #a5c2cf;
}
.login-form {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: 44rpx 36rpx 38rpx;
  border-radius: 28rpx;
  background: #fff;
  box-shadow: 0 12rpx 50rpx rgba(16, 42, 67, 0.08);
}

/* 小屏设备保持表单紧凑；空间不足时页面自然滚动，不压缩输入区。 */
@media screen and (max-height: 760px) {
  .login-page {
    padding-top: calc(20px + env(safe-area-inset-bottom));
    padding-bottom: calc(20px + env(safe-area-inset-bottom));
  }

  .brand {
    margin-bottom: 32rpx;
  }

  .login-form {
    padding-top: 30rpx;
  }

  .form-field {
    margin-top: 26rpx;
  }
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
</style>
