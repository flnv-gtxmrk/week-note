<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'
import 'echarts-wordcloud'
import { useHistoryStore } from '@/stores/historyStore'

const { t } = useI18n()
const historyStore = useHistoryStore()

const trendChartRef = ref<HTMLDivElement | null>(null)
const categoryChartRef = ref<HTMLDivElement | null>(null)
const keywordChartRef = ref<HTMLDivElement | null>(null)

const stats = computed(() => {
  const records = historyStore.records
  const total = records.length
  const avgScore = total > 0
    ? Math.round(records.reduce((sum, r) => sum + (r.fullReport.qualityScore || 0), 0) / total)
    : 0

  // Calculate weekly streak (simplified)
  const streak = total > 0 ? 1 : 0

  return { total, streak, avgScore }
})

const allKeywords = computed(() => {
  const map = new Map<string, number>()
  historyStore.records.forEach(r => {
    r.fullReport.keywords.forEach(k => {
      map.set(k, (map.get(k) || 0) + 1)
    })
  })
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([name, value]) => ({ name, value }))
})

function renderTrendChart() {
  if (!trendChartRef.value) return
  const chart = echarts.init(trendChartRef.value)
  const data = [...historyStore.records].reverse().map((r, i) => ({
    index: i + 1,
    score: r.fullReport.qualityScore || 0
  }))

  chart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: data.map(d => `#${d.index}`) },
    yAxis: { type: 'value', max: 100 },
    series: [{
      data: data.map(d => d.score),
      type: 'line',
      smooth: true,
      areaStyle: {
        color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(99, 102, 241, 0.4)' },
          { offset: 1, color: 'rgba(99, 102, 241, 0.05)' }
        ])
      },
      itemStyle: { color: '#6366f1' }
    }]
  })
}

function renderCategoryChart() {
  if (!categoryChartRef.value) return
  const chart = echarts.init(categoryChartRef.value)
  const categories: Record<string, number> = {}
  historyStore.records.forEach(r => {
    const input = r.fullReport.rawInput.toLowerCase()
    if (input.includes('开发') || input.includes('dev')) categories[t('dashboard.categoryDev') || '开发'] = (categories[t('dashboard.categoryDev') || '开发'] || 0) + 1
    if (input.includes('会议') || input.includes('meeting')) categories[t('dashboard.categoryMeeting') || '会议'] = (categories[t('dashboard.categoryMeeting') || '会议'] || 0) + 1
    if (input.includes('bug') || input.includes('修复')) categories[t('dashboard.categoryBug') || '修复'] = (categories[t('dashboard.categoryBug') || '修复'] || 0) + 1
    if (input.includes('文档') || input.includes('doc')) categories[t('dashboard.categoryDoc') || '文档'] = (categories[t('dashboard.categoryDoc') || '文档'] || 0) + 1
    if (Object.keys(categories).length === 0) categories[t('dashboard.categoryOther') || '其他'] = (categories[t('dashboard.categoryOther') || '其他'] || 0) + 1
  })

  chart.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: Object.entries(categories).map(([name, value]) => ({ name, value })),
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 }
    }]
  })
}

function renderKeywordChart() {
  if (!keywordChartRef.value) return
  const chart = echarts.init(keywordChartRef.value)
  chart.setOption({
    tooltip: { show: true },
    series: [{
      type: 'wordCloud',
      shape: 'circle',
      left: 'center',
      top: 'center',
      width: '90%',
      height: '90%',
      right: null,
      bottom: null,
      sizeRange: [14, 50],
      rotationRange: [-45, 45],
      rotationStep: 22.5,
      gridSize: 12,
      drawOutOfBound: false,
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        color: () => {
          const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']
          return colors[Math.floor(Math.random() * colors.length)]
        }
      },
      data: allKeywords.value
    }]
  })
}

onMounted(async () => {
  await historyStore.loadRecords()
  renderTrendChart()
  renderCategoryChart()
  renderKeywordChart()
})
</script>

<template>
  <div class="page-container">
    <h1 class="section-title">{{ t('dashboard.title') }}</h1>

    <div class="stats-grid">
      <div class="stat-card">
        <el-icon :size="32"><Document /></el-icon>
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">{{ t('dashboard.totalReports') }}</div>
      </div>
      <div class="stat-card">
        <el-icon :size="32"><Calendar /></el-icon>
        <div class="stat-value">{{ stats.streak }}</div>
        <div class="stat-label">{{ t('dashboard.weeklyStreak') }}</div>
      </div>
      <div class="stat-card">
        <el-icon :size="32"><Trophy /></el-icon>
        <div class="stat-value">{{ stats.avgScore }}</div>
        <div class="stat-label">{{ t('dashboard.avgScore') }}</div>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <h3>{{ t('dashboard.trendTitle') }}</h3>
        <div ref="trendChartRef" class="chart"></div>
      </div>
      <div class="chart-card">
        <h3>{{ t('dashboard.categoryTitle') }}</h3>
        <div ref="categoryChartRef" class="chart"></div>
      </div>
      <div class="chart-card wide">
        <h3>{{ t('dashboard.topKeywords') }}</h3>
        <div ref="keywordChartRef" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  @include glass-card;
  padding: 24px;
  text-align: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }

  .el-icon {
    color: var(--primary);
    margin-bottom: 12px;
  }
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 4px;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.chart-card {
  @include glass-card;
  padding: 24px;

  &.wide {
    grid-column: 1 / -1;
  }

  h3 {
    margin: 0 0 16px 0;
    font-size: 1.1rem;
    color: var(--text);
  }
}

.chart {
  width: 100%;
  height: 300px;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
