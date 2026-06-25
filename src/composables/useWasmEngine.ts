import { ref, onMounted } from 'vue'

export interface WeekReportApi {
  generateReport(input: string, templateJson: string): string
  scoreReport(reportText: string): number
  extractKeywords(input: string): string
  parseWorkItems(input: string): string
  getBuiltinTemplates(): string
}

declare global {
  interface Window {
    weekReportApi?: WeekReportApi
  }
}

const ready = ref(false)
const error = ref<string | null>(null)

export function useWasmEngine() {
  onMounted(() => {
    if (typeof window !== 'undefined' && window.weekReportApi) {
      ready.value = true
    } else {
      // Wait a bit for the script to load
      const check = setInterval(() => {
        if (typeof window !== 'undefined' && window.weekReportApi) {
          ready.value = true
          clearInterval(check)
        }
      }, 100)
      setTimeout(() => {
        clearInterval(check)
        if (!ready.value) {
          error.value = 'Java engine not loaded. Please refresh the page.'
        }
      }, 10000)
    }
  })

  function getApi(): WeekReportApi {
    if (typeof window === 'undefined' || !window.weekReportApi) {
      throw new Error('Java engine is not ready')
    }
    return window.weekReportApi
  }

  function generateReport(input: string, templateJson: string): string {
    return getApi().generateReport(input, templateJson)
  }

  function scoreReport(reportText: string): number {
    return getApi().scoreReport(reportText)
  }

  function extractKeywords(input: string): string[] {
    const json = getApi().extractKeywords(input)
    try {
      return JSON.parse(json)
    } catch {
      return []
    }
  }

  function parseWorkItems(input: string): string[] {
    const json = getApi().parseWorkItems(input)
    try {
      return JSON.parse(json)
    } catch {
      return []
    }
  }

  function getBuiltinTemplates(): string {
    return getApi().getBuiltinTemplates()
  }

  return {
    ready,
    error,
    generateReport,
    scoreReport,
    extractKeywords,
    parseWorkItems,
    getBuiltinTemplates
  }
}
