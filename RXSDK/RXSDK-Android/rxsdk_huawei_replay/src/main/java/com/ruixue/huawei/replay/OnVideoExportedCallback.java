package com.ruixue.huawei.replay;

import com.huawei.game.replay.common.model.RecordResult;

// Created by wangliang on 2025/1/9
public interface OnVideoExportedCallback {

    void onVideoExported(RecordResult recordResult);

    void onExportProgress(int percent);
}
