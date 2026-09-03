package com.ruixue.realauth;


import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ObjectAnimator;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.text.Editable;
import android.text.TextUtils;
import android.view.MotionEvent;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.Nullable;

import com.ruixue.ui.R;
import com.ruixue.utils.AppUtils;


// Created by wangliang on 2025/5/12.
public class IdCardKeyboardActivity extends Activity {

    private EditText inputPreviewEditText;
    private ImageView ivFinish;
    private TextView btnClear;
    private int style = 0;

    private boolean isLight() {
        return style == 1;
    }


    private final Handler handler = new Handler();
    private boolean isDeleting = false;
    private final Runnable deleteRunnable = new Runnable() {
        @Override
        public void run() {
            deleteCharacter(); // 删除一个字符
            if (isDeleting) {
                handler.postDelayed(this, 100); // 每 100ms 删除一个字符
            }
        }
    };

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(AppUtils.isUsePortMatch(this) ? R.layout.activity_ruixue_id_card_keyboard_port : R.layout.activity_ruixue_id_card_keyboard);
        initView();
    }

    @SuppressLint("ClickableViewAccessibility")
    private void initView() {
        findViewById(R.id.keyboard_container).setVisibility(View.INVISIBLE);
        int[] buttonIds = {
                R.id.btn_0, R.id.btn_1, R.id.btn_2, R.id.btn_3,
                R.id.btn_4, R.id.btn_5, R.id.btn_6, R.id.btn_7,
                R.id.btn_8, R.id.btn_9, R.id.btn_x
        };

        inputPreviewEditText = findViewById(R.id.edit_input);
        ivFinish = findViewById(R.id.btnDone);
        inputPreviewEditText.setShowSoftInputOnFocus(false);

        btnClear = findViewById(R.id.btn_clear);
        btnClear.setVisibility(View.GONE);

        if (getIntent() != null) {
            String defaultValue = getIntent().getStringExtra("defaultValue");
            if (!TextUtils.isEmpty(defaultValue)) {
                inputPreviewEditText.setText(defaultValue);
                inputPreviewEditText.setSelection(inputPreviewEditText.getText().length());
            }
            style = getIntent().getIntExtra("style", 0);
        }

        onPreviewTextChanged();

        inputPreviewEditText.setTextColor(getResources().getColor(isLight() ? R.color.color_05403B : R.color.color_131313));
        inputPreviewEditText.setHintTextColor(getResources().getColor(R.color.color_ADADAD));
        btnClear.setTextColor(getResources().getColor(R.color.color_ADADAD));
        btnClear.setOnClickListener(v -> {
            inputPreviewEditText.setText("");
            inputPreviewEditText.setSelection(0);
            onPreviewTextChanged();
        });

        View inputContainer = findViewById(R.id.inputContainer);
        inputContainer.setBackgroundColor(getResources().getColor(isLight() ? R.color.color_E3F4F7 : R.color.color_F1F1F1));

        View inputActionBar = findViewById(R.id.actionBar);
        inputActionBar.setBackgroundColor(getResources().getColor(isLight() ? R.color.color_D2F0F6 : R.color.color_E4E4E4));
        inputActionBar.setVisibility(View.VISIBLE);

        if (inputPreviewEditText.getText().length() > 0) {
            inputPreviewEditText.requestFocus();
        }

        ivFinish.setOnClickListener(v -> {
            if (TextUtils.isEmpty(inputPreviewEditText.getText().toString())) {
                return;
            }
            IdCardNumberKeyboardManager.getInstance().onFinishCallback(inputPreviewEditText.getText().toString());
            animHideKeyboard();
        });
        findViewById(R.id.main_container).setOnClickListener(v -> {
            IdCardNumberKeyboardManager.getInstance().onCancelCallback();
            animHideKeyboard();
        });

        setButtonsStyle();
        ImageView btnDel = findViewById(R.id.btn_del);
        btnDel.setImageResource(isLight() ? R.drawable.ruixue_id_card_keyboard_light_delete : R.drawable.ruixue_id_card_keyboard_delete);
        btnDel.setOnClickListener(v -> deleteCharacter());
        btnDel.setOnLongClickListener(v -> {
            isDeleting = true;
            handler.post(deleteRunnable); // 开始连删
            return true;
        });

        btnDel.setOnTouchListener((View v, MotionEvent event) -> {
            if (event.getAction() == MotionEvent.ACTION_UP ||
                    event.getAction() == MotionEvent.ACTION_CANCEL) {
                isDeleting = false; // 停止删除
            }
            return false;
        });
        for (int id : buttonIds) {
            View btn = findViewById(id);
            if (btn instanceof TextView) {
                TextView tv = (TextView) btn;
                tv.setTextColor(getResources().getColor(isLight() ? R.color.color_05403B : R.color.color_131313));
            }
            btn.setOnClickListener(v -> handleKeyPress(v.getId()));
        }

        animShowKeyboard();
    }

    private void setButtonsStyle() {
        findViewById(R.id.btn_1).setBackgroundResource(isLight() ? R.drawable.bg_ruixue_idcard_keyboard_light_top_left_radius_btn_selector : R.drawable.bg_ruixue_idcard_keyboard_top_left_radius_btn_selector);
        findViewById(R.id.btn_2).setBackgroundResource(isLight() ? R.drawable.bg_ruixue_idcard_keyboard_light_btn_selector : R.drawable.bg_ruixue_idcard_keyboard_btn_selector);
        findViewById(R.id.btn_3).setBackgroundResource(isLight() ? R.drawable.bg_ruixue_idcard_keyboard_light_top_right_radius_btn_selector : R.drawable.bg_ruixue_idcard_keyboard_top_right_radius_btn_selector);
        findViewById(R.id.btn_4).setBackgroundResource(isLight() ? R.drawable.bg_ruixue_idcard_keyboard_light_btn_selector : R.drawable.bg_ruixue_idcard_keyboard_btn_selector);
        findViewById(R.id.btn_5).setBackgroundResource(isLight() ? R.drawable.bg_ruixue_idcard_keyboard_light_btn_selector : R.drawable.bg_ruixue_idcard_keyboard_btn_selector);
        findViewById(R.id.btn_6).setBackgroundResource(isLight() ? R.drawable.bg_ruixue_idcard_keyboard_light_btn_selector : R.drawable.bg_ruixue_idcard_keyboard_btn_selector);
        findViewById(R.id.btn_7).setBackgroundResource(isLight() ? R.drawable.bg_ruixue_idcard_keyboard_light_btn_selector : R.drawable.bg_ruixue_idcard_keyboard_btn_selector);
        findViewById(R.id.btn_8).setBackgroundResource(isLight() ? R.drawable.bg_ruixue_idcard_keyboard_light_btn_selector : R.drawable.bg_ruixue_idcard_keyboard_btn_selector);
        findViewById(R.id.btn_9).setBackgroundResource(isLight() ? R.drawable.bg_ruixue_idcard_keyboard_light_btn_selector : R.drawable.bg_ruixue_idcard_keyboard_btn_selector);
        findViewById(R.id.btn_x).setBackgroundResource(isLight() ? R.drawable.bg_ruixue_idcard_keyboard_light_bottom_left_radius_btn_selector : R.drawable.bg_ruixue_idcard_keyboard_bottom_left_radius_btn_selector);
        findViewById(R.id.btn_0).setBackgroundResource(isLight() ? R.drawable.bg_ruixue_idcard_keyboard_light_btn_selector : R.drawable.bg_ruixue_idcard_keyboard_btn_selector);
        findViewById(R.id.btn_del).setBackgroundResource(isLight() ? R.drawable.bg_ruixue_idcard_keyboard_light_bottom_right_radius_btn_selector : R.drawable.bg_ruixue_idcard_keyboard_bottom_right_radius_btn_selector);
    }

    private void animShowKeyboard() {
        View keyboardContainer = findViewById(R.id.keyboard_container);
        keyboardContainer.post(() -> {
            float height = keyboardContainer.getHeight();
            IdCardNumberKeyboardManager.getInstance().onShowCallback(height);
            IdCardNumberKeyboardManager.getInstance().setKeyboardHeight(height);
            keyboardContainer.setTranslationY(height); // 起始位置：底部
            keyboardContainer.setVisibility(View.VISIBLE);
            // 动画滑入到原始位置（0）
            ObjectAnimator animator = ObjectAnimator.ofFloat(keyboardContainer, "translationY", height, 0)
                    .setDuration(300); // 动画时长
            animator.start();
        });
    }

    private boolean hideKeyboardAniming = false;

    private void animHideKeyboard() {
        if (hideKeyboardAniming) {
            return;
        }
        View targetView = findViewById(R.id.keyboard_container);
        // 向下滑走并隐藏
        ObjectAnimator animator = ObjectAnimator.ofFloat(targetView, "translationY", 0, targetView.getHeight());
        animator.setDuration(300);
        animator.addListener(new AnimatorListenerAdapter() {

            @Override
            public void onAnimationStart(Animator animation) {
                hideKeyboardAniming = true;
            }

            @Override
            public void onAnimationEnd(Animator animation) {
                hideKeyboardAniming = false;
                targetView.setVisibility(View.INVISIBLE);
                finish();
            }
        });
        animator.start();
        IdCardNumberKeyboardManager.getInstance().onHideAnimStartCallback();
    }

    private void handleKeyPress(int id) {
        int start = inputPreviewEditText.getSelectionStart();
        Editable editable = inputPreviewEditText.getText();
        editable.insert(start, getValueByBtnId(id));
        if (inputPreviewEditText.getText().length() > 0) {
            if (!inputPreviewEditText.hasFocus())
                inputPreviewEditText.requestFocus();
        }
        onPreviewTextChanged();
    }

    private void deleteCharacter() {
        if (inputPreviewEditText == null) return;
        int start = inputPreviewEditText.getSelectionStart();
        Editable editable = inputPreviewEditText.getText();
        if (start > 0) {
            editable.delete(start - 1, start);
        }
        onPreviewTextChanged();
    }

    private void onPreviewTextChanged() {
        checkFinishBtnStatus();
        checkClearBtnStatus();
    }

    private void checkFinishBtnStatus() {
        if (ivFinish != null) {
            if (isLight()) {
                ivFinish.setImageResource(inputPreviewEditText.getText().length() > 0 ? R.drawable.ruixue_id_card_keyboard_light_finish_normal : R.drawable.ruixue_id_card_keyboard_light_finish_disable);
            } else {
                ivFinish.setImageResource(inputPreviewEditText.getText().length() > 0 ? R.drawable.ruixue_id_card_keyboard_finish_normal : R.drawable.ruixue_id_card_keyboard_finish_disable);
            }
        }
    }

    private void checkClearBtnStatus() {
        if (btnClear != null) {
            btnClear.setVisibility(inputPreviewEditText.getText().length() > 0 ? View.VISIBLE : View.GONE);
        }
    }

    private String getValueByBtnId(int id) {
        if (id == R.id.btn_0) {
            return "0";
        } else if (id == R.id.btn_1) {
            return "1";
        } else if (id == R.id.btn_2) {
            return "2";
        } else if (id == R.id.btn_3) {
            return "3";
        } else if (id == R.id.btn_4) {
            return "4";
        } else if (id == R.id.btn_5) {
            return "5";
        } else if (id == R.id.btn_6) {
            return "6";
        } else if (id == R.id.btn_7) {
            return "7";
        } else if (id == R.id.btn_8) {
            return "8";
        } else if (id == R.id.btn_9) {
            return "9";
        } else if (id == R.id.btn_x) {
            return "X";
        }
        return "";
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        isDeleting = false;
        handler.removeCallbacksAndMessages(null);
        IdCardNumberKeyboardManager.getInstance().onHideCallback();
        IdCardNumberKeyboardManager.getInstance().reset();
    }
}
