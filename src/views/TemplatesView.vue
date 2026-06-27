<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useTemplateStore } from '@/stores/templateStore'
import type { ReportTemplate, TemplateSection, TemplateStyle } from '@/types/template'
import type { ReportType } from '@/types/report'

const { t, locale } = useI18n()
const templateStore = useTemplateStore()

onMounted(() => { if (!templateStore.loaded) templateStore.init() })

// --- Display helpers ---
function dn(tmpl: ReportTemplate) { return locale.value === 'zh-CN' ? (tmpl.nameZh || tmpl.name) : (tmpl.name || tmpl.nameZh) }
function dd(tmpl: ReportTemplate) { return locale.value === 'zh-CN' ? (tmpl.descriptionZh || tmpl.description) : (tmpl.description || tmpl.descriptionZh) }
function dst(s: TemplateSection) { return locale.value === 'zh-CN' ? (s.titleZh || s.title) : (s.title || s.titleZh) }

// --- Filter ---
const filterType = ref<'all' | ReportType>('all')
const filteredBuiltin = computed(() =>
  filterType.value === 'all' ? templateStore.builtinTemplates : templateStore.builtinTemplates.filter(t => t.reportType === filterType.value)
)
const filteredCustom = computed(() =>
  filterType.value === 'all' ? templateStore.customTemplates : templateStore.customTemplates.filter(t => t.reportType === filterType.value)
)

// --- Styles ---
const styles: { value: TemplateStyle; icon: string; labelKey: string; descKey: string }[] = [
  { value: 'formal', icon: '👔', labelKey: 'styleFormal', descKey: 'styleDescFormal' },
  { value: 'casual', icon: '😊', labelKey: 'styleCasual', descKey: 'styleDescCasual' },
  { value: 'technical', icon: '⚙️', labelKey: 'styleTechnical', descKey: 'styleDescTechnical' },
  { value: 'minimal', icon: '📌', labelKey: 'styleMinimal', descKey: 'styleDescMinimal' },
  { value: 'creative', icon: '🎨', labelKey: 'styleCreative', descKey: 'styleDescCreative' }
]

const reportTypeOptions: { value: ReportType; icon: string; labelKey: string }[] = [
  { value: 'daily', icon: '📅', labelKey: 'reportTypeDaily' },
  { value: 'weekly', icon: '📋', labelKey: 'reportTypeWeekly' },
  { value: 'monthly', icon: '📊', labelKey: 'reportTypeMonthly' }
]

// --- Editor state ---
const showEditor = ref(false)
const editorStep = ref(1)
const editingId = ref<string | null>(null)
const tagInput = ref('')

interface EditorState {
  name: string; nameZh: string
  description: string; descriptionZh: string
  tags: string[]; style: TemplateStyle
  reportType: ReportType
  sections: TemplateSection[]
}
const ed = ref<EditorState>({ name: '', nameZh: '', description: '', descriptionZh: '', tags: [], style: 'formal', reportType: 'weekly', sections: [] })

function startCreate() {
  editingId.value = null
  editorStep.value = 1
  tagInput.value = ''
  ed.value = {
    name: '', nameZh: '', description: '', descriptionZh: '',
    tags: [], style: 'formal', reportType: filterType.value === 'all' ? 'weekly' : filterType.value,
    sections: [{ key: 's1', title: '', titleZh: '', prompt: '', promptZh: '', required: true, order: 0 }]
  }
  showEditor.value = true
}

function startEdit(tmpl: ReportTemplate) {
  editingId.value = tmpl.id
  editorStep.value = 1
  tagInput.value = ''
  ed.value = {
    name: tmpl.name, nameZh: tmpl.nameZh, description: tmpl.description, descriptionZh: tmpl.descriptionZh,
    tags: [...(tmpl.tags || [])], style: tmpl.style || 'formal', reportType: tmpl.reportType || 'weekly',
    sections: tmpl.sections.map(s => ({ ...s }))
  }
  showEditor.value = true
}

function addTag() {
  const tag = tagInput.value.trim().toLowerCase()
  if (tag && !ed.value.tags.includes(tag)) ed.value.tags.push(tag)
  tagInput.value = ''
}
function removeTag(i: number) { ed.value.tags.splice(i, 1) }

