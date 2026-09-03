package com.ruixue.callback;

import com.ruixue.error.RXException;

public interface RXApiCallback {
    void onResponse(String response, boolean restfulData);

    /**
     * responseCode 非 200 或代码异常时调用
     *
     * @param e 异常堆栈消息，e.getJSONString() 获取异常json 格式数据
     */
    void onError(RXException e);
}
