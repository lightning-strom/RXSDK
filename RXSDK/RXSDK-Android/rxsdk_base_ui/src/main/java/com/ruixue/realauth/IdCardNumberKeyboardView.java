package com.ruixue.realauth;


import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ObjectAnimator;
import android.animation.ValueAnimator;
import android.content.Context;
import android.util.AttributeSet;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.DecelerateInterpolator;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;

import com.ruixue.ui.R;
import com.ruixue.utils.AppUtils;

// Created by wangliang on 2025/5/21.
public class IdCardNumberKeyboardView extends LinearLayout {

    private EditText inputPreviewEditText;
    private ImageView ivFinish;
    private String defaultValue = "";

    private IdKeyboardCallback callback;

    public IdCardNumberKeyboardView(Context context) {
        super(context);
        init(context);
    }

    public IdCardNumberKeyboardView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    private void init(Context context) {
        boolean isPort = AppUtils.isUsePortMatch(context);
        LayoutInflater.from(context).inflate(isPort ? R.layout.layout_ruixue_id_card_keyboard_port : R.layout.layout_ruixue_id_card_keyboard, this, true);
        setBackgroundColor(getResources().getColor(R.color.color_DDDDDD));
        setOrientation(VERTICAL);
        int[] buttonIds = {
                R.id.btn_0, R.id.btn_1, R.id.btn_2, R.id.btn_3,
                R.id.btn_4, R.id.btn_5, R.id.btn_6, R.id.btn_7,
                R.id.btn_8, R.id.btn_9, R.id.btn_x, R.id.btn_del
        };

        inputPreviewEditText = findViewById(R.id.edit_input);
        ivFinish = findViewById(R.id.btnDone);
//        inputPreviewEditText.setShowSoftInputOnFocus(false);

//        if (!TextUtils.isEmpty(defaultValue)) {
//            inputPreviewEditText.setText(defaultValue);
//            inputPreviewEditText.setSelection(inputPreviewEditText.getText().length());
//        }

//        if (inputPreviewEditText.getText().length() > 0) {
//            inputPreviewEditText.requestFocus();
//        }

//        ivFinish.setImageResource(inputPreviewEditText.getText().length() > 0 ? R.drawable.ruixue_id_card_keyboard_finish_normal : R.drawable.ruixue_id_card_keyboard_finish_disable);

//        findViewById(R.id.btnCancel).setOnClickListener(v -> {
//            IdCardNumberKeyboardManager.getInstance().onCancelCallback();
//            if (this.callback != null) {
//                this.callback.onCancel();
//            }
//            hide();
//        });
//        ivFinish.setOnClickListener(v -> {
//            IdCardNumberKeyboardManager.getInstance().onFinishCallback(inputPreviewEditText.getText().toString());
//            if (this.callback != null) {
//                this.callback.onFinish(inputPreviewEditText.getText().toString());
//            }
//            hide();
//        });

        for (int id : buttonIds) {
            View btn = findViewById(id);
            btn.setOnClickListener(v -> handleKeyPress(v.getId()));
        }

    }

    public void setCallback(IdKeyboardCallback callback) {
        this.callback = callback;
    }

    public void setDefaultValue(String value) {
        this.defaultValue = value;

        if (inputPreviewEditText == null) {
            return;
        }

//        if (!TextUtils.isEmpty(defaultValue)) {
//            inputPreviewEditText.setText(defaultValue);
//            inputPreviewEditText.setSelection(inputPreviewEditText.getText().length());
//        }
//
//        if (inputPreviewEditText.getText().length() > 0) {
//            inputPreviewEditText.post(() -> inputPreviewEditText.requestFocus());
//        }
    }

    private void handleKeyPress(int id) {
//        int start = inputPreviewEditText.getSelectionStart();
//        Editable editable = inputPreviewEditText.getText();
        if (id == R.id.btn_del) {
            if (callback != null)
                callback.onDelete();
//            if (start > 0) {
//                editable.delete(start - 1, start);
//            }
        } else {
//            editable.insert(start, getValueByBtnId(id));
            if (callback != null)
                callback.onInputContent(getValueByBtnId(id));
        }
//        if (inputPreviewEditText.getText().length() > 0) {
//            if (!inputPreviewEditText.hasFocus()) {
//                inputPreviewEditText.requestFocus();
//            }
//        }
//        if (ivFinish != null) {
//            ivFinish.setImageResource(inputPreviewEditText.getText().length() > 0 ? R.drawable.ruixue_id_card_keyboard_finish_normal : R.drawable.ruixue_id_card_keyboard_finish_disable);
//        }
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

    private ViewGroup rootView;
    public void show(ViewGroup rootView) {
        this.rootView = rootView;
        setVisibility(View.INVISIBLE);
        addViewToRoot(rootView);
        // 动画滑入到原始位置（0）
        post(() -> {
            float height = getHeight();
            IdCardNumberKeyboardManager.getInstance().onShowCallback(height);
            IdCardNumberKeyboardManager.getInstance().setKeyboardHeight(height);
            setTranslationY(height);
            setVisibility(View.VISIBLE);

            if (callback != null) {
                callback.onShow(height);
            }

            ValueAnimator animator = ValueAnimator.ofFloat(height, 0);
            animator.setInterpolator(new DecelerateInterpolator());
            animator.addUpdateListener(animation -> {
                float value = (float) animation.getAnimatedValue();
                setTranslationY(value);
            });

            animator.setDuration(300);// 动画时间，毫秒
            animator.start();

//                ObjectAnimator animator = ObjectAnimator.ofFloat(this, "translationY", height, 0);
//                animator.addListener(new Animator.AnimatorListener() {
//                    @Override
//                    public void onAnimationStart(@NonNull Animator animation) {
//
//                        Log.d("WLTest", "animation start");
//                    }
//
//                    @Override
//                    public void onAnimationEnd(@NonNull Animator animation) {
//                        Log.d("WLTest", "animation end");
//                    }
//
//                    @Override
//                    public void onAnimationCancel(@NonNull Animator animation) {
//
//                    }
//
//                    @Override
//                    public void onAnimationRepeat(@NonNull Animator animation) {
//
//                    }
//                });
//                animator.setDuration(1000);
//                animator.start();
        });
    }

    private boolean hideKeyboardAniming = false;
    public void hide() {
        if (hideKeyboardAniming) {
            return;
        }
        ObjectAnimator animator = ObjectAnimator.ofFloat(this, "translationY", 0, getHeight());
        animator.setDuration(300);
        animator.addListener(new AnimatorListenerAdapter() {

            @Override
            public void onAnimationStart(Animator animation) {
                hideKeyboardAniming = true;
            }

            @Override
            public void onAnimationEnd(Animator animation) {
                hideKeyboardAniming = false;
                removeViewFromRoot();
                if (callback != null) {
                    callback.onHide();
                }
//                IdCardNumberKeyboardManager.getInstance().onHideCallback();
            }
            @Override
            public void onAnimationCancel(Animator animation) {
                hideKeyboardAniming = false;
                removeViewFromRoot();
                if (callback != null) {
                    callback.onHide();
                }
            }
        });
        animator.start();
    }

    private void addViewToRoot(ViewGroup rootView) {
        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        params.gravity = Gravity.BOTTOM;
        if (rootView != null)
            rootView.addView(this, params);
    }

    private void removeViewFromRoot() {
        if (rootView != null) {
            rootView.removeView(this);
        }
//        if (inputPreviewEditText != null) {
//            inputPreviewEditText.clearFocus();
//        }
        IdCardNumberKeyboardViewManager.getInstance().setShowing(false);
    }

}
