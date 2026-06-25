package com.weekreport.core;

import com.weekreport.model.ReportSection;
import com.weekreport.model.WeeklyReport;

public class QualityScorer {

    public int score(WeeklyReport report) {
        int score = 50;

        // Completeness based on sections
        if (report.getSections() != null && !report.getSections().isEmpty()) {
            score += 10;
            for (ReportSection section : report.getSections()) {
                String content = section.getContent();
                if (content != null && !content.isEmpty() && content.length() > 10) {
                    score += 8;
                }
            }
        }

        // Keyword diversity
        if (report.getKeywords() != null && !report.getKeywords().isEmpty()) {
            score += Math.min(15, report.getKeywords().size() * 3);
        }

        // Input length
        if (report.getRawInput() != null && report.getRawInput().length() > 50) {
            score += 10;
        }

        return Math.min(100, score);
    }

    public int scoreText(String text) {
        int score = 50;

        if (text == null || text.isEmpty()) {
            return score;
        }

        // Length score
        int length = text.length();
        if (length > 200) score += 15;
        else if (length > 100) score += 10;
        else if (length > 50) score += 5;

        // Structure score: check for bullets
        if (text.contains("\n- ") || text.contains("\n• ") || text.contains("\n* ")) {
            score += 10;
        }

        // Specificity score: numbers/metrics
        if (text.matches(".*\\d+.*")) {
            score += 10;
        }

        // Action verb score
        String lower = text.toLowerCase();
        if (containsAny(lower, "完成", "实现", "推进", "解决", "优化", "设计", "开发",
                "completed", "implemented", "resolved", "optimized", "designed", "developed")) {
            score += 10;
        }

        return Math.min(100, score);
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
