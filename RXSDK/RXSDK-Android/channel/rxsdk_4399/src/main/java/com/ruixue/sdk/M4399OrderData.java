package com.ruixue.sdk;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.ruixue.billing.OrderData;

import org.json.JSONObject;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/7/9
 */
public class M4399OrderData extends OrderData {
    public ExtBean getExt() {
        return ext;
    }

    public boolean isSupport_excess() {
        if (ext!=null) {
            return getExt().isSupport_excess();
        }else {
            return  false;
        }
    }

    @Keep
    private ExtBean ext;

    public static class ExtBean {
        int amount;

        public boolean isSupport_excess() {
            return support_excess;
        }

        boolean support_excess;

        public int getAmount() {
            return amount;
        }
    }

    public static M4399OrderData fromJson(String json) {
        return new Gson().fromJson(json, M4399OrderData.class);
    }

    public static M4399OrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }

}
