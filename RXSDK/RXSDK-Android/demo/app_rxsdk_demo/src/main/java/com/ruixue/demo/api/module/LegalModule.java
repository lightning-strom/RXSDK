package com.ruixue.demo.api.module;

import android.app.Activity;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.RXUICallback;
import com.ruixue.demo.api.ButtonModule;
import com.ruixue.demo.v2.DemoManager;
import com.ruixue.legal.LegalData;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXSdkUI;
import com.ruixue.openapi.RXWebViewHelper;
import com.ruixue.qipai.R;
import com.ruixue.view.AppPrivacyView;
import com.ruixue.view.ForgotPasswordHelper;

import org.json.JSONObject;

import java.util.Arrays;
import java.util.HashMap;

/**
 * 隐私协议 / 法务 / 忘记密码 H5 等合规展示类测试按钮。
 */
public class LegalModule implements ButtonModule {

    private final Activity activity;
    private final DemoManager.ResultCallback callback;
    private final RXUICallback jsonCallback;

    public LegalModule(@NonNull Activity activity,
                       @NonNull DemoManager.ResultCallback callback,
                       @NonNull RXUICallback jsonCallback) {
        this.activity = activity;
        this.callback = callback;
        this.jsonCallback = jsonCallback;
    }

    @Override
    public void registerButtons(Registrar registrar) {
        registrar.register(R.id.policy, this::showPrivacyView);
        registrar.register(R.id.policy1, this::showPrivacyDialog);
        registrar.register(R.id.policyh5, this::showPrivacyH5View);
        registrar.register(R.id.legal, () -> showLegal(""));
        registrar.register(R.id.permissionui, () -> showLegal("permissions"));
        registrar.register(R.id.privacy_legal_data, this::showPrivacyByLegalData);
        registrar.register(R.id.privacy_key_list, this::showPrivacyByKeyList);
        registrar.register(R.id.forgotpwd_h5, this::showForgotPasswordH5);
        registrar.register(R.id.login_limit, this::loginLimitUI);
    }

    private void showPrivacyView() {
        RXSdkUI.getInstance().protocolView(activity, "00001", Arrays.asList("00001", "00002")).show();
    }

    private void showPrivacyDialog() {
        String privacyOneUrl = "https://u.weile.com/deal/privacy?appid=1002&channelid=205";
        String privacyTwoUrl = "https://u.weile.com/deal/1002/205/1.1.1/000000/1";
        AppPrivacyView.create(activity,
                " 我已阅读并同意<a href='" + privacyOneUrl + "'>《用户协议》</a>、<a href='" + privacyTwoUrl + "'>《隐私政策》</a>",
                null).show();
    }

    private void showPrivacyH5View() {
        String url = RuiXueSdk.getFirstBaseUrl()
                + (RuiXueSdk.isOasVersion() ? "static/passport/#/oversea/privacy" : "static/passport/#/user/privacy");
        RXWebViewHelper.createWebView(activity, url, new HashMap<>(), jsonCallback).show();
    }

    /** 隐私政策 - LegalData 版：从后台 legal 接口拉取 LegalData 后按 key 渲染。 */
    private void showPrivacyByLegalData() {
        RXSdkApi.getInstance().legal(new HashMap<>(), new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (data == null) {
                    callback.onToast("未配置相关法务信息");
                    return;
                }
                LegalData legalData = LegalData.fromJson(data);
                RXSdkUI.getInstance()
                        .userPrivacyPolicy(activity, legalData, "00001", jsonCallback)
                        .show();
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                callback.onResult("获取法务信息失败: " + cause.toString());
            }
        });
    }

    /** 隐私政策 - 多 Key 版：直接传入 title / content / keyList，常用于自定义嵌入场景。 */
    private void showPrivacyByKeyList() {
        String content = " 我已阅读并同意<a href='rxsdk://legal?key=00001'>《用户协议》</a>、"
                + "<a href='rxsdk://legal?key=00002'>《隐私政策》</a>";
        RXSdkUI.getInstance()
                .userPrivacyPolicy(activity,
                        "用户协议和隐私政策",
                        content,
                        Arrays.asList("00001", "00002"),
                        jsonCallback)
                .show();
    }

    private void showLegal(String key) {
        RXSdkApi.getInstance().legal(new HashMap<>(), new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (data == null) {
                    callback.onToast("未配置相关法务信息");
                    return;
                }
                LegalData legalData = LegalData.fromJson(data);
                if (TextUtils.isEmpty(key)) {
                    RXSdkUI.getInstance().protocolView(activity, key, Arrays.asList("00001", "00002")).show();
                } else if ("permissions".equals(key)) {
                    if (legalData.getTerm(key) != null) {
                        RXSdkUI.getInstance().protocolView(activity, key, Arrays.asList("00001", "00002")).show();
                    } else {
                        callback.onToast("未配置权限说明信息");
                    }
                } else {
                    RXSdkUI.getInstance().protocolView(activity, key, Arrays.asList("00001", "00002")).show();
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                callback.onResult("获取法务信息失败: " + cause.toString());
            }
        });
    }

    private void showForgotPasswordH5() {
        String url = RuiXueSdk.getFirstBaseUrl()
                + (RuiXueSdk.isOasVersion() ? "static/passport/#/oversea/forgetpassword"
                        : "static/passport/#/user/forgetpassword");
        ForgotPasswordHelper.createView(activity, url, R.drawable.logo, null, 1, null, jsonCallback).show();
    }

    private void loginLimitUI() {
        RXSdkApi.getInstance().legal(new HashMap<>(), new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (data == null) {
                    callback.onToast("未配置相关法务信息");
                    return;
                }
                LegalData legalData = LegalData.fromJson(data);
                if (legalData.getTerm("real_name") != null) {
                    callback.onResult("实名认证信息: " + legalData.getTerm("real_name").getContent());
                } else {
                    callback.onToast("未配置实名认证信息");
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                callback.onResult("获取法务信息失败: " + cause.toString());
            }
        });
    }
}
