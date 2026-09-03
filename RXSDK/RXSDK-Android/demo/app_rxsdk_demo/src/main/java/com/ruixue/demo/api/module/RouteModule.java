package com.ruixue.demo.api.module;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.ruixue.demo.GlobalConfig;
import com.ruixue.demo.api.ButtonModule;
import com.ruixue.demo.helper.RxSdkHelper;
import com.ruixue.qipai.R;
import com.ruixue.utils.ActivityUtils;

/**
 * 仅负责测试入口的 Activity 跳转。
 * <p>
 * 原先集中在 ToolsModule 的 registerRoute 调用全部移动到这里，
 * 让 ToolsModule 只保留纯工具类测试逻辑。
 */
public class RouteModule implements ButtonModule {

    private final Activity activity;

    public RouteModule(@NonNull Activity activity) {
        this.activity = activity;
    }

    @Override
    public void registerButtons(Registrar registrar) {
        registerRoute(registrar, R.id.wechat_test, "com.ruixue.demo.wechat.ShareDemoActivity", true);
        registerRoute(registrar, R.id.google_test, "com.ruixue.demo.overseas.OverseasDemoActivity", true);
        registerRoute(registrar, R.id.line_test, "com.ruixue.demo.activity.LineActivity", true);
        registerRoute(registrar, R.id.ysdk_test, "com.ruixue.demo.channel.ChannelDemoActivity", true);
        registerRoute(registrar, R.id.social_test, "com.ruixue.demo.activity.SocialTestActivity", true);
        registerRoute(registrar, R.id.share_test, "com.ruixue.demo.activity.ShareTestActivity", true);
        registerRoute(registrar, R.id.permission_test, "com.ruixue.demo.permission.PermissionActivity", true);
        registerRoute(registrar, R.id.demo_preview, "com.ruixue.demo.activity.NavActivity", true);
        registerRoute(registrar, R.id.api_demo_v2, "com.ruixue.demo.activity.ApiDemoV2Activity", false);
        registerRoute(registrar, R.id.promo_display, "com.ruixue.demo.activity.PromoTestActivity", true);
        registerRoute(registrar, R.id.demo_topon, "com.ruixue.demo.topon.TopOnActivity", false);
        registrar.register(R.id.webview_test, () -> RxSdkHelper.openUrl(activity, true));
        registerRoute(registrar, R.id.push_test, "com.ruixue.demo.push.MainPushActivity", true);
        registerRoute(registrar, R.id.game_area_test, "com.ruixue.demo.activity.GameAreaActivity", true);
        registerRoute(registrar, R.id.test_idcard_input, "com.ruixue.demo.activity.IdcardNumberInputDemoActivity", false);
        registerRoute(registrar, R.id.btn_leidan, "com.ruixue.demo.activity.LdActivity", false);
        registerRoute(registrar, R.id.btn_uc_game, "com.ruixue.demo.activity.UcGameDemoActivity", false);
        registerRoute(registrar, R.id.hw_replay, "com.ruixue.demo.huawei.HuaweiReplayDemoActivity", true);
        registerRoute(registrar, R.id.hw_moment, "com.ruixue.demo.huawei.HuaweiMomentDemoActivity", true);
    }

    private void registerRoute(Registrar registrar, int buttonId, String className, boolean withExt) {
        registrar.register(buttonId, () -> {
            if (withExt) {
                ActivityUtils.startActivityByClass(activity, className, GlobalConfig.getExt());
            } else {
                ActivityUtils.startActivityByClass(activity, className);
            }
        });
    }
}
