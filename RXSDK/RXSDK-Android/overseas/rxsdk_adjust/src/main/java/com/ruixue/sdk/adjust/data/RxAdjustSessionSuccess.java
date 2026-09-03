package com.ruixue.sdk.adjust.data;

import com.adjust.sdk.AdjustSessionSuccess;
import com.adjust.sdk.Util;

import org.json.JSONObject;

public class RxAdjustSessionSuccess {
    public String adid;
    public String message;
    public String timestamp;
    public JSONObject jsonResponse;

    public RxAdjustSessionSuccess(String adid, String message, String timestamp, JSONObject jsonResponse) {
        this.adid = adid;
        this.message = message;
        this.timestamp = timestamp;
        this.jsonResponse = jsonResponse;
    }

    @Override
    public String toString() {
        return Util.formatString("Session Success msg:%s time:%s adid:%s json:%s",
                message,
                timestamp,
                adid,
                jsonResponse);
    }

    public static RxAdjustSessionSuccess copy(AdjustSessionSuccess adjustSessionSuccess) {
        return new RxAdjustSessionSuccess(
                adjustSessionSuccess.adid,
                adjustSessionSuccess.message,
                adjustSessionSuccess.timestamp,
                adjustSessionSuccess.jsonResponse
        );
    }
}
