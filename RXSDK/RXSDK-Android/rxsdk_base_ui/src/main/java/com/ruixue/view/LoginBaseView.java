package com.ruixue.view;

import android.content.Context;
import android.content.DialogInterface;
import android.graphics.drawable.Drawable;
import android.view.View;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.base.UserActionTrackManager;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.OnViewBackListener;
import com.ruixue.openapi.OnViewCloseListener;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXView;
import com.ruixue.passport.LoginMethod;
import com.ruixue.ui.R;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.RichTextUtils;
import com.ruixue.widget.BaseDialog;
import com.ruixue.widget.LoginButtonGroup;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/3/22
 */
public abstract class LoginBaseView extends RXView {
    public static final int LOGIN_TAG_QUICK = 2;
    TextView tvAgreement;
    LinkedHashMap<String, String> privacyMap;

//    String privacyOneStr = "";
//    String privacyOneUrl = "ruixue://" + LegalData.KEY_SERVICE_AGREEMENT;
//    String privacyTwoStr = "";
//    String privacyTwoUrl = "ruixue://" + LegalData.KEY_PRIVACY_POLICY;
//
//    String privacyThreeStr = "";
//
//    String privacyThreeUrl = "";

    /**
     * 是否显示服务和隐私协议选项
     */
    protected boolean showPrivacy = true;

    protected boolean isAgreedPrivacy = false;
    /**
     * 返回按钮
     */
    protected boolean goBackEnable = false;
    protected LoginClickListener loginClickListener;
    protected OnViewCloseListener onViewCloseListener;
    protected OnViewBackListener onViewBackListener;
    protected CheckBox privacyCheckBox;
    protected List<String> loginMethods = new ArrayList<>();
    LoginMoreMethodView loginMoreMethodView;
    protected LoginButtonGroup loginButtonGroup;
    private boolean isQuickButtonBarVisible;

    public void setOnViewCloseListener(OnViewCloseListener onViewCloseListener) {
        this.onViewCloseListener = onViewCloseListener;
    }

    public void setOnViewBackListener(OnViewBackListener onViewBackListener) {
        this.onViewBackListener = onViewBackListener;
    }

    public void setPrivacyMap(LinkedHashMap<String, String> privacyMap) {
        this.privacyMap = privacyMap;
    }

    public LoginBaseView(Context context) {
        super(context);
    }

    public LoginBaseView setQuickButtonBarVisible(boolean quickButtonBarVisible) {
        isQuickButtonBarVisible = quickButtonBarVisible;
        return this;
    }

    /**
     * @param showPrivacy 是否显示隐私协议选项
     */
    public LoginBaseView setShowPrivacy(boolean showPrivacy) {
        this.showPrivacy = showPrivacy;
        return this;
    }


    public void setLoginMethods(List<String> loginMethods) {
        if (loginMethods != null) {
            this.loginMethods = loginMethods;
            if (loginButtonGroup != null) {
                int num = com.ruixue.utils.AppUtils.isUsePortMatch(getContext()) ? 4 : 3;
                loginButtonGroup.setLoginMethods(this.loginMethods, this.loginMethods.size() > num);
            }
        }
    }

    public void setLoginClickListener(LoginClickListener callback) {
        this.loginClickListener = callback;
    }

//    /**
//     * @param privacyOneStr 用户协议标题
//     */
//    public LoginBaseView setAppPrivacyOneTitle(String privacyOneStr) {
//        this.privacyOneStr = privacyOneStr;
//        return this;
//    }
//
//    /**
//     * @param privacyTwoStr 用户隐私政策标题
//     */
//    public LoginBaseView setAppPrivacyTwTitle(String privacyTwoStr) {
//        this.privacyTwoStr = privacyTwoStr;
//        return this;
//    }
//
//    /**
//     * @param privacyOneStr 用户协议标题
//     * @param privacyOneUrl 用户协议地址
//     */
//    public LoginBaseView setAppPrivacyOne(String privacyOneStr, String privacyOneUrl) {
//        this.privacyOneStr = privacyOneStr;
//        this.privacyOneUrl = privacyOneUrl;
//        return this;
//    }
//
//    /**
//     * @param privacyTwoStr 用户隐私政策标题
//     * @param privacyTwoUrl 用户隐私政策地址
//     */
//    public LoginBaseView setAppPrivacyTwo(String privacyTwoStr, String privacyTwoUrl) {
//        this.privacyTwoStr = privacyTwoStr;
//        this.privacyTwoUrl = privacyTwoUrl;
//        return this;
//    }
//
//    public LoginBaseView setAppPrivacyThree(String privacyThreeStr, String privacyThreeUrl) {
//        this.privacyThreeStr = privacyThreeStr;
//        this.privacyThreeUrl = privacyThreeUrl;
//        return this;
//    }

