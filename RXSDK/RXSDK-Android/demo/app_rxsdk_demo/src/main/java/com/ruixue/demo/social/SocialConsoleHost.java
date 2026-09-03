package com.ruixue.demo.social;

import androidx.annotation.NonNull;

public interface SocialConsoleHost {

    @NonNull
    SocialTestFormData getFormData();

    void renderResult(@NonNull SocialResultFormatter.DisplayData data);

    void clearFlowLog();

    void appendFlowLog(@NonNull String message);
}
