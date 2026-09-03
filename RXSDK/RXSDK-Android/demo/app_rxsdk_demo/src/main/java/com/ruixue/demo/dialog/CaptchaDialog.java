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
import android.view.LayoutInflater;
import android.view.View;
import android.widget.EditText;

import com.ruixue.base.CaptchaPurpose;
import com.ruixue.qipai.R;


public class CaptchaDialog extends Dialog implements View.OnClickListener {

    private final View view;

    private static String smUserName = "18122221111";

    private OnDialogClickListener onDialogClickListener;

    private EditText ed_1;


    @SuppressLint("InflateParams")
    public CaptchaDialog(Context context, boolean isAdd) {
        super(context, android.R.style.Theme_Material_Light_Dialog_Alert);
        view = LayoutInflater.from(context).inflate(R.layout.activity_captcha, null);
        initView(context);
    }

    public CaptchaDialog(Context context) {
        super(context, android.R.style.Theme_Material_Light_Dialog_Alert);
        view = LayoutInflater.from(context).inflate(R.layout.activity_captcha, null);
        initView(context);
    }

    private void initView(final Context context) {
        view.findViewById(R.id.purpose_register).setOnClickListener(this);
        view.findViewById(R.id.purpose_bindphone).setOnClickListener(this);
        view.findViewById(R.id.purpose_unbindphone).setOnClickListener(this);
        view.findViewById(R.id.purpose_resetpwd).setOnClickListener(this);
        view.findViewById(R.id.purpose_bindemail).setOnClickListener(this);
        view.findViewById(R.id.purpose_unbindemail).setOnClickListener(this);
        view.findViewById(R.id.purpose_login).setOnClickListener(this);
        view.findViewById(R.id.purpose_setpwd).setOnClickListener(this);
        view.findViewById(R.id.close).setOnClickListener(this);
        ed_1 = view.findViewById(R.id.username);
        ed_1.setText(smUserName);

//        setCanceledOnTouchOutside(false);
        setContentView(view);
    }

    @Override
    public void onClick(View view) {
        int viewId = view.getId();
        String purpose = null;
        if (viewId == R.id.purpose_register) {
            purpose = CaptchaPurpose.REGISTER;
        } else if (viewId == R.id.purpose_bindphone) {
            purpose = CaptchaPurpose.BINDPHONE;

        } else if (viewId == R.id.purpose_unbindphone) {
            purpose = CaptchaPurpose.UNBINDPHONE;

        } else if (viewId == R.id.purpose_resetpwd) {
            purpose = CaptchaPurpose.RESETPWD;

        } else if (viewId == R.id.purpose_bindemail) {
            purpose = CaptchaPurpose.BINDEMAIL;

        } else if (viewId == R.id.purpose_unbindemail) {
            purpose = CaptchaPurpose.UNBINDEMAIL;

        } else if (viewId == R.id.purpose_login) {
            purpose = CaptchaPurpose.LOGIN;

        } else if (viewId == R.id.purpose_setpwd) {
            purpose = CaptchaPurpose.SETPWD;
        } else if (viewId == R.id.close) {
            if (this.onDialogClickListener != null) {
                this.onDialogClickListener.onCancelClick();
            }
            return;
        }
        smUserName = this.ed_1.getText().toString();
        if (this.onDialogClickListener != null) {
            this.onDialogClickListener.onConfirmClick(purpose, smUserName);
        }

    }

    public void setOnDialogClickListener(OnDialogClickListener onDialogClickListener) {
        this.onDialogClickListener = onDialogClickListener;
    }
}
