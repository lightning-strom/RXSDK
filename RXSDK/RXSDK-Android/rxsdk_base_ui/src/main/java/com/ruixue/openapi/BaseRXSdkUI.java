package com.ruixue.openapi;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.RXStringCallback;
import com.ruixue.callback.RXUICallback;
import com.ruixue.legal.LegalData;
import com.ruixue.ui.R;
import com.ruixue.unity.UnityBaseCommonFun;
import com.ruixue.unity.UnityRXRequestCallback;
import com.ruixue.unity.UnityUICommonFun;
import com.ruixue.view.AppPrivacyH5View;
import com.ruixue.view.AppPrivacyView;
import com.ruixue.view.AppStatementView;
import com.ruixue.view.CaptchaCommonHelper;
import com.ruixue.view.CaptchaVerifyView;
import com.ruixue.view.ChangePasswordView;
import com.ruixue.view.DeregisterHelper;
import com.ruixue.view.DeregisterRecallView;
import com.ruixue.view.ForgotPasswordHelper;
import com.ruixue.view.LimitTipView;
import com.ruixue.view.LoginViewMgr2;
import com.ruixue.view.PermissionView;
import com.ruixue.view.RXH5View;
import com.ruixue.view.RXHelperCenter;
import com.ruixue.view.RXServiceView;
import com.ruixue.view.RXWebView;
import com.ruixue.view.RealAuthH5View;
import com.ruixue.view.RealNameView;
import com.ruixue.view.ShareHelper;
import com.ruixue.view.UserCenterView;
import com.ruixue.view.mail.MailListView;
import com.ruixue.view.notice.MaintainNoticeCallback;
import com.ruixue.view.notice.NoticeCallback;
import com.ruixue.view.notice.NoticeView;
import com.ruixue.view.notice.bean.NoticeItemBean;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import kotlin.Deprecated;

/**
 * 瑞雪 SDK UI 接口类
 */
public class BaseRXSdkUI implements IRXSdkUI {

    public IRXView loginUIOS(Activity activity, LoginUIConfig config, Map<String, Object> map, RXUICallback loginCallback) {
        return LoginViewMgr2.getInstance().createLoginView(activity, config, map, loginCallback);
    }

    public IRXView loginUIOS(Activity activity, LoginUIConfig config, Map<String, Object> map, RXUICallback loginCallback, RXUICallback registerCallback) {
        return LoginViewMgr2.getInstance().createLoginView(activity, config, map, loginCallback, registerCallback);
    }

    /**
     * 用户中
     * @param activity 页面上下文
     * @param map      用户中心接口透传参数
     * @param callback 回调
     * @return IRXView
     */
    @Override
    public IRXView userCenterUI(Activity activity, Map<String, Object> map, RXUICallback callback) {
        return UserCenterView.create(activity).setCustomParams(map).setCallback(callback);
    }

    public IRXView unityUserCenterUI(Activity activity, Map<String, Object> map, UnityRXRequestCallback callback) {
        return UnityUICommonFun.runOnUIHasTurn(activity, () -> userCenterUI(activity, map, UnityUICommonFun.convertRXUICallback(callback)));
    }

    /**
     * 用户中心
     * @param activity           activity
     * @param rxUserCenterConfig {@link  RXUserCenterConfig} 基础配置
     * @param callback           callback
     */
    public IRXView userCenterUI(Activity activity, RXUserCenterConfig rxUserCenterConfig, RXUICallback callback) {
        return UserCenterView.create(activity).setUserCenterConfig(rxUserCenterConfig).setCallback(callback);
    }

    /**
     * 帮助中心
     * @param activity           activity
     * @param rxUserCenterConfig {@link  RXUserCenterConfig} 基础配置
     * @param callback           callback
     */
    public IRXView helperCenterUI(Activity activity, RXUserCenterConfig rxUserCenterConfig, RXUICallback callback) {
        return RXHelperCenter.create(activity).setUserCenterConfig(rxUserCenterConfig).setCallback(callback);
    }

