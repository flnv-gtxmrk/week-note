package com.weekreport.model;

public class WorkItem {
    private String rawText;
    private String category;
    private int priority;
    private boolean completed;
    private double timeSpent;

    public WorkItem(String rawText) {
        this.rawText = rawText;
        this.category = "other";
        this.priority = 3;
        this.completed = true;
        this.timeSpent = 0;
    }

    public String getRawText() {
        return rawText;
    }

    public void setRawText(String rawText) {
        this.rawText = rawText;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public double getTimeSpent() {
        return timeSpent;
    }

    public void setTimeSpent(double timeSpent) {
        this.timeSpent = timeSpent;
    }
}
