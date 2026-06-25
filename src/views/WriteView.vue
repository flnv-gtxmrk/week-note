<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useReportStore } from '@/stores/reportStore'
import { useTemplateStore } from '@/stores/templateStore'
import { useHistoryStore } from '@/stores/historyStore'
import { useWasmEngine } from '@/composables/useWasmEngine'
import WorkInputPanel from '@/components/editor/WorkInputPanel.vue'
import TemplateSelector from '@/components/editor/TemplateSelector.vue'
import ReportPreview from '@/components/editor/ReportPreview.vue'
import ActionToolbar from '@/components/editor/ActionToolbar.vue'

const { t } = useI18n()
const { ready } = useWasmEngine()
const reportStore = useReportStore()
const templateStore = useTemplateStore()
const historyStore = useHistoryStore()

onMounted(() => {
  templateStore.init()
  historyStore.loadRecords()
})

async function saveReport() {
  if (!reportStore.currentReport) return
  await historyStore.addReport(reportStore.currentReport)
  ElMessage.success(t('write.saved') || '已保存到历史记录')
}

function generate() {
  reportStore.generate()
}
</script>

<template>
  <div class="write-view">
    <div class="write-header">
      <h1 class="section-title">{{ t('write.title') }}</h1>
      <el-alert
        v-if="!ready"
        :title="t('write.engineLoading') || 'Java 引擎加载中...'"
        type="info"
        :closable="false"
        show-icon
      />
    </div>

    <div class="write-grid">
      <div class="input-column">
        <WorkInputPanel v-model="reportStore.inputText" />
      </div>

      <div class="template-column">
        <TemplateSelector />
      </div>

      <div class="preview-column">
        <ReportPreview
          :report="reportStore.currentReport"
          :loading="reportStore.isGenerating"
        />
      </div>
    </div>

    <div class="toolbar-wrapper">
      <ActionToolbar
        :report-text="reportStore.reportText"
        :disabled="!ready || reportStore.isGenerating"
        @generate="generate"
        @save="saveReport"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.write-view {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.write-header {
  margin-bottom: 24px;

  h1 {
    margin-bottom: 12px;
  }
}

.write-grid {
  display: grid;
  grid-template-columns: 1.5fr 0.8fr 1.5fr;
  gap: 24px;
  margin-bottom: 24px;
  align-items: start;
}

.input-column,
.template-column,
.preview-column {
  min-height: 500px;
}

.toolbar-wrapper {
  position: sticky;
  bottom: 24px;
  z-index: 10;
}

@media (max-width: 1024px) {
  .write-grid {
    grid-template-columns: 1fr 1fr;
  }

  .preview-column {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .write-grid {
    grid-template-columns: 1fr;
  }

  .input-column,
  .template-column,
  .preview-column {
    min-height: auto;
  }
}
</style>
