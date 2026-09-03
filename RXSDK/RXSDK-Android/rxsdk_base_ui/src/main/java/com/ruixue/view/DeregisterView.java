package com.ruixue.view;

import android.content.Context;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.error.RXException;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXView;
import com.ruixue.ui.R;
import com.ruixue.widget.BaseDialog;
import com.ruixue.widget.SomeMonitorEditText;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

//注销账号
public class DeregisterView extends RXView {

    protected RXJSONCallback callback;
    private Map<String, Object> mapParams;

    public DeregisterView setCallback(RXJSONCallback callback) {
        this.callback = callback;
        return this;
    }

    public static DeregisterView create(Context context, Map<String, Object> mapParams) {
        return new DeregisterView(context, mapParams);

    }

    public DeregisterView(Context context, Map<String, Object> map) {
        super(context);
        mapParams = map == null ? new HashMap<>() : map;
    }

    @Override
    public int getResId() {
        return R.layout.rx_deregister;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        ImageView close = view.findViewById(R.id.close);
        close.setVisibility(isCancelable() ? View.VISIBLE : View.GONE);
        close.setEnabled(isCancelable());
        close.setOnClickListener(v -> {
            dialog.dismiss();
        });

        EditText realname = view.findViewById(R.id.realname);
        EditText idcard = view.findViewById(R.id.idcard);
        Button sure = view.findViewById(R.id.sure);
        SomeMonitorEditText.create(sure, realname, idcard);
        sure.setOnClickListener(v -> {
            if (mapParams != null) {
                mapParams.put("idcard", idcard.getText().toString().trim().toUpperCase());
                mapParams.put("realname", realname.getText().toString().trim());
            }
            RXSdkApi.getInstance().deregister(mapParams, new RXJSONCallback() {
                @Override
                public void onError(RXException e) {
                    if (callback != null) {
                        callback.onError(e);
                    }
                }

                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    idcard.clearFocus();
                    dialog.dismiss();
                    SuccessTipView.create(getContext(), R.string.txt_deregister, R.string.txt_deregister_requested, null).setIcoResId(R.drawable.rx_tips_ico_success).setButtonText(R.string.txt_ok).show();
                    if (callback != null) {
                        callback.onSuccess(data);
                    }
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    int code = cause.optInt("code");
                    if (code == 312217) {
                        dialog.dismiss();
                        SuccessTipView.create(getContext(), getContext().getString(R.string.txt_deregister), cause.optString("msg"), null).setIcoResId(R.drawable.rx_tips_ico_success).setButtonText(R.string.txt_ok).show();
                    }
                    if (callback != null) {
                        callback.onFailed(cause);
                    }
                }
            });
        });
    }
}
