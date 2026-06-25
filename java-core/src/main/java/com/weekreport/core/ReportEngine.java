package com.weekreport.core;

import com.weekreport.model.ReportSection;
import com.weekreport.model.WeeklyReport;
import com.weekreport.parser.KeywordExtractor;
import com.weekreport.parser.WorkItemParser;

import java.util.ArrayList;
import java.util.List;

public class ReportEngine {

    private final WorkItemParser itemParser;
    private final KeywordExtractor keywordExtractor;
    private final TemplateParser templateParser;
    private final QualityScorer qualityScorer;

    public ReportEngine() {
        this.itemParser = new WorkItemParser();
        this.keywordExtractor = new KeywordExtractor();
        this.templateParser = new TemplateParser();
        this.qualityScorer = new QualityScorer();
    }

    public String generateReportJson(String input, String templateJson) {
        WeeklyReport report = new WeeklyReport();
        report.setRawInput(input);

        Template template = templateParser.parseTemplate(templateJson);
        List<String> items = itemParser.splitLines(input);

        List<ReportSection> sections = new ArrayList<>();
        int order = 0;
        for (TemplateSection section : template.getSections()) {
            String content = generateSectionContent(section, items, input);
            sections.add(new ReportSection(section.getKey(), section.getTitle(), content, order++));
        }

        report.setSections(sections);
        report.setKeywords(keywordExtractor.extract(input));
        report.setQualityScore(qualityScorer.score(report));
        report.setDateRange("");
        report.setTemplateId(template.getId());

        return toJson(report);
    }

    private String generateSectionContent(TemplateSection section, List<String> items, String fullInput) {
        String key = section.getKey();
        StringBuilder sb = new StringBuilder();

        if ("summary".equals(key)) {
            sb.append("本周共完成 ").append(items.size()).append(" 项工作，主要围绕 ");
            sb.append(joinTopKeywords(keywordExtractor.extract(fullInput), 3));
            sb.append(" 等方面展开。");
        } else if ("completed".equals(key)) {
            for (String item : items) {
                if (isCompleted(item)) {
                    sb.append("- ").append(cleanItem(item)).append("\n");
                }
            }
            if (sb.length() == 0) {
                sb.append("- 完成本周常规工作\n");
            }
        } else if ("inProgress".equals(key)) {
            sb.append("- 持续推进中，预计下周完成\n");
        } else if ("nextWeek".equals(key)) {
            sb.append("- 继续跟进本周未完成事项\n");
            sb.append("- 根据优先级安排下周工作\n");
        } else if ("issues".equals(key)) {
            sb.append("- 暂无重大问题\n");
        } else if ("star".equals(key)) {
            sb.append("- 情境：本周工作内容\n");
            sb.append("- 任务：").append(items.isEmpty() ? "完成工作目标" : cleanItem(items.get(0))).append("\n");
            sb.append("- 行动：按计划执行并复盘\n");
            sb.append("- 结果：达成预期进度\n");
        } else {
            for (String item : items) {
                sb.append("- ").append(cleanItem(item)).append("\n");
            }
            if (sb.length() == 0) {
                sb.append("- ").append(section.getPrompt()).append("\n");
            }
        }

        return sb.toString().trim();
    }

    private boolean isCompleted(String item) {
        String lower = item.toLowerCase();
        return lower.contains("完成") || lower.contains("done") || lower.contains("finished")
                || lower.contains("fix") || lower.contains("修复") || lower.contains("发布")
                || lower.contains("上线");
    }

    private String cleanItem(String item) {
        return item.replaceAll("^[\\s\\-•\\*\\d\\.]+", "").trim();
    }

    private String joinTopKeywords(List<String> keywords, int limit) {
        if (keywords.isEmpty()) {
            return "各项工作";
        }
        StringBuilder sb = new StringBuilder();
        int count = Math.min(limit, keywords.size());
        for (int i = 0; i < count; i++) {
            if (i > 0) {
                sb.append("、");
            }
            sb.append(keywords.get(i));
        }
        return sb.toString();
    }

    public int scoreReport(String reportText) {
        return qualityScorer.scoreText(reportText);
    }

    public String extractKeywordsJson(String input) {
        List<String> keywords = keywordExtractor.extract(input);
        return toJsonArray(keywords);
    }

    public String parseWorkItemsJson(String input) {
        List<String> items = itemParser.splitLines(input);
        return toJsonArray(items);
    }

    public String getBuiltinTemplatesJson() {
        return templateParser.getBuiltinTemplatesJson();
    }

    private String toJson(WeeklyReport report) {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"id\":\"").append(escapeJson(report.getId())).append("\",");
        sb.append("\"dateRange\":\"").append(escapeJson(report.getDateRange())).append("\",");
        sb.append("\"rawInput\":\"").append(escapeJson(report.getRawInput())).append("\",");
        sb.append("\"templateId\":\"").append(escapeJson(report.getTemplateId())).append("\",");
        sb.append("\"qualityScore\":").append(report.getQualityScore()).append(",");
        sb.append("\"keywords\":").append(toJsonArray(report.getKeywords())).append(",");
        sb.append("\"sections\":[");
        for (int i = 0; i < report.getSections().size(); i++) {
            if (i > 0) sb.append(",");
            ReportSection s = report.getSections().get(i);
            sb.append("{");
            sb.append("\"key\":\"").append(escapeJson(s.getKey())).append("\",");
            sb.append("\"title\":\"").append(escapeJson(s.getTitle())).append("\",");
            sb.append("\"content\":\"").append(escapeJson(s.getContent())).append("\",");
            sb.append("\"order\":").append(s.getOrder());
            sb.append("}");
        }
        sb.append("]}");
        return sb.toString();
    }

    private String toJsonArray(List<String> list) {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append("\"").append(escapeJson(list.get(i))).append("\"");
        }
        sb.append("]");
        return sb.toString();
    }

    private String escapeJson(String value) {
        if (value == null) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < value.length(); i++) {
            char c = value.charAt(i);
            switch (c) {
                case '"': sb.append("\\\""); break;
                case '\\': sb.append("\\\\"); break;
                case '\b': sb.append("\\b"); break;
                case '\f': sb.append("\\f"); break;
                case '\n': sb.append("\\n"); break;
                case '\r': sb.append("\\r"); break;
                case '\t': sb.append("\\t"); break;
                default:
                    if (c < 0x20) {
                        sb.append(String.format("\\u%04x", (int) c));
                    } else {
                        sb.append(c);
                    }
            }
        }
        return sb.toString();
    }
}
