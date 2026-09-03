package com.ruixue.feedbackui.util;

import android.content.Context;
import android.content.res.Configuration;

public class FeedbackUtil {
    public static boolean getOrientation(Context context) {
        return context.getResources().getConfiguration().orientation == Configuration.ORIENTATION_LANDSCAPE;
    }
}
