package com.ruixue.utils;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import java.util.HashMap;


/**
 * Create Time：2018/6/28 0028 10:35
 * Created By：lql
 * Describe：
 * Modify：
 * Remark：弹窗工具类
 */

public class DialogUtils {

    private Context mContext;

    private int layoutId;
    private int layoutPosition;
    private int padingTop;
    private int padingBottom;
    private int padingRight;
    private int padingLeft;
    private int dialogAnimaType;
    private boolean outside = true;
    private boolean cancelable = true;
    private int height = WindowManager.LayoutParams.WRAP_CONTENT;

    private static Dialog dialog = null;


    public HashMap<Integer, Dialog> getMapsDialogs() {
        return mapsDialogs;
    }


    private HashMap<Integer, Dialog> mapsDialogs = new HashMap<>();


    private ViewInterface listener;

    private DialogUtils() {

    }

    /**
     * 静态内部类的方式构建单例模式
     */

    private static class DialogHolder {

        private static DialogUtils instance = new DialogUtils();

    }

    public static DialogUtils getInstance() {
        return DialogHolder.instance;
    }

    /**
     * 传入上下文
     *
     * @param context
     * @return
     */

    public final DialogUtils with(Context context) {
        this.mContext = context;
        return this;

    }

    /**
     * 传入弹窗需要的布局
     *
     * @param layoutId
     * @return
     */

    public final DialogUtils setlayoutId(int layoutId) {
        this.layoutId = layoutId;
        return this;

    }

    public int getlayoutId() {
        return this.layoutId;
    }

    /**
     * 设置弹窗的位置
     *
     * @param layoutPosition
     * @return
     */

    public final DialogUtils setlayoutPosition(int layoutPosition) {
        this.layoutPosition = layoutPosition;
        return this;

    }

    /**
     * 设置弹窗的动画
     *
     * @param dialogAnimaType
     * @return
     */
    public final DialogUtils setlayoutAnimaType(int dialogAnimaType) {
        this.dialogAnimaType = dialogAnimaType;
        return this;

    }

    /**
     * 设置弹窗距离屏幕的距离
     *
     * @param padingLeft
     * @param padingTop
     * @param padingRight
     * @param padingBottom
     * @return
     */
    public final DialogUtils setlayoutPading(int padingLeft, int padingTop, int padingRight, int padingBottom) {
        this.padingLeft = padingLeft;
        this.padingTop = padingTop;
        this.padingRight = padingRight;
        this.padingBottom = padingBottom;
        return this;
    }

    public interface ViewInterface {
        void getChildView(View view, int layoutResId, Dialog dialog);
    }

    /**
     * 设置子View
     *
     * @param listener ViewInterface
     * @return Builder
     */
    public DialogUtils setOnChildViewclickListener(ViewInterface listener) {
        this.listener = listener;
        return this;
    }

    public Dialog getDialog() {

        return dialog;
    }

    /**
     * 设置弹窗消失
     */
    public static void dismiss() {

        if (dialog != null && dialog.isShowing()) {
            dialog.dismiss();
        }
    }

    public void show() {
//        dialog = new Dialog(mContext);
        switch (dialogAnimaType) {
            case 0:
                //自下而上动画
                dialog = new Dialog(mContext, com.ruixue.base.R.style.Slide);
                break;
            case 1:
                //淡入淡出缩放动画
                dialog = new Dialog(mContext, com.ruixue.base.R.style.ScaleFade);
                break;
        }

        View view = LayoutInflater.from(mContext).inflate(layoutId, null);

        dialog.setContentView(view);
        if (listener != null && layoutId != 0) {
            listener.getChildView(view, layoutId, dialog);
        }


        //获得dialog的window窗口
        Window window = dialog.getWindow();
        //设置dialog在屏幕位置
        window.setGravity(layoutPosition);

//        window.getDecorView().setPadding(padingLeft, padingTop, padingRight, padingBottom);
        //获得window窗口的属性
        WindowManager.LayoutParams lp = window.getAttributes();

        //设置窗口宽度为充满全屏
        lp.width = WindowManager.LayoutParams.MATCH_PARENT;
        lp.height = height;


        //将设置好的属性set回去
        window.setAttributes(lp);

        window.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));

        window.setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        dialog.setCancelable(cancelable);
        dialog.setCanceledOnTouchOutside(outside);
        dialog.show();


    }


    /**
     * 点击空白处是否消失
     */
    public DialogUtils setCanceledOnTouchOutside(boolean outside) {
        this.outside = outside;
        return this;
    }

    /**
     * 点击返回键是否消失
     */
    public DialogUtils setCancelable(boolean cancelable) {
        this.cancelable = cancelable;
        return this;
    }

    public DialogUtils setHeight(int height) {
        this.height = height;
        return this;
    }

    public DialogUtils template(Context activity, int layoutid, int layoutPosition, ViewInterface listener) {

        DialogUtils.getInstance()
                .with(activity)//上下文
                .setCanceledOnTouchOutside(true)
                .setCancelable(true)
                .setlayoutId(layoutid)//布局文件
                .setlayoutPosition(layoutPosition)//位置 Gravity.CENTER
                .setHeight(WindowManager.LayoutParams.WRAP_CONTENT)
                .setlayoutAnimaType(1)//动画类型:0自下而上动画，1淡入淡出动画
                .setlayoutPading(0, 0, 0, 0)//与屏幕距离
                .setOnChildViewclickListener(listener).show();
        mapsDialogs.put(layoutid, dialog);


        return this;
    }

    public DialogUtils templateTouch(Activity activity, int layoutid, int layoutPosition, ViewInterface listener) {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                DialogUtils.getInstance()
                        .with(activity)//上下文
                        .setCanceledOnTouchOutside(true)
                        .setCancelable(true)
                        .setlayoutId(layoutid)//布局文件
                        .setlayoutPosition(layoutPosition)//位置 Gravity.CENTER
                        .setHeight(WindowManager.LayoutParams.WRAP_CONTENT)
                        .setlayoutAnimaType(1)//动画类型:0自下而上动画，1淡入淡出动画
                        .setlayoutPading(0, 0, 0, 0)//与屏幕距离
                        .setOnChildViewclickListener(listener).show();
                mapsDialogs.put(layoutid, dialog);
            }
        });

        return this;
    }

    public DialogUtils template(Context activity, int layoutid, int layoutPosition, boolean canceledOnTouchOutside, boolean cancelable, ViewInterface listener) {
        DialogUtils.getInstance()
                .with(activity)//上下文
                .setCanceledOnTouchOutside(canceledOnTouchOutside)
                .setCancelable(cancelable)
                .setlayoutId(layoutid)//布局文件
                .setlayoutPosition(layoutPosition)//位置 Gravity.CENTER
                .setHeight(WindowManager.LayoutParams.MATCH_PARENT)
                .setlayoutAnimaType(1)//动画类型:0自下而上动画，1淡入淡出动画
                .setlayoutPading(0, 0, 0, 0)//与屏幕距离
                .setOnChildViewclickListener(listener).show();
        mapsDialogs.put(layoutid, dialog);
        return this;
    }

}