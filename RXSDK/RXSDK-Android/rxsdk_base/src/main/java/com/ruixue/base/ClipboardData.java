package com.ruixue.base;

import android.content.Context;
import android.os.Build;
import android.text.TextUtils;

import com.ruixue.utils.ClipboardUtils;

import org.json.JSONObject;

import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.FutureTask;

public class ClipboardData {
    private static Future<String> sDataString;
    private static String sLastClipString;


    public static Future<String> loadDelayAfterP(Context context, int millis) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            try {
                FutureTask<String> futureTask = new FutureTask<>(() -> {
                    Thread.sleep(millis);
                    String str = ClipboardUtils.getString(context);
                    return str;
                });
                ExecutorService exec = Executors.newCachedThreadPool();
                exec.submit(futureTask);
                exec.shutdown();
//        new Thread(futureTask).start();
                sDataString = futureTask;
                return sDataString;
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        } else {
            return null;
        }
    }

    public static Future<String> load(Context context) {
        return loadDelayAfterP(context, 1000);
    }

    public static void clear(Context context) {
        sDataString = null;
        ClipboardUtils.clear(context);
    }

    /**
     * 启动时候执行 load
     *
     * @return 获取剪贴板内容，确保启动完全完成 否则可能产生阻塞。
     */
    public static String get(Context context) {
        String s = "";
        if (null != sDataString) {
//            synchronized (sDataString) {
            try {
                s = sDataString.get();
                sDataString = null;
            } catch (ExecutionException | InterruptedException e) {
                e.printStackTrace();
            }
//            }
        } else {
            s = ClipboardUtils.getString(context);
        }
        if (!TextUtils.isEmpty(s)) {
            sLastClipString = s;
        }
        return s;
    }

    public static String getLast(Context context) {
        get(context);
        return sLastClipString;
    }

    public static void clearLast() {
        sLastClipString = "";
    }

    static final String RX_TYPE = "type=rx&";

    public static Map<String, Object> getMap(Context context, boolean bClear) {
        Map<String, Object> map = new HashMap<>();
        try {
            String query = get(context);
            if (!TextUtils.isEmpty(query) && query.startsWith(RX_TYPE)) {
                String[] arrs = query.substring(RX_TYPE.length()).split("&");
                for (String arr : arrs) {
                    if (arr.contains("=")) {
                        String[] arrChild = arr.split("=");
                        int arrLen = arrChild.length;
                        if (arrLen > 0) {
                            String t = "";
                            if (arrLen > 1) {
                                try {
                                    t = URLDecoder.decode(arrChild[1], "utf-8");
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                            }
                            map.put(arrChild[0], t);
                        }
                    }
                }
                if (bClear) {
                    ClipboardUtils.clear(context);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return map;
    }

    //     * 数据格式 type=rx&min_from=${source}&func=${func}&materialid=${materialid}
    public static JSONObject getJSONObject(Context context, boolean bClear) {
        return new JSONObject(getMap(context, bClear));
    }
}
