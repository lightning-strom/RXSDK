package com.ruixue.demo.share;

import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.share.ShareData;
import com.ruixue.share.ShareDataResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public final class ShareResultFormatter {

    private ShareResultFormatter() {
    }

    @NonNull
    public static DisplayData fromShareDataResult(@NonNull String title, @Nullable ShareDataResult result) {
        if (result == null) {
            return fromText(title, "无分享数据返回");
        }
        JSONObject json = result.toJSONObject();
        ShareData data = result.getData();
        SelectionData selection = fromShareDataResult(result, data);
        List<ResultCard> cards = new ArrayList<>();

        if (data != null && data.getContent() != null) {
            List<String> fields = new ArrayList<>();
            addField(fields, "素材类型", data.getContent().getMaterial_type());
            addField(fields, "标题", data.getContent().getTitle());
            addField(fields, "内容", data.getContent().getContent());
            addField(fields, "图片", data.getContent().getImage());
            addField(fields, "链接", data.getContent().getUrl());
            addField(fields, "素材ID", String.valueOf(data.getContent().getMaterial_id()));
            addField(fields, "落地页ID", String.valueOf(data.getContent().getLanding_id()));
            cards.add(new ResultCard("分享素材", "点击可回填标题、内容、图片、链接", fields,
                    selection.hasValue(), selection));
        }

        if (data != null && data.getStrategy() != null) {
            List<String> fields = new ArrayList<>();
            addField(fields, "策略ID", String.valueOf(data.getStrategy().getId()));
            addField(fields, "平台", data.getStrategy().getPlatform());
            addField(fields, "地区", data.getStrategy().getRegion());
            addField(fields, "策略类型", String.valueOf(data.getStrategy().getType()));
            addField(fields, "产品ID", data.getStrategy().getProduct_id());
            addField(fields, "渠道ID", data.getStrategy().getChannel_id());
            cards.add(new ResultCard("调度策略", "点击可回填平台、地区、策略ID、上报属性", fields,
                    selection.hasValue(), selection));
        }

        if (data != null) {
            List<String> fields = new ArrayList<>();
            addField(fields, "触发标识", data.getTrigger() == null ? "" : data.getTrigger().getTag());
            addField(fields, "identity", data.getIdentity());
            addField(fields, "transmits", data.getTransmits());
            addField(fields, "调度信息", mapToJson(data.getScheduling()));
            addField(fields, "扩展字段", mapToJson(result.getExt()));
            if (!fields.isEmpty()) {
                cards.add(new ResultCard("透传 / 扩展", "用于查看 identity、transmits 和 scheduling 信息", fields));
            }
        }

        String summary = buildSummary(selection, data == null ? "" : data.getIdentity());
        return new DisplayData(
                title,
                summary,
                buildDetailLines(json),
                prettyJson(json == null ? "" : json.toString()),
                cards
        );
    }

    @NonNull
    public static DisplayData fromJson(@NonNull String title, @Nullable JSONObject json) {
        if (json == null) {
            return fromText(title, "无返回数据");
        }
        SelectionData selection = fromJson(json);
        List<String> fields = new ArrayList<>();
        addField(fields, "code", optStringSmart(json, "code"));
        addField(fields, "msg", firstNotEmpty(optStringSmart(json, "msg"), optStringSmart(json, "message")));
        addField(fields, "func", selection.func);
        addField(fields, "平台", selection.platform);
        addField(fields, "地区", selection.region);
        addField(fields, "素材类型", selection.materialType);
        addField(fields, "标题", selection.title);
        addField(fields, "内容", selection.content);
        addField(fields, "图片", selection.image);
        addField(fields, "链接", selection.url);
        addField(fields, "transmits", selection.transmits);
        addField(fields, "策略ID", selection.schedulingStrategyId);

        List<ResultCard> cards = new ArrayList<>();
        if (!fields.isEmpty()) {
            cards.add(new ResultCard("结果概览",
                    selection.hasValue() ? "点击可回填分享参数" : "展示本次分享接口返回的重要字段",
                    fields,
                    selection.hasValue(),
                    selection));
        }

        return new DisplayData(
                title,
                buildSummary(selection, firstNotEmpty(optStringSmart(json, "msg"), optStringSmart(json, "message"))),
                buildDetailLines(json),
                prettyJson(json.toString()),
                cards
        );
    }

    @NonNull
    public static DisplayData fromText(@NonNull String title, @Nullable String rawText) {
        String safe = TextUtils.isEmpty(rawText) ? "无结果" : rawText;
        return new DisplayData(
                title,
                safe,
                Collections.singletonList(safe),
                safe,
                Collections.emptyList()
        );
    }

    @NonNull
    public static SelectionData fromShareDataResult(@Nullable ShareDataResult result) {
        return fromShareDataResult(result, result == null ? null : result.getData());
    }

    @NonNull
    private static SelectionData fromShareDataResult(@Nullable ShareDataResult result, @Nullable ShareData data) {
        if (data == null) {
            return SelectionData.empty();
        }
        String func = data.getTrigger() == null ? "" : data.getTrigger().getTag();
        String platform = data.getStrategy() == null ? "" : data.getStrategy().getPlatform();
        String region = data.getStrategy() == null ? "" : data.getStrategy().getRegion();
        String materialType = data.getContent() == null ? "" : data.getContent().getMaterial_type();
        String title = data.getContent() == null ? "" : data.getContent().getTitle();
        String content = data.getContent() == null ? "" : data.getContent().getContent();
        String image = data.getContent() == null ? "" : data.getContent().getImage();
        String url = data.getContent() == null ? "" : data.getContent().getUrl();
        String strategyId = data.getStrategy() == null ? "" : String.valueOf(data.getStrategy().getId());
        String propertiesJson = prettyJson(mapToJson(data.getShareReportData()));
        return new SelectionData(
                func,
                platform,
                region,
                "",
                materialType,
                title,
                content,
                image,
                url,
                data.getTransmits(),
                strategyId,
                propertiesJson
        );
    }

    @NonNull
    private static SelectionData fromJson(@NonNull JSONObject json) {
        return new SelectionData(
                firstNotEmpty(optStringSmart(json, "func"), optStringSmart(json, "tag")),
                optStringSmart(json, "platform"),
                optStringSmart(json, "region"),
                optStringSmart(json, "shareScene"),
                firstNotEmpty(optStringSmart(json, "material_type"), optStringSmart(json, "type")),
                optStringSmart(json, "title"),
                firstNotEmpty(optStringSmart(json, "content"), optStringSmart(json, "description")),
                optStringSmart(json, "image"),
                firstNotEmpty(optStringSmart(json, "short_url"), optStringSmart(json, "shortUrl"), optStringSmart(json, "url")),
                optStringSmart(json, "transmits"),
                firstNotEmpty(optStringSmart(json, "scheduling_strategy_id"), optStringSmart(json, "strategy_id"), optStringSmart(json, "id")),
                prettyJson(mapToJson(optMap(json, "properties")))
        );
    }

    @NonNull
    private static List<String> buildDetailLines(@Nullable JSONObject json) {
        if (json == null) {
            return Collections.singletonList("无结构化结果");
        }
        List<String> lines = new ArrayList<>();
        appendLines(lines, "", json);
        if (lines.isEmpty()) {
            lines.add("无结构化结果");
        }
        return lines;
    }

    private static void appendLines(@NonNull List<String> lines, @NonNull String prefix, @Nullable Object value) {
        if (value == null || value == JSONObject.NULL) {
            return;
        }
        if (value instanceof JSONObject) {
            JSONObject object = (JSONObject) value;
            JSONArray names = object.names();
            if (names == null) {
                return;
            }
            for (int i = 0; i < names.length(); i++) {
                String key = names.optString(i);
                appendLines(lines, prefix.isEmpty() ? key : prefix + "." + key, object.opt(key));
            }
            return;
        }
        if (value instanceof JSONArray) {
            JSONArray array = (JSONArray) value;
            for (int i = 0; i < array.length() && i < 8; i++) {
                appendLines(lines, prefix + "[" + i + "]", array.opt(i));
            }
            return;
        }
        if (!TextUtils.isEmpty(prefix)) {
            lines.add(prefix + ": " + String.valueOf(value));
        }
    }

    @NonNull
    private static String buildSummary(@NonNull SelectionData selection, @Nullable String fallback) {
        List<String> parts = new ArrayList<>();
        if (!TextUtils.isEmpty(selection.platform)) {
            parts.add("平台 " + selection.platform);
        }
        if (!TextUtils.isEmpty(selection.materialType)) {
            parts.add("素材 " + selection.materialType);
        }
        if (!TextUtils.isEmpty(selection.schedulingStrategyId)) {
            parts.add("策略ID " + selection.schedulingStrategyId);
        }
        if (!TextUtils.isEmpty(selection.url)) {
            parts.add("链接已返回");
        }
        if (!TextUtils.isEmpty(fallback)) {
            parts.add(fallback);
        }
        if (parts.isEmpty()) {
            return "已返回结果，详情见下方结构化卡片";
        }
        return TextUtils.join(" | ", parts);
    }

    @Nullable
    private static Map<String, Object> optMap(@NonNull JSONObject object, @NonNull String key) {
        JSONObject nested = object.optJSONObject(key);
        if (nested == null) {
            return null;
        }
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> map = new com.google.gson.Gson().fromJson(nested.toString(), Map.class);
            return map;
        } catch (Exception e) {
            return null;
        }
    }

    @NonNull
    private static String optStringSmart(@NonNull JSONObject object, @NonNull String key) {
        Object direct = object.opt(key);
        if (direct != null && direct != JSONObject.NULL) {
            String value = String.valueOf(direct).trim();
            if (!value.isEmpty() && !"null".equalsIgnoreCase(value)) {
                return value;
            }
        }
        JSONObject data = object.optJSONObject("data");
        if (data != null) {
            String nested = optStringNested(data, key);
            if (!nested.isEmpty()) {
                return nested;
            }
        }
        return "";
    }

    @NonNull
    private static String optStringNested(@NonNull JSONObject object, @NonNull String key) {
        Object direct = object.opt(key);
        if (direct != null && direct != JSONObject.NULL) {
            String value = String.valueOf(direct).trim();
            if (!value.isEmpty() && !"null".equalsIgnoreCase(value)) {
                return value;
            }
        }
        String[] nestedKeys = {"content", "strategy", "trigger"};
        for (String nestedKey : nestedKeys) {
            JSONObject nested = object.optJSONObject(nestedKey);
            if (nested == null) {
                continue;
            }
            Object nestedValue = nested.opt(key);
            if (nestedValue != null && nestedValue != JSONObject.NULL) {
                String value = String.valueOf(nestedValue).trim();
                if (!value.isEmpty() && !"null".equalsIgnoreCase(value)) {
                    return value;
                }
            }
        }
        return "";
    }

    @NonNull
    private static String firstNotEmpty(String... values) {
        for (String value : values) {
            if (!TextUtils.isEmpty(value)) {
                return value;
            }
        }
        return "";
    }

    private static void addField(@NonNull List<String> fields, @NonNull String label, @Nullable String value) {
        if (TextUtils.isEmpty(value) || "0".equals(value)) {
            return;
        }
        fields.add(label + ": " + value);
    }

    @NonNull
    private static String mapToJson(@Nullable Map<String, ?> map) {
        if (map == null || map.isEmpty()) {
            return "";
        }
        return new JSONObject(map).toString();
    }

    @NonNull
    private static String prettyJson(@Nullable String raw) {
        if (TextUtils.isEmpty(raw)) {
            return "";
        }
        String trimmed = raw.trim();
        try {
            if (trimmed.startsWith("{")) {
                return new JSONObject(trimmed).toString(2);
            }
            if (trimmed.startsWith("[")) {
                return new JSONArray(trimmed).toString(2);
            }
        } catch (JSONException ignored) {
        }
        return raw;
    }

    public static class DisplayData {
        public final String title;
        public final String summary;
        public final List<String> detailLines;
        public final String rawText;
        public final List<ResultCard> cards;

        public DisplayData(@NonNull String title,
                           @NonNull String summary,
                           @NonNull List<String> detailLines,
                           @NonNull String rawText,
                           @NonNull List<ResultCard> cards) {
            this.title = title;
            this.summary = summary;
            this.detailLines = detailLines;
            this.rawText = rawText;
            this.cards = cards;
        }
    }

    public static class ResultCard {
        public final String title;
        public final String subtitle;
        public final List<String> fields;
        public final boolean interactive;
        public final SelectionData selectionData;

        public ResultCard(@NonNull String title,
                          @NonNull String subtitle,
                          @NonNull List<String> fields) {
            this(title, subtitle, fields, false, SelectionData.empty());
        }

        public ResultCard(@NonNull String title,
                          @NonNull String subtitle,
                          @NonNull List<String> fields,
                          boolean interactive,
                          @NonNull SelectionData selectionData) {
            this.title = title;
            this.subtitle = subtitle;
            this.fields = fields;
            this.interactive = interactive;
            this.selectionData = selectionData;
        }
    }

    public static class SelectionData {
        public final String func;
        public final String platform;
        public final String region;
        public final String shareScene;
        public final String materialType;
        public final String title;
        public final String content;
        public final String image;
        public final String url;
        public final String transmits;
        public final String schedulingStrategyId;
        public final String propertiesJson;

        public SelectionData(@NonNull String func,
                             @NonNull String platform,
                             @NonNull String region,
                             @NonNull String shareScene,
                             @NonNull String materialType,
                             @NonNull String title,
                             @NonNull String content,
                             @NonNull String image,
                             @NonNull String url,
                             @NonNull String transmits,
                             @NonNull String schedulingStrategyId,
                             @NonNull String propertiesJson) {
            this.func = func;
            this.platform = platform;
            this.region = region;
            this.shareScene = shareScene;
            this.materialType = materialType;
            this.title = title;
            this.content = content;
            this.image = image;
            this.url = url;
            this.transmits = transmits;
            this.schedulingStrategyId = schedulingStrategyId;
            this.propertiesJson = propertiesJson;
        }

        @NonNull
        public static SelectionData empty() {
            return new SelectionData("", "", "", "", "", "", "", "", "", "", "", "");
        }

        public boolean hasValue() {
            return !firstNotEmpty(
                    func,
                    platform,
                    materialType,
                    title,
                    content,
                    image,
                    url,
                    transmits,
                    schedulingStrategyId
            ).isEmpty();
        }
    }
}
