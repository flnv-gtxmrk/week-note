<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useSettingsStore } from '@/stores/settingsStore'
import { useHistoryStore } from '@/stores/historyStore'
import { useTemplateStore } from '@/stores/templateStore'
import { locales } from '@/i18n'

const { t } = useI18n()
const settings = useSettingsStore()
const historyStore = useHistoryStore()
const templateStore = useTemplateStore()

function exportData() {
  const data = {
    history: historyStore.records,
    customTemplates: templateStore.customTemplates,
    settings: {
      locale: settings.locale,
      theme: settings.theme
    },
    exportedAt: new Date().toISOString()
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `week-report-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success(t('settings.exported') || '数据已导出')
}

function importData(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      if (data.history) {
        for (const record of data.history) {
          await historyStore.addReport(record.fullReport)
        }
      }
      if (data.customTemplates) {
        for (const template of data.customTemplates) {
          templateStore.addCustomTemplate(template)
        }
      }
      ElMessage.success(t('settings.imported') || '数据已导入')
    } catch (err) {
      console.error(err)
      ElMessage.error(t('settings.importFailed') || '导入失败')
    }
  }
  reader.readAsText(file)
  target.value = ''
}

async function clearData() {
  try {
    await ElMessageBox.confirm(t('settings.clearConfirm'), t('common.confirm'), {
      confirmButtonText: t('settings.clearData'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    })
    await historyStore.clearAll()
    templateStore.customTemplates = []
    localStorage.removeItem('custom_templates')
    ElMessage.success(t('settings.cleared') || '数据已清空')
  } catch {
    // cancelled
  }
}
</script>

<template>
  <div class="page-container">
    <h1 class="section-title">{{ t('settings.title') }}</h1>

    <div class="settings-card">
      <h3>{{ t('settings.language') }}</h3>
      <div class="setting-options">
        <el-radio-group v-model="settings.locale">
          <el-radio-button v-for="loc in locales" :key="loc.value" :label="loc.value">
            {{ loc.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div class="settings-card">
      <h3>{{ t('settings.theme') }}</h3>
      <div class="setting-options">
        <el-radio-group v-model="settings.theme">
          <el-radio-button label="light">{{ t('settings.light') }}</el-radio-button>
          <el-radio-button label="dark">{{ t('settings.dark') }}</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div class="settings-card">
      <h3>{{ t('settings.dataTitle') }}</h3>
      <div class="data-actions">
        <el-button type="primary" @click="exportData">
          <el-icon><Download /></el-icon>
          {{ t('settings.exportData') }}
        </el-button>

        <el-upload
          action=""
          :auto-upload="false"
          :show-file-list="false"
          @change="importData"
        >
          <el-button type="success">
            <el-icon><Upload /></el-icon>
            {{ t('settings.importData') }}
          </el-button>
        </el-upload>

        <el-button type="danger" plain @click="clearData">
          <el-icon><Delete /></el-icon>
          {{ t('settings.clearData') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.settings-card {
  @include glass-card;
  padding: 24px;
  margin-bottom: 20px;

  h3 {
    margin: 0 0 16px 0;
    font-size: 1.1rem;
    color: var(--text);
  }
}

.setting-options {
  display: flex;
  gap: 12px;
}

.data-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
