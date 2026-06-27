<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ modelValue: string; placeholder?: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
const { t } = useI18n()

const inputValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const lineCount = computed(() => props.modelValue.split('\n').filter(l => l.trim()).length)
const charCount = computed(() => props.modelValue.length)
</script>

<template>
  <div class="work-input card">
    <div class="panel-header">
      <h3>{{ t('write.inputTitle') }}</h3>
      <span class="meta">{{ lineCount }} {{ t('write.lines') }} · {{ charCount }} {{ t('write.chars') }}</span>
    </div>
    <textarea
      v-model="inputValue"
      :placeholder="placeholder || t('write.inputPlaceholderWeekly')"
      class="work-textarea"
      rows="14"
    ></textarea>
    <div class="tip">💡 {{ t('write.tip1') }}</div>
  </div>
</template>

<style scoped lang="scss">
.work-input { padding: 22px; display: flex; flex-direction: column; }
.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;
  h3 { margin: 0; font-size: 15px; font-weight: 700; }
  .meta { font-size: 12px; color: $text-tertiary; }
}
.work-textarea {
  flex: 1; width: 100%; background: $bg; border: 1px solid $border; border-radius: $radius-sm;
  color: $text; font-size: 14px; line-height: 1.7; padding: 14px; font-family: $font; resize: vertical;
  &:focus { outline: none; border-color: $primary; }
  &::placeholder { color: $text-tertiary; }
}
.tip { margin-top: 10px; font-size: 12px; color: $text-secondary; padding: 8px 12px; background: $primary-lighter; border-radius: $radius-xs; }
</style>
