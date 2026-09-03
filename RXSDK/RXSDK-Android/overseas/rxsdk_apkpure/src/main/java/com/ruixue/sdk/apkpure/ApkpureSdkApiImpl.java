package com.ruixue.sdk.apkpure;

import androidx.annotation.NonNull;

import com.ruixue.base.SdkInfo;
import com.ruixue.openapi.RXSdkApiPlugin;

/**
 * Apkpure (VGamePop) 渠道宿主 —— 继承 {@link RXSdkApiPlugin} 复用海外公共逻辑。
 * <p>
 * 差异点仅：sdkName、插件列表。登录 / 支付由 {@link ApkpureSdkWrapper} 插件完成。
 */
public class ApkpureSdkApiImpl extends RXSdkApiPlugin {

    private static final String SDK_NAME = "apkpure";

    private static final String[] PLUGIN_NAME = new String[]{
            "RX_PLUGIN_APKPURE",
            "RX_PLUGIN_FACEBOOK",
            "RX_PLUGIN_GOOGLE",
            "RX_PLUGIN_FIREBASE",
            "RX_PLUGIN_LINE",
            "RX_PLUGIN_ADJUST",
            "RX_PLUGIN_ZALO",
            "RX_PLUGIN_TIKTOK",
            "RX_PLUGIN_SNAPCHAT",
            "RX_PLUGIN_INSTAGRAM",
            "RX_PLUGIN_REDDIT",
            "RX_PLUGIN_TOPON",
            "RX_PLUGIN_JUEFENG",
            "RX_PLUGIN_VK",
            "RX_PLUGIN_RUSTORE"
    };

    static class Single {
        static final ApkpureSdkApiImpl INSTANCE = new ApkpureSdkApiImpl();
    }

    @NonNull
    public static ApkpureSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public SdkInfo getSdkInfo() {
        return buildOverseasSdkInfo(SDK_NAME);
    }

    @Override
    protected String[] getSupportPluginNames() {
        return PLUGIN_NAME;
    }
}