    @Override
    public IRXView helperCenterUI(Activity activity, Map<String, Object> map, RXUICallback callback) {
        return RXHelperCenter.create(activity).setCustomParams(map).setCallback(callback);
    }

    public IRXView unityHelperCenterUI(Activity activity, Map<String, Object> map, UnityRXRequestCallback callback) {
        return UnityUICommonFun.runOnUIHasTurn(activity, () -> helperCenterUI(activity, map, UnityUICommonFun.convertRXUICallback(callback)));
    }

    @java.lang.Deprecated
    public IRXView chatServiceUI(Activity activity, Map<String, Object> map, RXUICallback callback) {
        return chatServiceUI(activity, map, false, callback);
    }

    public IRXView unityChatServiceUI(Activity activity, Map<String, Object> map, UnityRXRequestCallback callback) {
        return UnityUICommonFun.runOnUIHasTurn(activity, () -> chatServiceUI(activity, map, UnityUICommonFun.convertRXUICallback(callback)));
    }

    //滑块验证码ui
    @Override
    public IRXView captchaVerifyUI(Activity activity, int appid, RXUICallback callback) {
        return new CaptchaVerifyView(activity, null).setAppid(appid).setCallback(callback);
    }

    public IRXView unityCaptchaVerifyUI(Activity activity, int appid, UnityRXRequestCallback callback) {
        return UnityUICommonFun.runOnUIHasTurn(activity, () -> captchaVerifyUI(activity, appid, UnityUICommonFun.convertRXUICallback(callback)));
    }


    /**
     * @param activity 上下文对象
     * @param map      自定义参数
     * @param callback 回调
     * @return IRXView
     */
    @Override
    public IRXView chatServiceUI(Activity activity, Map<String, Object> map, boolean isLightTheme, RXUICallback callback) {
        return RXServiceView.create(activity, map, isLightTheme).setCallback(callback);
    }

    @Override
    public IRXView applyForDeregisterUI(Activity activity, Map<String, Object> map, RXUICallback callback) {
        String url = RuiXueSdk.getFirstBaseUrl() + (RuiXueSdk.isOasVersion() ? "static/passport/#/oversea/unregistercondition" : "static/passport/#/user/unregistercondition");
        return RXWebViewHelper.createWebView(activity, url, map, callback);
    }

    /**
     * 申请注销
     * @param activity           activity
     * @param rxUserCenterConfig {@link  RXUserCenterConfig} 自定义参数
     * @param callback           callback
     */
    public IRXView applyForDeregisterUI(Activity activity, RXUserCenterConfig rxUserCenterConfig, RXUICallback callback) {
        String url = RuiXueSdk.getFirstBaseUrl() + (RuiXueSdk.isOasVersion() ? "static/passport/#/oversea/unregistercondition" : "static/passport/#/user/unregistercondition");
        return RXWebViewHelper.createWebView(activity, url, rxUserCenterConfig != null ? rxUserCenterConfig.getCustomParams() : null, callback);
    }

    public IRXView unityApplyForDeregisterUI(Activity activity, Map<String, Object> map, UnityRXRequestCallback callback) {
        return UnityUICommonFun.runOnUIHasTurn(activity, () -> applyForDeregisterUI(activity, map, UnityUICommonFun.convertRXUICallback(callback)));
    }

    /**
     * 找回密码 忘记密码UI
     */
    @Override
    public IRXView findPassWordUI(Activity activity, RXUICallback callback) {
        return findPassWordUI(activity, null, callback);
    }

    @Override
    public IRXView findPassWordUI(Activity activity, Map<String, Object> map, RXUICallback callback) {
        return ForgotPasswordHelper.createDialog(activity, map, callback);
    }

    public IRXView getBackPassword(Activity activity, Map<String, Object> map, RXUICallback callback) {
        return findPassWordUI(activity, map, callback);
    }

