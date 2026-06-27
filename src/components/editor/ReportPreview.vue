<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { WeeklyReport } from '@/types/report'

const props = defineProps<{ report: WeeklyReport | null; loading?: boolean }>()
const { t } = useI18n()

const scoreColor = computed(() => {
  const s = props.report?.qualityScore || 0
  if (s >= 80) return '#059669'
  if (s >= 60) return '#f59e0b'
  return '#ef4444'
})
const scoreLevel = computed(() => {
  const s = props.report?.qualityScore || 0
  if (s >= 80) return t('write.excellent')
  if (s >= 60) return t('write.good')
  return t('write.needsImprovement')
})
</script>

<template>
  <div class="report-preview card">
    <div class="preview-header">
      <h3>{{ t('write.previewTitle') }}</h3>
      <div v-if="report?.qualityScore !== undefined" class="score-badge">
        <span class="score-val" :style="{ color: scoreColor }">{{ report.qualityScore }}</span>
        <span class="score-lvl" :style="{ color: scoreColor }">{{ scoreLevel }}</span>
      </div>
    </div>

    <div v-if="loading" class="empty">⏳ {{ t('common.loading') }}</div>
    <div v-else-if="!report" class="empty">📝 {{ t('write.emptyPreview') }}</div>
    <div v-else class="preview-content">
      <div v-for="s in report.sections.slice().sort((a: any, b: any) => a.order - b.order)" :key="s.key" class="section">
        <h4>{{ s.title }}</h4>
        <pre>{{ s.content }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.report-preview { padding: 22px; min-height: 200px; margin-bottom: 20px; }
.preview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;
  h3 { margin: 0; font-size: 15px; font-weight: 700; }
}
.score-badge { display: flex; align-items: center; gap: 4px; padding: 4px 12px; background: $bg; border-radius: $radius-round; }
.score-val { font-size: 22px; font-weight: 800; }
.score-lvl { font-size: 12px; font-weight: 600; }
.empty { flex: 1; display: flex; align-items: center; justify-content: center; color: $text-secondary; font-size: 14px; }
.section { margin-bottom: 18px;
  h4 { margin: 0 0 8px; font-size: 14px; font-weight: 700; color: $primary; padding-bottom: 6px; border-bottom: 1px solid $border; }
  pre { margin: 0; font-family: $font; white-space: pre-wrap; line-height: 1.6; font-size: 14px; color: $text; }
}
</style>
