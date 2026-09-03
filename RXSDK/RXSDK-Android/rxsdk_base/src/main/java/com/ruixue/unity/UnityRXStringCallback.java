package com.ruixue.unity;

public interface UnityRXStringCallback {

    public void onError(String e);

    public void onSuccess(String data);

    public void onFailed(int code, String msg, String traceId);

}
