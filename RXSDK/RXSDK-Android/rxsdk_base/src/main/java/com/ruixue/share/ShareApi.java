package com.ruixue.share;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdkVersion;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/23
 */
public abstract class ShareApi {

    //to be set in subclass
    protected boolean isInited = false;

    public abstract boolean doShare(Activity activity, Map<String, Object> paramsMap, RXJSONCallback callback);

//    public  boolean doShare(Activity activity, ShareObject shareObject, RXJSONCallback callback){
//
//    }

    public abstract PlatformType getPlatformType();

    public String getSdkVersion() {
        return RuiXueSdkVersion.BUILD;
    }

    public int getRequestCode() {
        return 0;
    }

    public boolean isInstalled() {
        return true;
    }

    public boolean isSupport() {
        return true;
    }

    public void onResume(Context context) {
    }

    public void onShareActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }

//    public Uri getImageContentUri(File var1) {
//        String var2 = var1.getAbsolutePath();
//        Context var3 = getContext().getApplicationContext();
//        @SuppressLint("Recycle") Cursor var4 = var3.getContentResolver().query(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, new String[]{"_id"}, "_data=? ", new String[]{var2}, (String) null);
//        if (var4 != null && var4.moveToFirst()) {
//            @SuppressLint("Range") int var7 = var4.getInt(var4.getColumnIndex("_id"));
//            Uri var6 = Uri.parse("content://media/external/images/media");
//            return Uri.withAppendedPath(var6, "" + var7);
//        } else if (var1.exists()) {
//            ContentValues var5 = new ContentValues();
//            var5.put("_data", var2);
//            return var3.getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, var5);
//        } else {
//            return null;
//        }
//    }
}
