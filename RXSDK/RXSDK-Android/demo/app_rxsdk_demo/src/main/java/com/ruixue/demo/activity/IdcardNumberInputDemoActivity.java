package com.ruixue.demo.activity;


import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.ruixue.qipai.R;
import com.ruixue.realauth.IdCardEditText;
import com.ruixue.realauth.IdCardNumberKeyboardManager;
import com.ruixue.realauth.KeyboardCallback;

// Created by wangliang on 2025/5/9.
public class IdcardNumberInputDemoActivity extends AppCompatActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_idcard_number_input);

        IdCardEditText editText = findViewById(R.id.idcardEt);
        editText.setShowSoftInputOnFocus(false);
        editText.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (hasFocus) {
                    showIdCardKeyboard(editText.getText().toString(), new KeyboardCallback() {

                        @Override
                        public void onShow(float keyboardHeight) {

                        }

                        @Override
                        public void onHide() {

                        }

                        @Override
                        public void onHideAnimStart() {

                        }

                        @Override
                        public void onFinish(String content) {

                        }

                        @Override
                        public void onCancel() {

                        }
                    });
                }
            }
        });

        editText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showIdCardKeyboard(editText.getText().toString(), new KeyboardCallback() {

                    @Override
                    public void onShow(float keyboardHeight) {

                    }

                    @Override
                    public void onHideAnimStart() {

                    }

                    @Override
                    public void onHide() {

                    }

                    @Override
                    public void onFinish(String content) {
                        editText.setText(content);
                        editText.setSelection(content.length());
                    }

                    @Override
                    public void onCancel() {

                    }
                });
            }
        });

        TextView customTv = findViewById(R.id.customTv);
        customTv.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d("WLTest", "custom click");
                IdCardNumberKeyboardManager.getInstance().showIdCardKeyboard(IdcardNumberInputDemoActivity.this, customTv.getText().toString(), 0, new KeyboardCallback() {

                    @Override
                    public void onShow(float keyboardHeight) {

                    }

                    @Override
                    public void onHideAnimStart() {

                    }

                    @Override
                    public void onHide() {

                    }

                    @Override
                    public void onFinish(String content) {
                        customTv.setText(content);
                    }

                    @Override
                    public void onCancel() {
                        Log.d("WLTest", "input cancel");
                    }
                });
            }
        });
    }

    private void showIdCardKeyboard(String defaultValue, KeyboardCallback callback) {
        IdCardNumberKeyboardManager.getInstance().showIdCardKeyboard(IdcardNumberInputDemoActivity.this, defaultValue, 0, callback);
    }

}
