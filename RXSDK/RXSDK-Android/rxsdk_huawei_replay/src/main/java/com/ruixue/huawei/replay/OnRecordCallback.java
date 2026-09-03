package com.ruixue.huawei.replay;

import com.huawei.game.replay.common.model.RecordResult;

// Created by wangliang on 2025/1/9
public interface OnRecordCallback {

    void onStart(RecordResult recordResult);
    void onStop(RecordResult recordResult);
}
