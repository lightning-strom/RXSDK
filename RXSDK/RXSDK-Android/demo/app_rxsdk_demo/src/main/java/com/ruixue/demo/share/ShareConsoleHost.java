package com.ruixue.demo.share;

import androidx.annotation.NonNull;

public interface ShareConsoleHost {

    @NonNull
    ShareTestFormData getFormData();

    void renderResult(@NonNull ShareResultFormatter.DisplayData data);

    void clearFlowLog();

    void appendFlowLog(@NonNull String message);

    void applyFormData(@NonNull ShareTestFormData formData, @NonNull String summary);
}
