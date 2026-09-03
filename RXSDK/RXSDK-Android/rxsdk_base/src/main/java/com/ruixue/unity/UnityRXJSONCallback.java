package com.ruixue.unity;

import com.ruixue.error.RXException;

import org.json.JSONObject;

public interface UnityRXJSONCallback {

    public void onSuccess(String data);

    public void onError(String e);

    public void onFailed(String cause);

}
