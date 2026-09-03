package com.ruixue.unity;


public interface UnityRuiXueSdkCallback {

    public void rxPublicCallback(int type, String mapJson);

    void onLogout(int code, String msg);

    public boolean onSwitchAccount(int code, String data);

}
