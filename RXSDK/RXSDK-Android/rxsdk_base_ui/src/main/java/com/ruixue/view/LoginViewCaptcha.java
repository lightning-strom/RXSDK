package com.ruixue.view;

import android.annotation.SuppressLint;
import android.content.Context;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;

import com.ruixue.adapter.GroupAdapter;
import com.ruixue.adapter.RegionData;
import com.ruixue.base.CaptchaPurpose;
import com.ruixue.listener.OnMultiClickListener;
import com.ruixue.openapi.Constants;
import com.ruixue.passport.LoginMethod;
import com.ruixue.ui.R;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.DisplayUtils;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.utils.StringUtils;
import com.ruixue.widget.BaseDialog;
import com.ruixue.widget.SomeMonitorEditText;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class LoginViewCaptcha extends LogoBaseView {

    public static LoginViewCaptcha create(Context context) {
        return new LoginViewCaptcha(context);
    }


    public LoginViewCaptcha(Context context) {
        super(context);
    }

    private @Constants.RegisterType int loginType = Constants.REGISTER_TYPE_PHONE;

    private String usernameHintText;

    private String usernameText;

    EditText username;

    EditText et_captcha;
    TextView tv_region_code;
    Button login;


    protected LoginClickListener loginClickListener;

    public LoginViewCaptcha setLoginClickListener(LoginClickListener loginClickListener) {
        this.loginClickListener = loginClickListener;
        return this;
    }

    public void setLoginType(int login_type) {
        if (login_type != 0) {
            this.loginType = login_type;
        }
    }

    @Override
    public int getResId() {
        return R.layout.rx_login_2_captcha;
    }

    /**
     * @param usernameHintText 用户名提示文本
     */
    public LoginViewCaptcha setUsernameHintText(String usernameHintText) {
        this.usernameHintText = usernameHintText;
        return this;
    }

    public LoginViewCaptcha setUsername(String username) {
        this.usernameText = username;
        return this;
    }

    public LoginViewCaptcha setBackEnable(boolean backEnable) {
        this.goBackEnable = backEnable;
        return this;
    }


    @SuppressLint("SetTextI18n")
    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        super.onCreateView(dialog, view);
        username = view.findViewById(R.id.username);
        et_captcha = view.findViewById(R.id.et_captcha);

        tv_region_code = view.findViewById(R.id.tv_region_code);
        TextView tv_get_captcha = view.findViewById(R.id.tv_get_captcha);
        tv_region_code.setTextDirection(DisplayUtils.isRtl(getContext()) ? View.TEXT_DIRECTION_RTL : View.TEXT_DIRECTION_LTR);
        if (!TextUtils.isEmpty(usernameHintText)) {
            username.setHint(usernameHintText);
        }

        login = view.findViewById(R.id.login_default);
        if (AppUtils.isUsePortMatch(getContext())) {
            LinearLayout ly_content = view.findViewById(R.id.ly_content);
            LinearLayout.LayoutParams layoutParams = (LinearLayout.LayoutParams) ly_content.getLayoutParams();
            layoutParams.leftMargin = getContext().getResources().getDimensionPixelSize(com.ruixue.base.R.dimen.dp_19);
            layoutParams.rightMargin = layoutParams.leftMargin;
        }

        SomeMonitorEditText.create(login, username, et_captcha);
        String json = com.ruixue.utils.AssetsUtil.getString(getContext(), "region.dat");
        List<RegionData> dataList = RegionData.fromJson(json);
        if (dataList != null) {
            int defaultTel = RegionData.getDefaultTel(dataList);
            tv_region_code.setText(StringUtils.enforceLTR("+" + defaultTel));

            tv_region_code.setTag(defaultTel);
        }
        if (!TextUtils.isEmpty(usernameText)) {
            if (usernameText.startsWith("+") && usernameText.length() > 5) {
                String reginCode = usernameText.substring(1, 5);
                tv_region_code.setText(StringUtils.enforceLTR("+" + Integer.valueOf(reginCode)));
                tv_region_code.setTag(reginCode);
                String userName = usernameText.substring(5);
                username.setText(userName);
            } else {
                username.setText(usernameText);
            }
        }

        LinearLayout ll_region_code = view.findViewById(R.id.ll_region_code);
        resetUserNamePadding();


        ll_region_code.setOnClickListener(new OnMultiClickListener() {
            @Override
            public void onMultiClick(View v) {
                RegionListView.create(getContext(), dataList).setOnItemClickListener(new GroupAdapter.OnItemClickListener<RegionData>() {
                    @Override
                    public void onItemClick(View itemView, RegionData data) {
                        tv_region_code.setText(data.getTel());
                        tv_region_code.setTag(data.getTelNum());
                        resetUserNamePadding();
//                        username.setPadding(getContext().getResources().getDimensionPixelSize(R.dimen.dp_33) + tv_region_code.getText().length() * getContext().getResources().getDimensionPixelSize(R.dimen.dp_8), 0, 10, 0);
                    }
                }).show();
            }
        });
        login.setOnClickListener(new OnMultiClickListener() {
            @Override
            public void onMultiClick(View v) {
                Map<String, Object> map = new HashMap<>();
                map.put("username", getUsername());
                Map<String, Object> ext = new HashMap<>();
                ext.put("captcha_code", et_captcha.getText().toString().trim());
                map.put("ext", ext);
                if (loginClickListener != null) {
                    loginClickListener.onLoginClick(LoginViewCaptcha.this, LoginMethod.CAPTCHACODE, 0, map);
                }
            }
        });

        tv_get_captcha.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                boolean isEmail = loginType == Constants.REGISTER_TYPE_EMAIL;
                if (TextUtils.isEmpty(username.getText().toString().trim())) {
                    com.ruixue.utils.UIToast.showToast(getContext(), isEmail ? R.string.txt_enter_email : R.string.txt_enter_phone);
                    return;
                }
                String accountStr = getUsername();
                CaptchaHelper.requestCaptcha(getContext(), tv_get_captcha, CaptchaPurpose.LOGIN, accountStr, isEmail);
            }
        });
    }

    private void resetUserNamePadding() {
        if (DisplayUtils.isRtl(getContext())) {
            username.setPadding(10, 0, getContext().getResources().getDimensionPixelSize(com.ruixue.base.R.dimen.dp_33) + tv_region_code.getText().length() * getContext().getResources().getDimensionPixelSize(com.ruixue.base.R.dimen.dp_8), 0);
        } else {
            username.setPadding(getContext().getResources().getDimensionPixelSize(com.ruixue.base.R.dimen.dp_33) + tv_region_code.getText().length() * getContext().getResources().getDimensionPixelSize(com.ruixue.base.R.dimen.dp_8), 0, 10, 0);
        }
    }

    @SuppressLint("DefaultLocale")
    @NonNull
    private String getUsername() {
        return String.format("+%04d", ObjectUtils.toInt(tv_region_code.getTag())) + username.getText().toString().trim();
//        return tv_region_code.getText() + username.getText().toString().trim();
    }
}
