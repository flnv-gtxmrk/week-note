package com.weekreport.core;

import java.util.ArrayList;
import java.util.List;

public class TemplateParser {

    public Template parseTemplate(String templateJson) {
        if (templateJson == null || templateJson.isEmpty()) {
            return createStandardTemplate();
        }

        // Minimal JSON parsing for built-in IDs
        String id = extractString(templateJson, "\"id\"");
        if ("star".equals(id)) {
            return createStarTemplate();
        } else if ("minimal".equals(id)) {
            return createMinimalTemplate();
        } else if ("manager".equals(id)) {
            return createManagerTemplate();
        }
        return createStandardTemplate();
    }

    private String extractString(String json, String key) {
        int idx = json.indexOf(key);
        if (idx < 0) return "";
        int colon = json.indexOf(':', idx);
        if (colon < 0) return "";
        int firstQuote = json.indexOf('"', colon);
        if (firstQuote < 0) return "";
        int secondQuote = json.indexOf('"', firstQuote + 1);
        if (secondQuote < 0) return "";
        return json.substring(firstQuote + 1, secondQuote);
    }

    public String getBuiltinTemplatesJson() {
        return "[" +
                toJson(createStandardTemplate()) + "," +
                toJson(createStarTemplate()) + "," +
                toJson(createMinimalTemplate()) + "," +
                toJson(createManagerTemplate()) +
                "]";
    }

    public Template createStandardTemplate() {
        Template t = new Template();
        t.setId("standard");
        t.setName("Standard Weekly");
        t.setNameZh("标准周报");
        t.setDescription("Classic weekly report with completed work, progress, plan and issues.");
        t.setDescriptionZh("经典周报结构：已完成工作、进行中、下周计划、问题与风险。");
        t.setBuiltin(true);
        t.setCustom(false);
        List<TemplateSection> sections = new ArrayList<>();
        sections.add(new TemplateSection("summary", "Summary", "本周概述", "Summarize this week's work", "总结本周整体工作情况", true, 0));
        sections.add(new TemplateSection("completed", "Completed Work", "已完成工作", "List completed tasks", "列出本周已完成的工作项", true, 1));
        sections.add(new TemplateSection("inProgress", "In Progress", "进行中工作", "List ongoing tasks", "列出进行中或待完成的工作", true, 2));
        sections.add(new TemplateSection("nextWeek", "Next Week Plan", "下周计划", "Plan for next week", "列出下周工作计划", true, 3));
        sections.add(new TemplateSection("issues", "Issues & Risks", "问题与风险", "List issues and risks", "列出遇到的问题和潜在风险", false, 4));
        t.setSections(sections);
        return t;
    }

    public Template createStarTemplate() {
        Template t = new Template();
        t.setId("star");
        t.setName("STAR Method");
        t.setNameZh("STAR 法");
        t.setDescription("Structure your report with Situation, Task, Action, Result.");
        t.setDescriptionZh("使用情境、任务、行动、结果四个维度组织周报。");
        t.setBuiltin(true);
        t.setCustom(false);
        List<TemplateSection> sections = new ArrayList<>();
        sections.add(new TemplateSection("situation", "Situation", "情境", "Describe the context", "描述工作背景与情境", true, 0));
        sections.add(new TemplateSection("task", "Task", "任务", "Describe your tasks", "描述本周承担的任务", true, 1));
        sections.add(new TemplateSection("action", "Action", "行动", "Describe actions taken", "描述采取的具体行动", true, 2));
        sections.add(new TemplateSection("result", "Result", "结果", "Describe the outcomes", "描述取得的成果与数据", true, 3));
        t.setSections(sections);
        return t;
    }

    public Template createMinimalTemplate() {
        Template t = new Template();
        t.setId("minimal");
        t.setName("Minimalist");
        t.setNameZh("极简版");
        t.setDescription("Concise summary and details only.");
        t.setDescriptionZh("只保留总结和详情，适合快速汇报。");
        t.setBuiltin(true);
        t.setCustom(false);
        List<TemplateSection> sections = new ArrayList<>();
        sections.add(new TemplateSection("summary", "Summary", "总结", "Brief summary", "一句话总结本周工作", true, 0));
        sections.add(new TemplateSection("details", "Details", "详情", "Detailed work items", "详细列出工作事项", true, 1));
        t.setSections(sections);
        return t;
    }

    public Template createManagerTemplate() {
        Template t = new Template();
        t.setId("manager");
        t.setName("Manager View");
        t.setNameZh("管理者视角");
        t.setDescription("Focused on achievements, metrics, risks and support needed.");
        t.setDescriptionZh("面向管理者：成果、数据、风险、所需支持。");
        t.setBuiltin(true);
        t.setCustom(false);
        List<TemplateSection> sections = new ArrayList<>();
        sections.add(new TemplateSection("achievements", "Key Achievements", "关键成果", "List key achievements", "列出本周关键成果", true, 0));
        sections.add(new TemplateSection("metrics", "Metrics", "数据指标", "Include metrics", "列出可量化的指标数据", true, 1));
        sections.add(new TemplateSection("risks", "Risks & Blockers", "风险与阻塞", "List risks", "列出风险与阻塞项", true, 2));
        sections.add(new TemplateSection("support", "Support Needed", "所需支持", "What support is needed", "说明需要哪些支持", false, 3));
        t.setSections(sections);
        return t;
    }

    private String toJson(Template t) {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"id\":\"").append(escape(t.getId())).append("\",");
        sb.append("\"name\":\"").append(escape(t.getName())).append("\",");
        sb.append("\"nameZh\":\"").append(escape(t.getNameZh())).append("\",");
        sb.append("\"description\":\"").append(escape(t.getDescription())).append("\",");
        sb.append("\"descriptionZh\":\"").append(escape(t.getDescriptionZh())).append("\",");
        sb.append("\"isBuiltin\":").append(t.isBuiltin()).append(",");
        sb.append("\"isCustom\":").append(t.isCustom()).append(",");
        sb.append("\"sections\":[");
        for (int i = 0; i < t.getSections().size(); i++) {
            if (i > 0) sb.append(",");
            TemplateSection s = t.getSections().get(i);
            sb.append("{");
            sb.append("\"key\":\"").append(escape(s.getKey())).append("\",");
            sb.append("\"title\":\"").append(escape(s.getTitle())).append("\",");
            sb.append("\"titleZh\":\"").append(escape(s.getTitleZh())).append("\",");
            sb.append("\"prompt\":\"").append(escape(s.getPrompt())).append("\",");
            sb.append("\"promptZh\":\"").append(escape(s.getPromptZh())).append("\",");
            sb.append("\"required\":").append(s.isRequired()).append(",");
            sb.append("\"order\":").append(s.getOrder());
            sb.append("}");
        }
        sb.append("]}");
        return sb.toString();
    }

    private String escape(String value) {
        if (value == null) return "";
        return value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t");
    }
}
