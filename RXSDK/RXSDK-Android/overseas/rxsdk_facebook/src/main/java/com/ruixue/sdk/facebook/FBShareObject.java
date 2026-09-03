package com.ruixue.sdk.facebook;

import android.graphics.Bitmap;

import androidx.annotation.Keep;

import com.ruixue.share.ShareObject;
import com.ruixue.utils.EntityUtils;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/11/18
 */
public class FBShareObject extends ShareObject {


    @Keep
    protected Bitmap bitmap;

    public void setBitmap(Bitmap bitmap) {
        this.bitmap = bitmap;
    }

    public Bitmap getBitmap() {
        return bitmap;
    }

    public Map<String, Object> toMap() {
        return EntityUtils.entityToMap(this);
    }

    public static FBShareObject fromMap(Map<String, Object> mapObj) {
        return EntityUtils.mapToEntity(mapObj, FBShareObject.class);
    }

}
