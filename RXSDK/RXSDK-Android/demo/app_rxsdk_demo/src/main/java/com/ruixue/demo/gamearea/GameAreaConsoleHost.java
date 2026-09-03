package com.ruixue.demo.gamearea;

import androidx.annotation.NonNull;

public interface GameAreaConsoleHost {

    @NonNull
    GameAreaTestFormData getFormData();

    void renderResult(@NonNull GameAreaResultFormatter.DisplayData data);

    void clearFlowLog();

    void appendFlowLog(@NonNull String message);
}
