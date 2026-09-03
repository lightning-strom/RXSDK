package com.ruixue.sdk.vk;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.text.TextUtils;

import androidx.lifecycle.LifecycleOwner;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.PluginSdk;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * VK ID 登录插件。
 * <p>
 * 默认使用官方 {@link com.vk.id.VKID} SDK（OAuth 2.1），成功后 ext 返回
 * {@code access_token}，需宿主在 Manifest 配置 VKID 占位符并完成 {@link VkIdAuthBridge} 初始化。
 * <p>
 * 当 ext 设置 {@code vk_auth_mode=code} 时，回退 WebView PKCE 流程；
 * 授权成功后将 {@code code}、{@code code_verifier}、{@code device_id} 通过 ext 返回给上层，
 * 由瑞雪服务端完成 code → access_token 的交换。
 * 见 <a href="https://id.vk.com/about/business/go/docs/en/vkid/latest/vk-id/connection/migration/android/migration-on-oauth-2.1">VK ID Android OAuth 2.1 迁移</a>。
 * <p>
 * 通过 AndroidManifest meta-data {@code RX_PLUGIN_VK} 注册，{@link #getName()} 返回
 * {@code "vk"}，对应 {@link com.ruixue.passport.LoginMethod#VK}。
 * <p>
 * 接入说明见模块 README（RuStore 场景参考
 * {@code https://www.rustore.ru/help/en/sdk/vk-id}）。
 * <p>
 * ext 配置项（客户端 → 服务端字段映射）：
 * <ul>
 * <li>{@code vk_client_id} — VK 应用 Client ID，对应服务端
 * {@code tp_appid}（<b>PKCE 模式必填，SDK 模式可选</b>）</li>
 * <li>{@code vk_redirect_uri} — 可选，默认 {@code https://oauth.vk.com/blank.html}；
 * 实际值需与 VK 开发者后台登记一致</li>
 * <li>{@code vk_auth_mode} — 可选，{@code sdk}（默认，官方 VKID SDK）或 {@code code}（WebView PKCE）</li>
 * </ul>
 * <p>
 * 登录成功后通过 ext 返回给服务端的字段：
 * <ul>
 * <li>SDK 模式：{@code access_token}</li>
 * <li>PKCE 模式：{@code code}、{@code code_verifier}、{@code device_id}</li>
 * </ul>
 */
public class VkSdkWrapper extends PluginSdk {

    public static final String NAME = "vk";

    private static final int AUTH_REQUEST_CODE = RuiXueSdk.DEFAULT_CALLBACK_REQUEST_CODE_OFFSET + 40;
    private static final String DEFAULT_REDIRECT_URI = "https://oauth.vk.com/blank.html";
    private static final String AUTH_ENDPOINT = "https://id.vk.com/authorize";

    static class Single {
        static final VkSdkWrapper INSTANCE = new VkSdkWrapper();
    }

    public static VkSdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    private String clientId;
    private String redirectUri = DEFAULT_REDIRECT_URI;
    private boolean useOfficialSdk;

    private RXJSONCallback loginCallback;
    private String pendingCodeVerifier;

    /** SDK 模式跳板页回调，由 {@link VkSdkAuthActivity} 通过 {@link #consumePendingSdkCallback()} 消费。 */
    static volatile RXJSONCallback pendingSdkCallback;

    static RXJSONCallback consumePendingSdkCallback() {
        RXJSONCallback cb = pendingSdkCallback;
        pendingSdkCallback = null;
        return cb;
    }

    /** ext 里 JSON/Map 可能把 client_id 解析成 Number；空串与 null 视为未配置。 */
    @Nullable
    private static String extString(@Nullable Map<String, Object> paramsMap, @NonNull String key) {
        if (paramsMap == null)
            return null;
        Object o = paramsMap.get(key);
        if (o == null)
            return null;
        String s = String.valueOf(o).trim();
        return TextUtils.isEmpty(s) ? null : s;
    }

    // ==================== PluginSdk ====================

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {
        clientId = extString(paramsMap, "vk_client_id");
        String uri = extString(paramsMap, "vk_redirect_uri");
        if (!TextUtils.isEmpty(uri)) {
            redirectUri = uri;
        }
        useOfficialSdk = VkIdAuthBridge.useOfficialSdk(paramsMap);
        if (!useOfficialSdk && TextUtils.isEmpty(clientId)) {
            RXLogger.e(getName() + " init failed: vk_client_id missing in PKCE mode");
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.INIT_PARAMS_ERROR.getValue(),
                        "vk_client_id empty in PKCE mode: set ext vk_client_id from VK ID console (tp_appid)"));
            }
            return false;
        }
        if (useOfficialSdk) {
            if (TextUtils.isEmpty(clientId)) {
                RXLogger.w(getName() + " init (VKID SDK) without vk_client_id; login can continue by manifest placeholders");
            }
            if (!VkIdAuthBridge.initVkid(context)) {
                if (callback != null) {
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.INIT_PARAMS_ERROR.getValue(),
                            "VKID.init failed; set host manifestPlaceholders VKIDClientID/Secret (see rxsdk_vk README)"));
                }
                return false;
            }
            RXLogger.i(getName() + " init ok (VKID SDK), clientId=" + (TextUtils.isEmpty(clientId) ? "<empty>" : clientId));
        } else {
            RXLogger.i(getName() + " init ok (WebView PKCE), clientId=" + clientId);
        }
        if (callback != null)
            callback.onSuccess(null);
        return true;
    }

    // ==================== 登录 ====================

    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
        boolean useSdkForLogin = VkIdAuthBridge.useOfficialSdk(paramsMap, useOfficialSdk);
        if (useSdkForLogin) {
            if (activity instanceof LifecycleOwner) {
                VkIdAuthBridge.authorize(activity, callback);
            } else {
                // 宿主 Activity 不是 LifecycleOwner（如 Unity UnityPlayerActivity），
                // 启动跳板页由 AppCompatActivity 代为持有 VKID 生命周期。
                RXLogger.i(getName() + " doLogin: activity is not LifecycleOwner, start VkSdkAuthActivity as trampoline");
                pendingSdkCallback = callback;
                Intent intent = new Intent(activity, VkSdkAuthActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                activity.startActivity(intent);
            }
            return true;
        }
        if (TextUtils.isEmpty(clientId)) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_INIT_ERROR.getValue(),
                    "VK PKCE not initialized, check vk_client_id in ext"));
            return true;
        }

        String codeVerifier = PkceUtil.generateCodeVerifier();
        String codeChallenge = PkceUtil.generateCodeChallenge(codeVerifier);
        String state = PkceUtil.generateState();

        String authUrl = AUTH_ENDPOINT
                + "?response_type=code"
                + "&client_id=" + Uri.encode(clientId)
                + "&redirect_uri=" + Uri.encode(redirectUri)
                + "&code_challenge=" + Uri.encode(codeChallenge)
                + "&code_challenge_method=S256"
                + "&state=" + Uri.encode(state)
                + "&scope=vkid.personal_info";

        pendingCodeVerifier = codeVerifier;
        loginCallback = callback;

        Intent intent = new Intent(activity, VkAuthActivity.class);
        intent.putExtra(VkAuthActivity.EXTRA_AUTH_URL, authUrl);
        intent.putExtra(VkAuthActivity.EXTRA_REDIRECT_URI, redirectUri);
        intent.putExtra(VkAuthActivity.EXTRA_STATE, state);
        activity.startActivityForResult(intent, AUTH_REQUEST_CODE);

        return true;
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode != AUTH_REQUEST_CODE || loginCallback == null)
            return;

        if (resultCode == Activity.RESULT_CANCELED) {
            loginCallback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject());
            loginCallback = null;
            pendingCodeVerifier = null;
            return;
        }

        if (data == null) {
            loginCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR));
            loginCallback = null;
            pendingCodeVerifier = null;
            return;
        }

        String error = data.getStringExtra(VkAuthActivity.RESULT_ERROR);
        if (!TextUtils.isEmpty(error)) {
            RXLogger.e(getName() + " login error: " + error);
            loginCallback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(-1, error));
            loginCallback = null;
            pendingCodeVerifier = null;
            return;
        }

        String code = data.getStringExtra(VkAuthActivity.RESULT_CODE);
        String deviceId = data.getStringExtra(VkAuthActivity.RESULT_DEVICE_ID);

        if (TextUtils.isEmpty(code)) {
            loginCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR));
            loginCallback = null;
            pendingCodeVerifier = null;
            return;
        }

        RXLogger.i(getName() + " login success, code length=" + code.length());
        Map<String, Object> extMap = new HashMap<>();
        extMap.put("code", code);
        extMap.put("code_verifier", pendingCodeVerifier);
        extMap.put("device_id", TextUtils.isEmpty(deviceId) ? "" : deviceId);
        loginCallback.onSuccess(new JSONObject(extMap));

        loginCallback = null;
        pendingCodeVerifier = null;
    }

    // ==================== 登出 ====================

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
        RXLogger.i(getName() + " doLogout");
        if (callback != null)
            callback.onSuccess("");
        return true;
    }

    // ==================== 支付（不支持） ====================

    @Override
    public boolean doPay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        return false;
    }
}
