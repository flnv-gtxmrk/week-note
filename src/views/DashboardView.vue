<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'
import 'echarts-wordcloud'
import { useHistoryStore } from '@/stores/historyStore'

const { t } = useI18n()
const historyStore = useHistoryStore()

const trendRef = ref<HTMLDivElement>()
const typeChartRef = ref<HTMLDivElement>()
const cloudRef = ref<HTMLDivElement>()

const stats = computed(() => {
  const records = historyStore.records
  const total = records.length
  const avgScore = total > 0 ? Math.round(records.reduce((s, r) => s + (r.fullReport.qualityScore || 0), 0) / total) : 0
  const dailyCount = records.filter(r => r.fullReport?.reportType === 'daily').length
  const weeklyCount = records.filter(r => r.fullReport?.reportType === 'weekly').length
  const monthlyCount = records.filter(r => r.fullReport?.reportType === 'monthly').length
  const streak = total > 0 ? 1 : 0
  return { total, dailyCount, weeklyCount, monthlyCount, streak, avgScore }
})

const allKeywords = computed(() => {
  const map = new Map<string, number>()
  historyStore.records.forEach(r => r.fullReport?.keywords?.forEach(k => map.set(k, (map.get(k) || 0) + 1)))
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 30).map(([name, value]) => ({ name, value }))
})

function renderTrend() {
  if (!trendRef.value) return
  const c = echarts.init(trendRef.value)
  const data = [...historyStore.records].reverse().map((r, i) => ({ i: i + 1, s: r.fullReport?.qualityScore || 0, type: r.fullReport?.reportType || 'weekly' }))
  c.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: [t('reportType.daily'), t('reportType.weekly'), t('reportType.monthly')], bottom: 0, textStyle: { fontSize: 11 } },
    xAxis: { type: 'category', data: data.map(d => `#${d.i}`), show: false },
    yAxis: { type: 'value', max: 100, show: false },
    series: [
      { name: t('reportType.daily'), data: data.map(d => d.type === 'daily' ? d.s : null), type: 'line', smooth: true, connectNulls: false, itemStyle: { color: '#059669' }, lineStyle: { color: '#059669' }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(5,150,105,0.2)' }, { offset: 1, color: 'rgba(5,150,105,0)' }] } } },
      { name: t('reportType.weekly'), data: data.map(d => d.type === 'weekly' ? d.s : null), type: 'line', smooth: true, connectNulls: false, itemStyle: { color: '#7c3aed' }, lineStyle: { color: '#7c3aed' }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(124,58,237,0.2)' }, { offset: 1, color: 'rgba(124,58,237,0)' }] } } },
      { name: t('reportType.monthly'), data: data.map(d => d.type === 'monthly' ? d.s : null), type: 'line', smooth: true, connectNulls: false, itemStyle: { color: '#3b82f6' }, lineStyle: { color: '#3b82f6' }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(59,130,246,0.2)' }, { offset: 1, color: 'rgba(59,130,246,0)' }] } } }
    ],
    grid: { left: 0, right: 0, top: 24, bottom: 28 }
  })
}

function renderTypeChart() {
  if (!typeChartRef.value) return
  const c = echarts.init(typeChartRef.value)
  c.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie', radius: ['45%', '72%'],
      data: [
        { name: t('reportType.daily'), value: stats.value.dailyCount, itemStyle: { color: '#059669' } },
        { name: t('reportType.weekly'), value: stats.value.weeklyCount, itemStyle: { color: '#7c3aed' } },
        { name: t('reportType.monthly'), value: stats.value.monthlyCount, itemStyle: { color: '#3b82f6' } }
      ],
      label: { fontSize: 12, fontWeight: 600 },
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 }
    }]
  })
}

function renderCloud() {
  if (!cloudRef.value || allKeywords.value.length === 0) return
  const c = echarts.init(cloudRef.value)
  c.setOption({
    series: [{
      type: 'wordCloud', shape: 'circle', left: 'center', top: 'center',
      sizeRange: [14, 44], rotationRange: [-30, 30], gridSize: 10,
      textStyle: { fontWeight: 'bold', color: () => ['#7c3aed','#a78bfa','#059669','#3b82f6','#ec4899'][Math.floor(Math.random() * 5)] },
      data: allKeywords.value
    }]
  })
}

onMounted(async () => {
  await historyStore.loadRecords()
  renderTrend()
  renderTypeChart()
  renderCloud()
})
</script>

<template>
  <div class="page-container">
    <h1 class="section-title">{{ t('dashboard.title') }}</h1>

    <div class="stats-row">
      <div class="stat-card card">
        <div class="stat-icon si-purple">📝</div>
        <div><div class="stat-val">{{ stats.total }}</div><div class="stat-lbl">{{ t('dashboard.totalReports') }}</div></div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon si-green">📅</div>
        <div><div class="stat-val">{{ stats.dailyCount }}</div><div class="stat-lbl">{{ t('dashboard.dailyCount') }}</div></div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon si-lavender">📋</div>
        <div><div class="stat-val">{{ stats.weeklyCount }}</div><div class="stat-lbl">{{ t('dashboard.weeklyCount') }}</div></div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon si-blue">📊</div>
        <div><div class="stat-val">{{ stats.monthlyCount }}</div><div class="stat-lbl">{{ t('dashboard.monthlyCount') }}</div></div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon si-yellow">⭐</div>
        <div><div class="stat-val">{{ stats.avgScore }}</div><div class="stat-lbl">{{ t('dashboard.avgScore') }}</div></div>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card card">
        <h3>{{ t('dashboard.trendTitle') }}</h3>
        <div ref="trendRef" style="height:200px"></div>
      </div>
      <div class="chart-card card">
        <h3>{{ t('dashboard.categoryTitle') }}</h3>
        <div ref="typeChartRef" style="height:200px"></div>
      </div>
    </div>

    <div class="chart-card card" style="margin-top:16px">
      <h3>{{ t('dashboard.topKeywords') }}</h3>
      <div ref="cloudRef" style="height:220px"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stats-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 18px; }
.stat-card { padding: 16px; display: flex; align-items: center; gap: 12px; }
.stat-icon { width: 42px; height: 42px; border-radius: $radius-sm; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.si-purple { background: $primary-lighter; }
.si-green { background: $success-lt; }
.si-lavender { background: #ede9fe; }
.si-blue { background: $info-lt; }
.si-yellow { background: $warning-bg; }
.stat-val { font-size: 22px; font-weight: 800; }
.stat-lbl { font-size: 11px; color: $text-secondary; }
.charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.chart-card { padding: 20px; h3 { margin: 0 0 12px; font-size: 14px; font-weight: 700; } }
@media (max-width: 768px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .charts-grid { grid-template-columns: 1fr; }
}
</style>
