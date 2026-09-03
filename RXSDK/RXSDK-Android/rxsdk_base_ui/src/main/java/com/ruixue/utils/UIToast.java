package com.ruixue.utils;

import android.content.Context;
import android.widget.Toast;

import androidx.annotation.StringRes;

import com.ruixue.net.ToastUtils;
import com.ruixue.ui.R;

import org.json.JSONObject;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/5/12
 */
public class UIToast {
    public static void showToast(Context context, @StringRes int resId) {
        String tips = resId != 0 ? context.getResources().getString(resId) : "error resId";
        ToastUtils.showToast(context, tips, Toast.LENGTH_SHORT, R.drawable.rx_toast_failed);
    }

    public static void showToast(Context context, String text) {
        ToastUtils.showToast(context, text, Toast.LENGTH_SHORT, R.drawable.rx_toast_failed);
    }

    public static void showToast(Context context, JSONObject jsonObject) {
        ToastUtils.showToast(context, jsonObject, Toast.LENGTH_SHORT, R.drawable.rx_toast_failed);
    }

    public static void showNetErrorToast(Context context, int code) {
        String tips = context.getResources().getString(com.ruixue.base.R.string.rx_tips_error_network);
        tips += "！code=" + code;
        showErrorToast(context, tips);
    }

    //Toast.LENGTH_LONG（3.5秒）和Toast.LENGTH_SHORT（2秒)
    public static void showErrorToast(Context context, @StringRes int resId) {
        String tips = resId != 0 ? context.getResources().getString(resId) : "error resId";
        showErrorToast(context, tips);
    }

    public static void showErrorToast(Context context, String text) {
        showErrorToast(context, text, Toast.LENGTH_LONG);
    }

    public static void showErrorToast(Context context, String text, int duration) {
        com.ruixue.net.ToastUtils.showToast(context, text, duration, R.drawable.rx_toast_failed);
    }

    public static void showSuccessToast(Context context, @StringRes int resId) {
        String tips = resId != 0 ? context.getResources().getString(resId) : "error resId";
        ToastUtils.showToast(context, tips, Toast.LENGTH_SHORT, R.drawable.rx_toast_success);
    }
    public static void showSuccessToast(Context context, String text) {
        com.ruixue.net.ToastUtils.showToast(context, text, Toast.LENGTH_LONG, R.drawable.rx_toast_success);
    }
}
