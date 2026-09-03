package com.ruixue.shlogin;

import android.annotation.SuppressLint;
import android.content.Context;

import com.ruixue.txmobile.R;
import com.shlogin.sdk.OneKeyLoginManager;
import com.shlogin.sdk.tool.LoginUIConfig;

import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.RelativeLayout;


import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/6/11
 */
public class TXAuthUIConfig {

    protected Drawable logoDrawable;
    protected Context context;

    protected String appid;
    protected int orientation;

    public TXAuthUIConfig(Context context, Map<String, Object> map) {
        this.context = context.getApplicationContext();//     必须getApplicationContext(),防止可能存在的内存泄漏
        orientation = context.getResources().getConfiguration().orientation;
        if (map != null) {
            appid = (String) map.get("tx_appid");
            if ((map.get("logoDrawable") instanceof Drawable)) {
                logoDrawable = (Drawable) map.get("logoDrawable");
            }
        }
    }

    public TXAuthUIConfig(Context context, com.ruixue.openapi.LoginUIConfig config) {
        this.context = context.getApplicationContext();//     必须getApplicationContext(),防止可能存在的内存泄漏
        orientation = context.getResources().getConfiguration().orientation;

    }

    public String getAppid() {
        return appid;
    }

    public void setAppid(String appid) {
        this.appid = appid;
    }

    public static TXAuthUIConfig create(Context context, Map<String, Object> map) {
        return new TXAuthUIConfig(context, map);
    }

    public static TXAuthUIConfig create(Context context, com.ruixue.openapi.LoginUIConfig config) {
        return new TXAuthUIConfig(context, config);
    }

    /**
     * 样式F配置示例: SDK固有控件都有默认值，只需设置自己想要修改的配置
     * @return
     */
    @SuppressLint("UseCompatLoadingForDrawables")
    public LoginUIConfig createAuthUIConfig() {
        /************************************SDK固有控件********************************/
        //logo图标
        Drawable mCustomLogo = context.getResources().getDrawable(R.drawable.rx_logo);
        //登录按钮背景
        Drawable mLoginBt = context.getResources().getDrawable(R.drawable.login_btn_bg_normal);
        //授权页背景
        Drawable mAuthBackgroundImg = context.getResources().getDrawable(R.drawable.login_bg_white);

        ImageView imgClose = new ImageView(context);
        imgClose.setId(View.generateViewId());
        imgClose.setImageResource(R.drawable.ruixue_close_dialog);
        RelativeLayout.LayoutParams mLayoutParams1 = new RelativeLayout.LayoutParams(context.getResources().getDimensionPixelSize(R.dimen.dp_50), // 宽度
                context.getResources().getDimensionPixelSize(R.dimen.dp_38)); // 高度
        mLayoutParams1.addRule(RelativeLayout.ALIGN_PARENT_END, RelativeLayout.TRUE);
        mLayoutParams1.setMargins(0, context.getResources().getDimensionPixelSize(R.dimen.dp_8), context.getResources().getDimensionPixelSize(R.dimen.dp_8), 0);
        imgClose.setLayoutParams(mLayoutParams1);
        imgClose.setScaleType(ImageView.ScaleType.CENTER_INSIDE);


        //自定义控件（右上角“更换号码>”）
//        TextView mOtherTv = new TextView(context);
//        mOtherTv.setText("其他方式登录");
//        mOtherTv.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
//        RelativeLayout.LayoutParams otherLayoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
//        otherLayoutParams.setMargins(0, AbScreenUtils.dp2px(context, 210), 0, 0);
//        otherLayoutParams.addRule(RelativeLayout.CENTER_HORIZONTAL);
//        mOtherTv.setLayoutParams(otherLayoutParams);

        View v = LayoutInflater.from(context).inflate(R.layout.tx_dialog_action_bar, null);
//        ImageView imageView = v.findViewById(R.id.iv_title);
//        imageView.setBackgroundResource(R.drawable.rx_logo);
        v.findViewById(R.id.btn_close).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                OneKeyLoginManager.getInstance().finishAuthActivity();
            }
        });

        /**************************授权页配置（示例配置自上而下，可调整顺序）****************/
        LoginUIConfig uiConfig = new LoginUIConfig.Builder()
                /**设置弹窗样式
                 * @param isdialogTheme 是否是弹窗主题
                 * @param dialogWidth 弹窗宽度
                 * @param dialogHeight 弹窗高度
                 * @param dialogX 弹窗距离屏幕左测边距（左右等距）
                 * @param dialogY 弹窗距离屏幕顶部测边距
                 * @param isDialogBottom 弹窗是否显示到屏幕底部
                 * **/.setDialogTheme(true, AbScreenUtils.getScreenWidth(context, true) - 60, AbScreenUtils.getScreenHeight(context, true) - 60, 0, 0, false)
