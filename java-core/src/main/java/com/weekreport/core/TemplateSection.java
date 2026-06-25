package com.weekreport.core;

public class TemplateSection {
    private String key;
    private String title;
    private String titleZh;
    private String prompt;
    private String promptZh;
    private boolean required;
    private int order;

    public TemplateSection() {
    }

    public TemplateSection(String key, String title, String titleZh, String prompt, String promptZh, boolean required, int order) {
        this.key = key;
        this.title = title;
        this.titleZh = titleZh;
        this.prompt = prompt;
        this.promptZh = promptZh;
        this.required = required;
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

    public String getTitleZh() {
        return titleZh;
    }

    public void setTitleZh(String titleZh) {
        this.titleZh = titleZh;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getPromptZh() {
        return promptZh;
    }

    public void setPromptZh(String promptZh) {
        this.promptZh = promptZh;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }
}
