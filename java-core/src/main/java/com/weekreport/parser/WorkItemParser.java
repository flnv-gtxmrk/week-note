package com.weekreport.parser;

import java.util.ArrayList;
import java.util.List;

public class WorkItemParser {

    public List<String> splitLines(String input) {
        List<String> result = new ArrayList<String>();
        if (input == null || input.isEmpty()) {
            return result;
        }

        String[] lines = input.split("\\r?\\n");
        for (String line : lines) {
            String trimmed = line.trim();
            if (!trimmed.isEmpty()) {
                result.add(trimmed);
            }
        }
        return result;
    }

    public String detectCategory(String item) {
        String lower = item.toLowerCase();
        if (containsAny(lower, "会议", "meeting", "评审", "review", "讨论", "discussion")) {
            return "meeting";
        }
        if (containsAny(lower, "bug", "修复", "fix", "问题", "issue")) {
            return "bugfix";
        }
        if (containsAny(lower, "开发", "dev", "实现", "implement", "编码", "code", "接口", "api")) {
            return "development";
        }
        if (containsAny(lower, "文档", "doc", "readme", "wiki")) {
            return "documentation";
        }
        if (containsAny(lower, "测试", "test", "验证", "verify")) {
            return "testing";
        }
        if (containsAny(lower, "学习", "learn", "调研", "research", "培训", "training")) {
            return "learning";
        }
        return "other";
    }

    public int estimatePriority(String item) {
        String lower = item.toLowerCase();
        if (containsAny(lower, "紧急", "urgent", "重要", "important", "p0", "critical")) {
            return 5;
        }
        if (containsAny(lower, "优先", "priority", "p1", "高优")) {
            return 4;
        }
        if (containsAny(lower, "常规", "normal", "p2")) {
            return 3;
        }
        if (containsAny(lower, "低优", "low", "p3")) {
            return 2;
        }
        return 3;
    }

    private boolean containsAny(String source, String... targets) {
        for (String target : targets) {
            if (source.contains(target)) {
                return true;
            }
        }
        return false;
    }
}
