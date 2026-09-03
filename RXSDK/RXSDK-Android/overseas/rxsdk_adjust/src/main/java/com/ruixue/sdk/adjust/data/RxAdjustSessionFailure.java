package com.ruixue.sdk.adjust.data;

import com.adjust.sdk.AdjustSessionFailure;
import com.adjust.sdk.Util;

import org.json.JSONObject;

public class RxAdjustSessionFailure {
    public boolean willRetry;
    public String adid;
    public String message;
    public String timestamp;
    public JSONObject jsonResponse;

    public RxAdjustSessionFailure(boolean willRetry, String adid, String message, String timestamp, JSONObject jsonResponse) {
        this.willRetry = willRetry;
        this.adid = adid;
        this.message = message;
        this.timestamp = timestamp;
        this.jsonResponse = jsonResponse;
    }

    @Override
    public String toString() {
        return Util.formatString("Session Failure msg:%s time:%s adid:%s retry:%b json:%s",
                message,
                timestamp,
                adid,
                willRetry,
                jsonResponse);
    }

    public static RxAdjustSessionFailure copy(AdjustSessionFailure adjustSessionFailure) {
        return new RxAdjustSessionFailure(
                adjustSessionFailure.willRetry,
                adjustSessionFailure.adid,
                adjustSessionFailure.message,
                adjustSessionFailure.timestamp,
                adjustSessionFailure.jsonResponse
        );
    }
}
