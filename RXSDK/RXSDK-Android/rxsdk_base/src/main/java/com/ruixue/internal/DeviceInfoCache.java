package com.ruixue.internal;

import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.ContentValues;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;

import com.ruixue.RuiXueSdk;

import com.ruixue.core.rxid.DeviceID;
import com.ruixue.core.rxid.IGetter;
import com.ruixue.core.rxid.compat.Oaid;

import com.ruixue.openapi.RXGlobalData;
import com.ruixue.storage.StorageLoginNum;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;

class DeviceInfoCache {
    private static final String TAG = DeviceInfoCache.class.getSimpleName();
    private static DeviceInfoCache instanceField;

    public static DeviceInfoCache getInstance(Context context) {
        if (instanceField == null) {
            synchronized (DeviceInfoCache.class) {
                if (instanceField == null) {
                    instanceField = new DeviceInfoCache(context);
                }
                return instanceField;
            }
        } else {
            return instanceField;
        }
    }

    private static final String PICTURE_FILE_PATH;
    private static final String GUID_FILE_PATH;

    static {
        PICTURE_FILE_PATH = Environment.DIRECTORY_PICTURES + File.separator + "agree";
        GUID_FILE_PATH = Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + ".agree-guid";
    }

    private static final String PREFS_FILE_NAME = "rx_device_info";
    private static final String PREFS_KEY_DEVICE_ID = "rx_device_id";

    private static final String PREFS_KEY_DEVICE_ID_TMP = "rx_device_id_tmp";
    private static final String PREFS_KEY_FIRST_START_TIME = "rx_first_start_time";

    private static final String PREFS_KEY_DISTINCT_ID = "rx_distinct_id";

    private static final String PREFS_KEY_DISTINCT_ID_PER = "rx_distinct_id_per";
    private static final String PREFS_KEY_OAID = "rx_oaid";
    private static final String PREFS_KEY_GAID = "rx_gaid";


    private static final String PREFS_KEY_SAVED_EXT_STORAGE_FLAG = "rx_device_id_saved_ext_storage_flag";
    private static SharedPreferences sharedPreferences;


    private String mDeviceId;

    private String mDistinctId;
    private String mDistinctIdPer;
    private String mOAID;

    private String mGaid;


    private int mFirstStartTime;
    private boolean isSavedToExtStorage;
    private final AtomicBoolean isInited = new AtomicBoolean(false);

    private void setSavedToExtStorage(boolean savedToExtStorage) {
        if (savedToExtStorage) {
            sharedPreferences.edit().putBoolean(PREFS_KEY_SAVED_EXT_STORAGE_FLAG, true).apply();
        }
        isSavedToExtStorage = savedToExtStorage;
    }

    private DeviceInfoCache(Context context) {
        sharedPreferences = context.getSharedPreferences(PREFS_FILE_NAME, Context.MODE_PRIVATE);
        this.load(context);
    }

    public boolean isInited() {
        return isInited.get();
    }

    public void load(Context context) {
        if (isInited.compareAndSet(false, true)) {
            String deviceId = sharedPreferences.getString(PREFS_KEY_DEVICE_ID, null);
            this.mFirstStartTime = sharedPreferences.getInt(PREFS_KEY_FIRST_START_TIME, -1);
            if (deviceId == null && !RXGlobalData.readSensitiveInfoEnabled()) {
                deviceId = sharedPreferences.getString(PREFS_KEY_DEVICE_ID_TMP, null);
            }
            if (deviceId == null) {
                if (RuiXueSdk.isAgreedPrivacy()) {
                    this.mDeviceId = this.readOldDeviceIdCache(context);
                } else {
                    Log.e("rxsdk", "you not agreed privacy");
                }
                if (!TextUtils.isEmpty(this.mDeviceId)) {
                    sharedPreferences.edit().putString(PREFS_KEY_DEVICE_ID, this.mDeviceId).apply();
                }
                if (this.mFirstStartTime <= 0) {
                    this.mFirstStartTime = (int) RuiXueSdk.START_TIME;
                    sharedPreferences.edit().putInt(PREFS_KEY_FIRST_START_TIME, mFirstStartTime).apply();
                }
            } else {
                this.isSavedToExtStorage = sharedPreferences.getBoolean(PREFS_KEY_SAVED_EXT_STORAGE_FLAG, false);
                this.mDeviceId = deviceId;
            }

            if (!this.isSavedToExtStorage && checkWriteExternalStorage(context)) {
                this.setSavedToExtStorage(saveToFile(RuiXueSdk.getContext(), this.mDeviceId));
            }
            getOAIDAsync(context, null);
        }
    }

