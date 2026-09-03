package com.ruixue.view;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXException;
import com.ruixue.listener.RXMapCallback;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.OnViewCloseListener;
import com.ruixue.openapi.PasswordStrength;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXView;
import com.ruixue.passport.PassportManager;
import com.ruixue.ui.R;
import com.ruixue.utils.LoadingDialog;
import com.ruixue.widget.BaseDialog;
import com.ruixue.widget.PwdEditText;
import com.ruixue.widget.SomeMonitorEditText;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class ChangePasswordView extends RXView {


    protected RXJSONCallback callback;

    protected RXMapCallback mapCallback;
    protected boolean isPasswordSet = true;
    protected boolean ignoreCheck = false;

    protected boolean isShowSurePwd = true;
    private String pwdHits;
    /**
     * 返回按钮
     */
    protected boolean goBackEnable = false;


    public ChangePasswordView setBackEnable(boolean backEnable) {
        this.goBackEnable = backEnable;
        return this;
    }

    public ChangePasswordView setOnViewCloseListener(OnViewCloseListener onViewCloseListener) {
        this.onViewCloseListener = onViewCloseListener;
        return this;
    }

    protected OnViewCloseListener onViewCloseListener = null;

    public void setPwdHits(String pwdHits) {
        this.pwdHits = pwdHits;
    }

    public void setShowSurePwd(boolean showSurePwd) {
        isShowSurePwd = showSurePwd;
    }

    public ChangePasswordView(Context context) {
        super(context);
    }

    public ChangePasswordView setCallback(RXMapCallback callback) {
        mapCallback = callback;
        return this;
    }

    public ChangePasswordView setCallback(RXJSONCallback callback) {
        this.callback = callback;
        return this;
    }

    /**
     * @param isPasswordSet 是否已设置密码
     */
    public ChangePasswordView setIsPasswordSet(boolean isPasswordSet) {
        this.isPasswordSet = isPasswordSet;
        return this;
    }


    /**
     * @param ignoreCheck 是否忽略检查密码
     */
    public ChangePasswordView ignoreCheckPassword(boolean ignoreCheck) {
        this.ignoreCheck = ignoreCheck;
        return this;
    }

    public static ChangePasswordView create(Context activity) {
        return new ChangePasswordView(activity);
    }


    /**
     * 修改密码UI
     * @param activity activity
     * @param callback callback
     */
    public static ChangePasswordView create(Context activity, RXJSONCallback callback) {
        return new ChangePasswordView(activity).setCallback(callback);
    }

    @Override
    public int getResId() {
        return R.layout.rx_changepwd;
    }

    DialogInterface.OnDismissListener listener;

    public ChangePasswordView setOnDismissListener(DialogInterface.OnDismissListener listener) {
        this.listener = listener;
        return this;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        if (listener != null) {
            dialog.setOnDismissListener(listener);
        }
        ImageView close = view.findViewById(R.id.close);
        close.setVisibility((!isCancelable()) ? View.GONE : View.VISIBLE);
        close.setOnClickListener(v -> {
            dialog.cancel();
        });
        dialog.setOnCancelListener(dialog1 -> {
            if (onViewCloseListener != null) {
                onViewCloseListener.onClosed(ChangePasswordView.this);
            }
        });
        ImageView btn_back = view.findViewById(R.id.btn_back);
        btn_back.setVisibility(goBackEnable ? View.VISIBLE : View.GONE);
        btn_back.setOnClickListener(v -> {
            dialog.dismiss();
        });
        TextView title = view.findViewById(R.id.title);
        title.setText(isPasswordSet ? R.string.txt_modify_pwd : R.string.txt_set_pwd);
        PwdEditText oldpwd = view.findViewById(R.id.oldpwd);
        oldpwd.setVisibility(isPasswordSet ? View.VISIBLE : View.GONE);
        PwdEditText newpwd = view.findViewById(R.id.et_newpwd);
        PwdEditText nextnewpwd = view.findViewById(R.id.nextnewpwd);

        Button updatebtn = view.findViewById(R.id.updatebtn);

        nextnewpwd.setVisibility(isShowSurePwd ? View.VISIBLE : View.GONE);

        if (!isPasswordSet && !isShowSurePwd) {
            view.findViewById(R.id.tv_setpwd_tips).setVisibility(View.VISIBLE);
            newpwd.setHint(getContext().getString(R.string.txt_enter_pwd));
        }
        if (!TextUtils.isEmpty(pwdHits)) {
            newpwd.setHint(pwdHits);
        } else if (RXGlobalData.getPasswordStrength() == PasswordStrength.Average) {
            newpwd.setHint(R.string.rx_tips_password_rule2);
        }
        if (isShowSurePwd) {
            SomeMonitorEditText.create(updatebtn, nextnewpwd.getEditText(), newpwd.getEditText());
        } else {
            SomeMonitorEditText.create(updatebtn, newpwd.getEditText());
        }

        updatebtn.setOnClickListener(v -> {

            if (!ignoreCheck && !PassportManager.getInstance().isPassword(newpwd.getText().toString().trim())) {
                ToastUtils.showToast(getContext(), RXGlobalData.getPasswordStrength() == PasswordStrength.Strong ? R.string.rx_tips_password_rule3 : R.string.rx_tips_password_rule2);
                if (mapCallback != null) {
                    Map<String, Object> hashMap = new HashMap<>();
                    hashMap.put("msg", "Please enter a 6-32 digit password");
                    mapCallback.onFailed(hashMap);
                }
                return;
            } else if (isShowSurePwd && !nextnewpwd.getText().toString().trim().equals(newpwd.getText().toString().trim())) {
                ToastUtils.showToast(getContext(), R.string.rx_titps_pwd_diff);
                if (mapCallback != null) {
                    Map<String, Object> hashMap = new HashMap<>();
                    hashMap.put("msg", "The two passwords do not match, please recheck");
                    mapCallback.onFailed(hashMap);
                }
                return;
            }

            Map<String, Object> hashMap = new HashMap<>();
            hashMap.put("old_password", oldpwd.getText().toString());
            hashMap.put("new_password", newpwd.getText().toString());
            if (ignoreCheck) {
                hashMap.put("ignore_check_password", true);
            }

            if (mapCallback != null) {
                mapCallback.onSuccess(hashMap);
            } else {
                Dialog xdialog = LoadingDialog.createLoadingDialog(getContext(), "");
                RXSdkApi.getInstance().changePassword(hashMap, new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        LoadingDialog.closeDialog(xdialog);
                        dialog.dismiss();
                        ToastUtils.showToast(getContext(), R.string.rx_tips_modify_success);
                        if (null != callback) {
                            callback.onSuccess(data);
                        }
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        if (null != callback) {
                            callback.onFailed(cause);
                        }
                        LoadingDialog.closeDialog(xdialog);
                        com.ruixue.utils.UIToast.showToast(getContext(), cause);
                    }

                    @Override
                    public void onError(RXException e) {
                        if (null != callback) {
                            callback.onError(e);
                        }
                        LoadingDialog.closeDialog(xdialog);
                        com.ruixue.utils.UIToast.showNetErrorToast(getContext(), e.getCode());
                    }
                });
            }
        });
    }
}
