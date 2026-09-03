package com.ruixue.view;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.base.CaptchaPurpose;
import com.ruixue.callback.RXUICallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.IRXView;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.ui.R;
import com.ruixue.utils.LoadingDialog;
import com.ruixue.utils.ObjectUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * @Desc: 密码找回
 * @Author: ROC LEE
 * @Date: 2022/6/21
 */
public class ForgotPasswordHelper {

    public static IRXView createView(Context context, String url, int title, String account, int accountType, Map<String, Object> map, RXUICallback callback) {
        RXUICallback rxuiCallback = new RXUICallback() {
            @Override
            public Map<String, Object> onClickHandle(Map<String, Object> params) {
                return callback.onClickHandle(params);
            }
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                callback.onSuccess(data);
            }
            @Override
            public void onFailed(@NonNull JSONObject cause) {
                callback.onSuccess(cause);
            }
        };
        if (!TextUtils.isEmpty(url)) {
            return RXWebView.create(context, url).setBackEnable(true).setTitleBackgroundColor(Color.parseColor("#E0FFFC")).setTitle(title).setCallback(rxuiCallback);
        } else {
            return ForgotPasswordHelper.createDialog(context, map, rxuiCallback).setAccountType(accountType).setPhoneTxt(account);
        }
    }

    public static ForgotPasswordView createDialog(Context context, Map<String, Object> map, RXUICallback callback) {
        ForgotPasswordView forgotPasswordVerify = ForgotPasswordView.create(context);
        if (map != null) {
            if (map.containsKey("username")) {
                forgotPasswordVerify.setPhoneTxt((String) map.get("username"));
            }
            if (map.containsKey("password_hint")) {
                forgotPasswordVerify.setPwdHits((String) map.get("password_hint"));
            }
            if (map.containsKey("account_type")) {
                forgotPasswordVerify.setAccountType(ObjectUtils.toInt(map.get("account_type"), CaptchaPurpose.ACCOUNT_TYPE_PHONE));
            }
        }
        forgotPasswordVerify.setBackVisible(true);
        forgotPasswordVerify.setCallback((code, username, captcha_code, password) -> {
            if (code == RXErrorCode.SUCCESS) {
                Map<String, Object> hashMap = new HashMap<>();
                hashMap.put("username", username);
                hashMap.put("password", password);
                hashMap.put("captcha_code", captcha_code);
                Map<String, Object> customMap = callback != null ? callback.onClickHandle(hashMap) : null;
                if (customMap != null) {
                    if (ObjectUtils.toBoolean(customMap.get("break"))) {
                        RXLogger.i("The request is break");
                        return;
                    } else {
                        hashMap.putAll(customMap);
                    }
                }

                Dialog loadingDialog = LoadingDialog.createLoadingDialog(context, "");
                RXSdkApi.getInstance().resetPassword(hashMap, new RXJSONCallback() {
                    @Override
                    public void onError(RXException e) {
                        LoadingDialog.closeDialog(loadingDialog);
                        com.ruixue.utils.UIToast.showNetErrorToast(context, e.getCode());
                        if (callback != null) {
                            callback.onError(e);
                        }
                    }

                    @Override
                    public void onSuccess(@Nullable JSONObject dataR) {
                        try {
                            final JSONObject data = dataR == null ? new JSONObject() : dataR;
                            if (!data.has("username"))
                                data.put("username", username);
                            LoadingDialog.closeDialog(loadingDialog);
                            forgotPasswordVerify.close();
                            SuccessTipView.create(context, context.getString(R.string.rx_txt_resetpwd), context.getString(R.string.rx_tips_resetpwd_success), new RXJSONCallback() {
                                @Override
                                public void onSuccess(@Nullable JSONObject d) {
                                    if (callback != null) {
                                        callback.onSuccess(data);
                                    }
                                }

                                @Override
                                public void onFailed(@NonNull JSONObject cause) {
                                }
                            }).setIcoResId(R.drawable.rx_tips_ico_success).setButtonText(R.string.txt_ok).show();
//                            UIToast.showToast(context, R.string.rx_tips_modify_success);

                        } catch (JSONException e1) {
                            e1.printStackTrace();
                            if (callback != null) {
                                callback.onError(new RXException(e1));
                            }
                        }
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        LoadingDialog.closeDialog(loadingDialog);
                        com.ruixue.utils.UIToast.showToast(context, cause);
                        if (callback != null) {
                            callback.onFailed(cause);
                        }
                    }
                });
            } else if (callback != null) {
                callback.onFailed(code.toJSONObject());
            }
        });
        return forgotPasswordVerify;
    }
}
