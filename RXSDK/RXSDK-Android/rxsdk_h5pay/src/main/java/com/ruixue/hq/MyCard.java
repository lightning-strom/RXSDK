package com.ruixue.hq;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;

import org.json.JSONObject;

public class MyCard {
    //待测试 无测试参数
    //    "ReturnMsg": "成功",
//            "AuthCode": "CFDE6C58DC9B4AFA31EA481BF4C6FDD744E08DDED6DB55A01F377CBF774550613497003557D06212DBDE814A047D47B54647258226A33B55161A5B52E8A77D54",
//            "TradeSeq": "GST2310280000467",
//            "TransactionUrl": "https://test.mycard520.com.tw/MyCardPay/?AuthCode=CFDE6C58DC9B4AFA31EA481BF4C6FDD744E08DDED6DB55A01F377CBF774550613497003557D06212DBDE814A047D47B54647258226A33B55161A5B52E8A77D54",
//            "InGameSaveType": "2",
//            "ReturnCode": "1"
    public static void doPay(Activity activity, @NonNull JSONObject jsonObject, RXJSONCallback callback) {
        try {
            JSONObject extObj = jsonObject.getJSONObject("ext");
            String url = extObj.optString("TransactionUrl");
            doPay(activity, url, callback);
        } catch (Exception e) {
            RXLogger.e("调起HQ失败:" + e.getClass());
            e.printStackTrace();
            callback.onError(new RXException(e));
        }
    }

    private static void doPay(Activity activity, String payUrl, RXJSONCallback callback) {
        HQCommon.doPay(activity, payUrl, callback);
    }
}
