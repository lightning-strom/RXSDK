package com.ruixue.view;

import android.app.Activity;
import android.content.Context;
import android.content.res.Resources;
import android.graphics.Paint;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.text.method.DigitsKeyListener;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.adapter.RealNameRewardAdapter;
import com.ruixue.base.UserActionTrackManager;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.listener.OnMultiClickListener;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXView;
import com.ruixue.passport.LoginData;
import com.ruixue.passport.Reward;
import com.ruixue.realauth.DeleteAwareEditText;
import com.ruixue.realauth.IdCardEditText;
import com.ruixue.realauth.IdCardNumberKeyboardManager;
import com.ruixue.realauth.KeyboardCallback;
import com.ruixue.ui.R;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.LoadingDialog;
import com.ruixue.utils.ThreadUtils;
import com.ruixue.utils.UIToast;
import com.ruixue.widget.BaseDialog;
import com.ruixue.widget.SomeMonitorEditText;

import org.json.JSONObject;

import java.util.Map;

public class RealNameView extends RXView {
    protected RXJSONCallback callback;
    private String idCardDigitsStr;

    private boolean useCustomIdCardKeyboard = true;

    private boolean canUseFastAuth = false;
    private boolean realNameIsDefault = false;
    private boolean realNameChanged = false;
    private boolean realCardNumberIsDefault = false;
    private boolean realCardNumberChanged = false;

//    private int idcardInputMode = 0; // 0: 输入法带输入框 1: 输入法不带输入框

    private ViewGroup mainContainer;

    public void setIdCardDigitsStr(String digitsStr) {
        this.idCardDigitsStr = digitsStr;
    }

    public RealNameView setCallback(RXJSONCallback callback) {
        this.callback = callback;
        return this;
    }


    public RealNameView(Context context) {
        super(context);
        setCancelable(false);
    }


    /**
     * 实名认证UI
     *
     * @param activity   activity
     * @param cancelable 窗口是否可以取消
     * @param callback   callback
     */
    public static RealNameView create(Activity activity, boolean cancelable, RXJSONCallback callback) {
        RealNameView realNameDialog = new RealNameView(activity).setCallback(callback);
        realNameDialog.setCancelable(cancelable);
        return realNameDialog;
    }

    @Override
    public int getResId() {
        return R.layout.rx_real_name;
    }


    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        ImageView close = view.findViewById(R.id.close);
        close.setVisibility(isCancelable() ? View.VISIBLE : View.GONE);
        close.setEnabled(isCancelable());
        close.setOnClickListener(v -> {
//            IdCardNumberKeyboardViewManager.getInstance().setShowing(false);
            dialog.cancel();
        });
        dialog.setOnCancelListener(dialog1 -> {
            clearIifaaValidateCallback();
//            IdCardNumberKeyboardViewManager.getInstance().setShowing(false);
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UI_CLOSE.getValue(), "未实名认证，请实名认证。"));
            }
        });
        dialog.setOnDismissListener(dialog12 -> clearIifaaValidateCallback());


        LoginData loginData = RuiXueSdk.getLoginData();
        useCustomIdCardKeyboard = RXGlobalData.isRealAuthUseCustomKeyboard();

        // 只有 fast auth 开关开启，并且 二者内容都不为空才是可以用状态
        canUseFastAuth = RXGlobalData.isRealAuthFastAuth() && loginData != null && !TextUtils.isEmpty(loginData.getExtRealName()) && !TextUtils.isEmpty(loginData.getExtIdcard());
        realNameIsDefault = canUseFastAuth;
        realCardNumberIsDefault = canUseFastAuth;
        realNameChanged = false;
        realCardNumberChanged = false;

        TextView title = view.findViewById(R.id.title);
        DeleteAwareEditText realname = view.findViewById(R.id.realname);
        IdCardEditText idcard = view.findViewById(R.id.idcard);
        Button sure = view.findViewById(R.id.sure);
        View manualAuthBack = view.findViewById(R.id.manual_auth_back);
        View realAuthChoiceLayout = view.findViewById(R.id.real_auth_choice_layout);
        View manualRealAuthLayout = view.findViewById(R.id.manual_real_auth_layout);
        View alipayAuthButton = view.findViewById(R.id.alipay_auth_button);
        TextView manualAuthButton = view.findViewById(R.id.manual_auth_button);

        mainContainer = view.findViewById(R.id.mainContainer);

