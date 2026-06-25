package com.weekreport.wasm;

import org.teavm.jso.JSBody;
import org.teavm.jso.JSObject;
import org.teavm.jso.JSExport;
import com.weekreport.core.ReportEngine;

public class ExportedApi implements JSObject {
    private static final ReportEngine engine = new ReportEngine();

    @JSExport
    public static String generateReport(String input, String templateJson) {
        return engine.generateReportJson(input, templateJson);
    }

    @JSExport
    public static int scoreReport(String reportText) {
        return engine.scoreReport(reportText);
    }

    @JSExport
    public static String extractKeywords(String input) {
        return engine.extractKeywordsJson(input);
    }

    @JSExport
    public static String parseWorkItems(String input) {
        return engine.parseWorkItemsJson(input);
    }

    @JSExport
    public static String getBuiltinTemplates() {
        return engine.getBuiltinTemplatesJson();
    }

    public static void main(String[] args) {
        registerApi();
    }

    @JSBody(script = "if (typeof window !== 'undefined') { " +
            "window.weekReportApi = {" +
            "generateReport: function(input, templateJson) { return $rt_globals.com.weekreport.wasm.ExportedApi.generateReport(input, templateJson); }," +
            "scoreReport: function(reportText) { return $rt_globals.com.weekreport.wasm.ExportedApi.scoreReport(reportText); }," +
            "extractKeywords: function(input) { return $rt_globals.com.weekreport.wasm.ExportedApi.extractKeywords(input); }," +
            "parseWorkItems: function(input) { return $rt_globals.com.weekreport.wasm.ExportedApi.parseWorkItems(input); }," +
            "getBuiltinTemplates: function() { return $rt_globals.com.weekreport.wasm.ExportedApi.getBuiltinTemplates(); }" +
            "};" +
            "}")
    public static native void registerApi();
}