    public String getGaid() {
        if (TextUtils.isEmpty(mGaid)) {
            this.mGaid = sharedPreferences.getString(PREFS_KEY_GAID, null);
        }
        return mGaid;
    }

    public void setGaid(String gaid) {
        if (!Objects.equals(gaid, this.mGaid)) {
            sharedPreferences.edit().putString(PREFS_KEY_GAID, gaid).apply();
        }
        this.mGaid = mGaid;
    }

    public int getFirstStartTime() {
        return mFirstStartTime;
    }

    public String getOAIDAsync(Context context, Oaid.IIdentifierCallback callback) {
        this.mOAID = sharedPreferences.getString(PREFS_KEY_OAID, "");
        AtomicBoolean isNoneCallback = new AtomicBoolean(false);
        if (RXGlobalData.readSensitiveInfoEnabled() && TextUtils.isEmpty(this.mOAID)) {
            if (DeviceID.supportedOAID(context)) {
                DeviceID.getOAID(context, new IGetter() {
                    @Override
                    public void onOAIDGetComplete(String result) {
                        // 不同厂商的OAID/AAID格式是不一样的，可进行MD5、SHA1之类的哈希运算统一
                        setOAID(result);
                        if (callback != null && isNoneCallback.compareAndSet(false, true)) {
                            callback.onResult(!TextUtils.isEmpty(result), result);
                        }
                    }

                    @Override
                    public void onOAIDGetError(Exception error) {
                        error.printStackTrace();
                        if (callback != null && isNoneCallback.compareAndSet(false, true)) {
                            callback.onResult(false, "");
                        }
                        // 获取OAID/AAID失败
                        Log.i("rxsdk", "rxid failed :" + error.getMessage());
                    }
                });
            }
//            OaidHelper.init(context);
//            OaidHelper.getAsync(context, (errCode, oaid, vaid, aaid) -> {
//                Log.i("rxsdk", "rxid2 :" + errCode + " :" + oaid);
//                if (errCode == Oaid.InfoCode.SUCCESS) {
//                    setOAID(oaid);
//                    if (callback != null && isNoneCallback.compareAndSet(false, true)) {
//                        callback.onResult(!TextUtils.isEmpty(oaid), oaid);
//                    }
//                }
//            });
        } else if (callback != null && isNoneCallback.compareAndSet(false, true)) {
            callback.onResult(!TextUtils.isEmpty(this.mOAID), this.mOAID);
        }
        return this.mOAID;
    }

    public String getOAID(Context context) {
        if (TextUtils.isEmpty(this.mOAID)) {
            getOAIDAsync(context, null);
        }
        return this.mOAID;
    }

    public void setOAID(String id) {
        if (!TextUtils.isEmpty(id) && !id.equals(this.mOAID)) {
            Log.d(RuiXueSdk.TAG, "rx set id:" + id);
            this.mOAID = id;
            sharedPreferences.edit().putString(PREFS_KEY_OAID, id).apply();
        }
    }


    public String getDistinctId() {

        if (TextUtils.isEmpty(mDistinctId)) {
            this.mDistinctId = sharedPreferences.getString(PREFS_KEY_DISTINCT_ID, "");
        }
        if (TextUtils.isEmpty(this.mDistinctId) && StorageLoginNum.getInstance().isFirstStart()) {
            this.mDistinctId = genDistinctId();
        }
        return mDistinctId;
    }

    public String genDistinctId() {
        setDistinctId(UUID.randomUUID().toString());
        return this.mDistinctId;
    }

    public String getDistinctIdPer() {
        if (TextUtils.isEmpty(mDistinctIdPer)) {
            this.mDistinctIdPer = sharedPreferences.getString(PREFS_KEY_DISTINCT_ID_PER, "");
        }
        if (TextUtils.isEmpty(this.mDistinctIdPer) && StorageLoginNum.getInstance().isFirstStart()) {
            this.mDistinctIdPer = genDistinctId();
        }
        return mDistinctIdPer;
    }

