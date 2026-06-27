<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const props = defineProps<{ reportText: string; disabled?: boolean }>()
const emit = defineEmits<{ (e: 'generate'): void; (e: 'save'): void }>()
const { t } = useI18n()
const copied = ref(false)

async function copyReport() {
  if (!props.reportText) return
  await navigator.clipboard.writeText(props.reportText)
  copied.value = true
  ElMessage.success(t('common.copied'))
  setTimeout(() => copied.value = false, 2000)
}

function dl(content: string, name: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = name; a.click()
  URL.revokeObjectURL(url)
}
function exportTxt() {
  if (!props.reportText) return
  dl(props.reportText, `weekly-${new Date().toISOString().slice(0,10)}.txt`, 'text/plain')
}
function exportMd() {
  if (!props.reportText) return
  dl(props.reportText.split('\n').map(l => l.trim().endsWith('：')||l.trim().endsWith(':')?`## ${l.trim()}`:l).join('\n'), `weekly-${new Date().toISOString().slice(0,10)}.md`, 'text/markdown')
}
function exportHtml() {
  if (!props.reportText) return
  dl(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Weekly Report</title></head><body style="font-family:sans-serif;max-width:720px;margin:40px auto;line-height:1.7">${props.reportText.replace(/\n/g,'<br>')}</body></html>`, `weekly-${new Date().toISOString().slice(0,10)}.html`, 'text/html')
}
</script>

<template>
  <div class="toolbar card">
    <button class="tb-btn primary" @click="emit('generate')">{{ t('write.regenerate') }}</button>
    <button class="tb-btn" @click="copyReport">{{ copied ? t('common.copied') : t('write.copy') }}</button>
    <button class="tb-btn" @click="exportTxt">↓ TXT</button>
    <button class="tb-btn" @click="exportMd">↓ MD</button>
    <button class="tb-btn" @click="exportHtml">↓ HTML</button>
    <button class="tb-btn success" @click="emit('save')">{{ t('write.saveHistory') }}</button>
  </div>
</template>

<style scoped lang="scss">
.toolbar {
  padding: 16px 22px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.tb-btn {
  padding: 8px 16px;
  border-radius: $radius-round;
  border: 1px solid $border;
  background: $bg;
  color: $text;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: $primary; color: $primary; }
  &.primary { background: $primary; color: #fff; border-color: $primary; &:hover { background: $primary-dark; } }
  &.success { background: $success; color: #fff; border-color: $success; &:hover { opacity: 0.9; } }
}
</style>
