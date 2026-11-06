<template>
  <view class="dashboard">
    <view class="hero">
      <view>
        <text class="hero__eyebrow">{{ factoryName }}</text>
        <text class="hero__title">生产运营驾驶舱</text>
      </view>
      <view class="hero__date">
        <text class="hero__date-label">数据日期</text>
        <text class="hero__date-value">{{ dashboard?.date || '今日' }}</text>
      </view>
    </view>

    <view v-if="loading" class="card loading-card">
      <wd-loading size="32px" />
      <text class="text-secondary">正在汇总生产数据...</text>
    </view>

    <template v-else-if="dashboard">
      <view class="metrics">
        <view v-for="metric in dashboard.metrics" :key="metric.label" class="metric">
          <view class="metric__label">
            <view class="metric__dot" :class="`metric__dot--${metric.tone}`" />
            <text>{{ metric.label }}</text>
          </view>
          <text class="metric__value">{{ metric.value }}</text>
          <text class="metric__trend">{{ metric.trend }}</text>
        </view>
      </view>

      <view class="card chart-card">
        <view class="section-header">
          <view>
            <text class="section-title">本周生产达成</text>
            <text class="text-secondary">产量与目标对比 · 单位：件</text>
          </view>
          <wd-tag type="success" plain>实时</wd-tag>
        </view>
        <app-chart :option="outputOption" />
        <view class="chart-note">
          <text>周累计 {{ totalOutput.toLocaleString() }} 件</text>
          <text class="text-positive">达成率 {{ achievementRate }}%</text>
        </view>
      </view>

      <view class="card chart-card">
        <view class="section-header">
          <view>
            <text class="section-title">今日质量分析</text>
            <text class="text-secondary">首检与过程检汇总</text>
          </view>
          <wd-button size="small" plain @click="loadData">刷新</wd-button>
        </view>
        <app-chart :option="qualityOption" />
      </view>

      <view class="card task-card">
        <view class="section-header">
          <text class="section-title">待办任务</text>
          <text class="text-secondary">{{ dashboard.pendingTasks.length }} 项待处理</text>
        </view>
        <app-empty v-if="!dashboard.pendingTasks.length" />
        <view v-for="task in dashboard.pendingTasks" :key="task.id" class="task">
          <view class="task__body">
            <text class="task__title">{{ task.title }}</text>
            <text class="task__id">{{ task.id }}</text>
          </view>
          <wd-tag :type="task.priority === '高' ? 'danger' : 'warning'" plain>
            {{ task.priority }}优先级
          </wd-tag>
          <uni-icons type="right" size="16" color="#a1aaba" />
        </view>
      </view>
    </template>

    <view v-else class="card error-card">
      <uni-icons type="info" size="40" color="#ed8b1b" />
      <text class="section-title">暂时无法获取数据</text>
      <text class="text-secondary">请检查网络后重试</text>
      <wd-button type="primary" @click="loadData">重新加载</wd-button>
    </view>
    <wd-toast />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { EChartsOption } from 'echarts'
import { onPullDownRefresh, onShow } from '@dcloudio/uni-app'
import { getDashboard } from '@/api/dashboard'
import { useUserStore } from '@/stores/modules/user'
import type { DashboardData } from '@/types/api'
import { notifyError } from '@/utils/error'
import AppChart from '@/components/AppChart.vue'
import AppEmpty from '@/components/AppEmpty.vue'

const dashboard = ref<DashboardData | null>(null)
const loading = ref(true)
const userStore = useUserStore()
const factoryName = computed(() => userStore.profile?.factoryName || '华东智能制造工厂')

async function loadData() {
  loading.value = true
  try {
    dashboard.value = await getDashboard()
  } catch (error) {
    dashboard.value = null
    notifyError(error)
  } finally {
    loading.value = false
    uni.stopPullDownRefresh()
  }
}

onShow(loadData)
onPullDownRefresh(loadData)

const totalOutput = computed(
  () => dashboard.value?.dailyOutput.reduce((total, item) => total + item.output, 0) || 0,
)
const achievementRate = computed(() => {
  const target = dashboard.value?.dailyOutput.reduce((total, item) => total + item.target, 0) || 0
  return target ? ((totalOutput.value / target) * 100).toFixed(1) : '0.0'
})

