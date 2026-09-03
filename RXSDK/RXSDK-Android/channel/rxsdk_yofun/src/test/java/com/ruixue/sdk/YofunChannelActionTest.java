package com.ruixue.sdk;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import com.ruixue.RuiXueSdk;

import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

public class YofunChannelActionTest {

    @Test
    public void defaultsSplashTypeToZero() {
        assertEquals(0, YofunSdkApiImpl.parseSplashType(null));
        assertEquals(0, YofunSdkApiImpl.parseSplashType(new HashMap<>()));
    }

    @Test
    public void acceptsSplashTypesZeroOneAndTwo() {
        assertEquals(0, parse(0));
        assertEquals(1, parse(1));
        assertEquals(2, parse(2));
        assertEquals(2, parse("2"));
    }

    @Test
    public void rejectsInvalidSplashTypes() {
        assertEquals(-1, parse(-1));
        assertEquals(-1, parse(3));
        assertEquals(-1, parse(1.5));
        assertEquals(-1, parse("invalid"));
        assertEquals(-1, parse(null));
    }

    @Test
    public void rejectsUnknownAction() {
        assertTrue(YofunSdkApiImpl.isSupportedChannelAction(
                RuiXueSdk.CHANNEL_ACTION_SHOW_SPLASH));
        assertFalse(YofunSdkApiImpl.isSupportedChannelAction(
                RuiXueSdk.CHANNEL_ACTION_SHOW_FLOAT_VIEW));
        assertFalse(YofunSdkApiImpl.isSupportedChannelAction("unknownAction"));
    }

    private static int parse(Object value) {
        Map<String, Object> params = new HashMap<>();
        params.put(RuiXueSdk.CHANNEL_ACTION_PARAM_SPLASH_TYPE, value);
        return YofunSdkApiImpl.parseSplashType(params);
    }
}
