package com.ruixue.utils;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.ruixue.logger.RXLogger;

/**
 * 剪贴板工具类
 */
public class ClipboardUtils {

    private ClipboardUtils() {
        throw new UnsupportedOperationException("u can't instantiate me...");
    }

    /**
     * 剪贴板获取异步回调
     *
     * @return 获取后是否清理剪贴板
     */
    public interface ICallback {
        /**
         * @param content 剪贴板内容
         * @return 获取后是否清理剪贴板
         */
        public boolean onClipContent(String content);
    }

    /**
     * App启动自动获取剪贴板请使用延迟异步获取剪贴板内容，原因：Android Q对剪切板做了改动 当应用没有获取到焦点的时候，无法获取剪贴板内容
     *
     * @param context
     * @param callback
     */
    public static void getStringDelay(@NonNull Context context, ICallback callback) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            Handler handler = new Handler(Looper.getMainLooper());
            handler.postDelayed(() -> {
                //此处可放 调用获取剪切板内容的代码
                String str = getString(context);
                if (null != callback && callback.onClipContent(str)) {
                    clear(context);//获取成功后清理剪贴板
                }
            }, 1000);
        } else {
            //此处可放 调用获取剪切板内容的代码
            String str = getString(context);
            if (null != callback && callback.onClipContent(str)) {
                clear(context);//获取成功后清理剪贴板
            }
        }
    }

    /**
     * 获取剪切板内容
     */
    public static String getString(Context context) {
        try {
            if (Looper.myLooper() == null) {
                Looper.prepare();
            }
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


    /**
     * 复制文本到剪贴板
     *
     * @param context 上下文
     * @param text    文本
     */
    public static void copyText(Context context, CharSequence text) {

        ClipboardManager clipboard = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
        clipboard.setPrimaryClip(ClipData.newPlainText("text", text));
    }

    /**
     * 获取剪贴板的文本
     *
     * @param context 上下文
     * @return 剪贴板的文本
     */
    public static CharSequence getText(Context context) {
        ClipboardManager clipboard = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = clipboard.getPrimaryClip();
        if (clip != null && clip.getItemCount() > 0) {
            return clip.getItemAt(0).coerceToText(context);
        }
        return "";
    }

    /**
     * 复制uri到剪贴板
     *
     * @param context 上下文
     * @param uri     uri
     */
    public static void copyUri(Context context, Uri uri) {
        ClipboardManager clipboard = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
        clipboard.setPrimaryClip(ClipData.newUri(context.getContentResolver(), "uri", uri));
    }

    /**
     * 获取剪贴板的uri
     *
     * @param context 上下文
     * @return 剪贴板的uri
     */
    public static Uri getUri(Context context) {
        ClipboardManager clipboard = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = clipboard.getPrimaryClip();
        if (clip != null && clip.getItemCount() > 0) {
            return clip.getItemAt(0).getUri();
        }
        return null;
    }

    /**
     * 复制Intent到剪贴板
     *
     * @param context 上下文
     * @param intent  意图
     */
    public static void copyIntent(Context context, Intent intent) {
        ClipboardManager clipboard = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
        clipboard.setPrimaryClip(ClipData.newIntent("intent", intent));
    }

    /**
     * 获取剪贴板的Intent
     *
     * @param context 上下文
     * @return 剪贴板的意图
     */
    public static Intent getIntent(Context context) {
        ClipboardManager clipboard = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = clipboard.getPrimaryClip();
        if (clip != null && clip.getItemCount() > 0) {
            return clip.getItemAt(0).getIntent();
        }
        return null;
    }

    /**
     * 清空剪切板
     */
    public static void clear(Context context) {
        ThreadUtils.getInstance().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                ClipboardManager clipboard = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
                if (clipboard != null) {
                    try {
                        clipboard.setPrimaryClip(clipboard.getPrimaryClip());
                        clipboard.setPrimaryClip(ClipData.newPlainText("", ""));
                        RXLogger.i("clipboard data clear.");
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        });
    }


}
