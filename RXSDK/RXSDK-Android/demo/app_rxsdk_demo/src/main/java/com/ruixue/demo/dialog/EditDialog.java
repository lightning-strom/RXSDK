/*
 *  Copyright 2020. Huawei Technologies Co., Ltd. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at

 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.ruixue.demo.dialog;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.NonNull;

import com.ruixue.qipai.R;


public class EditDialog extends Dialog implements View.OnClickListener {
    private static final float DIALOG_WIDTH_RATIO = 0.9f;
    private View view;

    private OnDialogClickListener onDialogClickListener;

    private EditText ed_1,ed_2;
    private TextView tvTitle;
    private TextView tvSubtitle;
    private TextView tvLabel1;
    private TextView tvLabel2;
    private TextView tvCancel;
    private TextView tvConfirm;


    @SuppressLint("InflateParams")
    public EditDialog(Context context, boolean isAdd) {
        super(context, R.style.custom_dialog);
        view = LayoutInflater.from(context).inflate(R.layout.dialog_add_topic, null);
        initView( context);
    }
    public EditDialog(Context context) {
        super(context, R.style.custom_dialog);
        view = LayoutInflater.from(context).inflate(R.layout.dialog_add_topic, null);
        initView(context);
    }

    private void initView( final Context context) {
        view.findViewById(R.id.tv_cancel).setOnClickListener(this);
        view.findViewById(R.id.tv_confirm).setOnClickListener(this);
        ed_1 = view.findViewById(R.id.ed_1);
        ed_2 = view.findViewById(R.id.ed_2);
        tvTitle = view.findViewById(R.id.tv_dialog_title);
        tvSubtitle = view.findViewById(R.id.tv_dialog_subtitle);
        tvLabel1 = view.findViewById(R.id.tv_label_1);
        tvLabel2 = view.findViewById(R.id.tv_label_2);
        tvCancel = view.findViewById(R.id.tv_cancel);
        tvConfirm = view.findViewById(R.id.tv_confirm);

        setDialogTitle("请输入信息");
        setDialogSubtitle("请填写以下测试参数");
        setField1("内容 1", "请输入内容 1");
        setField2("内容 2", "请输入内容 2");
        setActionText("取消", "确定");

        ed_1.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView textView, int i, KeyEvent keyEvent) {
                if (i == EditorInfo.IME_ACTION_UNSPECIFIED) {
                    //
                    InputMethodManager imm =
                        (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
                    if (imm != null) {
                        imm.hideSoftInputFromWindow(getWindow().getDecorView().getWindowToken(), 0);
                    }
                    return true;
                }
                return false;
            }
        });

        setCanceledOnTouchOutside(false);
        setContentView(view);
        applyWindowStyle(context);
    }

    private void applyWindowStyle(@NonNull Context context) {
        Window window = getWindow();
        if (window == null) {
            return;
        }
        window.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        int dialogWidth = (int) (context.getResources().getDisplayMetrics().widthPixels * DIALOG_WIDTH_RATIO);
        window.setLayout(dialogWidth, WindowManager.LayoutParams.WRAP_CONTENT);
    }

    @Override
    public void onClick(View view) {
        int viewId = view.getId();
        if (viewId == R.id.tv_cancel) {
            if (onDialogClickListener != null) {
                onDialogClickListener.onCancelClick();
            }
        } else if (viewId == R.id.tv_confirm) {
            if (onDialogClickListener != null) {
                onDialogClickListener.onConfirmClick(ed_1.getText().toString(),ed_2.getText().toString());
            }
        }
    }

    public void setOnDialogClickListener(OnDialogClickListener onDialogClickListener) {
        this.onDialogClickListener = onDialogClickListener;
    }

    public EditDialog setDialogTitle(@NonNull String title) {
        if (tvTitle != null) {
            tvTitle.setText(title);
        }
        return this;
    }

    public EditDialog setDialogSubtitle(@NonNull String subtitle) {
        if (tvSubtitle != null) {
            tvSubtitle.setText(subtitle);
        }
        return this;
    }

    public EditDialog setField1(@NonNull String label, @NonNull String hint) {
        if (tvLabel1 != null) {
            tvLabel1.setText(label);
        }
        if (ed_1 != null) {
            ed_1.setHint(hint);
        }
        return this;
    }

    public EditDialog setField2(@NonNull String label, @NonNull String hint) {
        if (tvLabel2 != null) {
            tvLabel2.setText(label);
        }
        if (ed_2 != null) {
            ed_2.setHint(hint);
        }
        return this;
    }

    public EditDialog setFieldValues(String value1, String value2) {
        if (ed_1 != null) {
            ed_1.setText(value1 == null ? "" : value1);
            ed_1.setSelection(ed_1.getText().length());
        }
        if (ed_2 != null) {
            ed_2.setText(value2 == null ? "" : value2);
            ed_2.setSelection(ed_2.getText().length());
        }
        return this;
    }

    public EditDialog setActionText(@NonNull String cancelText, @NonNull String confirmText) {
        if (tvCancel != null) {
            tvCancel.setText(cancelText);
        }
        if (tvConfirm != null) {
            tvConfirm.setText(confirmText);
        }
        return this;
    }
}
