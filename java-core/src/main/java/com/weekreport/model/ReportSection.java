package com.weekreport.model;

public class ReportSection {
    private String key;
    private String title;
    private String content;
    private int order;

    public ReportSection(String key, String title, String content, int order) {
        this.key = key;
        this.title = title;
        this.content = content;
        this.order = order;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }
}
