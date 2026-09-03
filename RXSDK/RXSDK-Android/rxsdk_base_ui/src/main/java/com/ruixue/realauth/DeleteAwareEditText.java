package com.ruixue.realauth;


import android.annotation.SuppressLint;
import android.content.Context;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.AttributeSet;
import android.widget.EditText;

// 该类有一定缺陷，由于兼容性问题，只能用 TextWatcher，为了更精确只能判断变化后的值是原值减去一个字符，所以当空的时候就不会响应 callback
// Created by wangliang on 2025/5/17.
@SuppressLint("AppCompatCustomView")
public class DeleteAwareEditText extends EditText {

    private OnDeleteCallback callback;

    public DeleteAwareEditText(Context context) {
        super(context);
        init();
    }

    public DeleteAwareEditText(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public DeleteAwareEditText(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {
        addTextChangedListener(new TextWatcher() {
            private String previousText = "";

            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                if(s == null) {
                    return;
                }
                previousText = s.toString();
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                try {
                    if (!TextUtils.isEmpty(previousText)) {
                        String substring = previousText.substring(0, previousText.length() - 1);
                        if (substring.equals(s.toString())) {
                            if (callback != null)
                                callback.onDelete();
                        }
                    }
                } catch (Exception igonre) {
                }
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });
    }

    public void setOnDeleteCallback(OnDeleteCallback callback) {
        this.callback = callback;
    }

    public interface OnDeleteCallback {
        void onDelete();
    }
}
