package com.ruixue.unity;

import java.util.Map;

public interface UnityRXRequestCallback {

    public Map<String, Object> onClickHandle(Map<String, Object> params);

    public void onResponse(String jsonObject);

    public void onError(String e);

}
