package com.ruixue.openapi;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2025/3/10
 */
public interface ISdkEvent {
    public static class Event {
        public static final String ACTIVATED = "activated";

        public static final String REGISTER = "register";

        public static final String LOGIN = "login";

        public static final String PAY = "pay";

        public static final String CREATE_GAME_ROLE = "create_game_role";
    }

    String getADChannel();

    void onEvent(String eventName, Map<String, Object> params);
}

