package com.ruixue.view;

import android.app.Activity;
import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.ListView;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.adapter.PrivacyAdapter;
import com.ruixue.error.RXErrorCode;
import com.ruixue.listener.OnMultiClickListener;
import com.ruixue.openapi.RXView;
import com.ruixue.ui.R;
import com.ruixue.widget.BaseDialog;

import java.util.List;

public class PrivacyListView extends RXView {

    int height = 0;
    int width = 0;
    List<String> mPrivacyList;
    ListView lvPrivacy;
    PrivacyAdapter privacyAdapter;

    RXJSONCallback callback;
    /**
     * 返回按钮
     */
    protected boolean goBackEnable = false;

    public PrivacyListView setBackEnable(boolean backEnable) {
        this.goBackEnable = backEnable;
        return this;
    }

    public PrivacyListView(Context context) {
        super(context);
    }

    public PrivacyListView setPrivacyList(List<String> privacyList) {
        this.mPrivacyList = privacyList;
        return this;
    }

    public PrivacyListView setCallback(RXJSONCallback callback) {
        this.callback = callback;
        return this;
    }

//    public PrivacyListView setPrivacyList(LinkedHashMap<String, Object> privacyList) {
////        this.mPrivacyList = privacyList;
//        return this;
//    }

    @Override
    public int getStyleId() {
        return com.ruixue.base.R.style.Dialog_None_Ani;
    }

    @Override
    public int getResId() {
        return R.layout.rx_privacy_list;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        ImageView close = view.findViewById(R.id.close);
        close.setVisibility((!isCancelable() || goBackEnable) ? View.GONE : View.VISIBLE);
        close.setOnClickListener(v -> {
            dialog.dismiss();
            if (callback != null) {
                callback.onFailed(RXErrorCode.DISAGREE_PRIVACY.toJSONObject());
            }
        });
        ImageView btn_back = view.findViewById(R.id.btn_back);
        btn_back.setVisibility(goBackEnable ? View.VISIBLE : View.GONE);
        btn_back.setOnClickListener(v -> {
            dialog.dismiss();
            if (callback != null) {
                callback.onFailed(RXErrorCode.DISAGREE_PRIVACY.toJSONObject());
            }
        });
        ViewGroup.LayoutParams layoutParams = view.findViewById(R.id.cv_root).getLayoutParams();
        if (height != 0) {
            layoutParams.height = height;
        }
        if (width != 0) {
            layoutParams.width = width;
        }
        Button btnAgreeAll = view.findViewById(R.id.btn_ok_agreeall);
        Button btnStart = view.findViewById(R.id.btn_ok);
        lvPrivacy = view.findViewById(R.id.lv_privacy);
        privacyAdapter = new PrivacyAdapter(getContext(), mPrivacyList);
        privacyAdapter.setOnCheckedChangeListener((buttonView, isChecked) -> btnStart.setEnabled(isAllPrivacyChecked()));
        lvPrivacy.setAdapter(privacyAdapter);

        btnAgreeAll.setOnClickListener(mStartClickListener);
        btnStart.setOnClickListener(mStartClickListener);
    }

    OnMultiClickListener mStartClickListener = new OnMultiClickListener() {
        @Override
        public void onMultiClick(View v) {
            RuiXueSdk.setPrivacyAgree(null);
            if (callback != null) {
                callback.onSuccess(null);
            }
            dismiss();
        }
    };

    private boolean isAllPrivacyChecked() {
        boolean isChecked = true;
        for (int i = 0; i < lvPrivacy.getChildCount(); i++) {
            CheckBox checkBox = lvPrivacy.getChildAt(i).findViewById(R.id.cbx_privacy);
            if (!checkBox.isChecked()) {
                isChecked = false;
                break;
            }
        }
        return isChecked;
    }

    public static PrivacyListView create(Activity activity, List<String> privacyList) {
        return new PrivacyListView(activity).setBackEnable(true).setPrivacyList(privacyList);
    }
}