    public IRXView unityFindPassWordUI(Activity activity, Map<String, Object> map, UnityRXRequestCallback callback) {
        return UnityUICommonFun.runOnUIHasTurn(activity, () -> findPassWordUI(activity, map, UnityUICommonFun.convertRXUICallback(callback)));
    }


    /**
     * 注册UI
     * @param activity     activity
     * @param registerType 注册界面类型 {@link Constants.RegisterType}
     * @param callback     callback
     */

    public IRXView registerUI(Activity activity, int registerType, RXUICallback callback) {
        return CaptchaCommonHelper.registerUI(activity, new HashMap<>(), registerType, callback);
    }

    public IRXView registerUI(Activity activity, Map<String, Object> map, int registerType, RXUICallback callback) {
        return CaptchaCommonHelper.registerUI(activity, map, registerType, callback);
    }

    /**
     * 注销账号界面
     */

    @java.lang.Deprecated
    public IRXView deregisterUI(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        return DeregisterHelper.deregisterUI(activity, map, callback);
    }

    /**
     * 修改密码UI
     */

    public IRXView changePwdUI(Activity activity, boolean isPasswordSet, RXJSONCallback callback) {
        return ChangePasswordView.create(activity, callback).setIsPasswordSet(isPasswordSet);
    }


    /**
     * 绑定手机号UI
     */

    public IRXView bindPhoneUI(Activity activity, RXUICallback callback) {

        return RXH5View.create(activity, RXH5View.H5ViewType.BindPhone).setCallback(callback);

//        return CaptchaCommonHelper.bindPhoneUI(activity, new HashMap<>(), callback);
    }

    public IRXView unityBindPhoneUI(Activity activity, UnityRXRequestCallback callback) {
        return UnityUICommonFun.runOnUIHasTurn(activity, () -> bindPhoneUI(activity, UnityUICommonFun.convertRXUICallback(callback)));
    }


    /**
     * 绑定邮箱
     */

    public IRXView bindEmailUI(Activity activity, RXUICallback callback) {
        return RXH5View.create(activity, RXH5View.H5ViewType.BindEmail).setCallback(callback);
//        return CaptchaCommonHelper.bindEmailUI(activity, callback);
    }

    public IRXView unityBindEmailUI(Activity activity, UnityRXRequestCallback callback) {
        return UnityUICommonFun.runOnUIHasTurn(activity, () -> bindEmailUI(activity, UnityUICommonFun.convertRXUICallback(callback)));
//        return CaptchaCommonHelper.bindEmailUI(activity, callback);
    }


    /**
     * 解绑手机
     */
    @java.lang.Deprecated
    public IRXView unBindPhoneUI(Activity activity, RXUICallback callback) {
        return CaptchaCommonHelper.unBindPhoneUI(activity, callback);
    }

    /**
     * 解绑邮箱
     */
    @java.lang.Deprecated
    public IRXView unBindEmailUI(Activity activity, RXUICallback callback) {
        return CaptchaCommonHelper.unBindEmailUI(activity, callback);
    }

    /**
     * 实名认证
     * @param activity   activity
     * @param cancelable 是否可取消关闭
     * @param callback   回调函数
     */
    @Override
    public IRXView realAuthUI(Activity activity, boolean cancelable, RXJSONCallback callback) {
        return RealNameView.create(activity, cancelable, callback);
    }

    /**
     * 实名认证 H5 界面
     * @param activity   activity
     * @param region     地区
     * @param cancelable 是否可取消关闭
     * @param callback   回调函数
     */
    @Override
    public IRXView realAuthH5UI(Activity activity, String region, boolean cancelable, RXJSONCallback callback) {
        return RealAuthH5View.create(activity, region, cancelable, callback);
    }

    public IRXView unityRealAuthUI(Activity activity, boolean cancelable, UnityRXRequestCallback callback) {
        return UnityUICommonFun.runOnUIHasTurn(activity, () -> realAuthUI(activity, cancelable, UnityBaseCommonFun.convertCallback(callback)));
    }

