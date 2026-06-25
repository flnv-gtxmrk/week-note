export interface ReportSection {
  key: string
  title: string
  content: string
  order: number
}

export interface WeeklyReport {
  id: string
  dateRange: string
  createdAt: Date
  sections: ReportSection[]
  rawInput: string
  templateId: string
  qualityScore?: number
  keywords: string[]
  fullText: string
}

export interface HistoryRecord {
  id: string
  date: string
  reportTitle: string
  preview: string
  fullReport: WeeklyReport
  tags: string[]
  createdAt: number
}

export interface WorkItem {
  id: string
  rawText: string
  category: string
  priority: number
  completed: boolean
  timeSpent?: number
}
