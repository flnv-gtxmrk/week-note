<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useTemplateStore } from '@/stores/templateStore'
import type { ReportTemplate, TemplateSection } from '@/types/template'

const { t, locale } = useI18n()
const templateStore = useTemplateStore()

onMounted(() => {
  if (!templateStore.loaded) {
    templateStore.init()
  }
})

const showEditor = ref(false)
const editingTemplate = ref<Partial<ReportTemplate> & { sections: TemplateSection[] }>({
  name: '',
  nameZh: '',
  description: '',
  descriptionZh: '',
  sections: []
})

function displayName(template: ReportTemplate) {
  return locale.value === 'zh-CN' ? template.nameZh || template.name : template.name
}

function displayDesc(template: ReportTemplate) {
  return locale.value === 'zh-CN' ? template.descriptionZh || template.description : template.description
}

function startCreate() {
  editingTemplate.value = {
    name: '',
    nameZh: '',
    description: '',
    descriptionZh: '',
    sections: [
      { key: 'section1', title: 'Section 1', titleZh: '段落一', prompt: '', promptZh: '', required: true, order: 0 }
    ]
  }
  showEditor.value = true
}

function addSection() {
  editingTemplate.value.sections.push({
    key: `section${editingTemplate.value.sections.length + 1}`,
    title: '',
    titleZh: '',
    prompt: '',
    promptZh: '',
    required: true,
    order: editingTemplate.value.sections.length
  })
}

function removeSection(index: number) {
  editingTemplate.value.sections.splice(index, 1)
  editingTemplate.value.sections.forEach((s, i) => { s.order = i })
}

function saveTemplate() {
  const template: ReportTemplate = {
    id: crypto.randomUUID(),
    name: editingTemplate.value.name || 'Untitled',
    nameZh: editingTemplate.value.nameZh || editingTemplate.value.name || '未命名',
    description: editingTemplate.value.description || '',
    descriptionZh: editingTemplate.value.descriptionZh || '',
    sections: editingTemplate.value.sections,
    isBuiltin: false,
    isCustom: true,
    createdAt: Date.now()
  }
  templateStore.addCustomTemplate(template)
  showEditor.value = false
  ElMessage.success(t('templates.saved') || '模板已保存')
}

function deleteTemplate(id: string) {
  templateStore.deleteCustomTemplate(id)
}

const customTemplates = computed(() => templateStore.customTemplates)
const builtinTemplates = computed(() => templateStore.builtinTemplates)
</script>

<template>
  <div class="page-container">
    <div class="templates-header">
      <h1 class="section-title">{{ t('templates.title') }}</h1>
      <el-button type="primary" @click="startCreate">
        <el-icon><Plus /></el-icon>
        {{ t('templates.create') }}
      </el-button>
    </div>

    <h2 class="template-group-title">{{ t('templates.builtin') }}</h2>
    <div class="template-grid">
      <div
        v-for="template in builtinTemplates"
        :key="template.id"
        class="template-card"
        :class="{ active: templateStore.selectedId === template.id }"
        @click="templateStore.selectTemplate(template.id)"
      >
        <h3>{{ displayName(template) }}</h3>
        <p>{{ displayDesc(template) }}</p>
        <div class="template-sections">
          <el-tag
            v-for="section in template.sections"
            :key="section.key"
            size="small"
            type="info"
          >
            {{ locale === 'zh-CN' ? section.titleZh : section.title }}
          </el-tag>
        </div>
      </div>
    </div>

    <h2 class="template-group-title">{{ t('templates.custom') }}</h2>
    <div v-if="customTemplates.length === 0" class="template-empty">
      {{ t('templates.noCustom') || '暂无自定义模板' }}
    </div>
    <div v-else class="template-grid">
      <div
        v-for="template in customTemplates"
        :key="template.id"
        class="template-card"
        :class="{ active: templateStore.selectedId === template.id }"
        @click="templateStore.selectTemplate(template.id)"
      >
        <div class="template-card-header">
          <h3>{{ displayName(template) }}</h3>
          <el-button
            type="danger"
            size="small"
            plain
            @click.stop="deleteTemplate(template.id)"
          >
            {{ t('common.delete') }}
          </el-button>
        </div>
        <p>{{ displayDesc(template) }}</p>
      </div>
    </div>

    <el-dialog
      v-model="showEditor"
      :title="t('templates.create')"
      width="600px"
    >
      <el-form label-position="top">
        <el-form-item :label="t('templates.name')">
          <el-input v-model="editingTemplate.name" />
        </el-form-item>
        <el-form-item :label="t('templates.name') + ' (中文)'">
          <el-input v-model="editingTemplate.nameZh" />
        </el-form-item>
        <el-form-item :label="t('templates.description')">
          <el-input v-model="editingTemplate.description" type="textarea" />
        </el-form-item>
        <el-form-item :label="t('templates.description') + ' (中文)'">
          <el-input v-model="editingTemplate.descriptionZh" type="textarea" />
        </el-form-item>

        <h4>{{ t('templates.sections') }}</h4>
        <div
          v-for="(section, index) in editingTemplate.sections"
          :key="index"
          class="section-editor"
        >
          <el-input v-model="section.title" :placeholder="t('templates.sectionTitle')" />
          <el-input v-model="section.titleZh" :placeholder="t('templates.sectionTitle') + ' 中文'" />
          <el-input v-model="section.prompt" :placeholder="t('templates.sectionPrompt')" />
          <el-input v-model="section.promptZh" :placeholder="t('templates.sectionPrompt') + ' 中文'" />
          <el-button type="danger" size="small" @click="removeSection(index)">
            {{ t('common.delete') }}
          </el-button>
        </div>

        <el-button type="primary" plain @click="addSection">
          {{ t('templates.addSection') }}
        </el-button>
      </el-form>

      <template #footer>
        <el-button @click="showEditor = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="saveTemplate">{{ t('common.save') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.templates-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.template-group-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 24px 0 16px 0;
  color: var(--text);
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.template-card {
  @include glass-card;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border);

  &:hover {
    border-color: var(--primary-light);
    transform: translateY(-2px);
  }

  &.active {
    border-color: var(--primary);
    background: rgba(99, 102, 241, 0.08);
  }

  h3 {
    margin: 0 0 8px 0;
    font-size: 1.1rem;
  }

  p {
    margin: 0 0 12px 0;
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.5;
  }
}

.template-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.template-sections {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.template-empty {
  color: var(--text-secondary);
  padding: 20px;
  text-align: center;
}

.section-editor {
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  background: var(--bg-soft);
  border-radius: var(--radius-sm);
}
</style>
