<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { EChartsOption } from 'echarts'
import { onPullDownRefresh, onShow } from '@dcloudio/uni-app'
import { getDashboard } from '@/api/dashboard'
import { useUserStore } from '@/stores/modules/user'
import type { DashboardData } from '@/types/api'
import AppChart from '@/components/AppChart.vue'
import AppTabBar from '@/components/AppTabBar.vue'
import AppEmpty from '@/components/AppEmpty.vue'
import { notifyError } from '@/utils/error'

const userStore = useUserStore()
const { profile, factoryName, permissions } = storeToRefs(userStore)
const dashboard = ref<DashboardData | null>(null)
const loading = ref(true)
const productionTrend = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 42, right: 16, top: 24, bottom: 26 },
  xAxis: {
    type: 'category',
    data: dashboard.value?.dailyOutput.map((item) => item.date) ?? [],
    axisLine: { lineStyle: { color: '#dce4eb' } },
    axisLabel: { color: '#90a1af', fontSize: 10 },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#edf1f4' } },
    axisLabel: { color: '#90a1af', fontSize: 10 },
  },
  series: [
    {
      name: '产量',
      type: 'bar',
      barWidth: 15,
      itemStyle: { color: '#2385ba', borderRadius: [4, 4, 0, 0] },
      data: dashboard.value?.dailyOutput.map((item) => item.output) ?? [],
    },
    {
      name: '计划',
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { color: '#28b79a', width: 2 },
      data: dashboard.value?.dailyOutput.map((item) => item.target) ?? [],
    },
  ],
}))
const taskGroups = [
  { icon: 'list', label: '生产任务', count: 8, color: '#347dd1' },
  { icon: 'check-circle', label: '待我检验', count: 3, color: '#8c70c4' },
  { icon: 'warning', label: '异常处理', count: 2, color: '#e47765' },
  { icon: 'setting1', label: '设备点检', count: 1, color: '#dc9b42' },
]
const quickActions = computed(() =>
  [
    { icon: 'list', label: '生产报工', permission: 'production:view', color: '#347dd1' },
    { icon: 'check-circle', label: '首检巡检', permission: 'quality:view', color: '#0c9b82' },
    { icon: 'scan', label: '批次追溯', permission: 'traceability:view', color: '#2385ba' },
    { icon: 'warning', label: '异常上报', permission: 'andon:view', color: '#e47765' },
  ].filter((item) => permissions.value.includes(item.permission)),
)
const taskStyle =
  '--wot-cell-title-fs:14px;--wot-cell-title-color:#233e52;--wot-cell-value-fs:12px;--wot-cell-value-color:#99a8b4'

function openWorkbench() {
  uni.reLaunch({ url: '/pages/workbench/index' })
}
function openMessages() {
  uni.reLaunch({ url: '/pages/messages/index' })
}
function comingSoon(name: string) {
  notifyError(`${name}：业务接口接入后开放`)
}
async function loadData() {
  loading.value = true
  try {
    dashboard.value = await getDashboard()
  } catch (error) {
    notifyError(error)
  } finally {
    loading.value = false
    uni.stopPullDownRefresh()
  }
}
onMounted(() => {
  void loadData()
})
onShow(() => {
  if (!userStore.isLoggedIn) uni.redirectTo({ url: '/pages/login/index' })
})
onPullDownRefresh(loadData)
</script>

