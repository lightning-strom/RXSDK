package com.ruixue.demo.api.module;

import android.app.Activity;
import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.google.gson.GsonBuilder;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.RXUICallback;
import com.ruixue.demo.GlobalConfig;
import com.ruixue.demo.api.ButtonModule;
import com.ruixue.demo.callback.DemoCallbacks;
import com.ruixue.demo.config.DemoTestConfig;
import com.ruixue.demo.dialog.EditDialog;
import com.ruixue.demo.dialog.OnDialogClickListener;
import com.ruixue.demo.v2.DemoManager;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXSdkUI;
import com.ruixue.openapi.RXUserCenterConfig;
import com.ruixue.openapi.RXWebViewHelper;
import com.ruixue.passport.LoginData;
import com.ruixue.passport.LoginMethod;
import com.ruixue.qipai.R;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.LoadingDialog;
import com.ruixue.view.ChangePasswordView;
import com.ruixue.view.ChangePhoneView;
import com.ruixue.view.DeregisterHelper;
import com.ruixue.view.RXHelperCenter;

import java.util.HashMap;
import java.util.Map;

public class UserModule implements ButtonModule {

    private final Activity activity;
    private final DemoManager.ResultCallback callback;
    private final RXUICallback jsonCallback;

    public UserModule(@NonNull Activity activity,
                      @NonNull DemoManager.ResultCallback callback,
                      @NonNull RXUICallback jsonCallback) {
        this.activity = activity;
        this.callback = callback;
        this.jsonCallback = jsonCallback;
    }

    @Override
    public void registerButtons(Registrar registrar) {
        // 用户信息
        registrar.register(R.id.getuserinfo, this::getUserInfo);
        registrar.register(R.id.updateuser, this::updateUser);
        registrar.register(R.id.user_center, this::showUserCenter);
        registrar.register(R.id.user_center_config, this::showUserCenterByConfig);
        registrar.register(R.id.user_helper_center, this::showHelperCenter);
        registrar.register(R.id.user_helper_center_config, this::showHelperCenterByConfig);
        registrar.register(R.id.user_service, this::showChatService);
        registrar.register(R.id.get_logindata, this::showLoginData);

        // 提示弹窗
        registrar.register(R.id.limit_ui, this::showLimitTip);
        registrar.register(R.id.anti_addition_view, this::showAntiAddition);

        // 绑定/解绑
        registrar.register(R.id.bindphone, () -> RXSdkUI.getInstance().bindPhoneUI(activity, jsonCallback).show());
        registrar.register(R.id.unbindphone, () -> RXSdkUI.getInstance().unBindPhoneUI(activity, jsonCallback).show());
        registrar.register(R.id.bindemail, () -> RXSdkUI.getInstance().bindEmailUI(activity, jsonCallback).show());
        registrar.register(R.id.unbindemail, () -> RXSdkUI.getInstance().unBindEmailUI(activity, jsonCallback).show());
        registrar.register(R.id.bind_account_scene_bind, () -> bindAccount(LoginMethod.WECHAT, "bind"));
        registrar.register(R.id.bind_account_scene_authorization,
                () -> bindAccount(LoginMethod.WECHAT, "authorization"));

        // 密码
        registrar.register(R.id.updatepassword, this::changePasswordUI);
        registrar.register(R.id.forgot_password, this::showForgotPassword);
        registrar.register(R.id.forgot_password_simple,
                () -> RXSdkUI.getInstance().findPassWordUI(activity, jsonCallback).show());
        registrar.register(R.id.change_phone,
                () -> ChangePhoneView.create(activity, jsonCallback).setShowOldPhoneInput(true).show());

        // 实名认证
        registrar.register(R.id.realnameui, () -> RXSdkUI.getInstance().realAuthUI(activity, true, jsonCallback).show());
        registrar.register(R.id.realnameh5ui,
                () -> RXSdkUI.getInstance().realAuthH5UI(activity, "vn", true, jsonCallback).show());
        registrar.register(R.id.iifaa_validate,
                () -> RXSdkApi.getInstance().getIIFAAResultWithRetryCount(3, DemoCallbacks.json(callback, "IIFAA查询")));

        // 注销
        registrar.register(R.id.deregister_cancel,
                () -> RXSdkApi.getInstance().deregisterCancel(null, jsonCallback));
        registrar.register(R.id.deregister_ui, this::showDeregisterUI);
        registrar.register(R.id.deregister_ui_config, this::showDeregisterUIByConfig);
        registrar.register(R.id.deregister, this::showDeregisterDialog);
        registrar.register(R.id.deregister_h5, this::showDeregisterH5);
        registrar.register(R.id.destroy_account_recall,
                () -> RXSdkUI.getInstance().destroyAccountStatusView(activity, true, jsonCallback));
        registrar.register(R.id.destroy_account_recall_text,
                () -> RXSdkUI.getInstance().destroyAccountStatusView(activity, "继续登录", jsonCallback));

        // 邮件
        registrar.register(R.id.mail_view, () -> {
            LoginData data = RuiXueSdk.getLoginData();
            if (data != null) {
                RXSdkUI.getInstance().showMailCenter(activity, data.getCp_user_id()).show();
            } else {
                callback.onToast("请先登录");
            }
        });

        // 客服
        registrar.register(R.id.service_unread_count,
                () -> RuiXueSdk.getApi().getServiceChatUnreadCount(DemoCallbacks.request(callback, "客服未读")));
        registrar.register(R.id.clear_service_unread,
                () -> RuiXueSdk.getApi().clearServiceChatUnreadCount(DemoCallbacks.request(callback, "清除未读")));

        // 反馈
        registrar.register(R.id.feedback_list, () -> RXSdkApi.getInstance().getFeedbackKindList(jsonCallback));
        registrar.register(R.id.feedback_create, this::createFeedback);
        registrar.register(R.id.feedback_update, this::updateFeedback);
    }

