<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessageBox } from 'element-plus'
import { useHistoryStore } from '@/stores/historyStore'
import { useReportStore } from '@/stores/reportStore'
import { useRouter } from 'vue-router'
import type { HistoryRecord, ReportType } from '@/types/report'

const { t, locale } = useI18n()
const router = useRouter()
const historyStore = useHistoryStore()
const reportStore = useReportStore()

const searchQuery = ref('')
const filterType = ref<'all' | ReportType>('all')
const showDetail = ref(false)
const detailRecord = ref<HistoryRecord | null>(null)

onMounted(() => { historyStore.loadRecords() })

const filteredRecords = computed(() => {
  let list = historyStore.records
  if (filterType.value !== 'all') {
    list = list.filter(r => r.fullReport?.reportType === filterType.value)
  }
  if (searchQuery.value.trim()) {
    list = historyStore.searchRecords(searchQuery.value).filter(r =>
      filterType.value === 'all' || r.fullReport?.reportType === filterType.value
    )
  }
  return list
})

const groupedRecords = computed(() => {
  const groups: Record<string, HistoryRecord[]> = {}
  for (const r of filteredRecords.value) {
    const d = r.date || new Date(r.createdAt).toLocaleDateString()
    if (!groups[d]) groups[d] = []
    groups[d].push(r)
  }
  return Object.entries(groups).sort((a, b) => {
    const da = a[1][0]?.createdAt || 0
    const db = b[1][0]?.createdAt || 0
    return db - da
  })
})

function loadRecord(record: HistoryRecord) {
  reportStore.loadReport(record.fullReport)
  router.push('/write')
}

function openDetail(record: HistoryRecord) {
  detailRecord.value = record
  showDetail.value = true
}

function deleteRecord(id: string) {
  ElMessageBox.confirm(t('history.deleteConfirm'), t('common.confirm'), {
    confirmButtonText: t('common.delete'), cancelButtonText: t('common.cancel'), type: 'warning'
  }).then(() => historyStore.deleteRecord(id)).catch(() => {})
}

