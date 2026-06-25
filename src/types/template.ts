export interface TemplateSection {
  key: string
  title: string
  titleZh: string
  prompt: string
  promptZh: string
  required: boolean
  order: number
}

export interface ReportTemplate {
  id: string
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  sections: TemplateSection[]
  isBuiltin: boolean
  isCustom: boolean
  createdAt?: number
}