function addSection() {
  ed.value.sections.push({ key: `s${Date.now()}`, title: '', titleZh: '', prompt: '', promptZh: '', required: true, order: ed.value.sections.length })
}
function removeSection(i: number) { ed.value.sections.splice(i, 1); ed.value.sections.forEach((s, j) => s.order = j) }
function moveSection(i: number, dir: number) {
  const j = i + dir
  if (j < 0 || j >= ed.value.sections.length) return
  const tmp = ed.value.sections[i]; ed.value.sections[i] = ed.value.sections[j]; ed.value.sections[j] = tmp
  ed.value.sections.forEach((s, k) => s.order = k)
}

const canNext = computed(() => editorStep.value !== 1 || !!(ed.value.name || ed.value.nameZh))
const canSave = computed(() => ed.value.sections.length > 0 && ed.value.sections.some(s => s.title || s.titleZh))

function saveTemplate() {
  const base = {
    name: ed.value.name || 'Untitled', nameZh: ed.value.nameZh || ed.value.name || '未命名',
    description: ed.value.description, descriptionZh: ed.value.descriptionZh,
    tags: ed.value.tags, style: ed.value.style, reportType: ed.value.reportType,
    sections: ed.value.sections
  }
  if (editingId.value) {
    templateStore.updateCustomTemplate(editingId.value, base)
  } else {
    templateStore.addCustomTemplate({ ...base, id: crypto.randomUUID(), isBuiltin: false, isCustom: true, createdAt: Date.now() })
  }
  showEditor.value = false
  ElMessage.success(t('templates.saved'))
}

// --- Upload / Export ---
function uploadFile(f: any) {
  if (!f) return
  const r = new FileReader()
  r.onload = e => {
    try {
      const d = JSON.parse(e.target?.result as string)
      if (d.name && d.sections) {
        templateStore.addCustomTemplate({
          id: crypto.randomUUID(), name: d.name, nameZh: d.nameZh || d.name,
          description: d.description || '', descriptionZh: d.descriptionZh || '',
          sections: d.sections, tags: d.tags || [], style: d.style || 'formal',
          reportType: d.reportType || 'weekly',
          isBuiltin: false, isCustom: true, createdAt: Date.now()
        })
        ElMessage.success(t('templates.saved'))
      }
    } catch { ElMessage.error(t('settings.importFailed') || 'Format error') }
  }
  r.readAsText(f)
  return false
}

function exportTemplate(tmpl: ReportTemplate) {
  const d = JSON.stringify({ name: tmpl.name, nameZh: tmpl.nameZh, description: tmpl.description, descriptionZh: tmpl.descriptionZh, tags: tmpl.tags, style: tmpl.style, reportType: tmpl.reportType, sections: tmpl.sections }, null, 2)
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([d], { type: 'application/json' }))
  a.download = `template-${tmpl.name || 'custom'}.json`
  a.click()
}

function styleIcon(s: string) { return styles.find(x => x.value === s)?.icon || '📄' }
function styleLabel(s: string) { const st = styles.find(x => x.value === s); return st ? t(`templates.${st.labelKey}`) : s }
function rtIcon(rt: string) { return reportTypeOptions.find(x => x.value === rt)?.icon || '📋' }

const filterTabs = [
  { value: 'all' as const, icon: '📁', labelKey: 'templates.filterAll' },
  { value: 'daily' as const, icon: '📅', labelKey: 'templates.filterDaily' },
  { value: 'weekly' as const, icon: '📋', labelKey: 'templates.filterWeekly' },
  { value: 'monthly' as const, icon: '📊', labelKey: 'templates.filterMonthly' }
]
</script>

