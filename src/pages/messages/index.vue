<script setup lang="ts">
import { computed, ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppTabBar from '@/components/AppTabBar.vue'

const activeTab = ref('全部')
const tabs = ['全部', '待办', '异常', '通知']
const messages = [
  {
    id: 1,
    type: '异常',
    title: '设备故障待响应',
    content: 'CNC-008 主轴温度异常，请设备工程师及时处理。',
    time: '10:32',
    icon: 'warning',
    color: '#df6b64',
    unread: true,
  },
  {
    id: 2,
    type: '待办',
    title: '首件检验任务',
    content: '工单 MO-20261106-018 已开工，请安排首件检验。',
    time: '09:48',
    icon: 'check-circle',
    color: '#3885be',
    unread: true,
  },
  {
    id: 3,
    type: '待办',
    title: '销售订单待评审',
    content: 'SO-202611-036 已提交，请在今日完成订单评审。',
    time: '09:15',
    icon: 'list',
    color: '#8a72bb',
    unread: true,
  },
  {
    id: 4,
    type: '通知',
    title: '早班生产例会提醒',
    content: '今日 13:30 在二楼会议室召开生产协调会。',
    time: '08:20',
    icon: 'notification',
    color: '#319a86',
    unread: false,
  },
  {
    id: 5,
    type: '异常',
    title: '物料齐套预警',
    content: '工单 MO-20261106-021 存在 2 项缺料，请关注。',
    time: '昨天',
    icon: 'home',
    color: '#d99a46',
    unread: false,
  },
]
const filteredMessages = computed(() =>
  activeTab.value === '全部' ? messages : messages.filter((item) => item.type === activeTab.value),
)
</script>

<template>
  <view class="page messages-page">
    <AppHeader title="消息中心" subtitle="及时响应每一项现场协同" />
    <view class="messages-content">
      <view class="message-tabs">
        <view
          v-for="tab in tabs"
          :key="tab"
          :class="{ 'message-tabs__active': activeTab === tab }"
          @click="activeTab = tab"
          >{{ tab }}<text v-if="tab === '全部'">3</text></view
        >
      </view>
      <view class="message-list">
        <view v-for="message in filteredMessages" :key="message.id" class="message-card">
          <view
            class="message-card__icon"
            :style="{ color: message.color, backgroundColor: `${message.color}14` }"
            ><wd-icon :name="message.icon" size="24px"
          /></view>
          <view class="message-card__body">
            <view class="message-card__head"
              ><text>{{ message.title }}</text
              ><text>{{ message.time }}</text></view
            >
            <text class="message-card__content">{{ message.content }}</text>
            <view class="message-card__footer"
              ><text>{{ message.type }}</text
              ><text>查看详情 <wd-icon name="arrow-right" size="11px" /></text
            ></view>
          </view>
          <view v-if="message.unread" class="message-card__unread" />
        </view>
        <view v-if="!filteredMessages.length" class="messages-empty">暂无此类消息</view>
      </view>
      <view class="demo-notice">以上消息用于界面预览，暂未连接业务通知服务</view>
    </view>
    <AppTabBar current="messages" />
  </view>
</template>

<style scoped lang="scss">
.messages-page {
  background: #f4f7f9;
}
.messages-content {
  padding: 28rpx 24rpx 50rpx;
}
.message-tabs {
  display: flex;
  padding: 8rpx;
  border-radius: 14rpx;
  background: #e8eef1;
}
.message-tabs > view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  height: 64rpx;
  color: #8295a4;
  font-size: 25rpx;
  border-radius: 10rpx;
}
.message-tabs__active {
  color: #1c776e !important;
  background: #fff;
  box-shadow: 0 2rpx 10rpx rgba(29, 68, 86, 0.07);
}
.message-tabs text {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26rpx;
  height: 26rpx;
  font-size: 18rpx;
  border-radius: 50%;
  color: #fff;
  background: #e4746b;
}
.message-list {
  margin-top: 24rpx;
}
.message-card {
  position: relative;
  display: flex;
  gap: 20rpx;
  margin-bottom: 18rpx;
  padding: 26rpx 22rpx;
  border: 1rpx solid #e8eef1;
  border-radius: 18rpx;
  background: #fff;
}
.message-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 70rpx;
  height: 70rpx;
  border-radius: 20rpx;
}
.message-card__body {
  flex: 1;
  min-width: 0;
}
.message-card__head {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}
.message-card__head text:first-child {
  font-size: 28rpx;
  font-weight: 500;
  color: #2d4558;
}
.message-card__head text:last-child {
  flex-shrink: 0;
  color: #a0aeb8;
  font-size: 20rpx;
}
.message-card__content {
  display: block;
  margin-top: 12rpx;
  color: #8294a2;
  font-size: 23rpx;
  line-height: 1.7;
}
.message-card__footer {
  display: flex;
  justify-content: space-between;
  margin-top: 17rpx;
  color: #9aaab5;
  font-size: 20rpx;
}
.message-card__footer text:first-child {
  color: #6f909c;
}
.message-card__unread {
  position: absolute;
  top: 20rpx;
  right: 14rpx;
  width: 8rpx;
  height: 8rpx;
  background: #e36d65;
  border-radius: 50%;
}
.messages-empty {
  padding: 80rpx 0;
  text-align: center;
  color: #9eacb6;
  font-size: 25rpx;
}
.demo-notice {
  margin-top: 30rpx;
  text-align: center;
  color: #a6b3bc;
  font-size: 20rpx;
}
</style>
