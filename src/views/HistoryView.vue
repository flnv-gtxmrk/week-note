<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useReportStore } from '@/stores/reportStore'
import HistoryList from '@/components/history/HistoryList.vue'
import type { HistoryRecord } from '@/types/report'

const { t } = useI18n()
const router = useRouter()
const reportStore = useReportStore()

function loadToEditor(record: HistoryRecord) {
  reportStore.loadReport(record.fullReport)
  router.push('/write')
}
</script>

<template>
  <div class="page-container">
    <div class="history-header">
      <div>
        <h1 class="section-title">{{ t('history.title') }}</h1>
        <p class="history-subtitle">{{ t('history.subtitle') }}</p>
      </div>
    </div>

    <HistoryList @load="loadToEditor" />
  </div>
</template>

<style scoped lang="scss">
.history-header {
  margin-bottom: 24px;
}

.history-subtitle {
  margin: 0;
  color: var(--text-secondary);
}
</style>
