package com.ruixue.storage;

import android.content.Context;
import android.text.TextUtils;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.utils.DateUtils;

public class StorageDateMark extends StorageString {
    static class Single {
       static StorageDateMark INSTANCE = new StorageDateMark(RXGlobalData.getContext());
    }
    public static StorageDateMark getInstance(){
        return Single.INSTANCE;
    }

    private static final String PREFERENCE_NAME = "spUtils";
    StorageDateMark(Context context) {
        super(SharedPreferencesLoader.get().loadPreferences(
                context, PREFERENCE_NAME), "date_mark");
    }

    public void markToday(){
        put(DateUtils.getDay());
    }

     public  boolean isTodayMark() {
        String dateMark =get();
        if (TextUtils.isEmpty(dateMark)) {
            return true;
        }
        String currentDate = DateUtils.getDay();
        if (dateMark.equals(currentDate)) {
             return false;
        } else {
             return true;
        }
    }
}