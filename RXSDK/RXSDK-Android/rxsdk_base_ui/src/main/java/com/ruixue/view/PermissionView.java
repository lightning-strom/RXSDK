package com.ruixue.view;

import android.app.Activity;
import android.content.Context;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.GridView;
import android.widget.ScrollView;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.adapter.PermissionAdapter;
import com.ruixue.error.RXErrorCode;
import com.ruixue.legal.LegalData;
import com.ruixue.openapi.RXView;
import com.ruixue.ui.R;
import com.ruixue.utils.DisplayUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.widget.BaseDialog;

public class PermissionView extends RXView {

    RXJSONCallback callback;
    PermissionAdapter permissionAdapter;


    public PermissionView(Context context) {
        super(context);
        setCancelable(false);
    }

    @Override
    public int getResId() {
        return R.layout.rx_permission;
    }

    public int getCount() {
        return permissionAdapter != null ? permissionAdapter.getCount() : 0;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        GridView gridView = view.findViewById(R.id.gview);
        ScrollView scrollView = view.findViewById(R.id.scroll_permission);
        //横竖屏适配
        if (!isLandscape()) {
            if (getCount() > 9) {
                scrollView.getLayoutParams().height = DisplayUtils.dip2px(160);
            }
        } else {
            if (getCount() > 6) {
                scrollView.getLayoutParams().height = DisplayUtils.dip2px(140);
            }
        }
        Button close = view.findViewById(R.id.close);
        close.setOnClickListener(v -> {
            dialog.dismiss();
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UI_CLOSE));
            }
        });

        Button sure = view.findViewById(R.id.sure);
        sure.setOnClickListener(v -> {
            dialog.dismiss();
            if (callback != null) {
                callback.onSuccess(null);
            }
        });
        if (permissionAdapter != null) {
            gridView.setAdapter(permissionAdapter);
        }
    }

    public PermissionView setCallback(RXJSONCallback callback) {
        this.callback = callback;
        return this;
    }

    public PermissionView setData(LegalData.PermissionsBean permission) {
        if (permission != null) {
            permissionAdapter = new PermissionAdapter(getContext(), permission.getList(), isLandscape());
        } else {
            Log.e(RuiXueSdk.TAG, "PermissionView setData PermissionsBean is null error");
        }
        return this;
    }

    public static PermissionView create(Activity activity, LegalData.PermissionsBean permission, RXJSONCallback channelCallback) {
        return new PermissionView(activity).setData(permission).setCallback(channelCallback);
    }


}
