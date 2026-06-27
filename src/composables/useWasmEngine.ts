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

// JS fallback: parse template JSON
function parseTemplateJson(templateJson: string) {
  try {
    return JSON.parse(templateJson)
  } catch {
    return { id: 'standard', sections: [] }
  }
}

// JS fallback: split input into work items
function splitWorkItems(input: string): string[] {
  return input.split('\n').map(l => l.trim()).filter(l => l.length > 0)
}

// JS fallback: extract keywords
function extractKeywords(input: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that', 'these', 'those',
    'of', 'in', 'on', 'at', 'to', 'for', 'with', 'about', 'as', 'and', 'or', 'but',
    '了', '的', '是', '在', '和', '与', '及', '等', '对', '为', '有', '我', '你', '他',
    '她', '它', '我们', '你们', '他们', '这个', '那个', '这些', '那些', '一个', '一种',
    '完成', '进行', '参加', '开展', '做好', '推进', '落实', '工作', '本周', '下周', '上周'
  ])
  const freq: Record<string, number> = {}
  // Chinese bigrams
  for (let i = 0; i < input.length - 1; i++) {
    const c = input[i]
    const n = input[i + 1]
    if (/[一-龥]/.test(c) && /[一-龥]/.test(n)) {
      const bigram = c + n
      if (!stopWords.has(bigram)) {
        freq[bigram] = (freq[bigram] || 0) + 1
      }
    }
  }
  // English words
  input.toLowerCase().split(/[^a-z0-9]+/).forEach(w => {
    if (w.length > 2 && !stopWords.has(w)) {
      freq[w] = (freq[w] || 0) + 1
    }
  })
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([k]) => k)
}

// JS fallback: score report quality
function scoreReportText(text: string): number {
  let score = 50
  if (!text) return score
  if (text.length > 200) score += 15
  else if (text.length > 100) score += 10
  else if (text.length > 50) score += 5
  if (text.includes('\n- ') || text.includes('\n• ')) score += 10
  if (/\d+/.test(text)) score += 10
  const actionWords = ['完成', '实现', '推进', '解决', '优化', '设计', '开发',
    'completed', 'implemented', 'resolved', 'optimized', 'designed', 'developed']
  if (actionWords.some(w => text.toLowerCase().includes(w))) score += 10
  return Math.min(100, score)
}

// JS fallback: generate report from input and template
function generateReportJs(input: string, templateJson: string): string {
  const template = parseTemplateJson(templateJson)
  const items = splitWorkItems(input)
  const sections: any[] = []

  for (const section of (template.sections || [])) {
    let content = ''
    switch (section.key) {
      case 'summary':
        content = `本周共完成 ${items.length} 项工作。`
        break
      case 'completed':
        content = items.filter((i: string) =>
          /完成|done|finished|修复|发布|上线|fix|release/i.test(i)
        ).map((i: string) => `- ${i.replace(/^[-•*\d.\s]+/, '')}`).join('\n')
        if (!content) content = `- 完成本周常规工作`
        break
      case 'inProgress':
        content = `- 持续推进中，预计下周完成`
        break
      case 'nextWeek':
        content = `- 继续跟进本周未完成事项\n- 根据优先级安排下周工作`
        break
      case 'issues':
        content = `- 暂无重大问题`
        break
      case 'situation':
        content = `- ${items.length > 0 ? items[0] : '本周工作内容'}`
        break
      case 'task':
        content = items.map((i: string) => `- ${i}`).join('\n') || '- 完成工作目标'
        break
      case 'action':
        content = `- 按计划执行并完成各项任务\n- 及时沟通协调解决问题`
        break
      case 'result':
        content = `- 达成预期进度，完成 ${items.length} 项工作`
        break
      case 'details':
        content = items.map((i: string) => `- ${i}`).join('\n') || '- 本周工作事项'
        break
      case 'achievements':
        content = items.slice(0, 3).map((i: string) => `- ${i}`).join('\n') || '- 取得阶段性成果'
        break
      case 'metrics':
        content = `- 本周完成 ${items.length} 项任务`
        break
      case 'risks':
        content = `- 暂无重大风险`
        break
      case 'support':
        content = `- 暂无特殊需求`
        break
      case 'objectives':
        content = `- 本周核心目标达成情况良好`
        break
      case 'keyResults':
        content = items.map((i: string) => `- ${i}`).join('\n') || '- 关键结果推进中'
        break
      case 'highlights':
        content = items.slice(0, 2).map((i: string) => `- ${i}`).join('\n') || '- 本周工作亮点'
        break
      case 'improvements':
        content = `- 持续优化工作流程\n- 提升沟通效率`
        break
      case 'sprintGoal':
        content = `- ${items.length > 0 ? items[0] : '冲刺目标'}`
        break
      case 'velocity':
        content = `- 完成 ${items.length} 个任务`
        break
      case 'retro':
        content = `- 做得好的：按时完成任务\n- 需改进的：提前规划优先级`
        break
      default:
        content = items.slice(0, 5).map((i: string) => `- ${i}`).join('\n') || `- ${section.promptZh || section.titleZh || section.title}`
    }
    sections.push({ key: section.key, title: section.titleZh || section.title, content: content.trim(), order: section.order })
  }

  return JSON.stringify({
    id: crypto.randomUUID(),
    dateRange: '',
    rawInput: input,
    templateId: template.id || 'standard',
    keywords: extractKeywords(input),
    qualityScore: scoreReportText(input),
    sections
  })
}

export function useWasmEngine() {
  onMounted(() => {
    ready.value = true
    if (typeof window !== 'undefined' && window.weekReportApi) {
      // Java engine is also available, but we use JS fallback for reliability
    }
  })

  function generateReport(input: string, templateJson: string): string {
    return generateReportJs(input, templateJson)
  }

  function scoreReport(reportText: string): number {
    return scoreReportText(reportText)
  }

  function extractExtractKeywords(input: string): string[] {
    return extractKeywords(input)
  }

  function parseWorkItems(input: string): string[] {
    return splitWorkItems(input)
  }

  function getBuiltinTemplates(): string {
    return '[]'  // Not used anymore, templates are in templateStore
  }

  return {
    ready,
    error,
    generateReport,
    scoreReport,
    extractKeywords: extractExtractKeywords,
    parseWorkItems,
    getBuiltinTemplates
  }
}