    // ==================== 用户信息 ====================

    private void getUserInfo() {
        RXSdkApi.getInstance().getUserInfo(jsonCallback);
    }

    private void updateUser() {
        Map<String, Object> updateUser = new HashMap<>();
        updateUser.put("avatarurl", DemoTestConfig.DEFAULT_AVATAR_URL);
        updateUser.put("sex", 0);
        updateUser.put("nickname", "测试用户");
        RXSdkApi.getInstance().updateUserInfo(updateUser, jsonCallback);
    }

    private void showUserCenter() {
        RXSdkUI.getInstance().userCenterUI(activity, buildCpDataMap(), jsonCallback).show();
    }

    private void showUserCenterByConfig() {
        RXUserCenterConfig config = buildUserCenterConfig();
        Map<String, Object> btnMap = new HashMap<>();
        btnMap.put("btns", new String[]{"real_name", "privacy_policy", "acount_cancel", "phone_management", "change_pwd"});
        config.setConfigParams(btnMap);
        RXSdkUI.getInstance().userCenterUI(activity, config, jsonCallback).show();
    }

    private void showHelperCenter() {
        Map<String, Object> m = new HashMap<>();
        m.put("appid", GlobalConfig.getWxAppId());
        RXHelperCenter.create(activity)
                .setSyncParams(m)
                .setLightTheme(!AppUtils.isDarkMode(activity))
                .clearCache(activity)
                .show();
    }

    private void showHelperCenterByConfig() {
        RXSdkUI.getInstance().helperCenterUI(activity, buildUserCenterConfig(), jsonCallback).show();
    }

    /** cpdata 公共测试参数（Map 形式）。 */
    private static Map<String, Object> buildCpDataMap() {
        Map<String, Object> m = new HashMap<>();
        m.put("transmit_args", DemoTestConfig.CP_TRANSMIT_ARGS);
        m.put("game_user_id", DemoTestConfig.CP_GAME_USER_ID);
        m.put("nickname", DemoTestConfig.CP_NICKNAME);
        m.put("head_img_url", DemoTestConfig.CP_HEAD_IMG_URL);
        m.put("queue_name", DemoTestConfig.CP_QUEUE_NAME);
        return m;
    }

    /** cpdata 公共测试参数（Config 形式）。 */
    private static RXUserCenterConfig buildUserCenterConfig() {
        RXUserCenterConfig config = new RXUserCenterConfig();
        config.setTransmit_args(DemoTestConfig.CP_TRANSMIT_ARGS);
        config.setGame_user_id(DemoTestConfig.CP_GAME_USER_ID);
        config.setNickname(DemoTestConfig.CP_NICKNAME);
        config.setHead_img_url(DemoTestConfig.CP_HEAD_IMG_URL);
        config.setQueue_name(DemoTestConfig.CP_QUEUE_NAME);
        return config;
    }

    // ==================== 提示弹窗 ====================

    private void showLimitTip() {
        RXSdkUI.getInstance().limitUI(activity,
                "温馨提示",
                "当前账号已达今日游戏时长上限，请明日再来。",
                "我知道了",
                jsonCallback).show();
    }

    private void showAntiAddition() {
        String text = "根据国家最新法规规定，未进行实名认证的用户不能体验任何游戏内容，请尽快完成实名。"
                + "当前账号未进行实名认证，游戏累计时间超过1小时将强制下线休息，且无法进行充值操作。";
        RXSdkUI.getInstance().antiAdditionView(activity,
                "防沉迷提示",
                text,
                "退出游戏",
                jsonCallback).show();
    }

    private void showChatService() {
        RXSdkUI.getInstance().chatServiceUI(activity, new HashMap<>(), !AppUtils.isDarkMode(activity), jsonCallback).show();
    }

