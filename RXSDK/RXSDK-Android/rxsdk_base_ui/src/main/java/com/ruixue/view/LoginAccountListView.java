package com.ruixue.view;

import android.app.Dialog;
import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.RelativeLayout;

import com.ruixue.adapter.AccountAdapter;
import com.ruixue.openapi.RXView;
import com.ruixue.passport.Account;
import com.ruixue.passport.AccountHelper;
import com.ruixue.ui.R;
import com.ruixue.utils.DisplayUtils;
import com.ruixue.widget.BaseDialog;

import java.util.List;

public class LoginAccountListView extends RXView {

    AccountClickListener loginMethodListener;
    AccountAdapter recyclerAdapter;
    int height = 0;
    int width = 0;

    private boolean goBackEnable = true;

    private boolean showOtherLoginBtn = false;
    private View.OnClickListener otherLoginClickListener;
    private View.OnClickListener clickCloseListener;

    public LoginAccountListView setGoBackEnable(boolean enable) {
        this.goBackEnable = enable;
        return this;
    }

    public LoginAccountListView setShowOtherLoginBtn(boolean show) {
        this.showOtherLoginBtn = show;
        return this;
    }

    public LoginAccountListView setOtherLoginClickListener(View.OnClickListener listener) {
        this.otherLoginClickListener = listener;
        return this;
    }


    public LoginAccountListView setOnEmptyListener(LoginQuickView.OnShowLoginViewListener onEmptyListener) {
        this.onEmptyListener = onEmptyListener;
        return this;
    }

    private LoginQuickView.OnShowLoginViewListener onEmptyListener;

    public Account getFirstAccount() {
        return recyclerAdapter == null ? null : (Account) recyclerAdapter.getItem(0);
    }


    public LoginAccountListView setCallback(AccountClickListener loginMethodListener) {
        this.loginMethodListener = loginMethodListener;
        return this;
    }

    public LoginAccountListView setClickCloseListener(View.OnClickListener clickCloseListener) {
        this.clickCloseListener = clickCloseListener;
        return this;
    }

    public LoginAccountListView(Context context) {
        super(context);
    }

    @Override
    public int getStyleId() {
        return com.ruixue.base.R.style.Dialog_None_Ani;
    }

    @Override
    public int getResId() {
        return R.layout.rx_account_list;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        ImageView back = view.findViewById(R.id.back);
        back.setOnClickListener(v -> {
            dialog.dismiss();
        });

        ImageView close = view.findViewById(R.id.close);
        close.setOnClickListener(v -> {
            dialog.dismiss();
            if (clickCloseListener != null)
                clickCloseListener.onClick(v);
        });

        if (goBackEnable) {
            back.setVisibility(View.VISIBLE);
            close.setVisibility(View.GONE);
        } else {
            back.setVisibility(View.GONE);
            close.setVisibility(isCancelable() ? View.VISIBLE : View.GONE);
        }


        ListView lv_account = view.findViewById(R.id.lv_account);
        ViewGroup.LayoutParams layoutParams = view.findViewById(R.id.cv_root).getLayoutParams();
        if (height != 0) {
            layoutParams.height = height;
        }
        if (width != 0) {
            layoutParams.width = width;
        }

        List<Account> rxAccounts = getAccountList();
//        // 用于描述item的适配器
        recyclerAdapter = new AccountAdapter(getContext(), rxAccounts);
        recyclerAdapter.setOnItemDeleteListener((rxAccount, position, size) -> {
            if (size <= 0) {
                dialog.dismiss();
                if (onEmptyListener != null) {
                    onEmptyListener.onShowLoinViewNotify(null);
                }
            } else if (loginMethodListener != null) {
                loginMethodListener.onClick(dialog, rxAccount, true);
            }
        });
        lv_account.setAdapter(recyclerAdapter);

        lv_account.setOnItemClickListener((parent, view1, position, id) -> {
            if (position >= 0 && position < rxAccounts.size()) {
                dialog.dismiss();
                Account account = rxAccounts.get(position);
                if (loginMethodListener != null) {
                    loginMethodListener.onClick(dialog, account, false);
                }
            }
        });

        View listContainer = view.findViewById(R.id.list_container);
        RelativeLayout.LayoutParams params = (RelativeLayout.LayoutParams) listContainer.getLayoutParams();
        params.bottomMargin = DisplayUtils.dip2px(showOtherLoginBtn ? 12 : 20);
        listContainer.setLayoutParams(params);

        View otherLoginBtn = view.findViewById(R.id.login_other_method);
        otherLoginBtn.setVisibility(showOtherLoginBtn ? View.VISIBLE : View.GONE);
        otherLoginBtn.setOnClickListener(otherLoginClickListener);
    }


    public interface AccountClickListener {
        void onClick(Dialog dialog, Account account, boolean isDel);
    }

    public static LoginAccountListView create(Context activity, LoginQuickView.OnShowLoginViewListener onEmptyListener) {
        return new LoginAccountListView(activity).setOnEmptyListener(onEmptyListener);
    }

    public static List<Account> getAccountList() {
        return AccountHelper.getAccounts();
    }

}
