package com.ruixue.aliqin;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;

import androidx.core.content.ContextCompat;

import com.mobile.auth.gatewayauth.AuthRegisterXmlConfig;
import com.mobile.auth.gatewayauth.AuthUIConfig;
import com.mobile.auth.gatewayauth.AuthUIControlClickListener;
import com.mobile.auth.gatewayauth.ui.AbstractPnsViewDelegate;
import com.ruixue.alimobile.R;
import com.ruixue.logger.RXLogger;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.ImageUtil;
import com.ruixue.widget.LoginButtonGroup;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/12/6
 */
//https://help.aliyun.com/document_detail/144231.html?scm=20140722.184.2.173
public class AliAuthUIConfig {


    protected String appid;

    //自定义登录方式
    protected List<String> customLoginMethods;
    //屏幕dp
    int screenWidthDp;

    int screenHeightDp;

    // 窗口height dp大小
    protected int dialogH;
    /**
     * 窗口width dp大小
     */
    protected int dialogW;


    // 电话号码显示 设置号码栏控件相对导航栏顶部的位移（单位：dp）。
    protected int numFieldY = 0;

    protected int numTxtSize = 24;
    /**
     * 运营商信息 设置Slogan相对导航栏顶部的位移（单位：dp）。
     */
    protected int sloganY = numFieldY + 33;
    //    设置Slogan文字大小（单位：dp，字体大小不随系统变化） // 运营商信息
    protected int sloganTxtSize = 12;

    // 登录按钮    // 设置登录按钮相对导航栏顶部的位移（单位：dp）。
    protected int loginBtnY = sloganY + (27);

    protected int loginBtnH = 38;  //    setLogBtnHeight	int	设置登录按钮高度（单位：dp）。

    protected int loginBtnW;    //    setLogBtnWidth 设置登录按钮宽度（单位：dp）。

    //登录按钮信息
    protected String loginBtnTxt = "本机号码一键登录"; //    setLogBtnText	String	设置登录按钮文字。

    protected int loginBtnTxtSize = 16; //    setLogBtnTextSize	int	设置登录按钮文字大小。

    // 阿里切换其它登录方式 是否隐藏
    protected boolean switchAccHide = true;
    //设置换按钮相对导航栏顶部的位移（单位：dp）。
    protected int switchAccY = loginBtnY + loginBtnH + 11;
    protected int switchAccTxtSize = 15;
    protected int switchAccTextColor = Color.parseColor("#20C0B3");


    /**
     * /设置隐私条款相对导航栏顶部的位移（单位：dp）。
     */
    protected int privacyY = switchAccY;
    protected int privacyHeight = 47;
    //设置隐私条款文字大小（单位：sp）。
    protected int privacyTxtSize = 12;

    /**
     * 设置隐私条款是否默认勾选
     */
    protected boolean privacyState;

    //自定义控件区域Y 位置
    protected int customLayY = privacyY + privacyHeight;

    float customLayHeight;

    protected int dialogOffsetX;
    protected int dialogOffsetY;

    //隐私同意确认对话框
    protected int privacyAlertBtnOffsetX = 185;

    protected int privacyAlertBtnOffsetY = 22;

    protected int privacyAlertBtnWidth = 120;

    protected int privacyAlertBtnHorMargin = 21;


    protected String packageName;
    protected boolean useCustomWebView;

    protected boolean showBackBtn;


    String logBtnBackgroundPath = "login_btn_bg";    //    设置登录按钮背景图片的路径。
    // 隐私协议参数
    protected String privacyOneStr;
    protected String privacyTwoStr;
    protected String privacyOneUrl;
    protected String privacyTwoUrl;

    protected String privacyThreeStr;
    protected String privacyThreeUrl;
    int webViewStatusBarColor = Color.TRANSPARENT;
    protected int checkBoxMarginTop = 0;

    //设置复选框是否隐藏
    protected boolean privacyCheckboxHidden = false;
    protected String uncheckedImgPath = "cbx_unselected";  //	String	设置复选框未选中时图片。
    protected String checkedImgPath = "cbx_selected";    //	String	设置复选框选中时图片。
    protected int checkBoxSize = 17;
    // 取值为ActivityInfo中的屏幕方向常量值，如：ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
    protected int authPageOrientation = ActivityInfo.SCREEN_ORIENTATION_REVERSE_LANDSCAPE;

    protected Drawable logoDrawable;
    protected int logoResId;

    public String getWXAppid() {
        return appid;
    }

    public List<String> getCustomLoginMethods() {
        return customLoginMethods;
    }

