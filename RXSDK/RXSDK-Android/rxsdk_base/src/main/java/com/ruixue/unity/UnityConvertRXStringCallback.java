package com.ruixue.unity;

public interface UnityConvertRXStringCallback {

    public void onSuccess(String data);

    public void onFailed(int code, String msg, String traceId);

}
