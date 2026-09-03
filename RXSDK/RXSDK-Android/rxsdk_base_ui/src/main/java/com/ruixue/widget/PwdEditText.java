package com.ruixue.widget;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.res.TypedArray;
import android.text.Editable;
import android.text.InputType;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RelativeLayout;

import androidx.annotation.StringRes;
import androidx.core.text.TextUtilsCompat;

import com.ruixue.listener.OnMultiClickListener;
import com.ruixue.ui.R;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.DisplayUtils;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/4/25
 */
public class PwdEditText extends RelativeLayout {

    boolean newpwd_eye_visible = false;

    boolean eyeEnable = true;
    EditText newpwd;
    ImageView iv_newpwd_eye;

    public PwdEditText(Context context) {
        super(context);
    }

    public void setEyeEnable(boolean eyeEnable) {
        this.eyeEnable = eyeEnable;
        if (!eyeEnable) {
            iv_newpwd_eye.setVisibility(GONE);
        }
    }

    public PwdEditText(Context context, AttributeSet attrs) {
        super(context, attrs);
        // 加载布局
        LayoutInflater.from(context).inflate(R.layout.rx_layout_pwd_edittext, this);
        init(context, attrs);
    }

    public final void setHint(CharSequence hint) {
        newpwd.setHint(hint);
    }

    public final void setHint(@StringRes int resid) {
        newpwd.setHint(resid);
    }

    public final void setText(CharSequence text) {
        newpwd.setText(text);
    }

    public CharSequence getText() {
        return newpwd.getText();
    }

    public EditText getEditText() {
        return newpwd;
    }

    public void setEyeMarginEnd(int marginEndPx) {
        RelativeLayout.LayoutParams layoutParams = (LayoutParams) iv_newpwd_eye.getLayoutParams();
        layoutParams.setMarginEnd(marginEndPx);
    }

    public ImageView getEyeImage() {
        return iv_newpwd_eye;
    }

    private void init(Context context, AttributeSet attrs) {
        @SuppressLint({"CustomViewStyleable", "Recycle"}) TypedArray tArray = context.obtainStyledAttributes(attrs, R.styleable.pwdEditText);//获取配置属性
        String hint = tArray.getString(R.styleable.pwdEditText_hint);
        int imeOptions = tArray.getInt(R.styleable.pwdEditText_imeOptions, 0);
        int eyeMarginEnd = tArray.getDimensionPixelSize(R.styleable.pwdEditText_eyeMarginEnd, DisplayUtils.dip2px(10));
        iv_newpwd_eye = findViewById(R.id.iv_newpwd_eye);
        newpwd = findViewById(R.id.newpwd);
        newpwd.setHint(hint);
        newpwd.setImeOptions(imeOptions);

        setEyeMarginEnd(eyeMarginEnd);
        if (DisplayUtils.isRtl(context)) {
            newpwd.setPadding(eyeMarginEnd + newpwd.getPaddingEnd(), 0, newpwd.getPaddingLeft(), 0);
        } else {
            newpwd.setPadding(newpwd.getPaddingLeft(), 0, eyeMarginEnd + newpwd.getPaddingEnd(), 0);
        }

        newpwd.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
            }

            @Override
            public void afterTextChanged(Editable s) {
                if (eyeEnable) {
                    iv_newpwd_eye.setVisibility(s.length() > 0 ? VISIBLE : INVISIBLE);
                }
            }
        });

        iv_newpwd_eye.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                newpwd_eye_visible = !newpwd_eye_visible;
                if (newpwd_eye_visible) {
                    //显示密码
                    newpwd.setInputType(InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD | InputType.TYPE_CLASS_TEXT);
                    iv_newpwd_eye.setBackgroundResource(R.drawable.rx_pwd_eye_open);
                } else {
                    newpwd.setInputType(InputType.TYPE_TEXT_VARIATION_PASSWORD | InputType.TYPE_CLASS_TEXT);
                    iv_newpwd_eye.setBackgroundResource(R.drawable.rx_pwd_eye_close);
                }
                int textLength = newpwd.getText().length();
                newpwd.setSelection(textLength, textLength);
            }
        });
    }

}
