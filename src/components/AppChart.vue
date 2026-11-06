<template>
  <uni-echarts class="chart" :option="option" />
</template>

<script setup lang="ts">
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import type { EChartsOption } from 'echarts'
import { CanvasRenderer } from 'echarts/renderers'
import UniEcharts from 'uni-echarts'

echarts.use([
  GridComponent,
  TooltipComponent,
  LegendComponent,
  BarChart,
  LineChart,
  PieChart,
  CanvasRenderer,
])

defineProps<{
  option: EChartsOption
}>()
</script>

<style scoped>
.chart {
  display: block;
  width: 100%;
  height: 480rpx;
}
</style>
