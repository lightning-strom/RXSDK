package com.ruixue.listener;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.callback.RXCallback;
import com.ruixue.error.RXException;

import java.util.Map;

/**
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/6/22
 */
public interface RXMapCallback extends RXCallback<Map<String, Object>> {
    @Override
    default void onError(RXException e) {
        e.printStackTrace();
    }
}