    //需求改成只显示关闭 2024年11月03日15:47:11
    public LoginBaseView setBackEnable(boolean backEnable) {
//        this.goBackEnable = backEnable;

        return this;
    }

    protected Drawable mLogoDrawable = null;

    public LoginBaseView setLogo(Drawable background) {
        mLogoDrawable = background;
        return this;
    }

    abstract void switchMethodShow(boolean isCaptchaLogin);

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
//        dialog.setDimAmount(0f);
        ImageView close = view.findViewById(R.id.close);

        // 新需求需要展示 back 键的时候隐藏 close
        if (goBackEnable) {
            close.setVisibility(View.GONE);
        } else {
            close.setVisibility((!isCancelable()) ? View.GONE : View.VISIBLE);
        }
        close.setOnClickListener(v -> {
            dialog.cancel();
        });
        ImageView btn_back = view.findViewById(R.id.btn_back);
        btn_back.setVisibility(goBackEnable ? View.VISIBLE : View.GONE);
        btn_back.setOnClickListener(v -> {
            onClickBack(dialog);
        });

        dialog.setOnCancelListener(new OnCancelListener() {
            @Override
            public void onCancel(DialogInterface dialog) {
                if (onViewCloseListener != null) {
                    onViewCloseListener.onClosed(LoginBaseView.this);
                }
                //联动阿里 隐私
                if (onViewBackListener != null) {
                    onViewBackListener.onBack(LoginBaseView.this, privacyCheckBox != null && privacyCheckBox.isChecked());
                }
                logClose();
            }
        });
        if (mLogoDrawable != null) {
            view.findViewById(R.id.tv_title).setVisibility(View.GONE);
            view.findViewById(R.id.iv_title).setVisibility(View.VISIBLE);
            view.findViewById(R.id.iv_title).setBackground(mLogoDrawable);
        }

        privacyCheckBox = view.findViewById(R.id.ischeck);

