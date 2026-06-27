<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTemplateStore } from '@/stores/templateStore'
import type { ReportTemplate } from '@/types/template'

const { t, locale } = useI18n()
const templateStore = useTemplateStore()

onMounted(() => { if (!templateStore.loaded) templateStore.init() })

function selectTemplate(tmpl: ReportTemplate) { templateStore.selectTemplate(tmpl.id) }
function dn(tmpl: ReportTemplate) {
  return locale.value === 'zh-CN' ? (tmpl.nameZh || tmpl.name) : (tmpl.name || tmpl.nameZh)
}

const styleIcons: Record<string, string> = { formal: '👔', casual: '😊', technical: '⚙️', minimal: '📌', creative: '🎨' }
</script>

<template>
  <div class="template-selector card">
    <h3>{{ t('write.templateTitle') }}</h3>
    <div class="template-list">
      <div
        v-for="tm in templateStore.allTemplates"
        :key="tm.id"
        class="template-item"
        :class="{ active: templateStore.selectedId === tm.id }"
        @click="selectTemplate(tm)"
      >
        <div class="template-item-top">
          <div class="template-name">
            <span class="style-icon">{{ styleIcons[tm.style] || '📄' }}</span>
            {{ dn(tm) }}
          </div>
          <span v-if="templateStore.selectedId === tm.id" class="check">✓</span>
        </div>
        <div class="template-meta">
          <span v-for="tag in (tm.tags || []).slice(0,3)" :key="tag" class="mini-tag">{{ tag }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.template-selector { padding: 22px; h3 { margin: 0 0 14px; font-size: 15px; font-weight: 700; } }
.template-list { display: flex; flex-direction: column; gap: 6px; max-height: 420px; overflow-y: auto; }
.template-item {
  padding: 10px 12px; border-radius: $radius-sm; border: 1px solid $border;
  cursor: pointer; transition: all 0.15s; background: $bg;
  &:hover { border-color: $primary-light; }
  &.active { border-color: $primary; background: $primary-lighter; }
}
.template-item-top { display: flex; justify-content: space-between; align-items: center; }
.template-name { font-size: 13px; font-weight: 600; color: $text; display: flex; align-items: center; gap: 6px; }
.style-icon { font-size: 14px; }
.template-meta { display: flex; gap: 4px; margin-top: 4px; }
.mini-tag { padding: 1px 6px; border-radius: $radius-round; font-size: 10px; background: $bg-soft; color: $text-secondary; }
.check { color: $success; font-weight: 700; }
</style>
