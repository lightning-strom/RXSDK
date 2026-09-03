package com.ruixue.demo.share;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;

/**
 * 分享测试台静态元数据。
 * <p>
 * 把平台、素材类型等“静态字典”从 {@link com.ruixue.demo.activity.ShareTestActivity}
 * 拆出，Activity 只负责 UI 编排，这里统一维护文档支持矩阵。
 */
public final class ShareTestMeta {

    private ShareTestMeta() {
    }

    /** 平台 key → 元数据，顺序即选择器展示顺序 */
    public static final LinkedHashMap<String, PlatformMeta> PLATFORMS = new LinkedHashMap<>();

    /** material_type → 描述 */
    public static final LinkedHashMap<String, String> MATERIAL_DESCRIPTIONS = new LinkedHashMap<>();

    static {
        PLATFORMS.put("system", new PlatformMeta("系统分享", 0,
                new String[]{"text", "image"},
                "shareScene 不生效，展示内容取决于系统分享面板。",
                "拉起后统一按成功处理，无真实失败/取消回调。"));
        PLATFORMS.put("wechat", new PlatformMeta("微信", 0,
                new String[]{"text", "image", "link"},
                "shareScene: 0=好友, 1=朋友圈。",
                "关闭/取消/分享都会回成功。"));
        PLATFORMS.put("facebook", new PlatformMeta("Facebook", 1,
                new String[]{"image", "link"},
                "shareScene: 0=弹框样式, 1=跳转 Facebook App。",
                "成功/失败/取消都有真实回调。"));
        PLATFORMS.put("messenger", new PlatformMeta("Messenger", 0,
                new String[]{"image", "link"},
                "shareScene 通常不生效。",
                "无真实成功/失败/取消回调。"));
        PLATFORMS.put("line", new PlatformMeta("LINE", 0,
                new String[]{"text", "link"},
                "shareScene 通常不生效。",
                "无成功/失败/取消回调。"));
        PLATFORMS.put("tiktok", new PlatformMeta("TikTok", 0,
                new String[]{"image", "video"},
                "shareScene 通常不生效。",
                "成功/失败/取消都有真实回调。"));
        PLATFORMS.put("zalo", new PlatformMeta("Zalo", 0,
                new String[]{"link"},
                "shareScene: 0=好友, 1=朋友圈。",
                "默认可由用户自行选择分享目标。"));
        PLATFORMS.put("snapchat", new PlatformMeta("Snapchat", 0,
                new String[]{"image", "video"},
                "shareScene 通常不生效。",
                "拉起即回成功，用户需手动返回 App。"));

        MATERIAL_DESCRIPTIONS.put("text", "文本：需要 title/content，文档支持 wechat/system/line。");
        MATERIAL_DESCRIPTIONS.put("image", "图片：需要 image；如需二维码可再配 url/x/y/width/height。");
        MATERIAL_DESCRIPTIONS.put("link", "链接：需要 title/content/image/url，文档支持 wechat/facebook/messenger/zalo/line。");
        MATERIAL_DESCRIPTIONS.put("landing", "落地页：通常只依赖后台返回 url，客户端主要用于承接和上报。");
        MATERIAL_DESCRIPTIONS.put("video", "视频：当前主要用于 tiktok/snapchat，通常需要更具体的平台视频参数。");
    }

    /** 取平台元数据 */
    @Nullable
    public static PlatformMeta getPlatform(@Nullable String key) {
        return key == null ? null : PLATFORMS.get(key);
    }

    /** 该平台是否使用 shareScene */
    public static boolean usesShareScene(@Nullable String platform) {
        return "wechat".equals(platform) || "facebook".equals(platform) || "zalo".equals(platform);
    }

    /** 规范化 material_type（landing 归一到 link，用于提示） */
    @NonNull
    public static String normalizeMaterialType(@Nullable String raw) {
        String value = raw == null ? "" : raw.trim().toLowerCase();
        if ("landing".equals(value)) {
            return "link";
        }
        return value;
    }

    /** 某 material_type 的必填字段列表 */
    @NonNull
    public static List<String> getRequiredFields(@NonNull String materialType) {
        switch (materialType) {
            case "text":
                return Arrays.asList("title", "content");
            case "image":
                return Collections.singletonList("image");
            case "link":
            case "landing":
                return Arrays.asList("title", "content", "image", "url");
            case "video":
                return Collections.singletonList("url");
            default:
                return Collections.emptyList();
        }
    }

    /** 平台 shareScene 可选项：<显示文案, 值> */
    @NonNull
    public static List<SceneOption> getShareSceneOptions(@Nullable String platform) {
        if ("wechat".equals(platform) || "zalo".equals(platform)) {
            return Arrays.asList(
                    new SceneOption("0 - 好友", "0"),
                    new SceneOption("1 - 朋友圈", "1")
            );
        }
        if ("facebook".equals(platform)) {
            return Arrays.asList(
                    new SceneOption("0 - 弹框样式", "0"),
                    new SceneOption("1 - 跳转 Facebook App", "1")
            );
        }
        return Collections.singletonList(new SceneOption("0 - 默认", "0"));
    }

    /** 平台元数据 */
    public static final class PlatformMeta {
        public final String label;
        public final int defaultScene;
        public final String[] supportedTypes;
        public final String sceneHint;
        public final String callbackHint;

        public PlatformMeta(@NonNull String label,
                            int defaultScene,
                            @NonNull String[] supportedTypes,
                            @NonNull String sceneHint,
                            @NonNull String callbackHint) {
            this.label = label;
            this.defaultScene = defaultScene;
            this.supportedTypes = supportedTypes;
            this.sceneHint = sceneHint;
            this.callbackHint = callbackHint;
        }

        public boolean supports(@NonNull String materialType) {
            for (String supportedType : supportedTypes) {
                if (supportedType.equals(materialType)) {
                    return true;
                }
            }
            return false;
        }
    }

    /** shareScene 可选项 */
    public static final class SceneOption {
        public final String label;
        public final String value;

        public SceneOption(@NonNull String label, @NonNull String value) {
            this.label = label;
            this.value = value;
        }
    }
}
