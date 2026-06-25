package com.weekreport.parser;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class KeywordExtractor {

    private static final String[] STOP_WORDS = {
        "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
        "have", "has", "had", "do", "does", "did", "will", "would", "could", "should",
        "i", "you", "he", "she", "it", "we", "they", "this", "that", "these", "those",
        "of", "in", "on", "at", "to", "for", "with", "about", "as", "and", "or", "but",
        "了", "的", "是", "在", "和", "与", "及", "等", "对", "为", "有", "我", "你", "他",
        "她", "它", "我们", "你们", "他们", "这个", "那个", "这些", "那些", "一个", "一种",
        "完成", "进行", "参加", "开展", "做好", "推进", "落实", "工作", "本周", "下周", "上周"
    };

    public List<String> extract(String input) {
        if (input == null || input.isEmpty()) {
            return new ArrayList<String>();
        }

        Map<String, Integer> frequency = new HashMap<String, Integer>();

        // Extract Chinese words (2-4 characters)
        for (int len = 4; len >= 2; len--) {
            for (int i = 0; i + len <= input.length(); i++) {
                String segment = input.substring(i, i + len);
                if (isChineseWord(segment)) {
                    frequency.put(segment, frequency.getOrDefault(segment, 0) + 1);
                }
            }
        }

        // Extract English words
        String[] words = input.toLowerCase().split("[^a-zA-Z0-9\\u4e00-\\u9fa5]+");
        for (String word : words) {
            if (word.length() > 2 && !isStopWord(word) && !containsChinese(word)) {
                frequency.put(word, frequency.getOrDefault(word, 0) + 1);
            }
        }

        // Sort by frequency and pick top
        List<Map.Entry<String, Integer>> entries = new ArrayList<Map.Entry<String, Integer>>(frequency.entrySet());
        Collections.sort(entries, new Comparator<Map.Entry<String, Integer>>() {
            @Override
            public int compare(Map.Entry<String, Integer> a, Map.Entry<String, Integer> b) {
                return b.getValue().compareTo(a.getValue());
            }
        });

        List<String> result = new ArrayList<String>();
        for (int i = 0; i < Math.min(15, entries.size()); i++) {
            result.add(entries.get(i).getKey());
        }
        return result;
    }

    private boolean isChineseWord(String segment) {
        for (int i = 0; i < segment.length(); i++) {
            char c = segment.charAt(i);
            if (c < 0x4e00 || c > 0x9fa5) {
                return false;
            }
        }
        return segment.length() >= 2;
    }

    private boolean containsChinese(String word) {
        for (int i = 0; i < word.length(); i++) {
            char c = word.charAt(i);
            if (c >= 0x4e00 && c <= 0x9fa5) {
                return true;
            }
        }
        return false;
    }

    private boolean isStopWord(String word) {
        for (String stop : STOP_WORDS) {
            if (stop.equals(word)) {
                return true;
            }
        }
        return false;
    }
}
