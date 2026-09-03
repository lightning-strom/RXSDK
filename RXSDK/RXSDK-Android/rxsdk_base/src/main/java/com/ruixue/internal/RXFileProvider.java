package com.ruixue.internal;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.content.FileProvider;

import com.ruixue.RuiXueSdk;

import java.io.File;
import java.util.ArrayList;
import java.util.Objects;

public class RXFileProvider extends FileProvider {

//    /**
//     * 给文件赋予别的应用临时访问权限
//     * @param context     上下文
//     * @param file        文件
//     * @param packageName 别的应用包名
//     * @return Uri
//     */
//    public static Uri grantUri(Context context, @NonNull File file, String packageName) {
//        //Android 7.0
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
//            Uri uri = getUriForFile(context, file);
//
//            if (packageName != null) {
//                context.grantUriPermission(packageName, uri, Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
//            }
//            return uri;  //即是以"content://"开头的用于共享的路径
//        }
//        return Uri.fromFile(file);
//    }

    public static Uri grantUri(Context context, @NonNull File file, String... packageNames) {
        //Android 7.0
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            Uri uri = getUriForFile(context, file);
            if (packageNames != null) {
                for (String packageName : packageNames) {
                    context.grantUriPermission(packageName, uri, Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
                }
            }
            return uri;  //即是以"content://"开头的用于共享的路径
        }
        return Uri.fromFile(file);
    }

    public static String getAuthority(Context context) {
        return context.getPackageName() + ".rxfileprovider";
    }

    public static Uri getUriForFile(Context context, @NonNull File file) {
        return FileProvider.getUriForFile(context, getAuthority(context), file);
    }


    @Override
    public boolean onCreate() {
        try {
            Boot.initialize(Objects.requireNonNull(this.getContext()));
        } catch (Exception e) {
            Log.w(RuiXueSdk.TAG, "Failed to auto initialize the RuiXue SDK " + e.getMessage());
        }
        return super.onCreate();
    }
}
