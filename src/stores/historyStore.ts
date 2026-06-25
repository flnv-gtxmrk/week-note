import { defineStore } from 'pinia'
import { ref } from 'vue'
import Dexie from 'dexie'
import type { HistoryRecord, WeeklyReport } from '@/types/report'

class ReportDatabase extends Dexie {
  history!: Dexie.Table<HistoryRecord, string>

  constructor() {
    super('WeekReportDB')
    this.version(1).stores({
      history: 'id, date, tags, createdAt'
    })
  }
}

const db = new ReportDatabase()

export const useHistoryStore = defineStore('history', () => {
  const records = ref<HistoryRecord[]>([])
  const loaded = ref(false)

  async function loadRecords() {
    records.value = await db.history.orderBy('createdAt').reverse().toArray()
    loaded.value = true
  }

  async function addReport(report: WeeklyReport) {
    const date = new Date()
    const dateStr = date.toLocaleDateString()
    const record: HistoryRecord = {
      id: crypto.randomUUID(),
      date: dateStr,
      reportTitle: report.dateRange || `${dateStr} 周报`,
      preview: report.fullText.slice(0, 120) + (report.fullText.length > 120 ? '...' : ''),
      fullReport: report,
      tags: report.keywords.slice(0, 5),
      createdAt: date.getTime()
    }
    await db.history.add(record)
    await loadRecords()
    return record.id
  }

  async function deleteRecord(id: string) {
    await db.history.delete(id)
    await loadRecords()
  }

  async function clearAll() {
    await db.history.clear()
    await loadRecords()
  }

  async function searchRecords(query: string) {
    const lower = query.toLowerCase()
    const all = await db.history.toArray()
    return all.filter(r =>
      r.fullReport.rawInput.toLowerCase().includes(lower) ||
      r.fullReport.fullText.toLowerCase().includes(lower) ||
      r.tags.some(t => t.toLowerCase().includes(lower))
    )
  }

  return {
    records,
    loaded,
    loadRecords,
    addReport,
    deleteRecord,
    clearAll,
    searchRecords
  }
})
