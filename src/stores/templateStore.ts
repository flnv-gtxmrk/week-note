import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ReportTemplate } from '@/types/template'
import { useWasmEngine } from '@/composables/useWasmEngine'

const CUSTOM_TEMPLATES_KEY = 'custom_templates'

export const useTemplateStore = defineStore('templates', () => {
  const { getBuiltinTemplates } = useWasmEngine()

  const builtinTemplates = ref<ReportTemplate[]>([])
  const customTemplates = ref<ReportTemplate[]>([])
  const selectedId = ref<string>('standard')
  const loaded = ref(false)

  const allTemplates = computed(() => [...builtinTemplates.value, ...customTemplates.value])

  const selectedTemplate = computed(() =>
    allTemplates.value.find(t => t.id === selectedId.value) || builtinTemplates.value[0]
  )

  function loadBuiltinTemplates() {
    try {
      const json = getBuiltinTemplates()
      const templates = JSON.parse(json) as ReportTemplate[]
      builtinTemplates.value = templates.map(t => ({ ...t, isBuiltin: true, isCustom: false }))
      loaded.value = true
    } catch (e) {
      console.error('Failed to load builtin templates:', e)
      builtinTemplates.value = []
    }
  }

  function loadCustomTemplates() {
    try {
      const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY)
      if (stored) {
        customTemplates.value = JSON.parse(stored)
      }
    } catch (e) {
      console.error('Failed to load custom templates:', e)
      customTemplates.value = []
    }
  }

  function saveCustomTemplates() {
    localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(customTemplates.value))
  }

  function selectTemplate(id: string) {
    selectedId.value = id
  }

  function addCustomTemplate(template: ReportTemplate) {
    customTemplates.value.push(template)
    saveCustomTemplates()
  }

  function updateCustomTemplate(id: string, template: Partial<ReportTemplate>) {
    const index = customTemplates.value.findIndex(t => t.id === id)
    if (index >= 0) {
      customTemplates.value[index] = { ...customTemplates.value[index], ...template }
      saveCustomTemplates()
    }
  }

  function deleteCustomTemplate(id: string) {
    customTemplates.value = customTemplates.value.filter(t => t.id !== id)
    if (selectedId.value === id) {
      selectedId.value = 'standard'
    }
    saveCustomTemplates()
  }

  function init() {
    loadBuiltinTemplates()
    loadCustomTemplates()
  }

  return {
    builtinTemplates,
    customTemplates,
    allTemplates,
    selectedId,
    selectedTemplate,
    loaded,
    loadBuiltinTemplates,
    loadCustomTemplates,
    selectTemplate,
    addCustomTemplate,
    updateCustomTemplate,
    deleteCustomTemplate,
    init
  }
})