    private void showLoginData() {
        LoginData data = RuiXueSdk.getLoginData();
        if (data != null) {
            String json = new GsonBuilder().setPrettyPrinting().create().toJson(data);
            callback.onResult("LoginData:\n" + json);
        } else {
            callback.onToast("未登录");
        }
    }

    private void bindAccount(String method, String scene) {
        Map<String, Object> map = new HashMap<>();
        map.put("method", method);
        map.put("scene", scene);
        callback.onResult("bindAccount:\nmethod=" + method + "\nscene=" + scene);
        RXSdkApi.getInstance().bindAccount(activity, map, jsonCallback);
    }

    // ==================== 密码 ====================

    private void changePasswordUI() {
        LoginData loginData = RuiXueSdk.getLoginData();
        if (loginData == null) {
            callback.onToast("请先登录再修改密码");
            return;
        }
        ChangePasswordView view = (ChangePasswordView) RXSdkUI.getInstance()
                .changePwdUI(activity, loginData.isPasswordSet(), jsonCallback);
        view.ignoreCheckPassword(true);
        view.show();
    }

    private void showForgotPassword() {
        Map<String, Object> map = new HashMap<>();
        map.put("username", DemoTestConfig.TEST_PHONE);
        map.put("account_type", 2);
        map.put("password_hint", "请输入密码");
        RXSdkUI.getInstance().findPassWordUI(activity, map, jsonCallback).show();
    }

    // ==================== 注销 ====================

    private void showDeregisterUI() {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("cpdata", JSONUtil.toJson(buildCpDataMap()));
        DeregisterHelper.deregisterUI(activity, hashMap, jsonCallback).show();
    }

    private void showDeregisterUIByConfig() {
        RXSdkUI.getInstance().applyForDeregisterUI(activity, buildUserCenterConfig(), jsonCallback).show();
    }

    private void showDeregisterDialog() {
        EditDialog topicDialog = new EditDialog(activity, true);
        topicDialog
                .setDialogTitle("实名注销测试")
                .setDialogSubtitle("填写实名信息后调用 SDK 注销接口，用于快速验证注销链路。")
                .setField1("真实姓名", "请输入实名姓名")
                .setField2("身份证号", "请输入身份证号")
                .setActionText("取消", "提交注销");
        topicDialog.setOnDialogClickListener(new OnDialogClickListener() {
            @Override
            public void onConfirmClick(String msg, String msg2) {
                String realName = msg == null ? "" : msg.trim();
                String idCard = msg2 == null ? "" : msg2.trim().toUpperCase();
                if (TextUtils.isEmpty(realName)) {
                    callback.onToast("请输入真实姓名");
                    return;
                }
                if (TextUtils.isEmpty(idCard)) {
                    callback.onToast("请输入身份证号");
                    return;
                }
                callback.onResult("提交实名注销:\n真实姓名: " + realName + "\n身份证号: " + idCard);
                topicDialog.dismiss();
                Map<String, Object> hashMap = new HashMap<>();
                hashMap.put("realname", realName);
                hashMap.put("idcard", idCard);
                hashMap.put("cpdata", JSONUtil.toJson(buildCpDataMap()));
                RXSdkApi.getInstance().deregister(hashMap, jsonCallback);
            }

            @Override
            public void onCancelClick() {
                topicDialog.dismiss();
            }
        });
        topicDialog.show();
    }

    private void showDeregisterH5() {
        String url = RuiXueSdk.getFirstBaseUrl()
                + (RuiXueSdk.isOasVersion()
                        ? "static/passport/#/oversea/unregistercondition?debugMode=true"
                        : "static/passport/#/user/unregistercondition?debugMode=true");
        RXWebViewHelper.createWebView(activity, url, buildCpDataMap(), jsonCallback).show();
    }

    // ==================== 反馈 ====================

    private void createFeedback() {
        LoadingDialog.create(activity).closeDelay(4000).show();
        Map<String, Object> map = new HashMap<>();
        map.put("game_id", 100);
        map.put("kind_id", 1);
        map.put("kind_name", "意见反馈类型");
        map.put("priority", 1);
        map.put("content", "说明");
        map.put("picture", "图片url");
        map.put("player_gameid", "玩家游戏id");
        map.put("send_voided_mails", 1);
        RXSdkApi.getInstance().createFeedback(map, jsonCallback);
    }

    private void updateFeedback() {
        Map<String, Object> map = new HashMap<>();
        map.put("key_number", 10);
        map.put("pleased_status", 1);
        map.put("reason", "理由");
        RXSdkApi.getInstance().satisfactionEvaluation(map, jsonCallback);
        LoadingDialog.create(activity).closeDelay(5000).show();
    }
}
