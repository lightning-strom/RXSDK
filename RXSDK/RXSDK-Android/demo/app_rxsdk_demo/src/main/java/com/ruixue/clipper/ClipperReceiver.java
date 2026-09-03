package com.ruixue.clipper;

import android.app.Activity;
import android.content.ClipData;
import android.content.IntentFilter;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.BroadcastReceiver;
import android.os.Build;

import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;

/*
 * Receives broadcast commands and controls clipboard accordingly.
 * The broadcast receiver is active only as long as the application, or its service is active.
 */
public class ClipperReceiver extends BroadcastReceiver {
    private static String TAG = "ClipboardReceiver";

    public static String ACTION_GET = "clipper.get";
    public static String ACTION_GET_SHORT = "get";
    public static String ACTION_SET = "clipper.set";
    public static String ACTION_SET_SHORT = "set";
    public static String EXTRA_TEXT = "text";

    private static class Singel {
        static ClipperReceiver INSTANCE = new ClipperReceiver();
    }

    /**
     * clipboard  receiver
     * 1. am broadcast -a clipper.set -e text \'This may be pasted now\' \n
     * 2. am broadcast -a clipper.get
     */
    public static void registerReceiver(@NonNull Context context) {
        IntentFilter intentFilter = new IntentFilter(ClipperReceiver.ACTION_GET);
        intentFilter.addAction(ClipperReceiver.ACTION_GET_SHORT);
        intentFilter.addAction(ClipperReceiver.ACTION_SET);
        intentFilter.addAction(ClipperReceiver.ACTION_SET_SHORT);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            // 允许 adb/custom broadcast 继续访问这个调试接收器。
            context.registerReceiver(Singel.INSTANCE, intentFilter, Context.RECEIVER_EXPORTED);
        } else {
            context.registerReceiver(Singel.INSTANCE, intentFilter);
        }
    }

    public static void unregisterReceiver(Context context) {
        context.unregisterReceiver(Singel.INSTANCE);
    }

    public static boolean isActionGet(final String action) {
        return ACTION_GET.equals(action) || ACTION_GET_SHORT.equals(action);
    }

    public static boolean isActionSet(final String action) {
        return ACTION_SET.equals(action) || ACTION_SET_SHORT.equals(action);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        if (isActionSet(intent.getAction())) {
            Log.d(TAG, "Setting text into clipboard");
            String text = intent.getStringExtra(EXTRA_TEXT);
            if (text != null) {
                setClipboardText(context, text);
                setResultCode(Activity.RESULT_OK);
                setResultData("Text is copied into clipboard.");
            } else {
                setResultCode(Activity.RESULT_CANCELED);
                setResultData("No text is provided. Use -e text \"text to be pasted\"");
            }
        } else if (isActionGet(intent.getAction())) {
            Log.d(TAG, "Getting text from clipboard");
            String clip = getClipboardText(context);
            if (!TextUtils.isEmpty(clip)) {
                Log.d(TAG, String.format("Clipboard text: %s", clip));
                setResultCode(Activity.RESULT_OK);
                setResultData(clip);
            } else {
                setResultCode(Activity.RESULT_CANCELED);
                setResultData("");
            }
        }
    }

    public static void setClipboardText(Context context, CharSequence text) {
        ClipboardManager clipboard = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
        clipboard.setPrimaryClip(ClipData.newPlainText("text", text));
    }

    public static String getClipboardText(Context context) {
        try {
            ClipboardManager clipboard = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
            if (clipboard != null) {
                ClipData data = clipboard.getPrimaryClip();
                if (data != null && data.getItemCount() > 0) {
                    ClipData.Item item = data.getItemAt(0);
                    if (item != null) {
                        //item.getText()部分手机可能会在剪切板没有相关的文本内容返回null.
                        CharSequence charSequence = item.getText();
                        if (charSequence != null) {
                            return charSequence.toString();
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }
}