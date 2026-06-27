import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ReportTemplate } from '@/types/template'
import type { ReportType } from '@/types/report'

const CUSTOM_TEMPLATES_KEY = 'custom_templates'

const BUILTIN_TEMPLATES: ReportTemplate[] = [
  // ===== DAILY =====
  {
    id: 'daily-standard',
    name: 'Standard Daily',
    nameZh: '标准日报',
    description: 'Today done, issues, tomorrow plan.',
    descriptionZh: '今日完成、遇到问题、明日计划。',
    isBuiltin: true, isCustom: false, tags: ['daily', 'work'], style: 'formal', reportType: 'daily',
    sections: [
      { key: 'todayDone', title: 'Today Completed', titleZh: '今日完成', prompt: 'What I did today', promptZh: '今天完成了哪些工作', required: true, order: 0 },
      { key: 'issues', title: 'Issues', titleZh: '遇到问题', prompt: 'Issues encountered', promptZh: '今天遇到的问题或阻塞', required: false, order: 1 },
      { key: 'tomorrow', title: 'Tomorrow Plan', titleZh: '明日计划', prompt: 'Plan for tomorrow', promptZh: '明天计划做什么', required: true, order: 2 }
    ]
  },
  {
    id: 'daily-minimal',
    name: 'Quick Daily',
    nameZh: '极简日报',
    description: 'Just today summary. One paragraph.',
    descriptionZh: '一段话总结今天。极简高效。',
    isBuiltin: true, isCustom: false, tags: ['daily', 'quick'], style: 'minimal', reportType: 'daily',
    sections: [
      { key: 'summary', title: 'Today Summary', titleZh: '今日总结', prompt: 'One paragraph summary', promptZh: '一段话总结今天的工作', required: true, order: 0 }
    ]
  },
  {
    id: 'daily-learn',
    name: 'Learning Daily',
    nameZh: '学习日报',
    description: 'Focus on what you learned today.',
    descriptionZh: '聚焦今天学到了什么。',
    isBuiltin: true, isCustom: false, tags: ['daily', 'learning'], style: 'casual', reportType: 'daily',
    sections: [
      { key: 'learned', title: 'What I Learned', titleZh: '今日所学', prompt: 'Key learnings', promptZh: '今天学到的知识点或技能', required: true, order: 0 },
      { key: 'applied', title: 'Applied', titleZh: '实践应用', prompt: 'How I applied it', promptZh: '如何应用到实际工作中', required: false, order: 1 },
      { key: 'questions', title: 'Questions', titleZh: '待解决疑问', prompt: 'Open questions', promptZh: '还有哪些不懂的', required: false, order: 2 }
    ]
  },

  // ===== WEEKLY =====
  {
    id: 'standard',
    name: 'Standard Weekly',
    nameZh: '标准周报',
    description: 'Classic weekly report: summary, completed, in-progress, next week plan, issues.',
    descriptionZh: '经典周报结构：本周概述、已完成、进行中、下周计划、问题与风险。',
    isBuiltin: true, isCustom: false, tags: ['work', 'weekly'], style: 'formal', reportType: 'weekly',
    sections: [
      { key: 'summary', title: 'Summary', titleZh: '本周概述', prompt: 'Summarize this week', promptZh: '总结本周整体工作情况', required: true, order: 0 },
      { key: 'completed', title: 'Completed Work', titleZh: '已完成工作', prompt: 'Completed tasks', promptZh: '本周已完成的工作项', required: true, order: 1 },
      { key: 'inProgress', title: 'In Progress', titleZh: '进行中', prompt: 'Ongoing tasks', promptZh: '进行中或待完成的工作', required: true, order: 2 },
      { key: 'nextWeek', title: 'Next Week Plan', titleZh: '下周计划', prompt: 'Plan for next week', promptZh: '下周工作计划安排', required: true, order: 3 },
      { key: 'issues', title: 'Issues & Risks', titleZh: '问题与风险', prompt: 'Issues and risks', promptZh: '遇到的问题和潜在风险', required: false, order: 4 }
    ]
  },
  {
    id: 'star',
    name: 'STAR Method',
    nameZh: 'STAR 法',
    description: 'Situation, Task, Action, Result. Highlight achievements.',
    descriptionZh: '情境、任务、行动、结果。适合突出个人贡献。',
    isBuiltin: true, isCustom: false, tags: ['achievement', 'review'], style: 'formal', reportType: 'weekly',
    sections: [
      { key: 'situation', title: 'Situation', titleZh: '情境', prompt: 'Context', promptZh: '工作背景与情境', required: true, order: 0 },
      { key: 'task', title: 'Task', titleZh: '任务', prompt: 'The task', promptZh: '具体任务', required: true, order: 1 },
      { key: 'action', title: 'Action', titleZh: '行动', prompt: 'Actions taken', promptZh: '采取的行动', required: true, order: 2 },
      { key: 'result', title: 'Result', titleZh: '结果', prompt: 'Outcomes', promptZh: '成果与数据', required: true, order: 3 }
    ]
  },
  {
    id: 'minimal',
    name: 'Minimalist',
    nameZh: '极简版',
    description: 'Summary + details only. Quick and concise.',
    descriptionZh: '只保留总结和详情，快速简洁。',
    isBuiltin: true, isCustom: false, tags: ['quick', 'simple'], style: 'minimal', reportType: 'weekly',
    sections: [
      { key: 'summary', title: 'Summary', titleZh: '总结', prompt: 'One sentence', promptZh: '一句话总结', required: true, order: 0 },
      { key: 'details', title: 'Details', titleZh: '详情', prompt: 'Work items', promptZh: '工作事项', required: true, order: 1 }
    ]
  },
  {
    id: 'manager',
    name: 'Manager View',
    nameZh: '管理者视角',
    description: 'Achievements, metrics, risks, support needed.',
    descriptionZh: '关键成果、数据指标、风险、所需支持。',
    isBuiltin: true, isCustom: false, tags: ['management', 'metrics'], style: 'formal', reportType: 'weekly',
    sections: [
      { key: 'achievements', title: 'Key Achievements', titleZh: '关键成果', prompt: 'Achievements', promptZh: '关键成果', required: true, order: 0 },
      { key: 'metrics', title: 'Metrics', titleZh: '数据指标', prompt: 'Metrics', promptZh: '数据指标', required: true, order: 1 },
      { key: 'risks', title: 'Risks & Blockers', titleZh: '风险与阻塞', prompt: 'Risks', promptZh: '风险', required: true, order: 2 },
      { key: 'support', title: 'Support Needed', titleZh: '所需支持', prompt: 'Support', promptZh: '所需支持', required: false, order: 3 }
    ]
  },
  {
    id: 'okr',
    name: 'OKR Review',
    nameZh: 'OKR 复盘',
    description: 'Objectives and Key Results review.',
    descriptionZh: '目标与关键结果复盘。',
    isBuiltin: true, isCustom: false, tags: ['okr', 'review'], style: 'formal', reportType: 'weekly',
    sections: [
      { key: 'objectives', title: 'Objectives', titleZh: '目标回顾', prompt: 'Objectives', promptZh: '目标', required: true, order: 0 },
      { key: 'keyResults', title: 'Key Results', titleZh: '关键结果', prompt: 'Key results', promptZh: '关键结果', required: true, order: 1 },
      { key: 'highlights', title: 'Highlights', titleZh: '亮点', prompt: 'Highlights', promptZh: '亮点', required: true, order: 2 },
      { key: 'improvements', title: 'To Improve', titleZh: '待改进', prompt: 'Improvements', promptZh: '待改进', required: false, order: 3 }
    ]
  },
  {
    id: 'sprint',
    name: 'Sprint Retro',
    nameZh: '敏捷迭代回顾',
    description: 'Sprint goal, completed stories, velocity, retro.',
    descriptionZh: '冲刺目标、完成故事、速率、回顾。',
    isBuiltin: true, isCustom: false, tags: ['agile', 'sprint'], style: 'casual', reportType: 'weekly',
    sections: [
      { key: 'sprintGoal', title: 'Sprint Goal', titleZh: '冲刺目标', prompt: 'Goal', promptZh: '目标', required: true, order: 0 },
      { key: 'completed', title: 'Completed Stories', titleZh: '完成的故事', prompt: 'Stories', promptZh: '故事', required: true, order: 1 },
      { key: 'velocity', title: 'Velocity', titleZh: '速率', prompt: 'Points', promptZh: '点数', required: false, order: 2 },
      { key: 'retro', title: 'Retrospective', titleZh: '回顾反思', prompt: 'Retro', promptZh: '回顾', required: true, order: 3 }
    ]
  },

  // ===== MONTHLY =====
  {
    id: 'monthly-standard',
    name: 'Standard Monthly',
    nameZh: '标准月报',
    description: 'Monthly summary, achievements, data, next month plan.',
    descriptionZh: '月度总结、核心成果、数据指标、下月计划。',
    isBuiltin: true, isCustom: false, tags: ['monthly', 'work'], style: 'formal', reportType: 'monthly',
    sections: [
      { key: 'monthlySummary', title: 'Monthly Summary', titleZh: '月度总结', prompt: 'Summarize this month', promptZh: '总结本月整体工作情况', required: true, order: 0 },
      { key: 'achievements', title: 'Key Achievements', titleZh: '核心成果', prompt: 'Key achievements this month', promptZh: '本月取得的核心成果', required: true, order: 1 },
      { key: 'data', title: 'Data & Metrics', titleZh: '数据指标', prompt: 'Quantifiable data', promptZh: '可量化的数据指标', required: true, order: 2 },
      { key: 'issues', title: 'Issues & Lessons', titleZh: '问题与经验', prompt: 'Issues and lessons learned', promptZh: '遇到的问题和经验教训', required: false, order: 3 },
      { key: 'nextMonth', title: 'Next Month Plan', titleZh: '下月计划', prompt: 'Plan for next month', promptZh: '下月工作计划安排', required: true, order: 4 }
    ]
  },
  {
    id: 'monthly-okr',
    name: 'Monthly OKR',
    nameZh: '月度 OKR 复盘',
    description: 'Review monthly OKR progress, deviations, and adjustments.',
    descriptionZh: '复盘月度 OKR 进展、偏差和调整。',
    isBuiltin: true, isCustom: false, tags: ['monthly', 'okr'], style: 'formal', reportType: 'monthly',
    sections: [
      { key: 'objectives', title: 'Objectives Review', titleZh: '目标回顾', prompt: 'Monthly objectives', promptZh: '月度目标回顾', required: true, order: 0 },
      { key: 'keyResults', title: 'Key Results Progress', titleZh: '关键结果进展', prompt: 'KR progress', promptZh: '各关键结果完成进度', required: true, order: 1 },
      { key: 'deviations', title: 'Deviations', titleZh: '偏差分析', prompt: 'Why deviations occurred', promptZh: '偏差原因分析', required: false, order: 2 },
      { key: 'adjustments', title: 'Adjustments', titleZh: '调整方案', prompt: 'Adjustments for next month', promptZh: '下月调整方案', required: true, order: 3 }
    ]
  },
  {
    id: 'monthly-growth',
    name: 'Growth Monthly',
    nameZh: '成长月报',
    description: 'Skills improved, books read, goals for next month.',
    descriptionZh: '技能提升、阅读学习、下月目标。',
    isBuiltin: true, isCustom: false, tags: ['monthly', 'growth'], style: 'casual', reportType: 'monthly',
    sections: [
      { key: 'skills', title: 'Skills Improved', titleZh: '技能提升', prompt: 'Skills improved this month', promptZh: '本月提升了哪些技能', required: true, order: 0 },
      { key: 'learning', title: 'Learning', titleZh: '学习收获', prompt: 'What I learned', promptZh: '本月学习了什么', required: true, order: 1 },
      { key: 'highlights', title: 'Highlights', titleZh: '本月亮点', prompt: 'Monthly highlights', promptZh: '本月最值得记录的事', required: false, order: 2 },
      { key: 'nextGoals', title: 'Next Month Goals', titleZh: '下月目标', prompt: 'Goals for next month', promptZh: '下月想达成的目标', required: true, order: 3 }
    ]
  }
]

