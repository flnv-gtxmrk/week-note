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
  const data = { history: historyStore.records, customTemplates: templateStore.customTemplates, settings: { locale: settings.locale, theme: settings.theme }, exportedAt: new Date().toISOString() }
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
  a.download = `week-report-backup-${new Date().toISOString().slice(0,10)}.json`; a.click()
  ElMessage.success(t('settings.exported'))
}
function importData(ev: Event) {
  const file = (ev.target as HTMLInputElement).files?.[0]; if (!file) return
  const r = new FileReader()
  r.onload = async e => {
    try {
      const d = JSON.parse(e.target?.result as string)
      if (d.history) for (const rec of d.history) await historyStore.addReport(rec.fullReport)
      if (d.customTemplates) for (const t of d.customTemplates) templateStore.addCustomTemplate(t)
      ElMessage.success(t('settings.imported'))
    } catch { ElMessage.error(t('settings.importFailed')) }
  }
  r.readAsText(file); (ev.target as HTMLInputElement).value = ''
}
async function clearData() {
  try {
    await ElMessageBox.confirm(t('settings.clearConfirm'), t('common.confirm'), { confirmButtonText: t('settings.clearData'), cancelButtonText: t('common.cancel'), type: 'warning' })
    await historyStore.clearAll()
    localStorage.removeItem('custom_templates')
    ElMessage.success(t('settings.cleared'))
  } catch {}
}
</script>

<template>
  <div class="page-container">
    <h1 class="section-title">{{ t('settings.title') }}</h1>

    <div class="setting-group card">
      <h3>{{ t('settings.language') }}</h3>
      <div class="opts">
        <button v-for="loc in locales" :key="loc.value" class="opt-btn" :class="{ active: settings.locale === loc.value }" @click="settings.setLocale(loc.value)">{{ loc.label }}</button>
      </div>
    </div>

    <div class="setting-group card">
      <h3>{{ t('settings.theme') }}</h3>
      <div class="opts">
        <button class="opt-btn" :class="{ active: settings.theme === 'light' }" @click="settings.theme = 'light'">☀️ {{ t('settings.light') }}</button>
        <button class="opt-btn" :class="{ active: settings.theme === 'dark' }" @click="settings.theme = 'dark'">🌙 {{ t('settings.dark') }}</button>
      </div>
    </div>

    <div class="setting-group card">
      <h3>{{ t('settings.dataTitle') }}</h3>
      <div class="data-actions">
        <button class="tb-btn" @click="exportData">📥 {{ t('settings.exportData') }}</button>
        <label class="tb-btn" style="cursor:pointer">📤 {{ t('settings.importData') }}
          <input type="file" accept=".json" hidden @change="importData">
        </label>
        <button class="tb-btn danger" @click="clearData">🗑 {{ t('settings.clearData') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.setting-group { padding: 22px; margin-bottom: 16px; h3 { margin: 0 0 14px; font-size: 15px; font-weight: 700; } }
.opts { display: flex; gap: 8px; }
.opt-btn {
  padding: 8px 20px; border-radius: $radius-round; border: 1px solid $border;
  background: $bg; font-size: 13px; font-weight: 500; cursor: pointer;
  color: $text; transition: all 0.15s;
  &.active { background: $primary; color: #fff; border-color: $primary; }
  &:hover:not(.active) { border-color: $primary; }
}
.data-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.tb-btn {
  padding: 8px 16px; border-radius: $radius-round; border: 1px solid $border;
  background: $bg; font-size: 13px; font-weight: 500; cursor: pointer;
  color: $text; transition: all 0.15s;
  &:hover { border-color: $primary; color: $primary; }
  &.danger { color: $danger; border-color: $danger; &:hover { background: $danger-bg; } }
}
</style>
