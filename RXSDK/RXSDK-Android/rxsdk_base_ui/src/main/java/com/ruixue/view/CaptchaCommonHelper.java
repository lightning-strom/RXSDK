package com.ruixue.view;

import android.app.Dialog;
import android.content.Context;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.CaptchaPurpose;
import com.ruixue.base.PresetEventHelper;
import com.ruixue.callback.RXUICallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.listener.RXMapCallback;
import com.ruixue.openapi.Constants;
import com.ruixue.openapi.IRXView;
import com.ruixue.openapi.OnViewCloseListener;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXView;
import com.ruixue.ui.R;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.LoadingDialog;
import com.ruixue.utils.MobileUtils;
import com.ruixue.utils.UIToast;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class CaptchaCommonHelper {
    @NonNull
    private static RXJSONCallback handleCallback(Context context, Dialog dialog, int resId, int contentResId, String purpose, Map<String, Object> hashMap, RXJSONCallback callback) {
        LoadingDialog xdialog = LoadingDialog.createLoadingDialog(dialog.getContext(), "");
        xdialog.showDelay(500).closeDelay(10000);
        return new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                dialog.dismiss();
                xdialog.dismiss();
                if (changePasswordView != null) {
                    changePasswordView.close();
                    changePasswordView = null;
                }
                SuccessTipView.create(context).setTitle(resId).setContent(contentResId).setButtonText(R.string.txt_ok).setIcoResId(R.drawable.rx_tips_ico_already_realname).show();
                if (callback != null) {
                    try {
                        if (data == null) {
                            data = new JSONObject(hashMap);
                        } else if (hashMap.containsKey("username")) {
                            data.put("username", hashMap.get("username"));
                        }
                        data.put("purpose", purpose);
                        callback.onSuccess(data);
                    } catch (JSONException e) {
                        callback.onError(new RXException(e));
                    }
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                LoadingDialog.closeDialog(xdialog);
                com.ruixue.utils.UIToast.showToast(context, cause);
                if (callback != null) {
                    try {
                        cause.put("purpose", purpose);
                        callback.onFailed(cause);
                    } catch (JSONException e) {
                        callback.onError(new RXException(e));
                    }
                }
            }

            @Override
            public void onError(RXException e) {
                LoadingDialog.closeDialog(xdialog);
                UIToast.showNetErrorToast(context, e.getCode());
                if (callback != null) {
                    callback.onError(e);
                }
            }
        };
    }

    public static RXView bindPhoneUI(Context activity, Map<String, Object> hashMap, RXUICallback callback) {
        return create(activity, hashMap, CaptchaPurpose.BINDPHONE, Constants.REGISTER_TYPE_PHONE, callback);
    }

    public static RXView unBindPhoneUI(Context activity, RXUICallback callback) {
        return create(activity, new HashMap<>(), CaptchaPurpose.UNBINDPHONE, Constants.REGISTER_TYPE_PHONE, callback);
    }

    public static RXView bindEmailUI(Context activity, RXUICallback callback) {
        return create(activity, new HashMap<>(), CaptchaPurpose.BINDEMAIL, Constants.REGISTER_TYPE_EMAIL, callback);
    }

    public static RXView unBindEmailUI(Context activity, RXUICallback callback) {
        return create(activity, new HashMap<>(), CaptchaPurpose.UNBINDEMAIL, Constants.REGISTER_TYPE_EMAIL, callback);
    }

    public static RXView registerUI(Context context, Map<String, Object> hashMap, int registerType, RXUICallback callback) {
        return create(context, hashMap, CaptchaPurpose.REGISTER, registerType, callback);
    }

    public static RXView registerPhoneUI(Context activity, Map<String, Object> hashMap, RXUICallback callback) {
        return create(activity, hashMap, CaptchaPurpose.REGISTER, Constants.REGISTER_TYPE_PHONE, callback);
    }

    public static RXView registerUserNameUI(Context activity, Map<String, Object> hashMap, RXUICallback callback) {
        return create(activity, hashMap, CaptchaPurpose.REGISTER, Constants.REGISTER_TYPE_USERNAME, callback);
    }

    public static RXView registerEmailUI(Context activity, Map<String, Object> hashMap, boolean twoStep, RXUICallback callback) {
        PresetEventHelper.emailRegisterClick();
        return create(activity, hashMap, CaptchaPurpose.REGISTER, Constants.REGISTER_TYPE_EMAIL, twoStep, callback);
    }

    public static RXView create(Context context, Map<String, Object> hashMap, String purpose, int registerType, RXUICallback callback) {
        return create(context, hashMap, purpose, registerType, false, callback);
    }

    static ChangePasswordView changePasswordView;

    /**
     * 绑定手机号UI
     * @param context  activity
     * @param purpose  验证码类型 {@link CaptchaPurpose}
     * @param callback
     */
    public static RXView create(Context context, Map<String, Object> hashMap, String purpose, int registerType, boolean twoStep, RXUICallback callback) {
        CaptchaCommonView captchaCommonDialog = CaptchaCommonView.create(context, purpose);
        captchaCommonDialog.setCallback(new CaptchaCommonView.OnCaptchaCallback() {
            @Override
            public void onFinish(Dialog dialog, String account, String captcha, String password) {
                if (twoStep && CaptchaPurpose.REGISTER.equals(purpose) && registerType != Constants.REGISTER_TYPE_USERNAME) {
                    boolean isEmail = MobileUtils.isEmail(account);
                    if (!isEmail && registerType == Constants.REGISTER_TYPE_EMAIL) {
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.PERMISSION_ERROR.getValue(), context.getString(R.string.rx_tips_email_format_err)));
                        return;
                    }
                    RXSdkApi.getInstance().verifyCaptcha(account, purpose, isEmail, captcha, new RXJSONCallback() {
                        @Override
                        public void onSuccess(@Nullable JSONObject data) {
                            PresetEventHelper.verifyCode(true, purpose, isEmail, null);
                            changePasswordView = ChangePasswordView.create(context).setBackEnable(true).setIsPasswordSet(false).setOnViewCloseListener(v -> captchaCommonDialog.dismiss()).setCallback(new RXMapCallback() {
                                @Override
                                public void onSuccess(@Nullable Map<String, Object> data) {

                                    if (data != null) {
                                        sendRequest(context, dialog, hashMap, account, captcha, (String) data.get("new_password"), purpose, callback, registerType);
                                    } else {
                                        callback.onFailed(RXErrorCode.PERMISSION_ERROR.toJSONObject());
                                    }
                                }

                                @Override
                                public void onFailed(@NonNull Map<String, Object> cause) {
                                    PresetEventHelper.setPassword(false, new JSONObject(cause));
                                }
                            });
                            changePasswordView.show();
                        }

                        @Override
                        public void onError(RXException e) {
                            com.ruixue.utils.UIToast.showNetErrorToast(context, e.getCode());
                        }

                        @Override
                        public void onFailed(@NonNull JSONObject cause) {
                            com.ruixue.utils.UIToast.showToast(context, cause);
                            PresetEventHelper.verifyCode(false, purpose, isEmail, null);
                        }
                    });
                } else {
                    sendRequest(context, dialog, hashMap, account, captcha, password, purpose, callback, registerType);
                }
            }

            @Override
            public void onClosed() {
                if (callback != null) {
                    callback.onFailed(RXErrorCode.UI_CLOSE.toJSONObject());
                }
            }
        });
        captchaCommonDialog.setRegisterType(registerType);

        if (CaptchaPurpose.BINDPHONE.equals(purpose)) {
            captchaCommonDialog.setTitle(R.string.txt_bind_phone).setPasswordVisible(true);
        } else if (CaptchaPurpose.BINDEMAIL.equals(purpose)) {
            captchaCommonDialog.setTitle(R.string.txt_bind_email).setPasswordVisible(true);
        } else if (CaptchaPurpose.UNBINDPHONE.equals(purpose)) {
            captchaCommonDialog.setTitle(R.string.txt_unbind_phone).setPasswordVisible(false);
        } else if (CaptchaPurpose.UNBINDEMAIL.equals(purpose)) {
            captchaCommonDialog.setTitle(R.string.txt_unbind_email).setPasswordVisible(false);
        } else if (CaptchaPurpose.REGISTER.equals(purpose)) {
            if (Constants.REGISTER_TYPE_PHONE == registerType) {
                captchaCommonDialog.setTitle(R.string.txt_register).setPasswordVisible(!twoStep);
            } else if (Constants.REGISTER_TYPE_EMAIL == registerType) {
                captchaCommonDialog.setTitle(R.string.txt_register).setPasswordVisible(!twoStep);
            } else {
                captchaCommonDialog.setTitle(R.string.txt_register).setPasswordVisible(true).setCaptchaVisible(false);
            }
        }
        return captchaCommonDialog;
    }

    private static void sendRequest(Context context, Dialog dialog, Map<String, Object> hashMap, String account, String captcha, String password, String purpose, RXUICallback callback, int registerType) {
        if (hashMap == null)
            hashMap = new HashMap<>();
        if (!TextUtils.isEmpty(captcha)) {
            hashMap.put("captcha_code", captcha);
        }
        if (CaptchaPurpose.BINDPHONE.equals(purpose)) {
            hashMap.put("password", password);
            hashMap.put("phone", account);
            invokeClickHandle(callback, hashMap);
            RXSdkApi.getInstance().bindPhone(hashMap, handleCallback(context, dialog, R.string.txt_bind_phone, R.string.rx_tips_bind_success, purpose, hashMap, callback));
        } else if (CaptchaPurpose.BINDEMAIL.equals(purpose)) {
            hashMap.put("password", password);
            hashMap.put("email", account);
            invokeClickHandle(callback, hashMap);
            RXSdkApi.getInstance().bindEmail(hashMap, handleCallback(context, dialog, R.string.txt_bind_email, R.string.rx_tips_bind_success, purpose, hashMap, callback));
        } else if (CaptchaPurpose.UNBINDPHONE.equals(purpose)) {
            hashMap.put("phone", account);
            invokeClickHandle(callback, hashMap);
            RXSdkApi.getInstance().unBindPhone(hashMap, handleCallback(context, dialog, R.string.txt_unbind_phone, R.string.rx_tips_unbind_success, purpose, hashMap, callback));
        } else if (CaptchaPurpose.UNBINDEMAIL.equals(purpose)) {
            hashMap.put("email", account);
            invokeClickHandle(callback, hashMap);
            RXSdkApi.getInstance().unBindEmail(hashMap, handleCallback(context, dialog, R.string.txt_unbind_email, R.string.rx_tips_unbind_success, purpose, hashMap, callback));
        } else if (CaptchaPurpose.REGISTER.equals(purpose)) {
            hashMap.put("username", account);
            hashMap.put("password", password);
            hashMap.put("type", registerType);
            invokeClickHandle(callback, hashMap);
            RXSdkApi.getInstance().register(hashMap, handleCallback(context, dialog, R.string.txt_register, R.string.rx_tips_register_success, purpose, hashMap, callback));
        }
    }

    private static void invokeClickHandle(RXUICallback callback, Map<String, Object> hashMap) {
        if (callback != null) {
            Map<String, Object> customMap = callback.onClickHandle(new HashMap<>(hashMap));
            if (customMap != null) {
                hashMap.putAll(customMap);
            }
        }
    }
}