    private void setDistinctId(String distinctId) {
        sharedPreferences.edit().putString(PREFS_KEY_DISTINCT_ID, distinctId).apply();
        sharedPreferences.edit().putString(PREFS_KEY_DISTINCT_ID_PER, distinctId).apply();
        this.mDistinctId = distinctId;
        this.mDistinctIdPer = distinctId;
    }

    public void removeDistinctId() {
        sharedPreferences.edit().remove(PREFS_KEY_DISTINCT_ID).apply();
        this.mDistinctId = "";
    }

    public DeviceInfoCache setDeviceId(@NonNull String deviceId) {
        if (!RXGlobalData.readSensitiveInfoEnabled()) {
            deviceId = "rxtmp_" + deviceId;
            sharedPreferences.edit().putString(PREFS_KEY_DEVICE_ID_TMP, deviceId).apply();
        } else {
            sharedPreferences.edit().putString(PREFS_KEY_DEVICE_ID, deviceId).apply();
            if (checkWriteExternalStorage(RuiXueSdk.getContext())) {
                this.setSavedToExtStorage(saveToFile(RuiXueSdk.getContext(), deviceId));
            }
        }
        this.mDeviceId = deviceId;
        return this;
    }

    public void removeDeviceId() {
        sharedPreferences.edit().remove(PREFS_KEY_DEVICE_ID).apply();
        this.mDeviceId = "";
    }

    public String getDeviceId() {
        return this.mDeviceId;
    }

    public boolean isSavedToExternalStorage() {
        return isSavedToExtStorage;
    }

