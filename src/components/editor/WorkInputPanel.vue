<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const { t } = useI18n()

const inputValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const lineCount = computed(() => props.modelValue.split('\n').filter(l => l.trim()).length)
const charCount = computed(() => props.modelValue.length)

const tips = [
  t('write.tip1') || '每条工作内容单独一行，便于拆解',
  t('write.tip2') || '使用动词开头，如完成、推进、修复、参加',
  t('write.tip3') || '尽量包含具体结果或数据',
  t('write.tip4') || '中英文输入均可识别'
]

const currentTip = tips[Math.floor(Math.random() * tips.length)]
</script>

<template>
  <div class="work-input-panel">
    <div class="panel-header">
      <h3 class="panel-title">{{ t('write.inputTitle') }}</h3>
      <span class="panel-meta">{{ lineCount }} {{ t('write.lines') || '行' }} · {{ charCount }} {{ t('write.chars') || '字' }}</span>
    </div>

    <el-input
      v-model="inputValue"
      type="textarea"
      :rows="12"
      resize="none"
      :placeholder="t('write.inputPlaceholder')"
      class="work-textarea"
    />

    <div class="writing-tip">
      <el-icon><InfoFilled /></el-icon>
      <span>{{ currentTip }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.work-input-panel {
  @include glass-card;
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
}

.panel-meta {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.work-textarea {
  flex: 1;

  :deep(.el-textarea__inner) {
    background: var(--bg-soft);
    border-color: var(--border);
    color: var(--text);
    font-size: 1rem;
    line-height: 1.7;
    border-radius: var(--radius-sm);

    &::placeholder {
      color: var(--text-secondary);
    }

    &:focus {
      border-color: var(--primary);
    }
  }
}

.writing-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 14px;
  background: rgba(99, 102, 241, 0.08);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 0.875rem;

  .el-icon {
    color: var(--primary);
    flex-shrink: 0;
  }
}
</style>
