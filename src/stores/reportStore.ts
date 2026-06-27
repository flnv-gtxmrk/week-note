import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useWasmEngine } from '@/composables/useWasmEngine'
import { useTemplateStore } from './templateStore'
import type { WeeklyReport, ReportSection, ReportType } from '@/types/report'

export const useReportStore = defineStore('report', () => {
  const { generateReport, scoreReport, extractKeywords } = useWasmEngine()
  const templateStore = useTemplateStore()

  const inputText = ref('')
  const currentReport = ref<WeeklyReport | null>(null)
  const isGenerating = ref(false)
  const error = ref<string | null>(null)

  const reportText = computed(() => {
    if (!currentReport.value) return ''
    return currentReport.value.sections
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(s => `${s.title}\n\n${s.content}`)
      .join('\n\n')
  })

  function setInput(text: string) { inputText.value = text }

  function getDateRange(): string {
    const now = new Date()
    const type = templateStore.reportType

    if (type === 'daily') {
      return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`
    }

    if (type === 'weekly') {
      const day = now.getDay()
      const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1)
      const monday = new Date(now.getFullYear(), now.getMonth(), diffToMonday)
      const friday = new Date(monday)
      friday.setDate(monday.getDate() + 4)
      const fmt = (d: Date) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
      return `${fmt(monday)} - ${fmt(friday)}`
    }

    // monthly
    return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}`
  }

  function generate() {
    if (!inputText.value.trim()) {
      error.value = '请输入工作内容'
      return
    }

    isGenerating.value = true
    error.value = null

    try {
      const template = templateStore.selectedTemplate
      if (!template) {
        error.value = '未选择模板'
        return
      }

      const templateJson = JSON.stringify({
        id: template.id,
        name: template.name,
        sections: template.sections,
        reportType: template.reportType
      })

      const resultJson = generateReport(inputText.value, templateJson)
      const result = JSON.parse(resultJson) as WeeklyReport

      const sections = result.sections || []
      const fullText = sections
        .slice()
        .sort((a: ReportSection, b: ReportSection) => a.order - b.order)
        .map((s: ReportSection) => `${s.title}\n\n${s.content}`)
        .join('\n\n')

      currentReport.value = {
        ...result,
        createdAt: new Date(),
        dateRange: getDateRange(),
        reportType: template.reportType,
        fullText,
        keywords: result.keywords || extractKeywords(inputText.value)
      }

      if (currentReport.value) {
        currentReport.value.qualityScore = scoreReport(fullText)
      }
    } catch (e) {
      console.error('Generate report failed:', e)
      error.value = '生成失败，请检查输入内容'
    } finally {
      isGenerating.value = false
    }
  }

  function clear() {
    currentReport.value = null
    error.value = null
  }

  function loadReport(report: WeeklyReport) {
    currentReport.value = report
    inputText.value = report.rawInput
    // Set template type to match
    if (report.reportType) {
      templateStore.setReportType(report.reportType)
    }
    if (report.templateId) {
      templateStore.selectTemplate(report.templateId)
    }
  }

  return { inputText, currentReport, isGenerating, error, reportText, setInput, generate, clear, loadReport }
})