export const useTemplateStore = defineStore('templates', () => {
  const builtinTemplates = ref<ReportTemplate[]>([...BUILTIN_TEMPLATES])
  const customTemplates = ref<ReportTemplate[]>([])
  const selectedId = ref<string>('daily-standard')
  const reportType = ref<ReportType>('daily')
  const loaded = ref(true)

  const allTemplates = computed(() => [...builtinTemplates.value, ...customTemplates.value])

  const filteredTemplates = computed(() =>
    allTemplates.value.filter(t => t.reportType === reportType.value)
  )

  const selectedTemplate = computed(() =>
    allTemplates.value.find(t => t.id === selectedId.value) ||
    filteredTemplates.value[0] ||
    builtinTemplates.value[0]
  )

  function loadCustomTemplates() {
    try {
      const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY)
      if (stored) customTemplates.value = JSON.parse(stored)
    } catch { customTemplates.value = [] }
  }

  function saveCustomTemplates() {
    localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(customTemplates.value))
  }

  function selectTemplate(id: string) { selectedId.value = id }

  function setReportType(type: ReportType) {
    reportType.value = type
    // Auto-select first template of this type
    const first = filteredTemplates.value[0]
    if (first) selectedId.value = first.id
  }

  function addCustomTemplate(template: ReportTemplate) {
    customTemplates.value.push(template)
    saveCustomTemplates()
  }

  function updateCustomTemplate(id: string, updates: Partial<ReportTemplate>) {
    const i = customTemplates.value.findIndex(t => t.id === id)
    if (i >= 0) {
      customTemplates.value[i] = { ...customTemplates.value[i], ...updates }
      saveCustomTemplates()
    }
  }

  function deleteCustomTemplate(id: string) {
    customTemplates.value = customTemplates.value.filter(t => t.id !== id)
    if (selectedId.value === id) selectedId.value = filteredTemplates.value[0]?.id || 'standard'
    saveCustomTemplates()
  }

  loadCustomTemplates()

  return {
    builtinTemplates, customTemplates, allTemplates, filteredTemplates,
    selectedId, selectedTemplate, reportType, loaded,
    selectTemplate, setReportType, addCustomTemplate, updateCustomTemplate, deleteCustomTemplate,
    init: loadCustomTemplates
  }
})
