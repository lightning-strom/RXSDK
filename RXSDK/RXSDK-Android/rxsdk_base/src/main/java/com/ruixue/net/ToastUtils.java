package com.ruixue.net;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.text.TextUtils;
import android.util.TypedValue;
import android.view.DisplayCutout;
import android.view.Gravity;
import android.view.View;
import android.view.WindowInsets;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.DrawableRes;
import androidx.annotation.StringRes;

import com.ruixue.base.R;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.GradientDrawableUtil;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONObject;

/**
 * author:lql
 * create by 2018:11:02
 */
public class ToastUtils {

    private static final int TOAST_RES_ID = 0;

    public static Toast showLongToast(Context context, String text) {
        return showToast(context, text, Toast.LENGTH_LONG, TOAST_RES_ID);
    }

    //transient_notification
    public static Toast showToast(Context context, String text, int duration, @DrawableRes int resId) {
        try {
            Context appContext = context.getApplicationContext();
            Toast toast = Toast.makeText(appContext, text, duration);
            LinearLayout layout = (LinearLayout) toast.getView();
            if (layout != null) {
                GradientDrawable radiusBg = GradientDrawableUtil.createRectangleDrawable(Color.parseColor("#F5272A2B"), Color.TRANSPARENT, 0, AppUtils.dp2px(appContext, 10));
                layout.setBackground(radiusBg);
                TextView tv = (TextView) layout.getChildAt(0);
                int horizontal = AppUtils.dp2px(appContext, 10);
                int vertical = AppUtils.dp2px(appContext, 8);
                tv.setGravity(Gravity.CENTER);
                tv.setPadding(horizontal, vertical, horizontal, vertical);
                tv.setMaxLines(Integer.MAX_VALUE);
                LinearLayout.LayoutParams tvLayout = (LinearLayout.LayoutParams) tv.getLayoutParams();
                tvLayout.setMargins(0, 0, 0, 0);

                //设置字体大小
                tv.setTextSize(TypedValue.COMPLEX_UNIT_SP, 15);
                //设置字体颜色
                tv.setTextColor(Color.WHITE);
                int xOffset = 0;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P && context instanceof Activity) {
                    final View decorView = ((Activity) context).getWindow().getDecorView();
                    WindowInsets insets = decorView.getRootWindowInsets();
                    if (insets != null && insets.getDisplayCutout() != null) {
                        DisplayCutout displayCutout = insets.getDisplayCutout();
                        xOffset += displayCutout.getSafeInsetRight() / 2;
                        xOffset -= displayCutout.getSafeInsetLeft() / 2;
                    }
                }

                toast.setGravity(Gravity.CENTER, xOffset, 0);

//              toast.getView().getBackground().setTintList(ContextCompat.getColorStateList(context, android.R.color.darker_gray));
//            } else {
//                toast.setText(text);
//                toast.setDuration(duration);
//            }

                if (resId != 0) {
                    layout.setPadding(horizontal, vertical * 2, horizontal, vertical);
                    ImageView imageCodeProject = new ImageView(appContext);
                    imageCodeProject.setImageResource(resId);
                    layout.setOrientation(LinearLayout.VERTICAL);
                    layout.addView(imageCodeProject, 0);
                } else {
                    layout.setPadding(horizontal, vertical, horizontal, vertical);
                }
            }
            toast.show();
            return toast;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static Toast showToast(Context context, String text) {
        return showToast(context, text, Toast.LENGTH_SHORT, TOAST_RES_ID);
    }

    public static void showToastSafe(Activity activity, String text) {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                showToast(activity, text, Toast.LENGTH_SHORT, TOAST_RES_ID);
            }
        });

    }

    public static Toast showToast(Context context, @StringRes int resId) {
        String tips = resId != 0 ? context.getResources().getString(resId) : "error resId";
        return showToast(context, tips);
    }

    public static Toast showNetErrorToast(Context context, int code) {
        String tips = context.getResources().getString(R.string.rx_tips_error_network);
        tips += "！code=" + code;
        return showToast(context, tips);
    }

    public static void showToast(Context context, RXException e) {
        showToast(context, e.getMessage());
    }

    public static void showToast(Context context, JSONObject jsonObject) {
        ThreadUtils.getInstance().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                showToast(context, jsonObject, Toast.LENGTH_SHORT, TOAST_RES_ID);
            }
        });
    }

    public static void showToast(Context context, JSONObject jsonObject, int duration, @DrawableRes int resId) {
        if (jsonObject != null) {
            String errMsg = jsonObject.optString("msg", RXErrorCode.UNKNOWN_ERROR.getDesc());
            int code = jsonObject.optInt("code", 0);
            if (code != RXErrorCode.LOGIN_CANCEL.getValue() && code != RXErrorCode.PAY_CANCEL.getValue()) {
                if (jsonObject.has("thirdmsg")) {
                    errMsg += "," + jsonObject.optString("thirdmsg", RXErrorCode.UNKNOWN_ERROR.getDesc());
                }
                if (jsonObject.has("thirdcode")) {
                    errMsg += "! code:" + jsonObject.optInt("thirdcode", -1);
                }
            }
            if (!TextUtils.isEmpty(errMsg)) {
                showToast(context, errMsg, duration, resId);
            }
        }
    }

}