<template>
  <div class="page-container">
    <div class="header">
      <h1 class="section-title">{{ t('templates.title') }}</h1>
      <div class="header-actions">
        <label class="tb-btn" style="cursor:pointer">
          📤 {{ t('templates.upload') }}
          <input type="file" accept=".json" hidden @change="uploadFile(($event.target as any).files[0])">
        </label>
        <button class="tb-btn primary" @click="startCreate">+ {{ t('templates.create') }}</button>
      </div>
    </div>

    <!-- Filter -->
    <div class="filter-tabs">
      <button v-for="tab in filterTabs" :key="tab.value" class="filter-tab" :class="{ active: filterType === tab.value }" @click="filterType = tab.value">
        <span>{{ tab.icon }}</span> {{ t(tab.labelKey) }}
      </button>
    </div>

    <!-- Builtin -->
    <h2 class="group-title">{{ t('templates.builtin') }} ({{ filteredBuiltin.length }})</h2>
    <div class="tpl-grid">
      <div v-for="tm in filteredBuiltin" :key="tm.id" class="tpl-card card" :class="{ active: templateStore.selectedId === tm.id }" @click="templateStore.selectTemplate(tm.id)">
        <div class="tpl-card-top">
          <div class="tpl-card-name">
            <span class="tpl-style-icon">{{ styleIcon(tm.style) }}</span>
            <div>
              <h4>{{ dn(tm) }}</h4>
              <span class="tpl-rt">{{ rtIcon(tm.reportType) }} {{ t(`reportType.${tm.reportType}`) }}</span>
            </div>
          </div>
          <span v-if="templateStore.selectedId === tm.id" class="check">✓</span>
        </div>
        <p>{{ dd(tm) }}</p>
        <div class="tpl-meta">
          <span v-for="tag in tm.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <div class="tpl-sections">
          <span v-for="s in tm.sections" :key="s.key" class="tpl-tag">{{ dst(s) }}</span>
        </div>
      </div>
    </div>

    <!-- Custom -->
    <h2 class="group-title">{{ t('templates.custom') }} ({{ filteredCustom.length }})</h2>
    <div v-if="filteredCustom.length === 0" class="empty">{{ t('templates.noCustom') }}</div>
    <div v-else class="tpl-grid">
      <div v-for="tm in filteredCustom" :key="tm.id" class="tpl-card card" :class="{ active: templateStore.selectedId === tm.id }" @click="templateStore.selectTemplate(tm.id)">
        <div class="tpl-card-top">
          <div class="tpl-card-name">
            <span class="tpl-style-icon">{{ styleIcon(tm.style) }}</span>
            <div>
              <h4>{{ dn(tm) }}</h4>
              <span class="tpl-rt">{{ rtIcon(tm.reportType) }} {{ t(`reportType.${tm.reportType}`) }}</span>
            </div>
          </div>
          <span v-if="templateStore.selectedId === tm.id" class="check">✓</span>
        </div>
        <p>{{ dd(tm) }}</p>
        <div class="tpl-sections">
          <span v-for="s in tm.sections" :key="s.key" class="tpl-tag">{{ dst(s) }}</span>
        </div>
        <div class="tpl-actions">
          <button class="tb-btn sm" @click.stop="startEdit(tm)">✏️</button>
          <button class="tb-btn sm" @click.stop="exportTemplate(tm)">↓</button>
          <button class="tb-btn sm danger" @click.stop="templateStore.deleteCustomTemplate(tm.id)">×</button>
        </div>
      </div>
    </div>

    <!-- Editor Modal -->
    <Teleport to="body">
      <div v-if="showEditor" class="modal-overlay" @click.self="showEditor = false">
        <div class="modal">
          <div class="modal-steps">
            <div class="step-dot" :class="{ active: editorStep === 1, done: editorStep > 1 }">1</div>
            <div class="step-line"></div>
            <div class="step-dot" :class="{ active: editorStep === 2 }">2</div>
          </div>

          <!-- Step 1 -->
          <div v-if="editorStep === 1" class="modal-body">
            <h2>{{ t('templates.step1') }}</h2>
            <div class="form-row">
              <div class="form-field">
                <label>{{ t('templates.name') }} (EN)</label>
                <input v-model="ed.name" placeholder="e.g. My Template" class="form-input">
              </div>
              <div class="form-field">
                <label>{{ t('templates.name') }} (中文)</label>
                <input v-model="ed.nameZh" placeholder="如：我的模板" class="form-input">
              </div>
            </div>
            <div class="form-row">
              <div class="form-field">
                <label>{{ t('templates.description') }} (EN)</label>
                <textarea v-model="ed.description" rows="2" class="form-input"></textarea>
              </div>
              <div class="form-field">
                <label>{{ t('templates.description') }} (中文)</label>
                <textarea v-model="ed.descriptionZh" rows="2" class="form-input"></textarea>
              </div>
            </div>

            <!-- Report Type -->
            <div class="form-field">
              <label>{{ t('templates.reportType') }}</label>
              <div class="rt-grid">
                <div v-for="rt in reportTypeOptions" :key="rt.value" class="rt-card" :class="{ active: ed.reportType === rt.value }" @click="ed.reportType = rt.value">
                  <span class="rt-icon">{{ rt.icon }}</span>
                  <span class="rt-name">{{ t(`templates.${rt.labelKey}`) }}</span>
                </div>
              </div>
            </div>

            <!-- Style -->
            <div class="form-field">
              <label>{{ t('templates.style') }}</label>
              <div class="style-grid">
                <div v-for="s in styles" :key="s.value" class="style-card" :class="{ active: ed.style === s.value }" @click="ed.style = s.value">
                  <span class="style-icon">{{ s.icon }}</span>
                  <span class="style-name">{{ t(`templates.${s.labelKey}`) }}</span>
                  <span class="style-desc">{{ t(`templates.${s.descKey}`) }}</span>
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div class="form-field">
              <label>{{ t('templates.tags') }}</label>
              <div class="tags-input">
                <span v-for="(tag, i) in ed.tags" :key="i" class="tag-chip">{{ tag }}<button class="tag-remove" @click="removeTag(i)">×</button></span>
                <input v-model="tagInput" :placeholder="t('templates.tagsPlaceholder')" class="tag-field" @keydown.enter.prevent="addTag">
              </div>
            </div>
          </div>

          <!-- Step 2 -->
          <div v-if="editorStep === 2" class="modal-body">
            <h2>{{ t('templates.step2') }}</h2>
            <div class="sections-list">
              <div v-for="(sec, i) in ed.sections" :key="sec.key" class="section-editor">
                <div class="section-header">
                  <span class="section-num">{{ i + 1 }}</span>
                  <label class="toggle-label"><input type="checkbox" v-model="sec.required"><span>{{ sec.required ? t('templates.required') : t('templates.optional') }}</span></label>
                  <div class="section-nav">
                    <button class="nav-btn" @click="moveSection(i, -1)" :disabled="i === 0">↑</button>
                    <button class="nav-btn" @click="moveSection(i, 1)" :disabled="i === ed.sections.length - 1">↓</button>
                    <button class="nav-btn danger" @click="removeSection(i)">×</button>
                  </div>
                </div>
                <div class="section-fields">
                  <input v-model="sec.title" :placeholder="t('templates.sectionTitle') + ' (EN)'" class="form-input">
                  <input v-model="sec.titleZh" :placeholder="t('templates.sectionTitle') + ' (中文)'" class="form-input">
                  <input v-model="sec.prompt" :placeholder="t('templates.sectionPrompt') + ' (EN)'" class="form-input">
                  <input v-model="sec.promptZh" :placeholder="t('templates.sectionPrompt') + ' (中文)'" class="form-input">
                </div>
              </div>
            </div>
            <button class="tb-btn add-btn" @click="addSection">+ {{ t('templates.addSection') }}</button>
          </div>

          <div class="modal-footer">
            <button v-if="editorStep > 1" class="tb-btn" @click="editorStep--">{{ t('templates.prev') }}</button>
            <div style="flex:1"></div>
            <button class="tb-btn" @click="showEditor = false">{{ t('common.cancel') }}</button>
            <button v-if="editorStep === 1" class="tb-btn primary" :disabled="!canNext" @click="editorStep++">{{ t('templates.next') }}</button>
            <button v-if="editorStep === 2" class="tb-btn primary" :disabled="!canSave" @click="saveTemplate">{{ t('common.save') }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; }
