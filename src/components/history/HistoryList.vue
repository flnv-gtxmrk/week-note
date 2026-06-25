<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessageBox } from 'element-plus'
import { useHistoryStore } from '@/stores/historyStore'
import type { HistoryRecord } from '@/types/report'

const { t } = useI18n()
const historyStore = useHistoryStore()
const searchQuery = ref('')
const filteredRecords = ref<HistoryRecord[]>([])

onMounted(() => {
  historyStore.loadRecords().then(filter)
})

async function filter() {
  if (!searchQuery.value.trim()) {
    filteredRecords.value = historyStore.records
  } else {
    filteredRecords.value = await historyStore.searchRecords(searchQuery.value)
  }
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString()
}

async function deleteRecord(id: string) {
  try {
    await ElMessageBox.confirm(t('history.deleteConfirm'), t('common.confirm'), {
      confirmButtonText: t('common.delete'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    })
    await historyStore.deleteRecord(id)
  } catch {
    // cancelled
  }
}

const emit = defineEmits<{
  (e: 'load', record: HistoryRecord): void
}>()

function loadRecord(record: HistoryRecord) {
  emit('load', record)
}
</script>

<template>
  <div class="history-list">
    <div class="history-search">
      <el-input
        v-model="searchQuery"
        :placeholder="t('history.search') || '搜索历史记录'"
        clearable
        @input="filter"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <div v-if="filteredRecords.length === 0" class="history-empty">
      <el-icon :size="48"><Calendar /></el-icon>
      <p>{{ t('common.empty') }}</p>
    </div>

    <div v-else class="history-cards">
      <div
        v-for="record in filteredRecords"
        :key="record.id"
        class="history-card"
      >
        <div class="history-card-header">
          <div class="history-date">
            <el-icon><Clock /></el-icon>
            <span>{{ formatDate(record.createdAt) }}</span>
          </div>
          <div class="history-tags">
            <el-tag
              v-for="tag in record.tags.slice(0, 3)"
              :key="tag"
              size="small"
              type="primary"
              effect="plain"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>

        <div class="history-preview">
          <h4>{{ record.reportTitle }}</h4>
          <p>{{ record.preview }}</p>
        </div>

        <div class="history-actions">
          <el-button
            type="primary"
            size="small"
            @click="loadRecord(record)"
          >
            {{ t('history.load') }}
          </el-button>
          <el-button
            type="danger"
            size="small"
            plain
            @click="deleteRecord(record.id)"
          >
            {{ t('common.delete') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.history-list {
  width: 100%;
}

.history-search {
  margin-bottom: 20px;

  .el-input {
    max-width: 400px;
  }
}

.history-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--text-secondary);
  gap: 16px;
}

.history-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-card {
  @include glass-card;
  padding: 20px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.history-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 10px;
}

.history-date {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.875rem;

  .el-icon {
    color: var(--primary);
  }
}

.history-tags {
  display: flex;
  gap: 6px;
}

.history-preview {
  margin-bottom: 16px;

  h4 {
    margin: 0 0 8px 0;
    font-size: 1.1rem;
    color: var(--text);
  }

  p {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.6;
    font-size: 0.95rem;
  }
}

.history-actions {
  display: flex;
  gap: 10px;
}
</style>