<template>
  <view class="page dashboard-page">
    <view class="home-hero safe-top">
      <view class="home-hero__nav"
        ><view class="factory-brand"
          ><view class="factory-brand__icon"><wd-icon name="home1" size="20px" /></view
          ><text>企业智造 MES</text></view
        ><view class="home-hero__notification" @click="openMessages"
          ><wd-icon name="notification" size="23px" /><view class="notification-dot" /></view
      ></view>
      <view class="home-hero__welcome"
        ><view
          ><text class="home-hero__greeting">早安，{{ profile?.name || '同事' }}</text
          ><text class="home-hero__factory"
            ><wd-icon name="location" size="13px" />{{ factoryName }} ·
            {{ profile?.department || '制造运营中心' }}</text
          ></view
        ><view class="home-hero__avatar">{{ profile?.name?.slice(0, 1) || '员' }}</view></view
      >
      <view class="shift-card"
        ><view
          ><text class="shift-card__label">今日班次</text
          ><text class="shift-card__value">早班 <text>08:00 – 20:00</text></text></view
        ><view class="shift-card__right"
          ><view class="status-dot" /><text>生产中</text
          ><text class="shift-card__date">{{ dashboard?.date }}</text></view
        ></view
      >
    </view>

    <view class="dashboard-content">
      <view class="section-heading"
        ><text class="section-heading__title">我的待办</text
        ><text class="section-heading__link" @click="openWorkbench"
          >全部任务 <wd-icon name="arrow-right" size="12px" /></text
      ></view>
      <view class="task-grid"
        ><view
          v-for="item in taskGroups"
          :key="item.label"
          class="task-card"
          @click="comingSoon(item.label)"
          ><view
            class="task-card__icon"
            :style="{ color: item.color, backgroundColor: `${item.color}12` }"
            ><wd-icon :name="item.icon" size="22px" /><text class="task-card__count">{{
              item.count
            }}</text></view
          ><text>{{ item.label }}</text></view
        ></view
      >

      <view class="section-heading"
        ><text class="section-heading__title">快捷操作</text
        ><text class="section-heading__desc">常用功能，一步直达</text></view
      >
      <view class="quick-card"
        ><view
          v-for="item in quickActions"
          :key="item.label"
          class="quick-card__item"
          @click="comingSoon(item.label)"
          ><view :style="{ color: item.color, backgroundColor: `${item.color}12` }"
            ><wd-icon :name="item.icon" size="23px" /></view
          ><text>{{ item.label }}</text></view
        ></view
      >

      <view class="section-heading"
        ><text class="section-heading__title">今日生产</text
        ><view class="demo-label">演示数据</view></view
      >
      <view v-if="dashboard" class="metric-card"
        ><view class="metric-card__head"
          ><text>生产概览</text
          ><text>较昨日 <text class="metric-card__up">↑ 5.2%</text></text></view
        ><view class="metric-grid"
          ><view v-for="metric in dashboard.metrics" :key="metric.label"
            ><text class="metric-grid__label">{{ metric.label }}</text
            ><view class="metric-grid__value">{{ metric.value }}</view
            ><view class="metric-grid__progress"
              ><view
                :style="{
                  width: `${Math.min(Number.parseFloat(metric.value), 100)}%`,
                }" /></view></view></view
      ></view>

      <view class="section-heading"
        ><text class="section-heading__title">近七日产量</text
        ><view class="chart-legend"><text />实际产量</view></view
      >
      <view class="chart-card"><AppChart :option="productionTrend" height="190px" /></view>

      <view class="section-heading"
        ><text class="section-heading__title">待办事项</text
        ><text class="section-heading__link" @click="openWorkbench"
          >查看全部 <wd-icon name="arrow-right" size="12px" /></text
      ></view>
      <view class="todo-card"
        ><wd-cell-group :border="false"
          ><wd-cell
            v-for="task in dashboard?.pendingTasks ?? []"
            :key="task.id"
            :title="task.title"
            :label="task.id"
            :value="task.priority"
            :custom-style="taskStyle"
            clickable
            @click="comingSoon(task.title)"
            ><template #icon><view class="todo-card__marker" /></template></wd-cell></wd-cell-group
        ><AppEmpty v-if="!loading && !dashboard?.pendingTasks.length"
      /></view>
      <view class="dashboard-content__footer">数据驱动制造 · 协同创造价值</view>
    </view>
    <AppTabBar current="dashboard" />
  </view>
</template>

