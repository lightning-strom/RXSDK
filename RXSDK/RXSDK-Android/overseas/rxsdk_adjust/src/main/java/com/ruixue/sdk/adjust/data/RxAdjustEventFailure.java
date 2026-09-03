package com.ruixue.sdk.adjust.data;

import com.adjust.sdk.AdjustEventFailure;
import com.adjust.sdk.Util;

import org.json.JSONObject;

public class RxAdjustEventFailure {
    public boolean willRetry;
    public String adid;
    public String message;
    public String timestamp;
    public String eventToken;
    public String callbackId;
    public JSONObject jsonResponse;

    public RxAdjustEventFailure(boolean willRetry, String adid, String message, String timestamp,
                                String eventToken, String callbackId, JSONObject jsonResponse) {
        this.willRetry = willRetry;
        this.adid = adid;
        this.message = message;
        this.timestamp = timestamp;
        this.eventToken = eventToken;
        this.callbackId = callbackId;
        this.jsonResponse = jsonResponse;
    }

    @Override
    public String toString() {
        return Util.formatString("Event Failure msg:%s time:%s adid:%s event:%s cid:%s retry:%b json:%s",
                message,
                timestamp,
                adid,
                eventToken,
                callbackId,
                willRetry,
                jsonResponse);
    }

    public static RxAdjustEventFailure copy(AdjustEventFailure adjustEventFailure) {
        return new RxAdjustEventFailure(
                adjustEventFailure.willRetry,
                adjustEventFailure.adid,
                adjustEventFailure.message,
                adjustEventFailure.timestamp,
                adjustEventFailure.eventToken,
                adjustEventFailure. callbackId,
                adjustEventFailure.jsonResponse
        );
    }
}
