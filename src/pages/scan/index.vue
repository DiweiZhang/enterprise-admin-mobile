<script setup lang="ts">
import { ref } from 'vue'
import AppTabBar from '@/components/AppTabBar.vue'
import { notifyError } from '@/utils/error'

const code = ref('')
const categories = ['工单', '物料', '批次 / SN', '设备', '库位']

function scanCode() {
  // #ifdef H5
  notifyError('H5 请使用手动输入，App 或小程序可调用摄像头扫码')
  // #endif
  // #ifndef H5
  uni.scanCode({
    success: (result) => {
      code.value = result.result
    },
    fail: () => notifyError('已取消扫码，可手动输入编码'),
  })
  // #endif
}
function query() {
  if (!code.value.trim()) return notifyError('请先扫描或输入编码')
  notifyError('追溯查询接口接入后，可查看该编码的完整履历')
}
</script>

<template>
  <view class="page scan-page">
    <view class="scan-hero safe-top"
      ><text class="scan-hero__eyebrow">IDENTIFY · TRACE · EXECUTE</text
      ><text class="scan-hero__title">扫一扫，快速作业</text
      ><text class="scan-hero__desc">扫描现场编码，连接每一道生产环节</text
      ><view class="scan-frame" @click="scanCode"
        ><view class="scan-frame__corner scan-frame__corner--tl" /><view
          class="scan-frame__corner scan-frame__corner--tr" /><view
          class="scan-frame__corner scan-frame__corner--bl" /><view
          class="scan-frame__corner scan-frame__corner--br" /><wd-icon
          name="scan1"
          size="66px"
          color="#7ce6ce" /><view class="scan-frame__line" /></view
      ><button class="scan-button" @click="scanCode">
        <wd-icon name="scan1" size="21px" />扫码识别</button
      ><text class="scan-hint">支持二维码与条形码</text></view
    >
    <view class="scan-content"
      ><view class="manual-card"
        ><text class="manual-card__title">手动输入编码</text
        ><view class="manual-card__input"
          ><input
            v-model="code"
            placeholder="请输入工单、物料或 SN 编码"
            placeholder-class="input-placeholder" /><wd-icon
            name="arrow-right"
            size="21px"
            color="#269b88"
            @click="query" /></view></view
      ><text class="scan-content__label">可识别编码</text
      ><view class="scan-types"
        ><view v-for="category in categories" :key="category"
          ><wd-icon name="check-circle" size="14px" />{{ category }}</view
        ></view
      ><view class="scan-notice"
        ><wd-icon name="info-circle" size="16px" /><text>查询结果由后端批次追溯接口提供</text></view
      ></view
    >
    <AppTabBar current="scan" />
  </view>
</template>

<style scoped lang="scss">
.scan-page {
  background: #f4f7f9;
}
.scan-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 32rpx;
  padding: 56rpx 32rpx 56rpx;
  color: #fff;
  background: linear-gradient(135deg, #102a43, #17485a);
  border-radius: 28rpx;
}
.scan-hero__eyebrow {
  font-size: 16rpx;
  color: #6cc8bc;
  letter-spacing: 3rpx;
}
.scan-hero__title {
  margin-top: 18rpx;
  font-size: 40rpx;
  font-weight: 600;
}
.scan-hero__desc {
  margin-top: 12rpx;
  font-size: 23rpx;
  color: #a9c6d2;
}
.scan-frame {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 310rpx;
  height: 310rpx;
  margin-top: 50rpx;
  border-radius: 12rpx;
  background: rgba(72, 182, 165, 0.05);
}
.scan-frame__corner {
  position: absolute;
  width: 50rpx;
  height: 50rpx;
  border: 5rpx solid #55d7bb;
}
.scan-frame__corner--tl {
  top: 0;
  left: 0;
  border-right: 0;
  border-bottom: 0;
  border-radius: 14rpx 0 0;
}
.scan-frame__corner--tr {
  top: 0;
  right: 0;
  border-left: 0;
  border-bottom: 0;
  border-radius: 0 14rpx 0 0;
}
.scan-frame__corner--bl {
  bottom: 0;
  left: 0;
  border-right: 0;
  border-top: 0;
  border-radius: 0 0 0 14rpx;
}
.scan-frame__corner--br {
  bottom: 0;
  right: 0;
  border-left: 0;
  border-top: 0;
  border-radius: 0 0 14rpx;
}
.scan-frame__line {
  position: absolute;
  left: 26rpx;
  right: 26rpx;
  top: 40%;
  height: 2rpx;
  background: linear-gradient(90deg, transparent, #64e1c5, transparent);
  box-shadow: 0 0 12rpx #64e1c5;
}
.scan-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14rpx;
  width: 310rpx;
  height: 82rpx;
  margin-top: 42rpx;
  font-size: 28rpx;
  color: #103c49;
  background: #70dfc5;
  border-radius: 14rpx;
}
.scan-hint {
  margin-top: 18rpx;
  color: #91b0bf;
  font-size: 22rpx;
}
.scan-content {
  padding: 30rpx 32rpx;
}
.manual-card {
  padding: 28rpx;
  border-radius: 18rpx;
  background: #fff;
  border: 1rpx solid #e8eef1;
}
.manual-card__title {
  font-size: 27rpx;
  font-weight: 500;
  color: #344e60;
}
.manual-card__input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20rpx;
  padding: 0 18rpx;
  height: 78rpx;
  background: #f5f8fa;
  border-radius: 12rpx;
}
.manual-card__input input {
  flex: 1;
  font-size: 24rpx;
}
.input-placeholder {
  color: #9cacb8;
}
.scan-content__label {
  display: block;
  margin: 34rpx 0 20rpx;
  color: #869aa9;
  font-size: 24rpx;
}
.scan-types {
  display: flex;
  flex-wrap: wrap;
  gap: 18rpx;
}
.scan-types view {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  color: #547082;
  font-size: 23rpx;
  border-radius: 10rpx;
  background: #eaf2f3;
}
.scan-types wd-icon {
  color: #37a995;
}
.scan-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  margin-top: 44rpx;
  color: #a0afb9;
  font-size: 21rpx;
}
</style>
