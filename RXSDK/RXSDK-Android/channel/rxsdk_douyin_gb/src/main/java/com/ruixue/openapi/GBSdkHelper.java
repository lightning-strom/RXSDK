package com.ruixue.openapi;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.bytedance.ttgame.tob.common.host.api.GBCommonSDK;
import com.bytedance.ttgame.tob.optional.union.api.IUnionService;
import com.bytedance.ttgame.tob.optional.union.api.account.IAccountCallback;
import com.bytedance.ttgame.tob.optional.union.api.account.ILogoutCallback;
import com.bytedance.ttgame.tob.optional.union.api.pay.PaySuccessListener;
import com.bytedance.ttgame.tob.optional.union.api.account.ISwitchCallback;
import com.bytedance.ttgame.tob.optional.union.api.account.RealNameType;
import com.bytedance.ttgame.tob.optional.union.api.account.UserInfoResult;
import com.bytedance.ttgame.tob.optional.union.api.pay.IPayCallback;
import com.bytedance.ttgame.tob.optional.union.api.pay.PayInfo;
import com.bytedance.ttgame.tob.optional.union.api.pay.PayResult;


import java.util.Objects;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/28
 */
public class GBSdkHelper {
    ////登录结果类声明
//public class UserInfoResult {
//    //错误码
//    public int code;
//    //错误信息
//    public String message;
//    //用户信息
//    public UserInfo data;
//}
////用户信息类声明
//public class UserInfo {
//    private String accessToken;//token
//    private ExtraData extraData;//扩展字段
//}
////扩展字段声明
//public class ExtraData {
//     private boolean isGuest; //是否游客
//     private int userType; //用户类型，绑定后为绑定的用户类型
//     private long userId; //uid
//     private int identityType;//云控返回的用户实名认证的等级 1=low，2=mid，3=high
//     private String nickname; //用户抖音or联运昵称
//     private String avatarUrl; //用户抖音or联运头像
//
//    //其中userType用户类型如下：
//    public static final int AWEME = 4; //抖音
//}

    public static IUnionService getService() {
        return Objects.requireNonNull(GBCommonSDK.getService(IUnionService.class));
    }

    /**
     * 判断登录状态 通过以下方法判断游戏是否已经登录：
     */
    public static boolean isLogin() {
        return getService().isLogin();
    }


    /**
     * 发起登录 在SDK初始化完成的前提下，调用以下方法，可以弹出一个登录弹窗：
     */
    public static void login(Activity context, IAccountCallback<UserInfoResult> callback) {
        getService().login(context, callback);
    }

    /**
     * 切换登录账号 如果游戏内有切换登录账号的按钮，可以在已经登录的情况下，调用以下接口打开一个切换登录界面：
     */
    public static void switchLogin(Activity context, ISwitchCallback<UserInfoResult> callback) {
        getService().switchLogin(context, callback);
    }

    /**
     * 退出登录 如果游戏内有退出登录账号的按钮，可以在已经登录的情况下，调用以下接口退出登录状态：
     */
    public static void logout(Activity context, IAccountCallback<UserInfoResult> callback) {
        getService().logout(context, callback);
    }

    /**
     * 触发实名认证 如果用户未实名，在合适的场景，可以调用以下接口，触发一次实名弹窗：
     *
     * @param context      游戏的activity
     * @param realNameType 实名认证类型(走网络配置，实名认证可关闭，实名认证不可关闭)
     * @param callback     回调
     *                     0  	成功
     *                     -1  	用户取消认证
     *                     -1202 	  该帐号已经实名认证过  	提示已实名
     */
    public static void realNameVerify(Activity context, @RealNameType int realNameType, IAccountCallback<UserInfoResult> callback) {
        getService().realNameVerify(context, realNameType, callback);
    }

    /**
     * 判断用户是否实名
     */
    public static void isVerify() {
        getService().isVerify();
    }


    /**
     * 年龄枚举 -1:未实名 8:0-8岁
     * 16:8-16岁 18:16-18岁 100:大于18岁 左闭右开
     */
    public static int getAgeType() {
        return getService().getAgeType();
    }

    /**
     * 下单支付
     *
     * @param activity 游戏支付页面
     * @param payInfo  支付参数
     * @param callback 回调
     */
    public static void pay(Activity activity, PayInfo payInfo, IPayCallback<PayResult> callback) {
        getService().pay(activity, payInfo, callback);
    }

    //     支付成功全局监听（选）
//     SDK悬浮球内支持对部分历史订单进行支付，对这部分订单可以设置全局的监听，收到监听结果后及时给用户发货，更新游戏界面，优化用户体验。
//      /**
//     * 直接支付的订单
//     */
//    int TYPE_DIRECT_PAY = 1;
//     /**
//     * 历史订单
//     */
//    int TYPE_HISTORY = 2;
    public static void setPaySuccessListener(@NonNull PaySuccessListener callback) {
        getService().setPaySuccessListener(callback);
    }

    public static void setLogoutCallback(ILogoutCallback callback) {
        getService().setLogoutCallback(callback);
    }
}
