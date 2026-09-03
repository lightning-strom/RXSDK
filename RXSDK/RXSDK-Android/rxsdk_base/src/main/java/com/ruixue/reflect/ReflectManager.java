package com.ruixue.reflect;


import android.content.Context;
import android.text.TextUtils;
import android.util.Log;

import com.ruixue.openapi.RXGlobalData;

import java.lang.reflect.Method;

public class ReflectManager {

    private static final String CLASS_NAME = "com.ruixue.contacts.ContactsHelper";

    public static void sendAddressBook(Context activity) {
        String path = RXGlobalData.getContactsPath();
        if (!TextUtils.isEmpty(path) && activity != null) {
            try {
                Class<?> aClass = Class.forName(CLASS_NAME);
                Method method = aClass.getMethod("sendAddressBook", Context.class, String.class, int.class);
                method.invoke(null, activity, path, RXGlobalData.getContactsTs());

            } catch (Exception e) {
                Log.d("rxsdk", "not api rxsdk_contacts library " + e.getMessage());
            }
        }
    }
}