//                .setRelativeCustomView()
                //添加自定义控件（其他方式登录）
//               view（必填） View ⾃定义控件对象
//               isFinish（必填） boolean 是否需要销毁授权⻚：true销毁 false不销毁
//               type（必填） boolean 设置⾃定义控件的位置：true为授权⻚导航栏 false为授权⻚导航栏以下空⽩处
//               customInterface CustomInterface ⾃定义控件监听
                .addCustomView(imgClose, true, false, null)
                //设置授权页背景
                .setAuthBGImgPath(mAuthBackgroundImg).setDialogDimAmount(0.5f)
                //设置导航栏隐藏
                .setAuthNavHidden(true)
                //设置logo
                .setLogoImgPath(mCustomLogo).setLogoWidth(100)
                //设置logo距离顶部偏移量
                .setLogoOffsetY(-5)
                //设置号码栏距离顶部偏移量
                .setNumFieldOffsetY(80)
                //号码栏设置字体加粗
                .setNumberBold(true)
                //设置号码栏字体大小
                .setNumberSize(25)
                //设置slogan距离顶部（状态栏）偏移量
                .setSloganOffsetY(120)
                //设置slogan文字大小
                .setSloganTextSize(13)
                //设置登录按钮距离顶部（状态栏）偏移量
                .setLogBtnOffsetY(160)
                //设置一键登录按钮的宽度
                .setLogBtnWidth(AbScreenUtils.getScreenWidth(context, true) - 120)
                //设置登录按钮文本
                .setLogBtnText("本机号码一键登录")
                //设置登录按钮字体大小
                .setLogBtnTextSize(18)
                //设置登录按钮背景图片
                .setLogBtnImgPath(mLoginBt)
                //设置协议复选框隐藏
                .setCheckBoxHidden(false).setCheckedImgPath(context.getResources().getDrawable(R.drawable.cbx_selected)).setUncheckedImgPath(context.getResources().getDrawable(R.drawable.cbx_unselected))
                .setcheckBoxOffsetXY(0, 7)
                .setCheckBoxMargin(10,10,0,10)
                //设置协议栏距离屏幕左侧偏移量
                .setPrivacyOffsetX(20)
                //设置协议栏距离屏幕底部偏移量
                .setPrivacyOffsetBottomY(5)
                //设置协议文字左对齐
                .setPrivacyOffsetGravityLeft(true)

                //设置协议字体大小
                .setPrivacyTextSize(13)
                //设置协议文字颜色（参数1：协议名称之外的文字颜色；参数2：协议名称文字颜色）
                .setAppPrivacyColor(Color.parseColor("#FF000000"), Color.parseColor("#20C0B3"))
                //设置自定义协议（参数1：协议名称；参数2：协议链接）
                .setAppPrivacyOne("用户协议", "https://www.miit.gov.cn/gyhxxhb/jgsj/xxtxglj/APPqhyhqyzxzzxd/zcbz/art/2020/art_9adee9099a8c4f2f9bf74fd5f3f556c4.html")
                //设置协议外部文字描述
                .setPrivacyText("我已阅读并同意", "、", "、", "、", "").build();
        return uiConfig;
    }
}
