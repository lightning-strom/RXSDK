package com.ruixue.huawei.replay;

import com.huawei.game.replay.common.model.RecordResult;

// Created by wangliang on 2025/1/3
public interface OnInitCallback {

    void onInit(int code, String msg);

    void onError(RecordResult recordResult);
}
