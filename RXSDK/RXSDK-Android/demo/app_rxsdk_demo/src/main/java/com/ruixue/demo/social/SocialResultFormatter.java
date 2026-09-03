package com.ruixue.demo.social;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public final class SocialResultFormatter {

    private static final String[] COMMON_ARRAY_KEYS = {
            "data", "list", "rows", "items", "friends", "ranks", "results", "records", "users"
    };

    private SocialResultFormatter() {}

    @NonNull
    public static DisplayData fromJson(@NonNull String title, @Nullable JSONObject json, boolean isError) {
        if (json == null) {
            return fromMessage(title, isError ? "请求失败" : "请求成功，但无返回数据", isError);
        }

        String summary = buildSummary(json, isError);
        List<String> lines = buildLines(json);
        List<ResultCard> cards = buildCards(title, json, lines);
        return new DisplayData(title, summary, lines, cards, json.toString(), isError);
    }

    @NonNull
    public static DisplayData fromMessage(@NonNull String title, @NonNull String message, boolean isError) {
        List<String> lines = new ArrayList<>();
        lines.add(message);
        List<ResultCard> cards = new ArrayList<>();
        cards.add(new ResultCard(title, message, lines));
        return new DisplayData(title, message, lines, cards, message, isError);
    }

    @NonNull
    private static String buildSummary(@NonNull JSONObject json, boolean isError) {
        int code = json.optInt("code", 0);
        String msg = firstNotEmpty(
                json.optString("msg"),
                json.optString("message"),
                json.optString("error"),
                isError ? "请求失败" : "请求成功"
        );
        if (json.has("trace_id")) {
            msg += " | trace_id=" + json.optString("trace_id");
        }
        return "code=" + code + " | " + msg;
    }

    @NonNull
    private static List<String> buildLines(@NonNull JSONObject json) {
        List<String> lines = new ArrayList<>();
        JSONArray targetArray = findPrimaryArray(json);
        if (targetArray != null && targetArray.length() > 0) {
            for (int i = 0; i < targetArray.length(); i++) {
                Object item = targetArray.opt(i);
                lines.add(formatItem(i, item));
            }
            return lines;
        }

        JSONObject targetObject = findPrimaryObject(json);
        if (targetObject != null) {
            flattenObject("", targetObject, lines, 0);
        }

        if (lines.isEmpty()) {
            lines.add(json.toString());
        }
        return lines;
    }

    @NonNull
    private static List<ResultCard> buildCards(@NonNull String resultTitle,
                                               @NonNull JSONObject json,
                                               @NonNull List<String> fallbackLines) {
        List<ResultCard> cards = new ArrayList<>();
        boolean friendListMode = resultTitle.startsWith("好友列表");
        JSONArray targetArray = findPrimaryArray(json);
        if (targetArray != null && targetArray.length() > 0) {
            for (int i = 0; i < targetArray.length(); i++) {
                cards.add(buildCardFromItem(i, targetArray.opt(i), friendListMode));
            }
            return cards;
        }

        JSONObject targetObject = findPrimaryObject(json);
        if (targetObject != null) {
            List<String> objectLines = new ArrayList<>();
            flattenObject("", targetObject, objectLines, 0);
            if (!objectLines.isEmpty()) {
                cards.add(new ResultCard("结果详情", firstNotEmpty(
                        targetObject.optString("msg"),
                        targetObject.optString("message"),
                        targetObject.optString("error"),
                        "结构化结果"
                ), objectLines));
                return cards;
            }
        }

        cards.add(new ResultCard("结果详情", "原始返回", fallbackLines));
        return cards;
    }

    @Nullable
    private static JSONArray findPrimaryArray(@NonNull JSONObject json) {
        for (String key : COMMON_ARRAY_KEYS) {
            JSONArray array = json.optJSONArray(key);
            if (array != null) {
                return array;
            }
        }

        for (String key : COMMON_ARRAY_KEYS) {
            JSONObject nested = json.optJSONObject(key);
            if (nested == null) {
                continue;
            }
            for (String nestedKey : COMMON_ARRAY_KEYS) {
                JSONArray array = nested.optJSONArray(nestedKey);
                if (array != null) {
                    return array;
                }
            }
        }
        return null;
    }

    @Nullable
    private static JSONObject findPrimaryObject(@NonNull JSONObject json) {
        JSONObject data = json.optJSONObject("data");
        if (data != null) {
            return data;
        }
        return json;
    }

    @NonNull
    private static String formatItem(int index, @Nullable Object item) {
        String prefix = (index + 1) + ". ";
        if (item instanceof JSONObject) {
            JSONObject object = (JSONObject) item;
            List<String> parts = new ArrayList<>();
            appendIfPresent(parts, object, "target", "target");
            appendIfPresent(parts, object, "openid", "openid");
            appendIfPresent(parts, object, "uid", "uid");
            appendIfPresent(parts, object, "nick", "昵称");
            appendIfPresent(parts, object, "name", "名称");
            appendIfPresent(parts, object, "remarks", "备注");
            appendIfPresent(parts, object, "rank", "排名");
            appendIfPresent(parts, object, "score", "分数");
            appendIfPresent(parts, object, "distance", "距离");
            appendIfPresent(parts, object, "lat", "纬度");
            appendIfPresent(parts, object, "lon", "经度");
            if (!parts.isEmpty()) {
                return prefix + join(parts);
            }
            return prefix + object.toString();
        }
        return prefix + String.valueOf(item);
    }

    @NonNull
    private static ResultCard buildCardFromItem(int index,
                                                @Nullable Object item,
                                                boolean friendListMode) {
        String title = "记录 " + (index + 1);
        if (item instanceof JSONObject) {
            JSONObject object = (JSONObject) item;
            String subtitle = firstNotEmpty(
                    object.optString("name"),
                    object.optString("nick"),
                    object.optString("target"),
                    object.optString("openid"),
                    object.optString("uid"),
                    "结构化记录"
            );
            List<String> lines = new ArrayList<>();
            appendLineIfPresent(lines, object, "target", "目标");
            appendLineIfPresent(lines, object, "openid", "OpenId");
            appendLineIfPresent(lines, object, "uid", "UID");
            appendLineIfPresent(lines, object, "nick", "昵称");
            appendLineIfPresent(lines, object, "name", "名称");
            appendLineIfPresent(lines, object, "remarks", "备注");
            appendLineIfPresent(lines, object, "target_remarks", "目标备注");
            appendLineIfPresent(lines, object, "user_remarks", "用户备注");
            appendLineIfPresent(lines, object, "rank", "排名");
            appendLineIfPresent(lines, object, "score", "分数");
            appendLineIfPresent(lines, object, "distance", "距离");
            appendLineIfPresent(lines, object, "lat", "纬度");
            appendLineIfPresent(lines, object, "lon", "经度");
            appendLineIfPresent(lines, object, "type", "类型");
            if (lines.isEmpty()) {
                flattenObject("", object, lines, 0);
            }
            String fillTargetOpenId = "";
            String fillFriendRemark = "";
            if (friendListMode) {
                fillTargetOpenId = firstNotEmpty(
                        object.optString("target"),
                        object.optString("openid"),
                        object.optString("uid")
                );
                fillFriendRemark = firstNotEmpty(
                        object.optString("remarks"),
                        object.optString("target_remarks"),
                        object.optString("user_remarks")
                );
            }
            return new ResultCard(
                    title,
                    subtitle,
                    lines,
                    friendListMode && fillTargetOpenId.length() > 0,
                    fillTargetOpenId,
                    fillFriendRemark
            );
        }

        List<String> lines = new ArrayList<>();
        lines.add(String.valueOf(item));
        return new ResultCard(title, "普通结果", lines);
    }

    private static void flattenObject(@NonNull String prefix,
                                      @NonNull JSONObject object,
                                      @NonNull List<String> lines,
                                      int depth) {
        if (depth > 1) {
            lines.add(prefix + object.toString());
            return;
        }
        Iterator<String> keys = object.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            Object value = object.opt(key);
            String linePrefix = prefix.isEmpty() ? key : prefix + key;
            if (value instanceof JSONObject) {
                flattenObject(linePrefix + ".", (JSONObject) value, lines, depth + 1);
            } else if (value instanceof JSONArray) {
                JSONArray array = (JSONArray) value;
                lines.add(linePrefix + "[" + array.length() + "]");
                for (int i = 0; i < Math.min(array.length(), 5); i++) {
                    lines.add("  - " + formatItem(i, array.opt(i)));
                }
            } else {
                lines.add(linePrefix + ": " + String.valueOf(value));
            }
        }
    }

    private static void appendIfPresent(@NonNull List<String> parts,
                                        @NonNull JSONObject object,
                                        @NonNull String key,
                                        @NonNull String label) {
        String value = object.optString(key);
        if (value != null && value.length() > 0 && !"null".equals(value)) {
            parts.add(label + "=" + value);
        }
    }

    private static void appendLineIfPresent(@NonNull List<String> lines,
                                            @NonNull JSONObject object,
                                            @NonNull String key,
                                            @NonNull String label) {
        String value = object.optString(key);
        if (value != null && value.length() > 0 && !"null".equals(value)) {
            lines.add(label + ": " + value);
        }
    }

    @NonNull
    private static String join(@NonNull List<String> parts) {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < parts.size(); i++) {
            if (i > 0) {
                builder.append(" | ");
            }
            builder.append(parts.get(i));
        }
        return builder.toString();
    }

    @NonNull
    private static String firstNotEmpty(@Nullable String... values) {
        for (String value : values) {
            if (value != null && value.trim().length() > 0 && !"null".equalsIgnoreCase(value)) {
                return value.trim();
            }
        }
        return "";
    }

    public static class DisplayData {
        public final String title;
        public final String summary;
        public final List<String> detailLines;
        public final List<ResultCard> cards;
        public final String rawText;
        public final boolean error;

        public DisplayData(@NonNull String title,
                           @NonNull String summary,
                           @NonNull List<String> detailLines,
                           @NonNull List<ResultCard> cards,
                           @NonNull String rawText,
                           boolean error) {
            this.title = title;
            this.summary = summary;
            this.detailLines = detailLines;
            this.cards = cards;
            this.rawText = rawText;
            this.error = error;
        }
    }

    public static class ResultCard {
        public final String title;
        public final String subtitle;
        public final List<String> fields;
        public final boolean interactive;
        public final String fillTargetOpenId;
        public final String fillFriendRemark;

        public ResultCard(@NonNull String title,
                          @NonNull String subtitle,
                          @NonNull List<String> fields) {
            this(title, subtitle, fields, false, "", "");
        }

        public ResultCard(@NonNull String title,
                          @NonNull String subtitle,
                          @NonNull List<String> fields,
                          boolean interactive,
                          @NonNull String fillTargetOpenId,
                          @NonNull String fillFriendRemark) {
            this.title = title;
            this.subtitle = subtitle;
            this.fields = fields;
            this.interactive = interactive;
            this.fillTargetOpenId = fillTargetOpenId;
            this.fillFriendRemark = fillFriendRemark;
        }
    }
}
