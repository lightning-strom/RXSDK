package com.ruixue.demo.config;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

/**
 * 初始化配置仓库
 * <p>
 * 统一从 {@code assets/init_configs.json} 加载所有 demo 初始化配置，按 key 访问。
 * 本地只维护 {@code init} 段（cpid / product_id / channel_id / domain / ipv4_url），
 * 其余 passport / user_center 等运行时走 SDK 后台下发。
 */
public final class InitConfigRegistry {

    private static final String TAG = "InitConfigRegistry";
    public static final String CONFIG_FILE = "init_configs.json";

    private static volatile boolean loaded;
    private static JSONObject configs;
    private static String defaultKey;
    private static String fallbackKey;
    private static boolean enabledFlag = true;
    private static final List<String> orderedKeys = new ArrayList<>();

    private InitConfigRegistry() {}

    /** 配置条目（用于弹窗展示）。 */
    public static final class ConfigItem {
        public final String key;
        public final String name;
        public final String cpId;
        public final String productId;
        public final String channelId;
        public final String domain;
        public final String env;

        ConfigItem(String key, String name, String cpId, String productId, String channelId, String domain, String env) {
            this.key = key;
            this.name = name;
            this.cpId = cpId;
            this.productId = productId;
            this.channelId = channelId;
            this.domain = domain;
            this.env = env;
        }

        public String getDisplayName() {
            return TextUtils.isEmpty(name)
                    ? "CP:" + cpId + " 产品:" + productId + " 渠道:" + channelId
                    : name;
        }

        @NonNull
        public String getDialogLabel(boolean isCurrent, boolean isRemembered) {
            StringBuilder sb = new StringBuilder();
            if (isCurrent) {
                sb.append("当前使用");
                sb.append(isRemembered ? " · 已记忆" : " · 默认");
                sb.append("\n");
            } else if (isRemembered) {
                sb.append("已记忆\n");
            }
            sb.append(getDisplayName()).append("\n")
                    .append("key: ").append(key)
                    .append(" | CP:").append(cpId)
                    .append(" | 产品:").append(productId)
                    .append(" | 渠道:").append(channelId);
            if (!TextUtils.isEmpty(domain)) {
                sb.append("\n域名: ").append(domain);
            }
            return sb.toString();
        }

        /**
         * 弹窗使用的多级样式 label：
         * <ul>
         *   <li>第 1 行：状态徽标（绿）+ 环境徽标（按域名判定颜色）+ 主标题（加粗）</li>
         *   <li>第 2 行：产品/渠道（灰色小字，CP 已在主标题不再重复）</li>
         *   <li>第 3 行：host（去掉 scheme，更浅灰小字）</li>
         * </ul>
         * 完整 key/原始 domain 通过弹窗中长按 row 触发的 toast 查看。
         */
        @NonNull
        public CharSequence getStyledDialogLabel(boolean isCurrent, boolean isRemembered) {
            android.text.SpannableStringBuilder sb = new android.text.SpannableStringBuilder();

            String stateBadge = null;
            if (isCurrent) {
                stateBadge = isRemembered ? "当前·已记忆" : "当前·默认";
            } else if (isRemembered) {
                stateBadge = "已记忆";
            }
            if (stateBadge != null) {
                appendBadge(sb, stateBadge, 0xFF1B873F);
            }

            String envBadge = computeEnvBadge();
            if (envBadge != null) {
                appendBadge(sb, envBadge, computeEnvColor());
            }

            int titleStart = sb.length();
            sb.append(getDisplayName());
            sb.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD),
                    titleStart, sb.length(), 0);
            sb.setSpan(new android.text.style.RelativeSizeSpan(1.08f),
                    titleStart, sb.length(), 0);

            sb.append('\n');
            int metaStart = sb.length();
            sb.append("产品 ").append(productId)
                    .append(" · 渠道 ").append(channelId);
            sb.setSpan(new android.text.style.RelativeSizeSpan(0.82f), metaStart, sb.length(), 0);
            sb.setSpan(new android.text.style.ForegroundColorSpan(0xFF666666),
                    metaStart, sb.length(), 0);

            String host = stripScheme(domain);
            if (!TextUtils.isEmpty(host)) {
                sb.append('\n');
                int hostStart = sb.length();
                sb.append(host);
                sb.setSpan(new android.text.style.RelativeSizeSpan(0.8f),
                        hostStart, sb.length(), 0);
                sb.setSpan(new android.text.style.ForegroundColorSpan(0xFF8A8A8A),
                        hostStart, sb.length(), 0);
            }

