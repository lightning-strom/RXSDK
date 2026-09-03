package com.ruixue.utils;

import android.content.Context;

import com.ruixue.RuiXueSdk;

import java.lang.reflect.Method;

public class AnnounceViewUtil {

    public static void showAnnounceView() {
        try {
            Class<?> noticeViewClass = Class.forName("com.ruixue.view.notice.NoticeView");

            Class<?> callBackClass = Class.forName("com.ruixue.view.notice.NoticeCallback");

            Method method = noticeViewClass.getMethod(
                    "create", Context.class, int.class, callBackClass
            );

            Object object = method.invoke(null, RuiXueSdk.getCurrentActivity(), 1, null);

            Class<?> showClass = object.getClass();

            Method showMethod = showClass.getMethod("loginShow");
            showMethod.invoke(object);


        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