.header-actions { display: flex; gap: 8px; }
.filter-tabs { display: flex; gap: 6px; margin-bottom: 20px; }
.filter-tab {
  display: flex; align-items: center; gap: 4px;
  padding: 7px 14px; border-radius: $radius-round;
  border: 1px solid $border; background: $bg-card;
  font-size: 12px; font-weight: 500; color: $text-secondary; cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: $primary-light; }
  &.active { border-color: $primary; background: $primary-lighter; color: $primary; font-weight: 600; }
}
.group-title { font-size: 15px; font-weight: 700; margin: 24px 0 12px; color: $text; }
.tpl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
.tpl-card { padding: 18px; cursor: pointer; transition: all 0.15s; border: 1px solid $border;
  &:hover { border-color: $primary-light; }
  &.active { border-color: $primary; background: $primary-lighter; }
  h4 { margin: 0; font-size: 14px; font-weight: 700; }
  p { margin: 6px 0; color: $text-secondary; font-size: 13px; line-height: 1.4; }
}
.tpl-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.tpl-card-name { display: flex; align-items: center; gap: 8px; }
.tpl-style-icon { font-size: 20px; }
.tpl-rt { font-size: 11px; color: $text-secondary; margin-top: 2px; display: block; }
.tpl-meta { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; margin: 8px 0; }
.tag { padding: 2px 8px; border-radius: $radius-round; font-size: 11px; font-weight: 600; background: $primary-lighter; color: $primary; }
.tpl-sections { display: flex; gap: 4px; flex-wrap: wrap; }
.tpl-tag { padding: 2px 8px; border-radius: $radius-round; font-size: 11px; background: $bg; color: $text-secondary; }
.tpl-actions { display: flex; gap: 6px; margin-top: 12px; }
.check { color: $success; font-weight: 700; font-size: 14px; }
.empty { padding: 40px; text-align: center; color: $text-secondary; }
.tb-btn {
  padding: 8px 16px; border-radius: $radius-round; border: 1px solid $border; background: $bg; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; color: $text;
  &:hover { border-color: $primary; color: $primary; }
  &.primary { background: $primary; color: #fff; border-color: $primary; &:hover { background: $primary-dark; } }
  &.sm { padding: 4px 10px; font-size: 11px; }
  &.danger { color: $danger; border-color: $danger; &:hover { background: $danger-bg; } }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
}
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 100; display: flex; align-items: center; justify-content: center; }
.modal { background: $bg-card; border-radius: $radius; box-shadow: $shadow-lg; width: 640px; max-width: 95vw; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; }
.modal-steps { display: flex; align-items: center; justify-content: center; gap: 0; padding: 20px 24px 0; }
.step-dot { width: 32px; height: 32px; border-radius: 50%; border: 2px solid $border; background: $bg; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: $text-secondary;
  &.active { border-color: $primary; color: $primary; background: $primary-lighter; }
  &.done { border-color: $success; color: #fff; background: $success; }
}
.step-line { width: 60px; height: 2px; background: $border; }
.modal-body { padding: 20px 24px; overflow-y: auto; flex: 1; h2 { margin: 0 0 18px; font-size: 18px; font-weight: 700; } }
.modal-footer { display: flex; gap: 8px; align-items: center; padding: 16px 24px; border-top: 1px solid $border; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
.form-field { margin-bottom: 14px; label { display: block; font-size: 12px; font-weight: 600; color: $text-secondary; margin-bottom: 4px; } }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid $border; border-radius: $radius-sm; font-size: 13px; font-family: $font; color: $text; background: $bg;
  &:focus { outline: none; border-color: $primary; }
  &::placeholder { color: $text-tertiary; }
}
.rt-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.rt-card { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 12px; border: 2px solid $border; border-radius: $radius-sm; cursor: pointer; transition: all 0.15s; text-align: center;
  &:hover { border-color: $primary-light; }
  &.active { border-color: $primary; background: $primary-lighter; }
  .rt-icon { font-size: 22px; }
  .rt-name { font-size: 12px; font-weight: 600; }
}
.style-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
.style-card { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 12px 6px; border: 2px solid $border; border-radius: $radius-sm; cursor: pointer; transition: all 0.15s; text-align: center;
  &:hover { border-color: $primary-light; }
  &.active { border-color: $primary; background: $primary-lighter; }
  .style-icon { font-size: 24px; }
  .style-name { font-size: 12px; font-weight: 600; }
  .style-desc { font-size: 10px; color: $text-secondary; line-height: 1.3; }
}
.tags-input { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; padding: 6px 8px; border: 1px solid $border; border-radius: $radius-sm; background: $bg; }
.tag-chip { display: flex; align-items: center; gap: 4px; padding: 2px 8px; background: $primary-lighter; color: $primary; border-radius: $radius-round; font-size: 12px; font-weight: 600; }
.tag-remove { background: none; border: none; color: $primary; cursor: pointer; font-size: 14px; padding: 0 2px; }
.tag-field { border: none; background: none; outline: none; font-size: 13px; font-family: $font; color: $text; flex: 1; min-width: 80px; }
.sections-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
.section-editor { background: $bg; border: 1px solid $border; border-radius: $radius-sm; padding: 12px; }
.section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.section-num { width: 24px; height: 24px; border-radius: 50%; background: $primary; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.toggle-label { display: flex; align-items: center; gap: 6px; font-size: 12px; color: $text-secondary; cursor: pointer; flex: 1; input { accent-color: $primary; } }
.section-nav { display: flex; gap: 4px; }
.nav-btn { width: 28px; height: 28px; border: 1px solid $border; border-radius: $radius-xs; background: $bg-card; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; color: $text-secondary;
  &:hover { border-color: $primary; color: $primary; }
  &.danger { color: $danger; &:hover { border-color: $danger; background: $danger-bg; } }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
}
.section-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.add-btn { width: 100%; text-align: center; }
@media (max-width: 768px) {
  .form-row, .style-grid, .rt-grid { grid-template-columns: 1fr; }
  .section-fields { grid-template-columns: 1fr; }
}
</style>
