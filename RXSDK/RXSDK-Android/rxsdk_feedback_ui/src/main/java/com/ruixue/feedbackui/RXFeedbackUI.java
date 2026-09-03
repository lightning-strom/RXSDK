package com.ruixue.feedbackui;

import android.app.Activity;
import android.content.Context;

import com.ruixue.feedbackui.view.RXCreateFeedBackView;
import com.ruixue.feedbackui.view.RXFeedbackListView;
import com.ruixue.unity.UnityBaseCommonFun;

public class RXFeedbackUI {

    public static void showCreateFeedbackView(Context context) {
        if (context == null) {
            return;
        }
        RXCreateFeedBackView.create(context).show();
    }

    public static void showUnityCreateFeedbackView(Activity activity) {
        if (activity == null) {
            return;
        }
        UnityBaseCommonFun.runOnUI(activity, () -> RXCreateFeedBackView.create(activity).show());
    }

    public static void showFeedbackListView(Context context) {
        if (context == null) {
            return;
        }
        RXFeedbackListView.create(context).show();
    }

    public static void showUnityFeedbackListView(Activity activity) {
        if (activity == null) {
            return;
        }
        UnityBaseCommonFun.runOnUI(activity, () -> RXFeedbackListView.create(activity).show());
    }

}
