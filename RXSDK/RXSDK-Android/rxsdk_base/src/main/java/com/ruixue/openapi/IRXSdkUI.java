package com.ruixue.openapi;

import android.app.Activity;
import android.content.Context;

import com.ruixue.RXJSONCallback;
import com.ruixue.callback.RXUICallback;
import com.ruixue.legal.LegalData;

import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/8/18
 */
public interface IRXSdkUI {

    IRXView userCenterUI(Activity activity, Map<String, Object> map, RXUICallback callback);

    IRXView helperCenterUI(Activity activity, Map<String, Object> map, RXUICallback callback);

    IRXView chatServiceUI(Activity activity, Map<String, Object> map, boolean isLightTheme, RXUICallback callback);

    IRXView captchaVerifyUI(Activity activity, int appid, RXUICallback callback);

    IRXView applyForDeregisterUI(Activity activity, Map<String, Object> map, RXUICallback callback);

    /**
     * 找回密码
     */
    @Deprecated
    IRXView findPassWordUI(Activity activity, RXUICallback callback);

    /**
     * @param activity activity
     * @param map      username 默认填充的账号 [可选]
     *                 account_type 1-普通账号 ，2-手机号 ,3-邮箱 [可选 默认 2]
     *                 password_hint 输入密码提示文本 [可选]
     * @param callback callback
     */
    IRXView findPassWordUI(Activity activity, Map<String, Object> map, RXUICallback callback);


    /**
     * 实名认证界面
     * @param activity   activity
     * @param cancelable 是否可取消关闭
     * @param callback   回调函数
     */
    IRXView realAuthUI(Activity activity, boolean cancelable, RXJSONCallback callback);

    /**
     * 实名认证 H5 界面
     * @param activity   activity
     * @param region     地区
     * @param cancelable 是否可取消关闭
     * @param callback   回调函数
     */
    IRXView realAuthH5UI(Activity activity, String region, boolean cancelable, RXJSONCallback callback);

    /**
     * 限制提示界面
     * @param activity   activity
     * @param titleStr   标题
     * @param contextStr 内容
     * @param callback   回调函数
     */
    IRXView limitUI(Activity activity, String titleStr, String contextStr, String buttonTxt, RXJSONCallback callback);

    /**
     * 用户协议和隐私协议界面
     * @param activity  activity
     * @param legalData 法务数据
     * @param key       Terms key
     * @param callback  callback
     */
    IRXView userPrivacyPolicy(Context activity, LegalData legalData, String key, RXJSONCallback callback);

    /**
     * 用户协议和隐私协议界面
     * @param title    标题
     * @param content  协议内容
     * @param callback callback
     */
    IRXView userPrivacyPolicy(Context activity, String title, String content, RXJSONCallback callback);

    IRXView userPrivacyPolicy(Context activity, String title, String content, Collection<String> keyList, RXJSONCallback callback);


    IRXView protocolView(Activity activity, String key, List<String> keyList);


    /**
     * 打开声明界面
     * @param activity  activity
     * @param legalData 法务数据
     * @param key       Terms key
     */
    IRXView statementUI(Activity activity, LegalData legalData, String key);

    IRXView destroyAccountStatusView(Activity activity, String okButtonText, RXJSONCallback callback);

    void showShareUI(Activity activity, String shareType, Map<String, Object> map, RXJSONCallback callback);

    /**
     * 打开 WebView 界面
     * @param activity activity
     * @param url      链接
     * @param title    标题
     */
    IRXView openWebView(Activity activity, String url, String title);

}
