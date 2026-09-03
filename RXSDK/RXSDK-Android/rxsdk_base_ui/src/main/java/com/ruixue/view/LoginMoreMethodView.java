package com.ruixue.view;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.widget.AdapterView;
import android.widget.GridView;
import android.widget.ImageView;

import androidx.cardview.widget.CardView;

import com.ruixue.adapter.MoreMethodAdapter;
import com.ruixue.openapi.RXView;
import com.ruixue.ui.R;
import com.ruixue.widget.BaseDialog;

import java.util.List;

public class LoginMoreMethodView extends RXView {

    private final Handler mTimerHandler = new Handler(Looper.getMainLooper());
    List<String> loginMethodList;

    private String icoType = "";

    public void setIcoType(String icoType) {
        this.icoType = icoType;
    }

    public void setLoginMethodList(List<String> loginMethodList) {
        this.loginMethodList = loginMethodList;
    }

    public void setLoginClickListener(LoginClickListener loginClickListener) {
        this.loginClickListener = loginClickListener;
    }

    public void setBackClickListener(View.OnClickListener backClickListener) {
        this.backClickListener = backClickListener;
    }

    protected LoginClickListener loginClickListener;
    protected View.OnClickListener backClickListener;

    public LoginMoreMethodView(Context context) {
        super(context);
    }

//    @Override
//    public int getStyleId() {
//        return R.style.Dialog_None_Ani;
//    }

    @Override
    public int getResId() {
        return R.layout.rx_login_more_method_layout;
    }

    public LoginMoreMethodView closeDelay(long delayMillis) {
        mTimerHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
                dismiss();
            }
        }, delayMillis);
        return this;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
//        dialog.setDimAmount(0f);
        ImageView close = view.findViewById(R.id.close);
        close.setOnClickListener(v -> {
            dialog.dismiss();
            if (backClickListener != null) {
                backClickListener.onClick(v);
            }
        });

        GridView lv_account = view.findViewById(R.id.grid_more_method);

        // 用于描述item的适配器
        MoreMethodAdapter recyclerAdapter = new MoreMethodAdapter(getContext(), loginMethodList);
        recyclerAdapter.setIcoType(icoType);
        if (loginMethodList != null && loginMethodList.size() <= 4) {
            lv_account.setNumColumns(loginMethodList.size());
            CardView cv_root = view.findViewById(R.id.cv_root);
            cv_root.getLayoutParams().height = getContext().getResources().getDimensionPixelOffset(com.ruixue.base.R.dimen.dp_175);
        }
        lv_account.setAdapter(recyclerAdapter);
        lv_account.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                if (loginClickListener != null) {
                    loginClickListener.onLoginClick(LoginMoreMethodView.this, loginMethodList.get(position), 2, null);
                }
            }
        });
    }

}