    public Drawable getLogoDrawable() {
        return logoDrawable;
    }

    public boolean isShowBackBtn() {
        return showBackBtn;
    }

    public int getCustomLayY() {
        return customLayY;
    }

    public int getLoginBtnY() {
        return loginBtnY;
    }

    public int getPrivacyAlertBtnWidth() {
        return privacyAlertBtnWidth;
    }

    public int getPrivacyAlertBtnHorMargin() {
        return privacyAlertBtnHorMargin;
    }

    public int getPrivacyAlertBtnOffsetY() {
        return privacyAlertBtnOffsetY;
    }

    public int getSwitchAccY() {
        return switchAccY;
    }

    public boolean isSwitchAccHide() {
        return switchAccHide;
    }

    public AliAuthUIConfig(Context context, int orientation, Map<String, Object> map) {
        JSONObject jsonObject = new JSONObject(map);
        if (map.get("logoDrawable") instanceof Drawable) {
            logoDrawable = (Drawable) map.get("logoDrawable");
        }
        init(context, orientation, jsonObject);
    }

    public AliAuthUIConfig(Context context, int orientation, JSONObject data) {
        init(context, orientation, data);
    }

    private void init(Context context, int orientation, JSONObject data) {
        try {
            packageName = context.getPackageName();
            screenWidthDp = AppUtils.px2dp(context, AppUtils.getPhoneWidthPixels(context));
            screenHeightDp = AppUtils.px2dp(context, AppUtils.getPhoneHeightPixels(context));
            screenHeightDp += (int) AppUtils.getNavigationBarHeightInDp((Activity) context);
            dialogW = (int) AppUtils.getDimensionDp(context, R.dimen.dialog_width);
            if (orientation == Configuration.ORIENTATION_PORTRAIT) {
                authPageOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR_PORTRAIT;
                dialogW = Math.min(dialogW, screenWidthDp - (int) (AppUtils.getDimensionDp(context, R.dimen.card_common_margin_hor) * 2));
            } else {
                authPageOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE;

            }
            if (Build.VERSION.SDK_INT == 26) {
                authPageOrientation = ActivityInfo.SCREEN_ORIENTATION_BEHIND;
            }

            // ---------------------UI参数----------------------
            JSONArray customLoginMethodArr = data.optJSONArray("loginMethods");


            appid = data.optString("appid", data.optString("wx_appid", ""));

            showBackBtn = data.optBoolean("showBackBtn", false);

            logoResId = data.optInt("logoResId", 0);
            if (logoResId != 0 && logoDrawable == null) {
                logoDrawable = ContextCompat.getDrawable(context, logoResId);
            }

            useCustomWebView = data.optBoolean("useCustomWebView", true);
            //竖屏参数
            if (orientation == Configuration.ORIENTATION_PORTRAIT) {
                numFieldY = 1;
                sloganY = numFieldY + 42;
                loginBtnY = sloganY + (32);
                privacyY = loginBtnY + loginBtnH + 18;
                customLayY = privacyY + privacyHeight + 13;
                //自定义控件区域Y 位置
                checkBoxMarginTop = 1;
            } else {
                //横屏参数
                checkBoxMarginTop = 0;
            }


            List<String> loginMethods = new ArrayList<>();
            List<String> cm = convertJOSNArrayToArray(customLoginMethodArr);
//            loginMethods.add(LoginMethod.USERNAME);
            if (cm != null) {
                for (int i = 0; i < cm.size(); i++) {
                    String method = cm.get(i);
                    if (LoginMethod.QUICKPHONE.equals(method)) {
                        continue;
                    }
//                    if (LoginMethod.CAPTCHACODE.equals(method) && cm.contains(LoginMethod.USERNAME)) {
//                        continue;
//                    }
                    loginMethods.add(method);
                }
            }
            customLoginMethods = loginMethods;


            customLayHeight = !loginMethods.isEmpty() ? AppUtils.getDimensionDp(context, R.dimen.dp_130) : 50;
            // 隐私协议参数
            privacyOneUrl = data.optString("privacyOneUrl", "");
            privacyOneStr = data.optString("privacyOneStr", TextUtils.isEmpty(privacyOneUrl) ? "" : "《用户协议》");

            privacyTwoUrl = data.optString("privacyTwoUrl", "");
            privacyTwoStr = data.optString("privacyTwoStr", TextUtils.isEmpty(privacyTwoUrl) ? "" : "《隐私政策》");

            privacyThreeUrl = data.optString("privacyThreeUrl", "");
            privacyThreeStr = data.optString("privacyThreeStr", "");

            privacyState = data.optBoolean("privacyState", false);

            loginBtnW = dialogW;

            //对话框高度
            dialogH = (int) (customLayY + customLayHeight); //privacyY
            //自定义协议，调整高度
//            if (!isExistsCustomPrivacy()) {
//                dialogH -= 10;
//            }

//            //隐私协议
//            if (orientation == Configuration.ORIENTATION_PORTRAIT) {
//                privacyY =  dialogH - (isExistsCustomPrivacy() ? 103 : 88);
//            } else {
//                privacyY =  dialogH - (isExistsCustomPrivacy() ? 92 : 79);
//            }


            privacyAlertBtnOffsetX = dialogW - privacyAlertBtnWidth - privacyAlertBtnHorMargin;
            privacyAlertBtnOffsetY = isExistsCustomPrivacy() ? 22 : 42;

            // 2.13.10 版本 dialogOffsetX、dialogOffsetY 算法改成参照左上角了
            if (orientation == Configuration.ORIENTATION_PORTRAIT) {
                dialogOffsetX = (screenWidthDp - dialogW) / 2;
                dialogOffsetY = (screenHeightDp - dialogH) / 2;
                dialogOffsetY += AppUtils.px2dp(context, com.ruixue.utils.AppUtils.getTopDisplayCutout(context)) / 2;
            } else {
                dialogOffsetX = (screenWidthDp - dialogW) / 2 + AppUtils.px2dp(context, com.ruixue.utils.AppUtils.getHorDisplayCutout(context)) / 2;
                dialogOffsetY = (screenHeightDp - dialogH) / 2;
            }
            RXLogger.i("screenWidthDp:" + screenWidthDp + ",screenHeightDp:" + screenHeightDp + ",dialogW:" + dialogW + ",dialogH:" + dialogH);
//            RXLogger.i("uiconfig:" + new Gson().toJson(this));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private boolean isExistsCustomPrivacy() {
        return !TextUtils.isEmpty(privacyOneStr) || !TextUtils.isEmpty(privacyTwoStr) || !TextUtils.isEmpty(privacyThreeStr);
    }

    public List<String> convertJOSNArrayToArray(JSONArray jsonArray) {

        if (jsonArray != null) {
            String[] stringArray = new String[jsonArray.length()];
            for (int i = 0; i < jsonArray.length(); i++) {
                stringArray[i] = jsonArray.optString(i);
            }
            return Arrays.asList(stringArray);
        }
        return null;
    }

    public static AliAuthUIConfig fromMap(Context context, Map<String, Object> map) {
        return new AliAuthUIConfig(context, context.getResources().getConfiguration().orientation, map);
    }


    public AuthRegisterXmlConfig createAuthRegisterXmlConfig(Context context, AuthUIClickListener callback) {
        return new AuthRegisterXmlConfig.Builder().setLayout(R.layout.ali_custom_layout, new AbstractPnsViewDelegate() {
            @Override
            public void onViewCreated(View customView) {
                ImageView imageView = customView.findViewById(R.id.iv_title);
                if (getLogoDrawable() != null) {
                    imageView.setVisibility(View.VISIBLE);
                    imageView.setBackground(getLogoDrawable());
                    customView.findViewById(R.id.tv_title).setVisibility(View.GONE);
                } else {
                    imageView.setVisibility(View.GONE);
                    customView.findViewById(R.id.tv_title).setVisibility(View.VISIBLE);
                }
                View backBtn = findViewById(R.id.btn_back);
                View closeBtn = findViewById(R.id.btn_close);
                ImageUtil.expandTouchArea(closeBtn, 30);


                backBtn.setVisibility(isShowBackBtn() ? View.VISIBLE : View.GONE);
                closeBtn.setVisibility(isShowBackBtn() ? View.GONE : View.VISIBLE);

                backBtn.setOnClickListener(v -> {
                    if (null != callback)
                        callback.onClickClose(700000, "用户点击关闭");
                });
                closeBtn.setOnClickListener(v -> {
                    if (null != callback)
                        callback.onClickClose(700000, "用户点击关闭");

                });

                List<String> loginMethods = getCustomLoginMethods();
                int visible = loginMethods.isEmpty() ? View.GONE : View.VISIBLE;
                int mTop = AppUtils.dp2px(context, getCustomLayY());
                View v = customView.findViewById(R.id.body_view);
                customView.findViewById(R.id.container_other).setVisibility(visible);
                LinearLayout.LayoutParams params = (LinearLayout.LayoutParams) v.getLayoutParams();
                params.height = mTop;
                v.setLayoutParams(params);
                LoginButtonGroup loginButtonGroup = customView.findViewById(R.id.login_btn_group);
                loginButtonGroup.setVisibility(visible);
                if (visible == View.VISIBLE) {
                    loginButtonGroup.setFromOneKey(true);
                    int size = 4;// com.ruixue.utils.AppUtils.isUsePortMatch(context) ? 4 : 3;
                    loginButtonGroup.setLoginMethods(loginMethods, loginMethods.size() > size);
                    loginButtonGroup.setLoginButtonClickListener(method -> {
                        if (null != callback)
                            callback.onClickOtherLogin(method, null);
                    });
                }

            }
        }).build();
    }

    public AuthRegisterXmlConfig createAuthRegisterXmlConfig(AuthUIControlClickListener callback) {
        return new AuthRegisterXmlConfig.Builder().setLayout(R.layout.ali_dialog_action_bar, new AbstractPnsViewDelegate() {
            @Override
            public void onViewCreated(View view) {
                ImageView imageView = view.findViewById(R.id.iv_title);
                if (getLogoDrawable() != null) {
                    imageView.setVisibility(View.VISIBLE);
                    imageView.setBackground(getLogoDrawable());
                    view.findViewById(R.id.tv_title).setVisibility(View.GONE);
                } else {
                    imageView.setVisibility(View.GONE);
                    view.findViewById(R.id.tv_title).setVisibility(View.VISIBLE);
                }
                View backBtn = findViewById(R.id.btn_back);
                View closeBtn = findViewById(R.id.btn_close);
                ImageUtil.expandTouchArea(closeBtn, 30);
//                ViewGroup.MarginLayoutParams closeBtnLayoutParams = (ViewGroup.MarginLayoutParams) closeBtn.getLayoutParams();
//                closeBtnLayoutParams.topMargin = AppUtils.dp2px(getContext(), closeBtnMarginTop);
//                closeBtn.setLayoutParams(closeBtnLayoutParams);

                backBtn.setVisibility(isShowBackBtn() ? View.VISIBLE : View.GONE);
                closeBtn.setVisibility(isShowBackBtn() ? View.GONE : View.VISIBLE);

                backBtn.setOnClickListener(v -> {
                    if (null != callback)
                        callback.onClick("700000", getContext(), "用户点击关闭");
                });
                closeBtn.setOnClickListener(v -> {
                    if (null != callback)
                        callback.onClick("700000", getContext(), "用户点击关闭");
                });
            }
        }).build();
    }

    public AuthUIConfig createAuthUIConfig() {
        AuthUIConfig.Builder config = new AuthUIConfig.Builder()
                // 弹窗属性设置
                .setAuthPageActIn("in_activity", "out_activity").setAuthPageActOut("in_activity", "out_activity").setDialogHeight(dialogH).setDialogWidth(dialogW)//
                .setDialogBottom(false).setScreenOrientation(authPageOrientation).setPageBackgroundPath("ali_login_bg")
                // 隐藏导航栏
                .setNavHidden(true)


                //设置隐私协议参数
                .setPrivacyAlertIsNeedShow(true)//
                .setPrivacyAlertIsNeedAutoLogin(true)//
                .setPrivacyAlertWidth(dialogW)//
                .setPrivacyAlertHeight(184)//
                .setPrivacyAlertMaskIsNeedShow(true)//
                .setPrivacyAlertMaskAlpha(0.5f)//
                .setPrivacyAlertCornerRadiusArray(new int[]{4, 4, 4, 4})//
                .setPrivacyAlertOffsetX(dialogOffsetX)//
                .setPrivacyAlertOffsetY((screenHeightDp - 170) / 2)//
                .setPrivacyAlertBtnBackgroundImgPath("shape_btn_1_normal")//
                .setPrivacyAlertBtnHeigth(38)//
                .setPrivacyAlertBtnWidth(privacyAlertBtnWidth)//
                .setTapPrivacyAlertMaskCloseAlert(false)//
                .setPrivacyAlertBtnContent("同意")//
                .setPrivacyAlertTitleContent("用户协议和隐私政策")//
                .setPrivacyAlertTitleTextSize(18)//
                .setPrivacyAlertTitleColor(Color.BLACK)//
                .setPrivacyAlertContentTextSize(14)//
                .setPrivacyAlertTitleOffsetY(7)//
                .setPrivacyAlertContentVerticalMargin(9)//
                .setPrivacyAlertContentHorizontalMargin(25)//
                .setPrivacyAlertBtnOffsetX(privacyAlertBtnOffsetX)//
                .setPrivacyAlertBtnOffsetY(privacyAlertBtnOffsetY)//
//                .setPrivacyAlertBtnGrivaty(new int[]{14})//
//                .setPrivacyAlertBtnHorizontalMargin(60)//
                .setPrivacyAlertBtnTextColor(Color.WHITE).setPrivacyAlertBtnTextSize(16).setPrivacyAlertCloseBtnShow(false).setLogBtnToastHidden(true)

//                .setPrivacyAlertCloseImagPath("shape_btn_2_normal")


//                .setNavTextColor(Color.parseColor("#000000")).setNavTextSizeDp(18).setNavReturnImgPath("ali_icon_close").setNavReturnImgHeight(20).setNavReturnImgWidth(20).setNavReturnScaleType(ImageView.ScaleType.FIT_CENTER).setNavText("")
////                // 隐藏logo
//                .setLogoHidden(logoDrawable == null)
//                .setLogoImgDrawable(logoDrawable)
//                .setLogoOffsetY(-100)
//                .setLogoScaleType(ImageView.ScaleType.CENTER_INSIDE)
                // 设置电话号码显示
                .setNumFieldOffsetY(numFieldY).setNumberSizeDp(numTxtSize)
                // 运营商信息
                .setSloganTextSizeDp(sloganTxtSize).setSloganOffsetY(sloganY)
                //
                .setStatusBarHidden(true).setDialogOffsetX(dialogOffsetX).setDialogOffsetY(dialogOffsetY).setBottomNavColor(Color.TRANSPARENT)
                // 登录按钮
                .setLogBtnOffsetY(loginBtnY).setLogBtnWidth(loginBtnW).setLogBtnHeight(loginBtnH).setLogBtnText(loginBtnTxt).setLogBtnTextSizeDp(loginBtnTxtSize).setLogBtnBackgroundPath(logBtnBackgroundPath)
                // 切换其它登录方式
                .setSwitchAccHidden(switchAccHide).setSwitchAccText("更多登录方式").setSwitchAccTextColor(switchAccTextColor).setSwitchOffsetY(switchAccY).setSwitchAccTextSizeDp(switchAccTxtSize)
                //设置隐私条款名称颜色（基础文字颜色，协议文字颜色）。
                .setAppPrivacyColor(Color.BLACK, Color.parseColor("#20c0b3")).setProtocolGravity(Gravity.START)
                //设置web

                .setPackageName(packageName).setWebNavColor(Color.parseColor("#ffffff")).setWebNavTextColor(Color.parseColor("#000000")).setWebHiddeProgress(true).setWebNavReturnImgPath("ali_return")
//                设置协议页状态栏颜色（系统版本5.0以上可设置），不设置则与授权页设置一致。
                .setWebViewStatusBarColor(webViewStatusBarColor).setCheckBoxMarginTop(checkBoxMarginTop).setPrivacyState(privacyState).setCheckBoxHeight(checkBoxSize).setCheckBoxWidth(checkBoxSize).setCheckboxHidden(privacyCheckboxHidden).setPrivacyTextSize(privacyTxtSize).setPrivacyOffsetY(privacyY);

        if (useCustomWebView) {
            config.setProtocolAction("com.aliqin.mytel.protocolWeb");
        }
        if (!TextUtils.isEmpty(privacyOneStr) && !TextUtils.isEmpty(privacyOneUrl)) {
            //设置开发者隐私条款1名称和URL（名称，URL）。
            config.setAppPrivacyOne(privacyOneStr, privacyOneUrl + (privacyOneUrl.contains("?") ? "&" : "?" + "title=") + privacyOneStr);
        }
        if (!TextUtils.isEmpty(privacyTwoStr) && !TextUtils.isEmpty(privacyTwoUrl)) {
            config.setAppPrivacyTwo(privacyTwoStr, privacyTwoUrl + (privacyTwoUrl.contains("?") ? "&" : "?" + "title=") + privacyTwoStr);
        }
        if (!TextUtils.isEmpty(privacyThreeStr) && !TextUtils.isEmpty(privacyThreeUrl)) {
            config.setAppPrivacyThree(privacyThreeStr, privacyThreeUrl + (privacyThreeUrl.contains("?") ? "&" : "?" + "title=") + privacyThreeStr);
        }

        if (!TextUtils.isEmpty(checkedImgPath)) {
            //设置复选框选中时图片。
            config.setCheckedImgPath(checkedImgPath);

        }
        if (!TextUtils.isEmpty(uncheckedImgPath)) {
            //设置复选框未选中时图片。
            config.setUncheckedImgPath(uncheckedImgPath);
        }

        return config.create();
    }
}