//        view.setOnTouchListener((v, event) -> {
//            if (event.getAction() == MotionEvent.ACTION_DOWN) {
//                IdCardNumberKeyboardManager.getInstance().hideIdCardKeyboard();
//            }
//            return false;
//        });

        SomeMonitorEditText.create(sure, realname, idcard);

        boolean useIIFAA = RXGlobalData.isRealAuthUseIIFAA();
        if (realAuthChoiceLayout != null && manualRealAuthLayout != null) {
            realAuthChoiceLayout.setVisibility(useIIFAA ? View.VISIBLE : View.GONE);
            manualRealAuthLayout.setVisibility(useIIFAA ? View.GONE : View.VISIBLE);
        }
        if (manualAuthBack != null) {
            manualAuthBack.setVisibility(View.GONE);
            manualAuthBack.setOnClickListener(v -> {
                userActionTrack("back");
                hideKeyboard(realname);
                hideKeyboard(idcard);
                if (realAuthChoiceLayout != null) {
                    realAuthChoiceLayout.setVisibility(View.VISIBLE);
                }
                if (manualRealAuthLayout != null) {
                    manualRealAuthLayout.setVisibility(View.GONE);
                }
                manualAuthBack.setVisibility(View.GONE);
            });
        }
        if (manualAuthButton != null) {
            manualAuthButton.setPaintFlags(manualAuthButton.getPaintFlags() | Paint.UNDERLINE_TEXT_FLAG);
            manualAuthButton.setOnClickListener(v -> {
                userActionTrack("manual");
                if (realAuthChoiceLayout != null) {
                    realAuthChoiceLayout.setVisibility(View.GONE);
                }
                if (manualRealAuthLayout != null) {
                    manualRealAuthLayout.setVisibility(View.VISIBLE);
                }
                if (manualAuthBack != null) {
                    manualAuthBack.setVisibility(View.VISIBLE);
                }
            });
        }
        if (alipayAuthButton != null) {
            alipayAuthButton.setOnClickListener(new OnMultiClickListener() {
                @Override
                public void onMultiClick(View v) {
                    userActionTrack("iifaa");
                    LoadingDialog loadingDialog = LoadingDialog.create(dialog.getContext());
                    loadingDialog.closeDelay(10000);
                    RXSdkApi.getInstance().getIIFAARedirectURL(getDefaultIIFAAAppName(), null, new RXJSONCallback() {
                        @Override
                        public void onSuccess(@Nullable JSONObject data) {
                            loadingDialog.dismiss();
                            String redirectUrl = getIIFAARedirectUrl(data);
                            RXLogger.i("IIFAA redirectUrl=" + redirectUrl);
                            if (TextUtils.isEmpty(redirectUrl) || !AppUtils.startApp(getContext(), redirectUrl)) {
                                clearIifaaValidateCallback();
                                UIToast.showToast(getContext(), getContext().getString(R.string.rx_txt_realname_failed));
                                return;
                            }
                            registerIifaaValidateCallback(dialog);
                        }

                        @Override
                        public void onFailed(@NonNull JSONObject cause) {
                            loadingDialog.dismiss();
                            clearIifaaValidateCallback();
                            UIToast.showToast(getContext(), getRealAuthErrorMessage(cause));
                        }

                        @Override
                        public void onError(RXException e) {
                            loadingDialog.dismiss();
                            clearIifaaValidateCallback();
                            String message = e.getMessage();
                            UIToast.showToast(getContext(), TextUtils.isEmpty(message)
                                    ? getContext().getString(R.string.rx_txt_realname_failed)
                                    : message);
                        }
                    });
                }
            });
        }

        if (realname != null) {
            if (canUseFastAuth && loginData != null && !TextUtils.isEmpty(loginData.getExtRealName())) {
                realname.setText(loginData.getExtRealName());
                realname.setSelection(loginData.getExtRealName().length());
            }
            realname.setOnDeleteCallback(() -> {
                // 删除一个字符就清空
                if (canUseFastAuth && realNameIsDefault) {
                    realNameIsDefault = false;
                    realname.setText("");
                }
            });
//            realname.setOnTouchListener((v, event) -> {
//                if (event.getAction() == MotionEvent.ACTION_DOWN) {
//                    IdCardNumberKeyboardManager.getInstance().hideIdCardKeyboard();
//                }
//                return false;
//            });

            realname.addTextChangedListener(new TextWatcher() {
                @Override
                public void beforeTextChanged(CharSequence s, int start, int count, int after) {

                }

                @Override
                public void onTextChanged(CharSequence s, int start, int before, int count) {
                    if (!realNameChanged) {
                        realNameChanged = true;
                    }
                }

                @Override
                public void afterTextChanged(Editable s) {

                }
            });

            realname.setOnFocusChangeListener((v, hasFocus) -> {
                if (hasFocus) {
                    userActionTrack("name_tf");
                }
            });
        }

        if (idcard != null) {
            if (canUseFastAuth && loginData != null && !TextUtils.isEmpty(loginData.getExtIdcard())) {
                idcard.setText(loginData.getExtIdcard());
                idcard.setSelection(loginData.getExtIdcard().length());
            }

            idcard.setShowSoftInputOnFocus(!useCustomIdCardKeyboard);
            idcard.setEditMode(!useCustomIdCardKeyboard);
            if (!useCustomIdCardKeyboard) {
                idcard.setOnDeleteCallback(() -> {
                    // 删除一个字符就清空
                    if (canUseFastAuth && realCardNumberIsDefault) {
                        realCardNumberIsDefault = false;
                        idcard.setText("");
                    }
                });
            }
            idcard.setOnFocusChangeListener((v, hasFocus) -> {
                if (hasFocus) {
                    if (useCustomIdCardKeyboard) {
                        v.post(() -> {
                            // FIX: 这里是为了修复小米手机，当真是姓名唤起了键盘，然后直接切换到下一个，就会导致莫名唤起系统键盘的问题。
                            InputMethodManager imm = (InputMethodManager) v.getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
                            imm.hideSoftInputFromWindow(v.getWindowToken(), 0);
                            showIdCardKeyboard(idcard);
                        });
                    }
                    userActionTrack("idcard_tf");
                }
            });

            idcard.addTextChangedListener(new TextWatcher() {
                @Override
                public void beforeTextChanged(CharSequence s, int start, int count, int after) {

                }

                @Override
                public void onTextChanged(CharSequence s, int start, int before, int count) {
                    if (!realCardNumberChanged)
                        realCardNumberChanged = true;
                }

                @Override
                public void afterTextChanged(Editable s) {

                }
            });

            if (useCustomIdCardKeyboard) {
                idcard.setOnClickListener(v -> {
                    showIdCardKeyboard(idcard);
                });
            }
        }

        if (!TextUtils.isEmpty(idCardDigitsStr)) {
            if (idcard != null)
                idcard.setKeyListener(DigitsKeyListener.getInstance(idCardDigitsStr));
        }

        sure.setOnClickListener(new OnMultiClickListener() {
            @Override
            public void onMultiClick(View v) {
                userActionTrack("confirm");
                clearIifaaValidateCallback();
                LoadingDialog loadingDialog = LoadingDialog.create(dialog.getContext());
                loadingDialog.closeDelay(10000);

                boolean isFastRealAuth = canUseFastAuth && !realNameChanged && realNameIsDefault && !realCardNumberChanged && realCardNumberIsDefault;
//                RXLogger.d("WLTest", "isFastRealAuth:" + isFastRealAuth);
//                if (true) {
//                    return;
//                }

                RXSdkApi.getInstance().certification(realname.getText().toString().trim(), idcard.getText().toString().trim().toUpperCase(), isFastRealAuth, new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        loadingDialog.dismiss();
                        showRealAuthSuccessDialog(dialog, title.getText().toString(), data);
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        loadingDialog.dismiss();
                        int errCode = cause.optInt("code");
                        if (errCode != 312224) {
//                            if (callback != null) {
//                                callback.onFailed(cause);
//                            }
                            UIToast.showToast(getContext(), getRealAuthErrorMessage(cause));
                        } else {
                            showRealAuthSuccessDialog(dialog, title.getText().toString(), cause);
                        }
                    }
                });
            }
        });

        View rewardLayout = view.findViewById(R.id.reward_layout);
        RecyclerView rewardRecyclerList = view.findViewById(R.id.reward_recycler_list);
        rewardRecyclerList.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false));
        if (loginData != null && loginData.getReward() != null) {
            Reward reward = loginData.getReward();
            if (Reward.KIND_REAL_AUTH.equals(reward.getKind()) && reward.getList() != null && !reward.getList().isEmpty()) {
                RealNameRewardAdapter adapter = new RealNameRewardAdapter();
                rewardRecyclerList.setAdapter(adapter);
                adapter.setData(reward.getList());
                adapter.notifyDataSetChanged();
                rewardLayout.setVisibility(View.VISIBLE);
                sure.setText(R.string.txt_confirm_and_reward);
                handleSubmitButtonMargin(true, sure);
            } else {
                rewardLayout.setVisibility(View.GONE);
                sure.setText(R.string.txt_commit_confirm);
                handleSubmitButtonMargin(false, sure);
            }
        } else {
            rewardLayout.setVisibility(View.GONE);
            sure.setText(R.string.txt_commit_confirm);
            handleSubmitButtonMargin(false, sure);
        }

        userActionTrack("show");
    }

    private void showRealAuthSuccessDialog(BaseDialog dialog, String titleText, JSONObject dataCB) {
        clearIifaaValidateCallback();
        dialog.dismiss();
        SuccessTipView.create(dialog.getContext(), titleText, getContext().getString(R.string.rx_txt_realname_success), new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject d) {
                if (callback != null) {
                    callback.onSuccess(dataCB);
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
            }
        }).setIcoResId(R.drawable.rx_tips_ico_already_realname).show();
    }

    private String getRealAuthErrorMessage(@NonNull JSONObject cause) {
        String message = cause.optString("msg");
        return TextUtils.isEmpty(message) ? getContext().getString(R.string.rx_txt_realname_failed) : message;
    }

    private String getDefaultIIFAAAppName() {
        String appName = AppUtils.getAppName(getContext());
        return TextUtils.isEmpty(appName) ? getContext().getPackageName() : appName;
    }

    private String getIIFAAThirdPartSchema() {
        String scheme = RXGlobalData.getRealAuthIIFAAScheme();
        if (TextUtils.isEmpty(scheme)) {
            return "";
        }
        scheme = scheme.trim();
        // 服务端需要完整 scheme，若配置值不含 :// 则自动补全（如 "ruixue" → "ruixue://"）
        if (!scheme.contains("://")) {
            scheme = scheme + "://";
        }
        return scheme;
    }


    private String getIIFAARedirectUrl(@Nullable JSONObject data) {
        if (data == null) {
            return "";
        }
        String redirectUrl = data.optString("redirect_url");
        if (TextUtils.isEmpty(redirectUrl)) {
            redirectUrl = data.optString("redirectUrl");
        }
        if (TextUtils.isEmpty(redirectUrl)) {
            redirectUrl = data.optString("url");
        }
        return redirectUrl;
    }

    private void registerIifaaValidateCallback(BaseDialog dialog) {
        RXSdkApi.getInstance().setIifaaAutoValidateCallback(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (!isShowing()) {
                        return;
                    }
                    clearIifaaValidateCallback();
                    dialog.dismiss();
                    if (callback != null) {
                        callback.onSuccess(data);
                    }
                });
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (!isShowing()) {
                        return;
                    }
                    UIToast.showToast(getContext(), getRealAuthErrorMessage(cause));
                });
            }

            @Override
            public void onError(RXException e) {
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (!isShowing()) {
                        return;
                    }
                    String message = e == null ? "" : e.getMessage();
                    UIToast.showToast(getContext(), TextUtils.isEmpty(message)
                            ? getContext().getString(R.string.rx_txt_realname_failed)
                            : message);
                });
            }
        });
    }

    private void clearIifaaValidateCallback() {
        RXSdkApi.getInstance().clearIifaaAutoValidateCallback();
    }

    private void showIdCardKeyboard(EditText idcard) {
        if (idcard == null) {
            return;
        }

        String defaultValue = "";
        if (canUseFastAuth && realCardNumberIsDefault) {
            defaultValue = "";
        } else {
            defaultValue = idcard.getText().toString();
        }

//        if (idcardInputMode == 1) {
//            IdCardNumberKeyboardManager.getInstance().showIdCardKeyboard(idcard.getRootView(), defaultValue, new IdKeyboardCallback() {
//
//                @Override
//                public void onShow(float keyboardHeight) {
//                    if (AppUtils.isUsePortMatch(getContext())) {
//                        return;
//                    }
//                    if (mainContainer == null) return;
//                    int toBottom = getDistanceToBottom(idcard);
//                    Log.d("WLTest", "to bottom:" + toBottom);
//                    mainContainer.animate().translationY(toBottom - keyboardHeight).setDuration(300).start();
//                }
//
//                @Override
//                public void onInputContent(String content) {
//                    realCardNumberChanged = true;
//                    int start = idcard.getSelectionStart();
//                    Editable editable = idcard.getText();
//                    editable.insert(start, content);
//                }
//
//                @Override
//                public void onDelete() {
//                    if (mayUseFastAuth && realCardNumberIsDefault) {
//                        realCardNumberIsDefault = false;
//                        idcard.setText("");
//                    } else {
//                        int start = idcard.getSelectionStart();
//                        Editable editable = idcard.getText();
//                        if (start > 0) {
//                            editable.delete(start - 1, start);
//                        }
//                    }
//                }
//
//                @Override
//                public void onHide() {
////                idcard.requestFocus();
//                    animHideIdCard();
//                }
//            });
//        } else {
            IdCardNumberKeyboardManager.getInstance().showIdCardKeyboard(getContext(), defaultValue, 1, new KeyboardCallback() {
                @Override
                public void onShow(float keyboardHeight) {
                    if (AppUtils.isPortrait(getContext())) {
                        return;
                    }

                    if (mainContainer == null) return;
                    int toBottom = getDistanceToBottom(idcard);
                    mainContainer.animate().translationY(toBottom - keyboardHeight).setDuration(300).start();
                }

                @Override
                public void onFinish(String content) {
                    // 空并且是默认值的情况下，不做任何处理
                    if (canUseFastAuth && content.isEmpty() && realCardNumberIsDefault) {
                        return;
                    }
                    idcard.setText(content);
                    idcard.setSelection(content.length());
                    idcard.requestFocus();
                    realCardNumberIsDefault = false;
                }

                @Override
                public void onCancel() {

                }

                @Override
                public void onHide() {
                }

                @Override
                public void onHideAnimStart() {
                    animHideIdCard();
                }
            });
//        }
    }

    private void hideKeyboard(EditText editText) {
        if (editText == null) {
            return;
        }
        InputMethodManager imm = (InputMethodManager) editText.getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
        if (imm != null) {
            imm.hideSoftInputFromWindow(editText.getWindowToken(), 0);
        }
    }

    private int getDistanceToBottom(View view) {
        if (view == null) {
            return 0;
        }
        int[] location = new int[2];
        view.getLocationOnScreen(location); // 获取 view 在屏幕上的位置

        int viewBottomY = location[1] + view.getHeight();

        int screenHeight = Resources.getSystem().getDisplayMetrics().heightPixels;

        return screenHeight - viewBottomY;
    }

    private void animHideIdCard() {
        if (AppUtils.isPortrait(getContext())) {
            return;
        }
        if (mainContainer == null) return;
        mainContainer.animate().translationY(0).setDuration(300).start();
    }

    private void handleSubmitButtonMargin(boolean hasReward, View button) {
        if (button == null) {
            return;
        }
        ViewGroup.MarginLayoutParams layoutParams = (ViewGroup.MarginLayoutParams) button.getLayoutParams();
        layoutParams.topMargin = AppUtils.dp2px(getContext(), hasReward ? 15 : 28);
        layoutParams.bottomMargin = AppUtils.dp2px(getContext(), hasReward ? 18 : 28);
        button.setLayoutParams(layoutParams);
    }

    private void userActionTrack(String action) {
        Map<String, Object> properties = UserActionTrackManager.generatePropertiesMap("realauth", null, action);
        UserActionTrackManager.getInstance().reportUserAction(properties);
    }

}
