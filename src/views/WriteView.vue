<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useReportStore } from '@/stores/reportStore'
import { useTemplateStore } from '@/stores/templateStore'
import { useHistoryStore } from '@/stores/historyStore'
import type { ReportType } from '@/types/report'
import WorkInputPanel from '@/components/editor/WorkInputPanel.vue'
import TemplateSelector from '@/components/editor/TemplateSelector.vue'
import ReportPreview from '@/components/editor/ReportPreview.vue'
import ActionToolbar from '@/components/editor/ActionToolbar.vue'

const { t, locale } = useI18n()
const reportStore = useReportStore()
const templateStore = useTemplateStore()
const historyStore = useHistoryStore()

onMounted(() => {
  templateStore.init()
  historyStore.loadRecords()
})

const reportTypes: { value: ReportType; icon: string }[] = [
  { value: 'daily', icon: '📅' },
  { value: 'weekly', icon: '📋' },
  { value: 'monthly', icon: '📊' }
]

function switchType(type: ReportType) {
  templateStore.setReportType(type)
}

const inputPlaceholder = computed(() => {
  const key = `write.inputPlaceholder${templateStore.reportType.charAt(0).toUpperCase() + templateStore.reportType.slice(1)}` as any
  return t(key)
})

function generate() { reportStore.generate() }

async function saveReport() {
  if (!reportStore.currentReport) return
  historyStore.addReport(reportStore.currentReport)
  ElMessage.success(t('write.saved'))
}
</script>

<template>
  <div class="write-view">
    <div class="write-top">
      <h1 class="section-title">{{ t('write.title') }}</h1>
    </div>

    <!-- Report Type Tabs -->
    <div class="type-tabs">
      <button
        v-for="rt in reportTypes"
        :key="rt.value"
        class="type-tab"
        :class="{ active: templateStore.reportType === rt.value }"
        @click="switchType(rt.value)"
      >
        <span class="type-icon">{{ rt.icon }}</span>
        {{ t(`reportType.${rt.value}`) }}
      </button>
    </div>

    <div class="write-grid">
      <WorkInputPanel v-model="reportStore.inputText" :placeholder="inputPlaceholder" />
      <TemplateSelector />
    </div>

    <div class="generate-row">
      <button class="generate-btn" :disabled="reportStore.isGenerating" @click="generate">
        ✨ {{ reportStore.isGenerating ? t('common.loading') : t('write.generate') }}
      </button>
    </div>

    <ReportPreview
      :report="reportStore.currentReport"
      :loading="reportStore.isGenerating"
    />

    <ActionToolbar
      v-if="reportStore.currentReport"
      :report-text="reportStore.reportText"
      :disabled="reportStore.isGenerating"
      @generate="generate"
      @save="saveReport"
    />
  </div>
</template>

<style scoped lang="scss">
.write-view { max-width: 900px; margin: 0 auto; padding: 28px; }
.write-top { margin-bottom: 16px; }

.type-tabs { display: flex; gap: 6px; margin-bottom: 20px; }
.type-tab {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 20px; border-radius: $radius-round;
  border: 2px solid $border; background: $bg-card;
  font-size: 14px; font-weight: 600; color: $text-secondary;
  cursor: pointer; transition: all 0.15s;
  &:hover { border-color: $primary-light; color: $primary; }
  &.active { border-color: $primary; background: $primary-lighter; color: $primary; }
}
.type-icon { font-size: 16px; }

.write-grid { display: grid; grid-template-columns: 1.3fr 0.9fr; gap: 18px; margin-bottom: 16px; }

.generate-row { display: flex; justify-content: center; margin-bottom: 20px; }
.generate-btn {
  padding: 12px 32px; border-radius: $radius-round; border: none;
  background: $primary; color: #fff; font-size: 15px; font-weight: 600;
  cursor: pointer; transition: all 0.15s;
  &:hover:not(:disabled) { background: $primary-dark; transform: translateY(-1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

@media (max-width: 768px) {
  .write-grid { grid-template-columns: 1fr; }
  .type-tabs { flex-wrap: wrap; }
}
</style>
