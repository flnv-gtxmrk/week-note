<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  reportText: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'generate'): void
  (e: 'save'): void
}>()

const { t } = useI18n()
const copied = ref(false)

async function copyReport() {
  if (!props.reportText) return
  try {
    await navigator.clipboard.writeText(props.reportText)
    copied.value = true
    ElMessage.success(t('common.copied'))
    setTimeout(() => copied.value = false, 2000)
  } catch {
    ElMessage.error('Copy failed')
  }
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function exportTxt() {
  if (!props.reportText) return
  downloadFile(props.reportText, `weekly-report-${new Date().toISOString().slice(0, 10)}.txt`, 'text/plain')
}

function exportMd() {
  if (!props.reportText) return
  const md = props.reportText.replace(/^(.*)$/gm, (line) => {
    if (line.trim().endsWith('：') || line.trim().endsWith(':')) {
      return `## ${line.trim()}`
    }
    return line
  })
  downloadFile(md, `weekly-report-${new Date().toISOString().slice(0, 10)}.md`, 'text/markdown')
}

function exportHtml() {
  if (!props.reportText) return
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Weekly Report</title></head>
<body style="font-family: sans-serif; max-width: 720px; margin: 40px auto; line-height: 1.7;">
${props.reportText.replace(/\n/g, '<br>')}
</body>
</html>`
  downloadFile(html, `weekly-report-${new Date().toISOString().slice(0, 10)}.html`, 'text/html')
}

function saveReport() {
  emit('save')
}

function generateReport() {
  emit('generate')
}
</script>

<template>
  <div class="action-toolbar">
    <el-button
      type="primary"
      size="large"
      :disabled="disabled"
      @click="generateReport"
    >
      <el-icon><MagicStick /></el-icon>
      {{ t('write.generate') }}
    </el-button>

    <el-button
      :disabled="!reportText"
      @click="copyReport"
    >
      <el-icon><DocumentCopy /></el-icon>
      {{ copied ? t('common.copied') : t('write.copy') }}
    </el-button>

    <el-dropdown :disabled="!reportText" @command="exportTxt">
      <el-button
        :disabled="!reportText"
      >
        <el-icon><Download /></el-icon>
        {{ t('common.export') }}
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="exportTxt">{{ t('write.exportTxt') }}</el-dropdown-item>
          <el-dropdown-item @click="exportMd">{{ t('write.exportMd') }}</el-dropdown-item>
          <el-dropdown-item @click="exportHtml">{{ t('write.exportHtml') }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-button
      type="success"
      plain
      :disabled="!reportText"
      @click="saveReport"
    >
      <el-icon><FolderChecked /></el-icon>
      {{ t('write.saveHistory') }}
    </el-button>
  </div>
</template>

<style scoped lang="scss">
.action-toolbar {
  @include glass-card;
  padding: 16px 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: center;
}

.el-button {
  .el-icon {
    margin-right: 6px;
  }
}
</style>
