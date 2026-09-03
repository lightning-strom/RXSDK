package com.ruixue;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.callback.RXApiCallback;
import com.ruixue.callback.RXCallback;
import com.ruixue.error.RXException;

import org.json.JSONObject;

import java.util.Map;

public abstract class RXJSONCallback implements RXApiCallback, RXCallback<JSONObject> {

    @Override
    public void onResponse(String response, boolean restfulData) {
    }

    @Override
    public void onError(RXException e) {
        onFailed(e.toJSONObject());
    }

    @Deprecated
    public Map<String, Object> onClickHandle(Map<String, Object> params) {
        return params;
    }

    public static RXJSONCallback EMPTY = new RXJSONCallback() {

        @Override
        public void onSuccess(@Nullable JSONObject data) {
        }

        @Override
        public void onFailed(@NonNull JSONObject cause) {
            System.out.println("RX onFailed:" + cause.toString());
        }

        @Override
        public void onError(RXException exception) {
            exception.printStackTrace();
            System.out.println("RX onError:" + exception.getMessage());
        }
    };
}