<style scoped lang="scss">
.dashboard-page {
  background: #f4f7f9;
}
.home-hero {
  padding: 44rpx 32rpx 68rpx;
  color: #fff;
  background: linear-gradient(125deg, #102a43, #174458 72%, #176464);
  border-radius: 0 0 36rpx 36rpx;
}
.home-hero__nav,
.home-hero__welcome,
.shift-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.factory-brand {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 25rpx;
  font-weight: 500;
  letter-spacing: 1rpx;
}
.factory-brand__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48rpx;
  height: 48rpx;
  color: #6ee7d0;
  border-radius: 13rpx;
  background: rgba(255, 255, 255, 0.09);
}
.home-hero__notification {
  position: relative;
  padding: 10rpx;
  color: #c4d7df;
}
.notification-dot {
  position: absolute;
  top: 8rpx;
  right: 10rpx;
  width: 10rpx;
  height: 10rpx;
  border: 3rpx solid #173f51;
  border-radius: 50%;
  background: #5de2c2;
}
.home-hero__welcome {
  margin-top: 42rpx;
}
.home-hero__greeting {
  display: block;
  font-size: 40rpx;
  font-weight: 600;
  letter-spacing: 2rpx;
}
.home-hero__factory {
  display: flex;
  align-items: center;
  gap: 5rpx;
  margin-top: 14rpx;
  font-size: 23rpx;
  color: #b0c8d2;
}
.home-hero__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 82rpx;
  height: 82rpx;
  color: #bff1e2;
  font-size: 33rpx;
  border: 2rpx solid rgba(166, 232, 215, 0.3);
  border-radius: 50%;
  background: rgba(99, 206, 181, 0.17);
}
.shift-card {
  margin-top: 34rpx;
  padding: 24rpx;
  border: 1rpx solid rgba(154, 210, 209, 0.12);
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.065);
}
.shift-card__label {
  display: block;
  color: #a0bdc9;
  font-size: 20rpx;
}
.shift-card__value {
  display: block;
  margin-top: 9rpx;
  font-size: 28rpx;
}
.shift-card__value text {
  margin-left: 14rpx;
  color: #bbced5;
  font-size: 22rpx;
}
.shift-card__right {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #78ddc0;
  font-size: 21rpx;
}
.status-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: #65d9b6;
}
.shift-card__date {
  margin-left: 12rpx;
  color: #adc2cd;
}
.dashboard-content {
  padding: 0 24rpx 40rpx;
}
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 34rpx 6rpx 22rpx;
}
.section-heading__title {
  font-size: 31rpx;
  font-weight: 600;
  color: #233d51;
}
.section-heading__link {
  display: flex;
  align-items: center;
  gap: 6rpx;
  font-size: 22rpx;
  color: #8c9da9;
}
.section-heading__desc {
  color: #a1aeb9;
  font-size: 20rpx;
}
.task-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
}
.task-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18rpx;
  padding: 24rpx 6rpx;
  font-size: 22rpx;
  color: #647b8d;
  background: #fff;
  border: 1rpx solid #edf1f4;
  border-radius: 16rpx;
}
.task-card__icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 62rpx;
  height: 62rpx;
  border-radius: 18rpx;
}
.task-card__count {
  position: absolute;
  top: -12rpx;
  right: -15rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28rpx;
  height: 28rpx;
  color: #fff;
  font-size: 18rpx;
  border: 3rpx solid #fff;
  border-radius: 14rpx;
  background: #eb6b68;
}
.quick-card {
  display: flex;
  justify-content: space-around;
  padding: 28rpx 12rpx;
  border: 1rpx solid #e9eff1;
  border-radius: 18rpx;
  background: #fff;
}
.quick-card__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15rpx;
  color: #637a8a;
  font-size: 23rpx;
}
.quick-card__item view {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70rpx;
  height: 70rpx;
  border-radius: 20rpx;
}
.demo-label {
  padding: 5rpx 12rpx;
  font-size: 18rpx;
  color: #899eac;
  border-radius: 6rpx;
  background: #e9eff3;
}
.metric-card {
  padding: 26rpx;
  border-radius: 18rpx;
  background: #fff;
  border: 1rpx solid #e9eff1;
}
.metric-card__head {
  display: flex;
  justify-content: space-between;
  color: #3d5568;
  font-size: 24rpx;
}
.metric-card__head > text:last-child {
  font-size: 21rpx;
  color: #9aabb7;
}
.metric-card__up {
  color: #23a587;
}
.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28rpx 36rpx;
  margin-top: 30rpx;
}
.metric-grid__label {
  color: #8b9eab;
  font-size: 22rpx;
}
.metric-grid__value {
  margin-top: 9rpx;
  font-size: 39rpx;
  font-weight: 600;
  color: #243e53;
}
.metric-grid__progress {
  height: 6rpx;
  margin-top: 13rpx;
  border-radius: 4rpx;
  background: #edf2f4;
}
.metric-grid__progress view {
  height: 100%;
  border-radius: 4rpx;
  background: #38b69e;
}
.chart-legend {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #9aaab7;
  font-size: 20rpx;
}
.chart-legend text {
  width: 12rpx;
  height: 12rpx;
  background: #2385ba;
  border-radius: 3rpx;
}
.chart-card {
  padding: 20rpx 8rpx 6rpx;
  border: 1rpx solid #e9eff1;
  border-radius: 18rpx;
  background: #fff;
}
.todo-card {
  overflow: hidden;
  border: 1rpx solid #e9eff1;
  border-radius: 18rpx;
  background: #fff;
}
.todo-card__marker {
  width: 8rpx;
  height: 30rpx;
  margin-right: 15rpx;
  background: #36b69c;
  border-radius: 5rpx;
}
.dashboard-content__footer {
  margin-top: 40rpx;
  text-align: center;
  color: #b0bdc6;
  font-size: 20rpx;
  letter-spacing: 2rpx;
}
</style>