    @Deprecated(message = "Use realAuthUI alternative")
    public IRXView realNameUI(Activity activity, boolean cancelable, RXJSONCallback callback) {
        return realAuthUI(activity, cancelable, callback);
    }

    /**
     * @param activity   activity
     * @param titleStr   标题
     * @param contextStr 内容
     * @param buttonTxt  按钮文本
     * @param callback   回调函数
     */
    @Override
    public IRXView limitUI(Activity activity, String titleStr, String contextStr, String buttonTxt, RXJSONCallback callback) {
        return LimitTipView.create(activity, titleStr, contextStr, buttonTxt, callback);
    }

    public IRXView unityLimitUI(Activity activity, String titleStr, String contextStr, String buttonTxt, UnityRXRequestCallback callback) {
        return UnityUICommonFun.runOnUIHasTurn(activity, () -> limitUI(activity, titleStr, contextStr, buttonTxt, UnityBaseCommonFun.convertCallback(callback)));
    }

    /**
     * 防沉迷
     * @param activity   activity
     * @param titleStr   标题
     * @param contextStr 内容
     * @param buttonTxt  按钮文本
     * @param callback   回调函数
     */
    public IRXView antiAdditionView(Activity activity, String titleStr, String contextStr, String buttonTxt, RXJSONCallback callback) {
        return LimitTipView.create(activity, titleStr, contextStr, buttonTxt, callback);
    }


    @Override
    public IRXView userPrivacyPolicy(Context activity, LegalData legalData, String key, RXJSONCallback callback) {
        return AppPrivacyView.create(activity, legalData != null ? legalData.getTerm(key) : null, callback).setBigSize();
    }

    @Override
    public IRXView userPrivacyPolicy(Context activity, String title, String content, RXJSONCallback callback) {
        return AppPrivacyView.create(activity, content, callback).setTitle(title).setBigSize().setContentTextSize(15);
    }

    @Override
    public IRXView userPrivacyPolicy(Context activity, String title, String content, Collection<String> keyList, RXJSONCallback callback) {
        return AppPrivacyView.create(activity, content, callback).setTitle(title).setBigSize().setContentTextSize(15).setKeyList(keyList);
    }

    /**
     * 用户协议和隐私界面
     * @param activity 应用上下文
     * @param key      默认需要展示的协议条款key
     * @param keyList  需要展示的协议条款key列表
     */
    @Override
    public IRXView protocolView(Activity activity, String key, List<String> keyList) {
        return AppPrivacyH5View.create(activity, key, keyList);
    }

    public IRXView unityProtocolView(Activity activity, String key, List<String> keyList) {
        return UnityUICommonFun.runOnUIHasTurn(activity, () -> protocolView(activity, key, keyList));
    }


    @java.lang.Deprecated
    public IRXView permissionUI(Activity activity, LegalData legalData, RXJSONCallback callback) {
        return PermissionView.create(activity, legalData != null ? legalData.getPermissions() : null, callback);
    }


    @Override
    public IRXView statementUI(Activity activity, LegalData legalData, String key) {
        return AppStatementView.create(activity, legalData, key);
    }

    /**
     * 撤销注销
     * @param activity        activity
     * @param isLoginContinue true继续登录，false退出登录
     * @param callback        callback
     */
    public IRXView destroyAccountStatusView(Activity activity, boolean isLoginContinue, RXJSONCallback callback) {
        return DeregisterRecallView.create(activity).setLoginContinue(isLoginContinue).setCallback(callback);
    }

    public IRXView unityDestroyAccountStatusView(Activity activity, boolean isLoginContinue, UnityRXRequestCallback callback) {
        return UnityUICommonFun.runOnUIHasTurn(activity, () -> destroyAccountStatusView(activity, isLoginContinue, UnityBaseCommonFun.convertCallback(callback)));
    }

    /**
     * 撤销注销
     * @param activity     activity
     * @param okButtonText 设置右侧按钮文本，默认继续登录
     * @param callback     callback
     */
    @Override
    public IRXView destroyAccountStatusView(Activity activity, String okButtonText, RXJSONCallback callback) {
        return DeregisterRecallView.create(activity).setContinueText(okButtonText).setCallback(callback);
    }

