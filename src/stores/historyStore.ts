import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { HistoryRecord, WeeklyReport } from '@/types/report'

const STORAGE_KEY = 'week_report_history'

export const useHistoryStore = defineStore('history', () => {
  const records = ref<HistoryRecord[]>([])
  const loaded = ref(false)

  function loadRecords() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        records.value = JSON.parse(stored)
      }
    } catch { records.value = [] }
    loaded.value = true
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.value))
  }

  function addReport(report: WeeklyReport): string {
    const now = new Date()
    const id = crypto.randomUUID()
    const fullText = report.fullText || report.sections
      ?.slice()
      .sort((a, b) => a.order - b.order)
      .map(s => `${s.title}\n\n${s.content}`)
      .join('\n\n') || ''

    const record: HistoryRecord = {
      id,
      date: now.toLocaleDateString(),
      reportTitle: report.dateRange || `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} 周报`,
      preview: fullText.slice(0, 150) + (fullText.length > 150 ? '...' : ''),
      fullReport: { ...report, fullText, id },
      tags: report.keywords?.slice(0, 5) || [],
      createdAt: now.getTime()
    }

    records.value.unshift(record)
    persist()
    return id
  }

  function deleteRecord(id: string) {
    records.value = records.value.filter(r => r.id !== id)
    persist()
  }

  function clearAll() {
    records.value = []
    persist()
  }

  function searchRecords(query: string): HistoryRecord[] {
    const lower = query.toLowerCase()
    return records.value.filter(r =>
      r.fullReport?.rawInput?.toLowerCase().includes(lower) ||
      r.fullReport?.fullText?.toLowerCase().includes(lower) ||
      r.reportTitle?.toLowerCase().includes(lower) ||
      r.tags?.some(t => t.toLowerCase().includes(lower))
    )
  }

  // Auto-load on store creation
  loadRecords()

  return { records, loaded, loadRecords, addReport, deleteRecord, clearAll, searchRecords }
})