function formatTime(ts: number) {
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const typeLabels: Record<string, { zh: string; en: string }> = {
  'daily-standard': { zh: '标准日报', en: 'Standard Daily' },
  'daily-minimal': { zh: '极简日报', en: 'Quick Daily' },
  'daily-learn': { zh: '学习日报', en: 'Learning Daily' },
  'standard': { zh: '标准周报', en: 'Standard Weekly' },
  'star': { zh: 'STAR 法', en: 'STAR Method' },
  'minimal': { zh: '极简版', en: 'Minimalist' },
  'manager': { zh: '管理者视角', en: 'Manager View' },
  'okr': { zh: 'OKR 复盘', en: 'OKR Review' },
  'sprint': { zh: '敏捷迭代回顾', en: 'Sprint Retro' },
  'monthly-standard': { zh: '标准月报', en: 'Standard Monthly' },
  'monthly-okr': { zh: '月度 OKR 复盘', en: 'Monthly OKR' },
  'monthly-growth': { zh: '成长月报', en: 'Growth Monthly' }
}

function tmplName(record: HistoryRecord) {
  const id = record.fullReport?.templateId || ''
  const n = typeLabels[id]
  return n ? (locale.value === 'zh-CN' ? n.zh : n.en) : id
}

function typeIcon(record: HistoryRecord) {
  const rt = record.fullReport?.reportType
  if (rt === 'daily') return '📅'
  if (rt === 'monthly') return '📊'
  return '📋'
}

const filterTabs = [
  { value: 'all' as const, labelKey: 'history.all', icon: '📁' },
  { value: 'daily' as const, labelKey: 'history.daily', icon: '📅' },
  { value: 'weekly' as const, labelKey: 'history.weekly', icon: '📋' },
  { value: 'monthly' as const, labelKey: 'history.monthly', icon: '📊' }
]
</script>

<template>
  <div class="page-container">
    <div class="header">
      <div>
        <h1 class="section-title">{{ t('history.title') }}</h1>
        <p class="section-subtitle">{{ t('history.subtitle') }}</p>
      </div>
      <input v-model="searchQuery" :placeholder="t('history.search')" class="search-input">
    </div>

    <!-- Type filter -->
    <div class="filter-tabs">
      <button
        v-for="tab in filterTabs"
        :key="tab.value"
        class="filter-tab"
        :class="{ active: filterType === tab.value }"
        @click="filterType = tab.value"
      >
        <span>{{ tab.icon }}</span>
        {{ t(tab.labelKey) }}
      </button>
    </div>

    <div v-if="groupedRecords.length === 0" class="empty-state">
      <span style="font-size:48px">📋</span>
      <p>{{ t('common.empty') }}</p>
    </div>

    <div v-else class="history-groups">
      <div v-for="([date, items]) in groupedRecords" :key="date" class="date-group">
        <div class="date-header">
          <span class="date-dot"></span>
          <span class="date-text">{{ date }}</span>
          <span class="date-count">{{ items.length }}</span>
        </div>
        <div class="date-items">
          <div v-for="r in items" :key="r.id" class="history-card card">
            <div class="card-row">
              <div class="card-time">{{ formatTime(r.createdAt) }}</div>
              <div class="card-main">
                <div class="card-title">
                  <span class="type-badge">{{ typeIcon(r) }}</span>
                  {{ r.reportTitle }}
                </div>
                <div class="card-preview">{{ r.preview }}</div>
                <div class="card-meta">
                  <span class="meta-tmpl">📄 {{ tmplName(r) }}</span>
                  <span v-for="tag in (r.tags || []).slice(0, 3)" :key="tag" class="meta-tag">{{ tag }}</span>
                </div>
              </div>
              <div class="card-actions">
                <button class="act-btn" @click.stop="openDetail(r)">👁</button>
                <button class="act-btn primary" @click.stop="loadRecord(r)">↩</button>
                <button class="act-btn danger" @click.stop="deleteRecord(r.id)">×</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showDetail && detailRecord" class="modal-overlay" @click.self="showDetail = false">
        <div class="detail-modal card">
          <div class="detail-header">
            <div>
              <h2>{{ detailRecord.reportTitle }}</h2>
              <p class="detail-date">📅 {{ detailRecord.date }} · {{ tmplName(detailRecord) }}</p>
            </div>
            <button class="close-btn" @click="showDetail = false">×</button>
          </div>
          <div class="detail-tags" v-if="detailRecord.tags?.length">
            <span v-for="tag in detailRecord.tags" :key="tag" class="meta-tag">{{ tag }}</span>
          </div>
          <div class="detail-body">
            <div v-if="detailRecord.fullReport?.qualityScore !== undefined" class="detail-score">
              {{ t('write.qualityScore') }}: <strong>{{ detailRecord.fullReport.qualityScore }}</strong>
            </div>
            <div v-for="sec in (detailRecord.fullReport?.sections || []).slice().sort((a: any, b: any) => a.order - b.order)" :key="sec.key" class="detail-section">
              <h4>{{ sec.title }}</h4>
              <pre>{{ sec.content }}</pre>
            </div>
          </div>
          <div class="detail-footer">
            <button class="tb-btn primary" @click="loadRecord(detailRecord!); showDetail = false">{{ t('history.load') }}</button>
            <button class="tb-btn" @click="showDetail = false">{{ t('common.close') }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.search-input {
  padding: 8px 14px; border: 1px solid $border; border-radius: $radius-sm;
  background: $bg-card; font-size: 13px; font-family: $font; color: $text; width: 220px;
  &:focus { outline: none; border-color: $primary; }
}
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 80px 20px; color: $text-secondary; p { margin-top: 12px; } }

.filter-tabs { display: flex; gap: 6px; margin-bottom: 20px; }
.filter-tab {
  display: flex; align-items: center; gap: 4px;
  padding: 7px 14px; border-radius: $radius-round;
  border: 1px solid $border; background: $bg-card;
  font-size: 12px; font-weight: 500; color: $text-secondary; cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: $primary-light; }
  &.active { border-color: $primary; background: $primary-lighter; color: $primary; font-weight: 600; }
}

