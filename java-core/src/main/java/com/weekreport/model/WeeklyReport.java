package com.weekreport.model;

import java.util.ArrayList;
import java.util.List;

public class WeeklyReport {
    private String id;
    private String dateRange;
    private String rawInput;
    private String templateId;
    private List<ReportSection> sections;
    private int qualityScore;
    private List<String> keywords;

    public WeeklyReport() {
        this.sections = new ArrayList<>();
        this.keywords = new ArrayList<>();
        this.qualityScore = 0;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDateRange() {
        return dateRange;
    }

    public void setDateRange(String dateRange) {
        this.dateRange = dateRange;
    }

    public String getRawInput() {
        return rawInput;
    }

    public void setRawInput(String rawInput) {
        this.rawInput = rawInput;
    }

    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }

    public List<ReportSection> getSections() {
        return sections;
    }

    public void setSections(List<ReportSection> sections) {
        this.sections = sections;
    }

    public int getQualityScore() {
        return qualityScore;
    }

    public void setQualityScore(int qualityScore) {
        this.qualityScore = qualityScore;
    }

    public List<String> getKeywords() {
        return keywords;
    }

    public void setKeywords(List<String> keywords) {
        this.keywords = keywords;
    }
}
