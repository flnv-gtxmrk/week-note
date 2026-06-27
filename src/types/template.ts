import type { ReportType } from './report'

export interface TemplateSection {
  key: string
  title: string
  titleZh: string
  prompt: string
  promptZh: string
  required: boolean
  order: number
}

export type TemplateStyle = 'formal' | 'casual' | 'technical' | 'minimal' | 'creative'

export interface ReportTemplate {
  id: string
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  sections: TemplateSection[]
  tags: string[]
  style: TemplateStyle
  reportType: ReportType      // daily / weekly / monthly
  isBuiltin: boolean
  isCustom: boolean
  createdAt?: number
}
