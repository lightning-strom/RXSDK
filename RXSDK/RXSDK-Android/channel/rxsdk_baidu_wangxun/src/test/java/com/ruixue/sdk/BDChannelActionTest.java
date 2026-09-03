package com.ruixue.sdk;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import com.ruixue.RuiXueSdk;

import org.junit.Test;

public class BDChannelActionTest {

    @Test
    public void routesSupportedActions() {
        assertTrue(BDSdkApiImpl.isSupportedChannelAction(
                RuiXueSdk.CHANNEL_ACTION_SHOW_SPLASH));
        assertTrue(BDSdkApiImpl.isSupportedChannelAction(
                RuiXueSdk.CHANNEL_ACTION_SHOW_FLOAT_VIEW));
        assertTrue(BDSdkApiImpl.isSupportedChannelAction(
                RuiXueSdk.CHANNEL_ACTION_HIDE_FLOAT_VIEW));
    }

    @Test
    public void rejectsUnknownAction() {
        assertFalse(BDSdkApiImpl.isSupportedChannelAction("unknownAction"));
    }
}