    public IRXView unityDestroyAccountStatusView(Activity activity, String okButtonText, UnityRXRequestCallback callback) {
        return UnityUICommonFun.runOnUIHasTurn(activity, () -> destroyAccountStatusView(activity, okButtonText, UnityBaseCommonFun.convertCallback(callback)));
    }

    @Override
    public void showShareUI(Activity activity, String shareType, Map<String, Object> map, RXJSONCallback callback) {
        ShareHelper.showShareDialog(activity, shareType, map, callback);
    }

    @Override
    public IRXView openWebView(Activity activity, String url, String title) {
        RXWebView rxWebView = RXWebView.create(activity, url);
        rxWebView.setTitle(title);
        return rxWebView;
    }

    public IRXView showMailCenter(Activity activity, String userId) {
        return MailListView.create(activity, userId);
    }

    public IRXView unityShowMailCenter(Activity activity, String userId) {
        return UnityUICommonFun.runOnUIHasTurn(activity, () -> showMailCenter(activity, userId));
    }

    /**
     * 显示公告UI
     * @param context      context
     * @param limit        读取条数，limit > 0
     * @param linkCallback 回调
     */
    public void showAnnounceView(Context context, int limit, NoticeCallback linkCallback) {
        if (limit < 1) {
            linkCallback.hasAnnounceUI(false);
            return;
        }
        NoticeView.create(context, limit, linkCallback).show();
    }

    public void unityShowAnnounceView(Activity activity, int limit, NoticeCallback linkCallback) {
        UnityUICommonFun.runOnUINoTurn(activity, () -> showAnnounceView(activity, limit, linkCallback));
    }

