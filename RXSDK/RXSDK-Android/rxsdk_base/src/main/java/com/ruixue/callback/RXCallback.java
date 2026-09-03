package com.ruixue.callback;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.error.RXException;

public interface RXCallback<T> {

    /**
     * 成功回调
     *
     * @param data 数据可能为空 需要判空处理
     */
    void onSuccess(@Nullable T data);

    /**
     * 业务级 错误回调
     *
     * @param cause 失败原因
     *              code 错误码
     *              msg 错误消息
     *              trace_id 错误追踪
     */
    void onFailed(@NonNull T cause);

    /**
     * responseCode 非 200 或代码异常时调用
     *
     * @param e 异常堆栈消息，e.getJSONString() 获取异常json 格式数据
     */
    void onError(RXException e);

    default void println(String str) {
        System.out.println("RX:" + str);
    }

}
