package com.ruixue.view.notice;

import androidx.annotation.Nullable;

public interface MaintainNoticeCallback {

    void onLink(String link);

    void hasAnnounceUI(boolean isHas);

    void onSuccess(@Nullable String data);

   void onFailed(int code, String msg, @Nullable String traceId);

}