    /**
     * @param context      context
     * @param version      客户端版本号，3段或4段
     * @param region       地区码
     * @param queryMap     type 脚本类型 默认json， 可选 lua， u3d
     *                     format 输出文件后缀，默认json，可选lua
     * @param isShowUI     是否显示UI
     * @param linkCallback 回调
     */
    public void showUpdateAppView(Context context, String version, String region, Map<String, Object> queryMap, boolean isShowUI, MaintainNoticeCallback linkCallback) {
        RuiXueSdk.getRXSdkApi().updateApp(version, region, queryMap, new RXStringCallback() {
            @Override
            public void onSuccess(@Nullable String data) {
                boolean isResolveData = false;
                try {
                    if (queryMap.isEmpty() || "json".equals(queryMap.get("type")) || "u3d".equals(queryMap.get("type")) || "json".equals(queryMap.get("format")) || "u3d".equals(queryMap.get("format"))) {
                        isResolveData = true;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                handleMaintainView(context, isResolveData, data, isShowUI, linkCallback);
            }

            @Override
            public void onFailed(int code, String msg, @Nullable String traceId) {
                if (linkCallback != null) {
                    linkCallback.hasAnnounceUI(false);
                    linkCallback.onFailed(code, msg, traceId);
                }
            }
        });
    }

    public void UnityShowUpdateAppView(Activity activity, String version, String region, Map<String, Object> queryMap, boolean isShowUI, MaintainNoticeCallback linkCallback) {
        UnityUICommonFun.runOnUINoTurn(activity, () -> showUpdateAppView(activity, version, region, queryMap, isShowUI, linkCallback));
    }

    /**
     * @param context      context
     * @param version      客户端版本号， 3段或4段
     * @param region       地区码， 默认0
     * @param type         脚本类型 默认js， 可选lua， u3d
     * @param queryMap     queryMap games {"games:{"游戏id": 客户端游戏版本}"}
     *                     activities {"activities":{"活动别名": 客户端活动版本}}
     * @param isShowUI     是否显示UI
     * @param linkCallback 回调
     */
    public void showCheckUpdateAppView(Context context, String version, String region, String type, Map<String, Object> queryMap, boolean isShowUI, MaintainNoticeCallback linkCallback) {

        RuiXueSdk.getRXSdkApi().checkUpdateApp(version, region, type, queryMap, new RXStringCallback() {
            @Override
            public void onSuccess(@Nullable String data) {
                boolean isResolveData = false;
                try {
                    if (TextUtils.isEmpty(type)) {
                        isResolveData = true;
                    }
                    if ("js".equals(type) || "u3d".equals(type)) {
                        isResolveData = true;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                handleMaintainView(context, isResolveData, data, isShowUI, linkCallback);
            }

            @Override
            public void onFailed(int code, String msg, @Nullable String traceId) {
                if (linkCallback != null) {
                    linkCallback.hasAnnounceUI(false);
                    linkCallback.onFailed(code, msg, traceId);
                }
            }
        });
    }

    public void unityShowCheckUpdateAppView(Activity activity, String version, String region, String type, Map<String, Object> queryMap, boolean isShowUI, MaintainNoticeCallback linkCallback) {
        UnityUICommonFun.runOnUINoTurn(activity, () -> showCheckUpdateAppView(activity, version, region, type, queryMap, isShowUI, linkCallback));
    }

    private void handleMaintainView(Context context, boolean isResolveData, String data, boolean isShowUI, MaintainNoticeCallback linkCallback) {
        Log.d("RXSdkUI", "更新内容：" + data);

        if (linkCallback != null) {
            linkCallback.onSuccess(data);
        }

        if (!isResolveData) {
            if (linkCallback != null) {
                linkCallback.hasAnnounceUI(false);
            }
            return;
        }

        if (!isShowUI) {
            if (linkCallback != null) {
                linkCallback.hasAnnounceUI(false);
            }
            return;
        }

        if (TextUtils.isEmpty(data)) {
            if (linkCallback != null) {
                linkCallback.hasAnnounceUI(false);
            }
            return;
        }

        try {
            JSONObject jsonObject = new JSONObject(data);

            int code = jsonObject.optInt("code");


            if (code != 0) {
                if (linkCallback != null) {
                    linkCallback.hasAnnounceUI(false);
                }
                return;
            }

            NoticeItemBean.DataDTO dataDTO = new NoticeItemBean.DataDTO();
            String contentStr = jsonObject.optString("data");

            if (TextUtils.isEmpty(contentStr)) {
                if (linkCallback != null) {
                    linkCallback.hasAnnounceUI(false);
                }
                return;
            }

            JSONObject dataObject = new JSONObject(contentStr);

            int upgrade = dataObject.optInt("upgrade");
            if (upgrade != 2) {
                if (linkCallback != null) {
                    linkCallback.hasAnnounceUI(false);
                }
                return;
            }

            String title = "";
            try {
                title = dataObject.optString("maintain_title");
            } catch (Exception e) {
                e.printStackTrace();
            }

            if (TextUtils.isEmpty(title)) {
                title = context.getResources().getString(R.string.announce_maintain_title);
            }

            String content = dataObject.optString("maintain");

            if (TextUtils.isEmpty(content)) {
                if (linkCallback != null) {
                    linkCallback.hasAnnounceUI(false);
                }
                return;
            }

            dataDTO.setTitle(title);
            dataDTO.setContent(content);
            dataDTO.setContentType(1);

            List<NoticeItemBean.DataDTO> list = new ArrayList<>();
            list.add(dataDTO);

            NoticeView.maintainCreate(context, list, new NoticeCallback() {
                @Override
                public void onLink(String link) {
                    if (linkCallback != null) {
                        linkCallback.onLink(link);
                    }
                }

                @Override
                public void hasAnnounceUI(boolean isHas) {
                    if (linkCallback != null) {
                        linkCallback.hasAnnounceUI(isHas);
                    }
                }
            }).show();
        } catch (Exception e) {
            if (linkCallback != null) {
                linkCallback.hasAnnounceUI(false);
            }
            e.printStackTrace();
        }
    }

}
