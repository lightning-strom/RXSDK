package com.ruixue;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.callback.RXUICallback;
import com.ruixue.error.RXException;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public abstract class RXRequestCallback extends RXUICallback {

    @Override
    public void onSuccess(@Nullable JSONObject data) {
        Map<String, Object> m = new HashMap<>();
        m.put("code", 0);
        if (data != null) {
            m.put("data", data);
        }
        onResponse(new JSONObject(m));
    }

    @Override
    public void onFailed(@NonNull JSONObject cause) {
        onResponse(cause);
    }

    public abstract void onResponse(JSONObject jsonObject);

    @Override
    public void onResponse(String response, boolean restfulData) {
        onResponse(JSONUtil.toJSONObject(response));
    }

    public static RXRequestCallback EMPTY = new RXRequestCallback() {
        @Override
        public Map<String, Object> onClickHandle(Map<String, Object> params) {
            return params;
        }

        @Override
        public void onResponse(JSONObject jsonObject) {

        }

        @Override
        public void onError(RXException exception) {
            exception.printStackTrace();
            System.out.println("RX onError:" + exception.getMessage());
        }
    };
}
