package com.ruixue.openapi;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.error.RXErrorCode;

import org.json.JSONObject;
import org.junit.Test;

import java.util.concurrent.atomic.AtomicReference;

public class ChannelActionTest {

    @Test
    public void defaultImplementationReturnsUnsupportedError() {
        AtomicReference<JSONObject> failure = new AtomicReference<>();
        RXSdkApi api = new RXSdkApiImplDefault();

        api.invokeChannelAction(null, RuiXueSdk.CHANNEL_ACTION_SHOW_SPLASH, null,
                new RXJSONCallback() {
                    @Override
                    public void onSuccess(JSONObject data) {
                    }

                    @Override
                    public void onFailed(JSONObject cause) {
                        failure.set(cause);
                    }
                });

        assertNotNull(failure.get());
        assertEquals(RXErrorCode.UNKNOWN_THIRD_ERROR, failure.get().optInt("code"));
        assertEquals(RuiXueSdk.CHANNEL_ACTION_SHOW_SPLASH,
                failure.get().optString("action"));
        assertEquals("channel action is not supported", failure.get().optString("msg"));
    }

    @Test
    public void nullCallbackIsSafe() {
        new RXSdkApiImplDefault().invokeChannelAction(
                null, "unknownAction", null, null);
    }
}
