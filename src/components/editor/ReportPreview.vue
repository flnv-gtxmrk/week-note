<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { WeeklyReport } from '@/types/report'

const props = defineProps<{
  report: WeeklyReport | null
  loading?: boolean
}>()

const { t } = useI18n()

const scoreColor = computed(() => {
  const score = props.report?.qualityScore || 0
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
})

const scoreLevel = computed(() => {
  const score = props.report?.qualityScore || 0
  if (score >= 80) return t('write.excellent') || '优秀'
  if (score >= 60) return t('write.good') || '良好'
  return t('write.needsImprovement') || '待提升'
})
</script>

<template>
  <div class="report-preview">
    <div class="preview-header">
      <h3 class="panel-title">{{ t('write.previewTitle') }}</h3>
      <div v-if="report?.qualityScore !== undefined" class="quality-badge">
        <span class="score-label">{{ t('write.qualityScore') }}</span>
        <span class="score-value" :style="{ color: scoreColor }">{{ report.qualityScore }}</span>
        <span class="score-level" :style="{ color: scoreColor }">{{ scoreLevel }}</span>
      </div>
    </div>

    <div v-if="loading" class="preview-loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>{{ t('common.loading') }}</span>
    </div>

    <div v-else-if="!report" class="preview-empty">
      <el-icon :size="48"><Document /></el-icon>
      <p>{{ t('write.emptyPreview') || '输入工作内容并点击生成周报' }}</p>
    </div>

    <div v-else class="preview-content">
      <div
        v-for="section in report.sections.slice().sort((a, b) => a.order - b.order)"
        :key="section.key"
        class="preview-section"
      >
        <h4 class="section-title">{{ section.title }}</h4>
        <pre class="section-body">{{ section.content }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.report-preview {
  @include glass-card;
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 400px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.panel-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
}

.quality-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: var(--bg-soft);
  border-radius: 999px;
  font-size: 0.875rem;
}

.score-value {
  font-size: 1.25rem;
  font-weight: 800;
}

.score-level {
  font-weight: 600;
}

.preview-loading,
.preview-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  gap: 16px;

  .el-icon.is-loading {
    animation: rotate 1s linear infinite;
  }
}

.preview-content {
  flex: 1;
  overflow-y: auto;
}

.preview-section {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  margin: 0 0 10px 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.section-body {
  margin: 0;
  font-family: inherit;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.7;
  color: var(--text);
  font-size: 0.95rem;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
