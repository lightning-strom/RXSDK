package com.ruixue.demo.gamearea;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public final class GameAreaResultFormatter {

    private static final String[] COMMON_ARRAY_KEYS = {
            "data", "list", "rows", "items", "results", "records", "characters", "areas"
    };

    private GameAreaResultFormatter() {}

    @NonNull
    public static DisplayData fromJson(@NonNull String title, @Nullable JSONObject json, boolean error) {
        if (json == null) {
            return fromMessage(title, error ? "请求失败" : "请求成功，但无返回数据", error);
        }
        String summary = buildSummary(json, error);
        List<String> lines = buildLines(json);
        List<ResultCard> cards = buildCards(json, lines);
        return new DisplayData(title, summary, lines, cards, json.toString(), error);
    }

    @NonNull
    public static DisplayData fromMessage(@NonNull String title, @NonNull String message, boolean error) {
        List<String> lines = new ArrayList<>();
        lines.add(message);
        List<ResultCard> cards = new ArrayList<>();
        cards.add(new ResultCard(title, message, lines));
        return new DisplayData(title, message, lines, cards, message, error);
    }

    @NonNull
    private static String buildSummary(@NonNull JSONObject json, boolean error) {
        int code = json.optInt("code", 0);
        String msg = firstNotEmpty(
                json.optString("msg"),
                json.optString("message"),
                json.optString("error"),
                error ? "请求失败" : "请求成功"
        );
        return "code=" + code + " | " + msg;
    }

    @NonNull
    private static List<String> buildLines(@NonNull JSONObject json) {
        List<String> lines = new ArrayList<>();
        JSONArray array = findPrimaryArray(json);
        if (array != null && array.length() > 0) {
            for (int i = 0; i < array.length(); i++) {
                lines.add(formatItem(i, array.opt(i)));
            }
            return lines;
        }

        JSONObject object = findPrimaryObject(json);
        if (object != null) {
            flattenObject("", object, lines, 0);
        }
        if (lines.isEmpty()) {
            lines.add(json.toString());
        }
        return lines;
    }

    @NonNull
    private static List<ResultCard> buildCards(@NonNull JSONObject json, @NonNull List<String> fallbackLines) {
        List<ResultCard> cards = new ArrayList<>();
        JSONArray array = findPrimaryArray(json);
        if (array != null && array.length() > 0) {
            for (int i = 0; i < array.length(); i++) {
                cards.add(buildCard(i, array.opt(i)));
            }
            return cards;
        }

        JSONObject object = findPrimaryObject(json);
        if (object != null) {
            List<String> lines = new ArrayList<>();
            flattenObject("", object, lines, 0);
            cards.add(new ResultCard("结果详情", "结构化结果", lines));
            return cards;
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
            JSONObject object = json.optJSONObject(key);
            if (object == null) {
                continue;
            }
            for (String nestedKey : COMMON_ARRAY_KEYS) {
                JSONArray array = object.optJSONArray(nestedKey);
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
        return data != null ? data : json;
    }

    @NonNull
    private static String formatItem(int index, @Nullable Object item) {
        if (item instanceof JSONObject) {
            JSONObject object = (JSONObject) item;
            List<String> parts = new ArrayList<>();
            append(parts, object, "area_id", "区服ID");
            append(parts, object, "area_name", "区服名");
            append(parts, object, "character_id", "角色ID");
            append(parts, object, "character_name", "角色名");
            append(parts, object, "character_level", "等级");
            append(parts, object, "cp_user_id", "CP用户ID");
            if (!parts.isEmpty()) {
                return (index + 1) + ". " + join(parts);
            }
            return (index + 1) + ". " + object.toString();
        }
        return (index + 1) + ". " + String.valueOf(item);
    }

    @NonNull
    private static ResultCard buildCard(int index, @Nullable Object item) {
        if (item instanceof JSONObject) {
            JSONObject object = (JSONObject) item;
            SelectionData selection = buildSelectionData(object);
            String subtitle = firstNotEmpty(
                    object.optString("character_name"),
                    object.optString("area_name"),
                    object.optString("character_id"),
                    object.optString("area_id"),
                    "结构化记录"
            );
            List<String> fields = new ArrayList<>();
            appendLine(fields, object, "area_id", "区服ID");
            appendLine(fields, object, "area_name", "区服名");
            appendLine(fields, object, "area_status", "区服状态");
            appendLine(fields, object, "area_type", "区服类型");
            appendLine(fields, object, "character_id", "角色ID");
            appendLine(fields, object, "character_name", "角色名");
            appendLine(fields, object, "character_level", "角色等级");
            appendLine(fields, object, "character_faction", "阵营");
            appendLine(fields, object, "character_profession", "职业");
            appendLine(fields, object, "character_status", "角色状态");
            appendLine(fields, object, "character_type", "角色类型");
            appendLine(fields, object, "character_vip_level", "VIP等级");
            appendLine(fields, object, "cp_user_id", "CP用户ID");
            appendLine(fields, object, "guild", "公会");
            appendLine(fields, object, "power", "战力");
            if (fields.isEmpty()) {
                flattenObject("", object, fields, 0);
            }
            return new ResultCard("记录 " + (index + 1), subtitle, fields, selection.hasValue(), selection);
        }
        List<String> fields = new ArrayList<>();
        fields.add(String.valueOf(item));
        return new ResultCard("记录 " + (index + 1), "普通结果", fields);
    }

    @NonNull
    private static SelectionData buildSelectionData(@NonNull JSONObject object) {
        return new SelectionData(
                optStringSmart(object, "area_id"),
                optStringSmart(object, "area_name", "name"),
                optStringSmart(object, "area_status", "status"),
                optStringSmart(object, "area_type", "type"),
                optStringSmart(object, "guild"),
                optStringSmart(object, "power"),
                optStringSmart(object, "character_id", "role_id"),
                optStringSmart(object, "character_name", "role_name", "nick"),
                optStringSmart(object, "character_level", "level"),
                optStringSmart(object, "character_faction", "faction"),
                optStringSmart(object, "character_profession", "profession"),
                optStringSmart(object, "character_status"),
                optStringSmart(object, "character_type"),
                optStringSmart(object, "character_vip_level", "vip_level"),
                optStringSmart(object, "cp_user_id", "openid", "uid")
        );
    }

    private static void flattenObject(@NonNull String prefix, @NonNull JSONObject object, @NonNull List<String> lines, int depth) {
        if (depth > 1) {
            lines.add(prefix + object.toString());
            return;
        }
        Iterator<String> keys = object.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            Object value = object.opt(key);
            String lineKey = prefix.isEmpty() ? key : prefix + key;
            if (value instanceof JSONObject) {
                flattenObject(lineKey + ".", (JSONObject) value, lines, depth + 1);
            } else if (value instanceof JSONArray) {
                JSONArray array = (JSONArray) value;
                lines.add(lineKey + "[" + array.length() + "]");
                for (int i = 0; i < Math.min(array.length(), 5); i++) {
                    lines.add("  - " + formatItem(i, array.opt(i)));
                }
            } else {
                lines.add(lineKey + ": " + String.valueOf(value));
            }
        }
    }

    private static void append(@NonNull List<String> parts, @NonNull JSONObject object, @NonNull String key, @NonNull String label) {
        String value = object.optString(key);
        if (value != null && value.length() > 0 && !"null".equals(value)) {
            parts.add(label + "=" + value);
        }
    }

    private static void appendLine(@NonNull List<String> lines, @NonNull JSONObject object, @NonNull String key, @NonNull String label) {
        String value = object.optString(key);
        if (value != null && value.length() > 0 && !"null".equals(value)) {
            lines.add(label + ": " + value);
        }
    }

    @NonNull
    private static String optStringSmart(@NonNull JSONObject object, @NonNull String... keys) {
        for (String key : keys) {
            String value = firstNotEmpty(object.optString(key));
            if (!value.isEmpty()) {
                return value;
            }
        }
        String[] nestedKeys = {"extension", "ext", "extra"};
        for (String nestedKey : nestedKeys) {
            JSONObject nested = object.optJSONObject(nestedKey);
            if (nested == null) {
                continue;
            }
            for (String key : keys) {
                String value = firstNotEmpty(nested.optString(key));
                if (!value.isEmpty()) {
                    return value;
                }
            }
        }
        return "";
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
        public final SelectionData selectionData;

        public ResultCard(@NonNull String title, @NonNull String subtitle, @NonNull List<String> fields) {
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
        public final String areaId;
        public final String areaName;
        public final String areaStatus;
        public final String areaType;
        public final String areaGuild;
        public final String areaPower;
        public final String characterId;
        public final String characterName;
        public final String characterLevel;
        public final String characterFaction;
        public final String characterProfession;
        public final String characterStatus;
        public final String characterType;
        public final String characterVipLevel;
        public final String cpUserId;

        public SelectionData(@NonNull String areaId,
                             @NonNull String areaName,
                             @NonNull String areaStatus,
                             @NonNull String areaType,
                             @NonNull String areaGuild,
                             @NonNull String areaPower,
                             @NonNull String characterId,
                             @NonNull String characterName,
                             @NonNull String characterLevel,
                             @NonNull String characterFaction,
                             @NonNull String characterProfession,
                             @NonNull String characterStatus,
                             @NonNull String characterType,
                             @NonNull String characterVipLevel,
                             @NonNull String cpUserId) {
            this.areaId = areaId;
            this.areaName = areaName;
            this.areaStatus = areaStatus;
            this.areaType = areaType;
            this.areaGuild = areaGuild;
            this.areaPower = areaPower;
            this.characterId = characterId;
            this.characterName = characterName;
            this.characterLevel = characterLevel;
            this.characterFaction = characterFaction;
            this.characterProfession = characterProfession;
            this.characterStatus = characterStatus;
            this.characterType = characterType;
            this.characterVipLevel = characterVipLevel;
            this.cpUserId = cpUserId;
        }

        @NonNull
        public static SelectionData empty() {
            return new SelectionData("", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
        }

        public boolean hasValue() {
            return !firstNotEmpty(
                    areaId, areaName, characterId, characterName, cpUserId
            ).isEmpty();
        }
    }
}