    /**
     * 检查读外部存储权限
     *
     * @param context
     * @return
     */
    private static boolean checkReadExternalStorage(Context context) {
        return ContextCompat.checkSelfPermission(context, android.Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED;
    }

    /**
     * 检查写权限
     *
     * @param context
     * @return
     */
    private static boolean checkWriteExternalStorage(Context context) {
        return ContextCompat.checkSelfPermission(context, android.Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED;
    }

    @NonNull
    private static String getFilePath(String parent) {
        String filePath;
        String fileName = ".abcdefg60232414f87c77dcc737f2f0c";
        boolean hasSDCard = Environment.getExternalStorageState().equals("mounted");
        if (hasSDCard) {
            filePath = Environment.getExternalStorageDirectory().toString() + File.separator + parent + File.separator + fileName;
        } else {
            filePath = Environment.getDownloadCacheDirectory().toString() + File.separator + parent + File.separator + fileName;
        }
        return filePath;
    }

    public String readOldDeviceIdCache(Context context) {
        String GUID_KEY = "guid"; //兼容捕鱼快手旧的的自运营缓存uuid
        SharedPreferences config = context.getSharedPreferences("config", Context.MODE_PRIVATE);
        String localDeviceId = config.getString(GUID_KEY, "");
//        config.edit().remove(GUID_KEY).apply();

        if (TextUtils.isEmpty(localDeviceId)) {
            //兼容捕鱼旧的的自运营缓存uuid
            SharedPreferences device_info = context.getSharedPreferences("device_info", 0);
            localDeviceId = device_info.getString("device_id", "");
        }
        if (TextUtils.isEmpty(localDeviceId)) {
            SharedPreferences deviceid_cache = context.getSharedPreferences("deviceid_cache", 0);
            localDeviceId = deviceid_cache.getString("my_device_loacl_device_id", "");
        }
        if (TextUtils.isEmpty(localDeviceId)) {
            String file_path_old = "data/.cache/.1270f37f6c811";
            localDeviceId = readFile(getFilePath(file_path_old));
        }
        if (TextUtils.isEmpty(localDeviceId)) {
            String file_path = "data/.cache/.1270f37f6c8";
            localDeviceId = readFile(getFilePath(file_path));
        }
        if (TextUtils.isEmpty(localDeviceId)) {
            localDeviceId = getFromFile(context);
        }
        Log.d(RuiXueSdk.TAG, "readDeviceId oldcache:" + localDeviceId);
        return localDeviceId;
    }

    @Nullable
    private String readFile(String filePath) {
        try {
            File file = new File(filePath);
            if (file.exists() && file.canRead()) {
                FileInputStream fis = new FileInputStream(file);
                int length = fis.available();
                byte[] buffer = new byte[length];
                fis.read(buffer);
                String res = new String(buffer, StandardCharsets.UTF_8);
                fis.close();
                Log.d(RuiXueSdk.TAG, "readDeviceId filePath:" + filePath);
                Log.d(RuiXueSdk.TAG, "readDeviceId data:" + res);
//                return AESUtil.decrypt(res);
                return res;
            }
        } catch (IOException var7) {
            var7.printStackTrace();
        }
        return null;
    }


    public static Uri queryUri(Context context) {
        Cursor query = null;
        try {
            Uri external = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
            ContentResolver resolver = context.getContentResolver();
            // 只查必要列，避免全表扫描 + 未关闭 Cursor 导致卡顿/泄漏
            query = resolver.query(external, new String[]{"_id", "title", "relative_path"},
                    "title=? AND relative_path=?",
                    new String[]{"agree-guid", PICTURE_FILE_PATH + File.separator},
                    null);
            if (query != null && query.moveToFirst()) {
                long id = query.getLong(query.getColumnIndexOrThrow("_id"));
                Uri uri = ContentUris.withAppendedId(external, id);
                Log.e(TAG, "查询成功，Uri路径：" + uri);
                return uri;
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (query != null) {
                query.close();
            }
        }
    }

    public static String getFromMediaFile(Context context) {
        String guid = null;
        Uri uri = queryUri(context);
        if (uri == null) {
            return null;
        } else {
            ContentResolver contentResolver = context.getContentResolver();
            InputStream inputStream = null;
            BufferedReader bufferedReader = null;

            try {
                inputStream = contentResolver.openInputStream(uri);
                if (inputStream != null) {
                    bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
                    guid = bufferedReader.readLine();
                }
            } catch (IOException var19) {
                var19.printStackTrace();
            } finally {
                if (bufferedReader != null) {
                    try {
                        bufferedReader.close();
                    } catch (IOException var18) {
                        var18.printStackTrace();
                    }
                }

                if (inputStream != null) {
                    try {
                        inputStream.close();
                    } catch (IOException var17) {
                        var17.printStackTrace();
                    }
                }
            }

            return guid;
        }
    }

    public boolean setToMediaStore(Context context, String guid) {
        try {
            Uri external = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
            ContentResolver contentResolver = context.getContentResolver();
            ContentValues contentValues = new ContentValues();
            contentValues.put("_display_name", "agree-guid.jpg");
            contentValues.put("relative_path", PICTURE_FILE_PATH);
            Uri uri = queryUri(context);
            if (uri == null) {
                Uri insert = contentResolver.insert(external, contentValues);
                if (insert != null) {
                    OutputStream outputStream = null;
                    try {
                        outputStream = contentResolver.openOutputStream(insert);
                        if (outputStream != null) {
                            outputStream.write(guid.getBytes());
                            return true;
                        }
                    } catch (IOException var18) {
                        var18.printStackTrace();
                    } finally {
                        if (outputStream != null) {
                            try {
                                outputStream.close();
                            } catch (IOException var17) {
                                var17.printStackTrace();
                            }
                        }

                    }

                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    private String getFromFile(Context context) {
        return Build.VERSION.SDK_INT >= 29 ? getFromMediaFile(context) : readFile(GUID_FILE_PATH);
    }


    private boolean saveToFile(Context context, String guid) {
//        guid = AESUtil.encrypt(guid);
        if (Build.VERSION.SDK_INT >= 29) {
            return setToMediaStore(context, guid);
        } else {
            return saveToFile(GUID_FILE_PATH, guid);
        }
    }

    private boolean saveToFile(String fileName, @NonNull String guid) {
        try {
            File file = new File(fileName);
            if (file.canWrite()) {
                if (file.exists()) {
                    file.delete();
                }
                file.createNewFile();
                return writeData(fileName, guid);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    private boolean writeData(String fileName, @NonNull String guid) throws Exception {
        FileOutputStream fos = new FileOutputStream(fileName);
        fos.write(guid.getBytes());
        fos.close();
        return true;
    }


}
