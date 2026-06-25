<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTemplateStore } from '@/stores/templateStore'
import type { ReportTemplate } from '@/types/template'

const { t, locale } = useI18n()
const templateStore = useTemplateStore()

onMounted(() => {
  if (!templateStore.loaded) {
    templateStore.init()
  }
})

function selectTemplate(template: ReportTemplate) {
  templateStore.selectTemplate(template.id)
}

function displayName(template: ReportTemplate) {
  return locale.value === 'zh-CN' ? template.nameZh || template.name : template.name
}

function displayDesc(template: ReportTemplate) {
  return locale.value === 'zh-CN' ? template.descriptionZh || template.description : template.description
}
</script>

<template>
  <div class="template-selector">
    <h3 class="panel-title">{{ t('write.templateTitle') }}</h3>
    <div class="template-list">
      <div
        v-for="template in templateStore.allTemplates"
        :key="template.id"
        class="template-card"
        :class="{ active: templateStore.selectedId === template.id }"
        @click="selectTemplate(template)"
      >
        <div class="template-header">
          <span class="template-name">{{ displayName(template) }}</span>
          <el-tag v-if="template.isBuiltin" size="small" type="info">{{ t('templates.builtin') }}</el-tag>
          <el-tag v-else size="small" type="success">{{ t('templates.custom') }}</el-tag>
        </div>
        <p class="template-desc">{{ displayDesc(template) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.template-selector {
  @include glass-card;
  padding: 24px;
}

.panel-title {
  margin: 0 0 16px 0;
  font-size: 1.125rem;
  font-weight: 700;
}

.template-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.template-card {
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--bg-soft);

  &:hover {
    border-color: var(--primary-light);
    transform: translateX(4px);
  }

  &.active {
    border-color: var(--primary);
    background: rgba(99, 102, 241, 0.08);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
  }
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.template-name {
  font-weight: 600;
  color: var(--text);
}

.template-desc {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
}
</style>