            return sb;
        }

        private static void appendBadge(@NonNull android.text.SpannableStringBuilder sb,
                                        @NonNull String text, int color) {
            int start = sb.length();
            sb.append(text).append("   ");
            sb.setSpan(new android.text.style.RelativeSizeSpan(0.78f), start, sb.length(), 0);
            sb.setSpan(new android.text.style.ForegroundColorSpan(color), start, sb.length(), 0);
        }

        /** 仅取 host，去掉 {@code scheme://} 与 path/query。 */
        @NonNull
        private static String stripScheme(@Nullable String url) {
            if (TextUtils.isEmpty(url)) return "";
            String s = url;
            int idx = s.indexOf("://");
            if (idx >= 0) s = s.substring(idx + 3);
            int slash = s.indexOf('/');
            if (slash > 0) s = s.substring(0, slash);
            return s;
        }

        /**
         * 根据 host 推断环境+地区徽标，例如 {@code 测试·海外} / {@code 演示·国内} / {@code 正式}。
         * host 为空时返回 {@code null}，由调用方决定是否显示。
         */
        @Nullable
        private String computeEnvBadge() {
            String host = stripScheme(domain);
            if (TextUtils.isEmpty(host)) return null;
            String env;
            if (host.contains("-test")) env = "测试";
            else if (host.contains("-demo")) env = "演示";
            else if (host.contains("-pre") || host.contains("-staging")) env = "预发";
            else env = "正式";

            String region = null;
            if (host.startsWith("os-")) region = "海外";
            else if (host.startsWith("cn-")) region = "国内";

            return region != null ? env + "·" + region : env;
        }

        /** 与 {@link #computeEnvBadge()} 配套的徽标颜色：测试蓝、演示紫、预发橙、正式红。 */
        private int computeEnvColor() {
            String host = stripScheme(domain);
            if (host.contains("-test")) return 0xFF1976D2;
            if (host.contains("-demo")) return 0xFF7B1FA2;
            if (host.contains("-pre") || host.contains("-staging")) return 0xFFE65100;
            return 0xFFC62828;
        }
    }

    public static synchronized void ensureLoaded(@NonNull Context context) {
        if (loaded) return;
        try {
            InputStream is = context.getAssets().open(CONFIG_FILE);
            byte[] buf = new byte[is.available()];
            is.read(buf);
            is.close();
            JSONObject root = new JSONObject(new String(buf, StandardCharsets.UTF_8));
            configs = root.optJSONObject("configs");
            if (configs == null) configs = new JSONObject();
            defaultKey = root.optString("default_key", null);
            fallbackKey = root.optString("fallback_key", null);
            enabledFlag = !root.has("enabled") || root.optBoolean("enabled", true);

            orderedKeys.clear();
            Iterator<String> it = configs.keys();
            while (it.hasNext()) orderedKeys.add(it.next());
            if (defaultKey == null && !orderedKeys.isEmpty()) {
                defaultKey = orderedKeys.get(0);
            }
        } catch (Exception e) {
            Log.e(TAG, "load " + CONFIG_FILE + " failed: " + e.getMessage(), e);
            configs = new JSONObject();
            defaultKey = null;
            fallbackKey = null;
            enabledFlag = true;
        }
        loaded = true;
    }

    @NonNull
    public static String getDefaultKey(@NonNull Context context) {
        ensureLoaded(context);
        return defaultKey != null ? defaultKey : "";
    }

    /** 包名匹配不到时的回落 key（缺省退回 defaultKey）。 */
    @NonNull
    public static String getFallbackKey(@NonNull Context context) {
        ensureLoaded(context);
        return fallbackKey != null ? fallbackKey : getDefaultKey(context);
    }

    @Nullable
    public static String findKeyByInit(@NonNull Context context,
                                       @Nullable String cpId,
                                       @Nullable String productId,
                                       @Nullable String channelId,
                                       @Nullable List<String> domains) {
        ensureLoaded(context);
        String fallbackKey = null;
        for (String key : orderedKeys) {
            JSONObject cfg = configs.optJSONObject(key);
            if (cfg == null) continue;
            JSONObject init = cfg.optJSONObject("init");
            if (init == null) continue;
            if (!sameText(cpId, init.optString("cpid", null))
                    || !sameText(productId, init.optString("product_id", null))
                    || !sameText(channelId, init.optString("channel_id", null))) {
                continue;
            }
            if (fallbackKey == null) {
                fallbackKey = key;
            }
            if (domains == null || domains.isEmpty() || domainMatches(domains, init.optJSONArray("domain"))) {
                return key;
            }
        }
        return fallbackKey;
    }

    private static boolean sameText(@Nullable String left, @Nullable String right) {
        return TextUtils.equals(normalize(left), normalize(right));
    }

    @NonNull
    private static String normalize(@Nullable String value) {
        return value == null ? "" : value.trim();
    }

    private static boolean domainMatches(@NonNull List<String> expectedDomains, @Nullable JSONArray actualDomains) {
        if (actualDomains == null || actualDomains.length() == 0) {
            return false;
        }
        for (String expected : expectedDomains) {
            String expectedValue = normalize(expected);
            if (TextUtils.isEmpty(expectedValue)) continue;
            for (int i = 0; i < actualDomains.length(); i++) {
                if (TextUtils.equals(expectedValue, normalize(actualDomains.optString(i)))) {
                    return true;
                }
            }
        }
        return false;
    }

    public static boolean contains(@NonNull Context context, @Nullable String key) {
        if (TextUtils.isEmpty(key)) return false;
        ensureLoaded(context);
        return configs.has(key);
    }

    @NonNull
    public static List<String> getAllKeys(@NonNull Context context) {
        ensureLoaded(context);
        return Collections.unmodifiableList(new ArrayList<>(orderedKeys));
    }

    @NonNull
    public static List<ConfigItem> getAllItems(@NonNull Context context) {
        ensureLoaded(context);
        List<ConfigItem> out = new ArrayList<>(orderedKeys.size());
        for (String key : orderedKeys) {
            ConfigItem item = getItem(context, key);
            if (item != null) out.add(item);
        }
        return out;
    }

    @Nullable
    public static ConfigItem getItem(@NonNull Context context, @Nullable String key) {
        if (TextUtils.isEmpty(key)) return null;
        ensureLoaded(context);
        JSONObject cfg = configs.optJSONObject(key);
        if (cfg == null) return null;
        JSONObject init = cfg.optJSONObject("init");
        if (init == null) return null;
        String name = "";
        JSONObject meta = cfg.optJSONObject("_meta");
        if (meta != null) name = meta.optString("name", "");
        String cpId = init.optString("cpid", "-");
        String productId = init.optString("product_id", "-");
        String channelId = init.optString("channel_id", "-");
        String domain = "";
        JSONArray domains = init.optJSONArray("domain");
        if (domains != null && domains.length() > 0) {
            domain = domains.optString(0);
        }
        String env = cfg.optString("env", null);
        return new ConfigItem(key, name, cpId, productId, channelId, domain, env);
    }

    /**
     * 获取指定 key 的 {@code init} 段 JSON 字符串，供 SDK 初始化解析。
     * 如果 key 不存在或缺少 init，返回 null。
     */
    @Nullable
    public static String getInitJson(@NonNull Context context, @Nullable String key) {
        if (TextUtils.isEmpty(key)) return null;
        ensureLoaded(context);
        JSONObject cfg = configs.optJSONObject(key);
        if (cfg == null) return null;
        JSONObject init = cfg.optJSONObject("init");
        return init == null ? null : init.toString();
    }

    /** 顶层 {@code enabled} 开关，缺失视为 true。 */
    public static boolean isEnabled(@NonNull Context context) {
        ensureLoaded(context);
        // enabled 存在 root 顶层；ensureLoaded 未单独存该字段，这里从 configs 同级读取需重新解析
        return enabledFlag;
    }

    /** 当前 key 的 env（test/prod/null）。 */
    @Nullable
    public static String getEnv(@NonNull Context context, @Nullable String key) {
        JSONObject cfg = getCfg(context, key);
        return cfg == null ? null : cfg.optString("env", null);
    }

    /** 当前 key 的 ext 段（JSONObject，可能为 null）。 */
    @Nullable
    public static JSONObject getExt(@NonNull Context context, @Nullable String key) {
        JSONObject cfg = getCfg(context, key);
        return cfg == null ? null : cfg.optJSONObject("ext");
    }

    /** 当前 key 的 ext_test 段（JSONObject，可能为 null）。 */
    @Nullable
    public static JSONObject getExtTest(@NonNull Context context, @Nullable String key) {
        JSONObject cfg = getCfg(context, key);
        return cfg == null ? null : cfg.optJSONObject("ext_test");
    }

    /** 当前 key 声明的 package_names。 */
    @NonNull
    public static List<String> getPackageNames(@NonNull Context context, @Nullable String key) {
        JSONObject cfg = getCfg(context, key);
        if (cfg == null) return Collections.emptyList();
        JSONArray arr = cfg.optJSONArray("package_names");
        if (arr == null) return Collections.emptyList();
        List<String> out = new ArrayList<>(arr.length());
        for (int i = 0; i < arr.length(); i++) {
            String p = arr.optString(i);
            if (!TextUtils.isEmpty(p)) out.add(p);
        }
        return out;
    }

    /** 按包名反查 key（package_names 命中即返回）。 */
    @Nullable
    public static String findKeyByPackageName(@NonNull Context context, @Nullable String packageName) {
        if (TextUtils.isEmpty(packageName)) return null;
        ensureLoaded(context);
        for (String key : orderedKeys) {
            JSONObject cfg = configs.optJSONObject(key);
            if (cfg == null) continue;
            JSONArray arr = cfg.optJSONArray("package_names");
            if (arr == null) continue;
            for (int i = 0; i < arr.length(); i++) {
                if (packageName.equals(arr.optString(i))) {
                    return key;
                }
            }
        }
        return null;
    }

    @Nullable
    private static JSONObject getCfg(@NonNull Context context, @Nullable String key) {
        if (TextUtils.isEmpty(key)) return null;
        ensureLoaded(context);
        return configs.optJSONObject(key);
    }
}
