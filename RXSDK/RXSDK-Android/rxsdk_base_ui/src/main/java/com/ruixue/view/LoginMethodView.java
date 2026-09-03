package com.ruixue.view;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.widget.AdapterView;
import android.widget.GridView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.ruixue.adapter.LoginMethodAdapter;
import com.ruixue.openapi.Constants;
import com.ruixue.ui.R;
import com.ruixue.utils.AppUtils;
import com.ruixue.widget.BaseDialog;

import java.util.ArrayList;
import java.util.List;

public class LoginMethodView extends LogoBaseView {

    private final Handler mTimerHandler = new Handler(Looper.getMainLooper());

    List<String> loginMethodList;

    public List<String> getLoginMethodList() {
        return loginMethodList == null ? new ArrayList<>() : loginMethodList;
    }

    public LoginMethodView setLoginMethodList(List<String> loginMethodList) {
        this.loginMethodList = loginMethodList;
        return this;
    }

    protected LoginClickListener loginClickListener;


    public void setLoginClickListener(LoginClickListener loginClickListener) {
        this.loginClickListener = loginClickListener;
    }


    public static LoginMethodView create(Context context) {
        return new LoginMethodView(context);
    }

    public LoginMethodView(Context context) {
        super(context);
    }

//    @Override
//    public int getStyleId() {
//        return R.style.Dialog_None_Ani;
//    }

    @Override
    public int getResId() {
        return R.layout.rx_login_method_layout;
    }

    public LoginMethodView closeDelay(long delayMillis) {
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
        super.onCreateView(dialog, view);

        GridView lv_account = view.findViewById(R.id.grid_more_method);
        TextView tv_more_login_method = view.findViewById(R.id.tv_more_login_method);
        tv_more_login_method.setOnClickListener(v -> {

            showMoreMethodView();
        });
        int size = Math.min(getLoginMethodList().size(), 4);
        // 用于描述item的适配器
        LoginMethodAdapter recyclerAdapter = new LoginMethodAdapter(getContext(), getLoginMethodList().subList(0, size));
        lv_account.setNumColumns(size);
        lv_account.setAdapter(recyclerAdapter);
        tv_more_login_method.setVisibility(getLoginMethodList().size() > 4 ? View.VISIBLE : View.GONE);

        if (getLoginMethodList().size() > 4) {
            LinearLayout.LayoutParams layoutParams = (LinearLayout.LayoutParams) view.findViewById(R.id.rl_more_method).getLayoutParams();
            layoutParams.bottomMargin = getContext().getResources().getDimensionPixelOffset(com.ruixue.base.R.dimen.dp_18);
        }

        if (size == 1) {
            RelativeLayout.LayoutParams layoutParams = (RelativeLayout.LayoutParams) lv_account.getLayoutParams();
            layoutParams.setMarginStart(AppUtils.dp2px(getContext(), 96));
            layoutParams.setMarginEnd(AppUtils.dp2px(getContext(), 96));
        }

        lv_account.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                if (loginClickListener != null) {

                    loginClickListener.onLoginClick(LoginMethodView.this, loginMethodList.get(position), 2, null);

                }
            }
        });
    }

    private void showMoreMethodView() {
        LoginMoreMethodView loginMoreMethodView = new LoginMoreMethodView(getContext());
        int fromIndex = 4;
        loginMoreMethodView.setIcoType(String.valueOf(Constants.REGISTER_TYPE_EMAIL));
        loginMoreMethodView.setLoginMethodList(fromIndex < getLoginMethodList().size() ? getLoginMethodList().subList(fromIndex, getLoginMethodList().size()) : null);
        loginMoreMethodView.setLoginClickListener((context, method, isQuickBtn, loginMap) -> {
            loginMoreMethodView.close();
            if (loginClickListener != null) {
                loginClickListener.onLoginClick(LoginMethodView.this, method, isQuickBtn, loginMap);
            }
        });
        loginMoreMethodView.show();
    }

}
