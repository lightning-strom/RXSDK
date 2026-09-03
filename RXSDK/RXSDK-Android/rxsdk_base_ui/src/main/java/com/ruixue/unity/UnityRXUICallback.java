package com.ruixue.unity;

import java.util.Map;

public interface UnityRXUICallback {

    public Map<String, Object> onClickHandle(Map<String, Object> map);

    public void onSuccess(String data);

    public void onFailed(String cause);

}