const outputOption = computed<EChartsOption>(() => ({
  animationDuration: 600,
  color: ['#246bfd', '#a8c1ff'],
  grid: { left: 12, right: 16, top: 56, bottom: 12, containLabel: true },
  legend: { top: 0, right: 0, itemWidth: 12, itemHeight: 8, textStyle: { color: '#7a8499' } },
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: dashboard.value?.dailyOutput.map((item) => item.date) || [],
    axisLine: { lineStyle: { color: '#e7eaf0' } },
    axisTick: { show: false },
    axisLabel: { color: '#7a8499', fontSize: 10 },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#edf0f5', type: 'dashed' } },
    axisLabel: { color: '#a1aaba', fontSize: 10 },
  },
  series: [
    {
      name: '实际产量',
      type: 'bar',
      barWidth: 14,
      itemStyle: { borderRadius: [4, 4, 0, 0] },
      data: dashboard.value?.dailyOutput.map((item) => item.output) || [],
    },
    {
      name: '计划目标',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 2 },
      data: dashboard.value?.dailyOutput.map((item) => item.target) || [],
    },
  ],
}))

const qualityOption = computed<EChartsOption>(() => ({
  animationDuration: 600,
  color: ['#12a182', '#ed8b1b', '#e34d59'],
  tooltip: { trigger: 'item' },
  legend: { bottom: 12, icon: 'circle', itemWidth: 8, itemHeight: 8 },
  series: [
    {
      name: '检验结果',
      type: 'pie',
      center: ['50%', '43%'],
      radius: ['42%', '65%'],
      avoidLabelOverlap: true,
      itemStyle: { borderColor: '#fff', borderWidth: 3, borderRadius: 6 },
      label: { formatter: '{b}\n{d}%', color: '#5b667a', fontSize: 11 },
      data: dashboard.value?.quality || [],
    },
  ],
}))
</script>

<style lang="scss" scoped>
.dashboard {
  min-height: 100vh;
  padding: 0 32rpx 40rpx;
}

.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 42rpx 4rpx 36rpx;
  gap: 24rpx;

  &__eyebrow,
  &__title {
    display: block;
  }

  &__eyebrow {
    margin-bottom: 10rpx;
    color: $color-text-secondary;
    font-size: 24rpx;
  }

  &__title {
    font-size: 42rpx;
    font-weight: 700;
    letter-spacing: 1rpx;
  }

  &__date {
    padding: 12rpx 18rpx;
    text-align: center;
    background: #e9efff;
    border-radius: 16rpx;

    &-label,
    &-value {
      display: block;
      white-space: nowrap;
    }

    &-label {
      margin-bottom: 4rpx;
      color: #6881b5;
      font-size: 20rpx;
    }

    &-value {
      color: #246bfd;
      font-size: 24rpx;
      font-weight: 600;
    }
  }
}

.metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.metric {
  width: calc(50% - 10rpx);
  padding: 26rpx;
  background: #fff;
  border-radius: 20rpx;

  &__label {
    display: flex;
    align-items: center;
    color: $color-text-secondary;
    font-size: 24rpx;
    gap: 10rpx;
  }

  &__dot {
    width: 12rpx;
    height: 12rpx;
    background: $uni-color-primary;
    border-radius: 50%;

    &--success {
      background: $uni-color-success;
    }

    &--warning {
      background: $uni-color-warning;
    }
  }

  &__value,
  &__trend {
    display: block;
  }

  &__value {
    margin: 18rpx 0 8rpx;
    font-size: 44rpx;
    font-weight: 700;
  }

  &__trend {
    color: #8a94a6;
    font-size: 22rpx;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16rpx;
}

.chart-card {
  padding: 28rpx 20rpx 22rpx;

  .section-header {
    padding: 0 12rpx;
  }
}

.chart-note {
  display: flex;
  justify-content: space-between;
  padding: 0 12rpx;
  color: $color-text-secondary;
  font-size: 24rpx;
}

.text-positive {
  color: $uni-color-success;
}

.task {
  display: flex;
  align-items: center;
  padding: 26rpx 0;
  border-bottom: 1rpx solid #edf0f5;
  gap: 18rpx;

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__title,
  &__id {
    display: block;
  }

  &__title {
    margin-bottom: 8rpx;
    font-size: 26rpx;
  }

  &__id {
    color: $color-text-secondary;
    font-size: 22rpx;
  }
}

.loading-card,
.error-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 96rpx 24rpx;
  gap: 24rpx;
}
</style>