.history-groups { display: flex; flex-direction: column; gap: 24px; }
.date-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding-left: 4px; }
.date-dot { width: 10px; height: 10px; border-radius: 50%; background: $primary; flex-shrink: 0; }
.date-text { font-size: 14px; font-weight: 700; color: $text; }
.date-count { padding: 2px 8px; border-radius: $radius-round; background: $primary-lighter; color: $primary; font-size: 11px; font-weight: 600; }
.date-items { display: flex; flex-direction: column; gap: 8px; padding-left: 22px; border-left: 2px solid $border; margin-left: 4px; }

.history-card { padding: 14px 18px; transition: all 0.15s; &:hover { box-shadow: $shadow-md; } }
.card-row { display: flex; gap: 14px; align-items: flex-start; }
.card-time { font-size: 12px; font-weight: 600; color: $text-tertiary; white-space: nowrap; min-width: 42px; padding-top: 2px; }
.card-main { flex: 1; min-width: 0; }
.card-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
.type-badge { font-size: 14px; }
.card-preview { font-size: 12px; color: $text-secondary; line-height: 1.5; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.card-meta { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; margin-top: 6px; }
.meta-tmpl { font-size: 11px; color: $text-secondary; }
.meta-tag { padding: 1px 7px; border-radius: $radius-round; font-size: 10px; font-weight: 600; background: $primary-lighter; color: $primary; }
.card-actions { display: flex; gap: 4px; flex-shrink: 0; }
.act-btn {
  width: 30px; height: 30px; border-radius: $radius-xs; border: 1px solid $border;
  background: $bg-card; cursor: pointer; display: flex; align-items: center;
  justify-content: center; font-size: 13px; transition: all 0.15s;
  &:hover { border-color: $primary; }
  &.primary:hover { background: $primary; color: #fff; border-color: $primary; }
  &.danger:hover { background: $danger-bg; color: $danger; border-color: $danger; }
}

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 100; display: flex; align-items: center; justify-content: center; }
.detail-modal { width: 600px; max-width: 95vw; max-height: 85vh; display: flex; flex-direction: column; overflow: hidden; padding: 0; }
.detail-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 22px 24px 0; h2 { margin: 0; font-size: 18px; } }
.detail-date { font-size: 12px; color: $text-secondary; margin-top: 4px; }
.close-btn { background: none; border: none; font-size: 20px; color: $text-secondary; cursor: pointer; padding: 4px; &:hover { color: $text; } }
.detail-tags { display: flex; gap: 4px; padding: 0 24px; flex-wrap: wrap; }
.detail-body { padding: 16px 24px; overflow-y: auto; flex: 1; }
.detail-score { padding: 8px 14px; background: $primary-lighter; border-radius: $radius-sm; font-size: 13px; margin-bottom: 16px; color: $primary; }
.detail-section { margin-bottom: 18px;
  h4 { margin: 0 0 8px; font-size: 13px; font-weight: 700; color: $primary; padding-bottom: 6px; border-bottom: 1px solid $border; }
  pre { margin: 0; font-family: $font; white-space: pre-wrap; line-height: 1.6; font-size: 13px; color: $text; }
}
.detail-footer { display: flex; gap: 8px; padding: 16px 24px; border-top: 1px solid $border; }
.tb-btn {
  padding: 8px 18px; border-radius: $radius-round; border: 1px solid $border;
  background: $bg; font-size: 13px; font-weight: 500; cursor: pointer; color: $text;
  &:hover { border-color: $primary; color: $primary; }
  &.primary { background: $primary; color: #fff; border-color: $primary; &:hover { background: $primary-dark; } }
}
</style>