        privacyCheckBox.setChecked(isAgreedPrivacy);
        privacyCheckBox.setClickable(false);
        privacyCheckBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                isAgreedPrivacy = isChecked;
                if (isChecked) {
                    RXSdkApi.getInstance().setPrivacyAgree(getContext(), isChecked, null);
                }
            }
        });

        view.findViewById(R.id.ll_privacy).setVisibility(showPrivacy ? View.VISIBLE : View.GONE);
        if (showPrivacy) {
            tvAgreement = view.findViewById(R.id.xieyi);
            updateAgreementText(view);
            view.findViewById(R.id.ll_privacy).setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    isAgreedPrivacy = !isAgreedPrivacy;
                    if (isAgreedPrivacy) {
                        RXSdkApi.getInstance().setPrivacyAgree(getContext(), isAgreedPrivacy, null);
                    }
                    privacyCheckBox.setChecked(isAgreedPrivacy);
                }
            });
        }
        loginButtonGroup = view.findViewById(R.id.login_btn_group);

        boolean visible = isQuickButtonBarVisible && !this.loginMethods.isEmpty();
        int num = AppUtils.isUsePortMatch(getContext()) ? 4 : 3;
        loginButtonGroup.setVisibility(visible ? View.VISIBLE : View.GONE);
        LinearLayout ll_other_method = view.findViewById(R.id.ll_other_method);
        if (ll_other_method != null) {
            ll_other_method.setVisibility(visible ? View.VISIBLE : View.GONE);
        }
        if (visible) {
            loginButtonGroup.setLoginMethods(this.loginMethods, this.loginMethods.size() > num);
            loginButtonGroup.setLoginButtonClickListener(new LoginButtonGroup.LoginButtonClickListener() {
                @Override
                public void onLoginButtonClick(String method) {
                    if (method.equals(LoginButtonGroup.MORE)) {
                        loginMoreMethodView = new LoginMoreMethodView(getContext());
                        int fromIndex = 3;
                        loginMoreMethodView.setLoginMethodList(fromIndex < loginMethods.size() ? loginMethods.subList(fromIndex, loginMethods.size()) : null);
                        loginMoreMethodView.setLoginClickListener(new LoginClickListener() {
                            @Override
                            public void onLoginClick(RXView context, String method, int isQuickBtn, Map<String, Object> loginMap) {
                                // 2024-6-6 新改的逻辑登录列表里已经过滤掉了 CAPTCHACODE 和 USERNAME 及 QUICKPHONE，基本不会走下边两个判断了，这里改动最小话不动逻辑了
                                if (method.equals(LoginMethod.CAPTCHACODE) || method.equals(LoginMethod.USERNAME)) {
                                    RXLogger.i("click " + method);
                                    switchMethodShow(method.equals(LoginMethod.CAPTCHACODE));
                                    if (loginMoreMethodView != null) {
                                        loginMoreMethodView.closeDelay(200);
                                    }
                                } else if (method.equals(LoginMethod.QUICKPHONE)) {
                                    if (loginMoreMethodView != null) {
                                        loginMoreMethodView.close();
                                    }
                                    notifyLoginClicked(method, isQuickBtn, null);
                                } else {
                                    checkAgreedPrivacy(method, new PrivacyAgreeClickListener() {
                                        @Override
                                        public void onAgree() {
                                            RXLogger.i("click " + method);
                                            notifyLoginClicked(method, isQuickBtn, null);
                                            if (loginMoreMethodView != null) {
                                                loginMoreMethodView.closeDelay(200);
                                            }
                                        }
                                    });
                                }
                            }
                        });
                        loginMoreMethodView.show();

                    } else {
                        if (method.equals(LoginMethod.CAPTCHACODE) || method.equals(LoginMethod.USERNAME)) {
                            RXLogger.i("click " + method);
                            // 2024-6-6 新改的逻辑登录列表里已经过滤掉了 CAPTCHACODE 和 USERNAME 及 QUICKPHONE，基本不会走下边两个判断了，这里改动最小话不动逻辑了
                            switchMethodShow(method.equals(LoginMethod.CAPTCHACODE));
                        } else if (method.equals(LoginMethod.QUICKPHONE)) {
                            notifyLoginClicked(method, LOGIN_TAG_QUICK, null);
                        } else {
                            userActionTrack("click", method);
                            checkAgreedPrivacy(method, new PrivacyAgreeClickListener() {
                                @Override
                                public void onAgree() {
                                    notifyLoginClicked(method, LOGIN_TAG_QUICK, null);
                                }
                            });
                        }
                    }
                }
            });
        }
    }

    private void onClickBack(BaseDialog dialog) {
        if (onViewBackListener != null) {
            onViewBackListener.onBack(this, privacyCheckBox != null && privacyCheckBox.isChecked());
        }
        logClose();
        dialog.dismiss();
    }

    private void logClose() {
        if (this instanceof LoginView) {
            String method = ((LoginView) this).isCaptchaLogin() ? "captchacode" : "username";
            userActionTrack("close", method);
        }
    }

    private void userActionTrack(String action, String method) {
        Map<String, Object> properties = UserActionTrackManager.generatePropertiesMap("login", method, action);
        UserActionTrackManager.getInstance().reportUserAction(properties);
    }

    @Override
    public void close() {
        if (loginMoreMethodView != null) {
            loginMoreMethodView.close();
            loginMoreMethodView = null;
        }
        super.close();
    }


    public interface PrivacyAgreeClickListener {
        void onAgree();
    }

    protected boolean checkAgreedPrivacy(String method, @NonNull PrivacyAgreeClickListener privacyAgreeClickListener) {
        if (!showPrivacy || (privacyCheckBox != null && privacyCheckBox.isChecked())) {
            privacyAgreeClickListener.onAgree();
            return true;
        } else {
//            String privacy = getContext().getString(R.string.rx_txt_privacy_sure) + " <a href='" + privacyOneUrl + "'>" + privacyOneStr + "</a>、<a href='" + privacyTwoUrl + "'>" + privacyTwoStr + "</a>";
//            if (!TextUtils.isEmpty(privacyThreeUrl) && !TextUtils.isEmpty(privacyThreeStr)) {
//                privacy += "、<a href='" + privacyThreeUrl + "'>" + privacyThreeStr + "</a>";
//            }

            String privacy = getContext().getString(R.string.rx_txt_privacy_sure) + getPrivacyLinkString();
            AppPrivacyView.create(getContext(), privacy, new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    privacyAgreeClickListener.onAgree();
                    if (privacyCheckBox != null)
                        privacyCheckBox.setChecked(true);
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
//                    ToastUtils.showToast(getContext(), RXErrorCode.DISAGREE_PRIVACY.getDesc());
                    if (privacyCheckBox != null)
                        privacyCheckBox.setChecked(false);
                }
            }).show();
            return false;
        }
    }

    protected void notifyLoginClicked(String method, int loginTag, Map<String, Object> map) {
        if (null != this.loginClickListener) {
            if (method != null) {
                this.loginClickListener.onLoginClick(LoginBaseView.this, method, loginTag, map);
            } else {
                ToastUtils.showToast(getContext(), "unknow login method");
            }
        } else {
            RXLogger.e("loginClickListener is null");
        }
    }


    public void updateAgreementText(View view) {
        if (tvAgreement == null) {
            return;
        }

//        for (Map.Entry<String, Object> entry : privacyMap.entrySet()) {
//            agreement.append(String.format("<a href='%s' >%s</a>", entry.getValue(), entry.getKey()));
//        }
//
//        String agreement = String.format("<a href='%s' >%s</a>", privacyOneUrl, privacyOneStr);
//        if (!TextUtils.isEmpty(privacyTwoUrl)) {
//            agreement += String.format("、<a href='%s' >%s</a>", privacyTwoUrl, privacyTwoStr);
//        }
//        if (!TextUtils.isEmpty(privacyThreeUrl) && !TextUtils.isEmpty(privacyThreeStr)) {
//            agreement += String.format("、<a href='%s' >%s</a>", privacyThreeUrl, privacyThreeStr);
////            Configuration configuration = getContext().getResources().getConfiguration();
////            boolean isLandscape = configuration.orientation == Configuration.ORIENTATION_LANDSCAPE;
////            if (!isLandscape) {
////                int size = AppUtils.px2dp(getContext(), getContext().getResources().getDimension(R.dimen.sp_9));
////                privacyCheckBox.setTextSize(size);
////                tvAgreement.setTextSize(size);
////            }
//        }
        RichTextUtils.updateTextViewClickable(getContext(), tvAgreement, getPrivacyLinkString());
    }

    @NonNull
    private String getPrivacyTitleString() {
        StringBuilder agreement = new StringBuilder();
        Iterator<Map.Entry<String, String>> it = privacyMap.entrySet().iterator();
        int i = 0;
        while (it.hasNext() && i < 2) {
            Map.Entry<String, String> item = it.next();
            agreement.append(item.getValue());
            if (i < 1) {
                agreement.append(getContext().getString(R.string.rx_txt_and));
            }
            i++;
        }
        return agreement.toString();
    }

    @NonNull
    protected String getPrivacyLinkString() {
        StringBuilder agreement = new StringBuilder();
        Iterator<Map.Entry<String, String>> it = privacyMap.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<String, String> item = it.next();
            agreement.append(String.format("<a href='%s' >%s</a>", item.getKey(), item.getValue()));
            if (it.hasNext()) {
                agreement.append("、");
            }
        }
        return agreement.toString();
    }

}
