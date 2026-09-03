package com.ruixue.sdk.adjust.data;

import com.adjust.sdk.AdjustEventSuccess;
import com.adjust.sdk.Util;

import org.json.JSONObject;

public class RxAdjustEventSuccess {
    public String adid;
    public String message;
    public String timestamp;
    public String eventToken;
    public String callbackId;
    public JSONObject jsonResponse;

    @Override
    public String toString() {
        return Util.formatString("Event Success msg:%s time:%s adid:%s event:%s cid:%s json:%s",
                message,
                timestamp,
                adid,
                eventToken,
                callbackId,
                jsonResponse);
    }

    public static RxAdjustEventSuccess copy(AdjustEventSuccess adjustEventSuccess) {
        RxAdjustEventSuccess rxAdjustEventSuccess = new RxAdjustEventSuccess();
        rxAdjustEventSuccess.adid = adjustEventSuccess.adid;
        rxAdjustEventSuccess.message = adjustEventSuccess.message;
        rxAdjustEventSuccess.timestamp = adjustEventSuccess.timestamp;
        rxAdjustEventSuccess.eventToken = adjustEventSuccess.eventToken;
        rxAdjustEventSuccess.callbackId = adjustEventSuccess.callbackId;
        rxAdjustEventSuccess.jsonResponse = adjustEventSuccess.jsonResponse;
        return rxAdjustEventSuccess;
    }

}
