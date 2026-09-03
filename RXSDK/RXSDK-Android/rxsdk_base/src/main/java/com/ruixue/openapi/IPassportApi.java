package com.ruixue.openapi;

import android.app.Activity;

import androidx.annotation.Nullable;
import androidx.annotation.StringDef;

import com.ruixue.RXJSONCallback;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.passport.LoginMethod;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.util.Map;

/**
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/7/22
 */
public interface IPassportApi {

    @StringDef({LoginMethod.GUEST, LoginMethod.WECHAT, LoginMethod.USERNAME, LoginMethod.QUICKPHONE, LoginMethod.CAPTCHACODE,
            LoginMethod.VIRTUAL, LoginMethod.OPPO, LoginMethod.HUAWEI, LoginMethod.HWJOS, LoginMethod.MI, LoginMethod.VIVO, LoginMethod.BAIDUNET,
            LoginMethod.DOUYIN, LoginMethod.KUAISHOU, LoginMethod.YSDK, LoginMethod.BILIBILI, LoginMethod.TAPTAP, LoginMethod.GOOGLE, LoginMethod.FACEBOOK, LoginMethod.LINE})
    @Retention(RetentionPolicy.SOURCE)
    public @interface LoginType {
    }

    void logout(OnLogoutCallback callback);

    void setRuiXueSdkCallback(RuiXueSdkCallback ruiXueSdkCallback);

    boolean exitApp(Activity activity, OnAppExitCallback callback);


    void setSubChannelId(String subChannelid);

    /**
     * @param type    枚举 手机或邮箱
     * @param target  手机或邮箱
     * @param purpose 意图
     */
    boolean sendCaptcha(CaptchaType type, String target, String purpose, RXJSONCallback callback);

    /**
     * @param type         枚举 手机或邮箱
     * @param target       手机或邮箱
     * @param purpose      意图
     * @param captcha_code 验证码
     */
    boolean verifyCaptcha(CaptchaType type, String target, String purpose, String captcha_code, RXJSONCallback callback);

    /**
     * @param username    用户名
     * @param password    password
     * @param captchaCode 验证码
     * @param ext         "nickname" : "昵称",      // string
     *                    "avatarUrl" : "头像地址"  // string
     *                    "sex" : 0     // 0男 1女  number
     */
    void register(String username, String password, String captchaCode, Map<String, Object> ext, RXJSONCallback callback);

    /**
     * 重置密码
     * @param username     手机号
     * @param password     密码
     * @param captcha_code 验证码
     * @param migrate_args 任意合法的 json 类型, 比如 string, number，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
     */
    void resetPassword(String username, String password, String captcha_code, Object migrate_args, RXJSONCallback callback);

    /**
     * @param method     登录方式
     * @param devicecode 设备码
     * @param states     账号的位标记
     */
    void searchHasAccounts(String method, String devicecode, int states, RXJSONCallback callback);

    /**
     * 登录请求
     * @param activity    应用上下文
     * @param loginType   登录类型 {@link LoginMethod}
     * @param username    用户名 非账号登录传空，账号注册为账号，手机注册为手机号，邮箱注册为邮箱
     * @param password    密码 非账号登录传空
     * @param captchaCode 验证码
     * @param loginOpenId 二次登录使用的login_openid ，null或空为普通登录
     * @param ext         扩展字段，可传null
     * @param signFields  指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]  非必须
     * @param migrateArgs 任意合法的 json 类型, 比如 string, number，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
     */
    void login(Activity activity,   String loginType, String username, String password, String captchaCode, String loginOpenId, Map<String, Object> ext, String[] signFields, Object migrateArgs, RXJSONCallback callback);


    /**
     * 修改密码
     * @param old_password 旧密码
     * @param new_password 新密码
     * @param callback     callback
     */
    void changePassword(String old_password, String new_password, RXJSONCallback callback);

    /**
     * 实名认证
     * @param realname 姓名
     * @param idcard   身份证
     * @param callback callback
     */
    void realAuth(String realname, String idcard, RXJSONCallback callback);

    /**
     * 实名认证
     * @param realname 姓名
     * @param idcard   身份证
     * @param isFastRealAuth 是否使用快速认证 默认值为 false
     * @param callback callback
     */
    void realAuth(String realname, String idcard, boolean isFastRealAuth, RXJSONCallback callback);

    /**
     * 查询 IIFAA 认证结果，POST {@code v1/cgosdk/sdk/auth/iifaa/validate_by_bizid}。
     * <p>成功时对登录态数据的处理与 {@link #realAuth(String, String, boolean, RXJSONCallback)}（实名认证）一致。</p>
     * <p>当服务端返回码为 310039 时自动重试；{@code retryCount} 表示失败后重试次数，传 0 不重试。</p>
     *
     * @param retryCount 310039 错误重试次数
     * @param callback   回调
     */
    void getIIFAAResultWithRetryCount(int retryCount, RXJSONCallback callback);

    /**
     * 查询 IIFAA 认证结果，POST {@code v1/cgosdk/sdk/auth/iifaa/validate_by_bizid}。
     * <p>相比 {@link #getIIFAAResultWithRetryCount(int, RXJSONCallback)} 新增 {@code source} 请求参数。</p>
     *
     * @param source     业务场景，deregister 表示注销场景，传空表示正常认证逻辑
     * @param retryCount 310039 错误重试次数，传 0 不重试
     * @param callback   回调
     */
    void getIIFAAResultWithSource(@Nullable String source, int retryCount, RXJSONCallback callback);

    /**
     * 获取 IIFAA 支付宝授权跳转地址，POST {@code v1/cgosdk/sdk/auth/iifaa/redirect_url}。
     *
     * @param appName         应用名称
     * @param thirdPartSchema 游戏自定义 URL Scheme，用于支付宝完成后回跳
     * @param callback        回调
     */
    void getIIFAARedirectURL(@Nullable String appName, @Nullable String thirdPartSchema, RXJSONCallback callback);

    /**
     * 获取用户信息
     * @param callback 回调函数
     */
    void getUserInfo(RXJSONCallback callback);

    /**
     * 获取指定用户信息
     * @param map      请求参数 map
     * @param callback 回调函数
     */
    void getUserInfoByField(Map<String, Object> map, RXJSONCallback callback);

    /**
     * 修改用户信息
     * @param nickname  用户昵称 非必传
     * @param avatarUrl 头像url 非必传
     * @param region    地区码 非必传
     * @param sex       1男 0女 非必传
     * @param callback
     */
    void updateUserInfo(String nickname, String avatarUrl, String region, int sex, RXJSONCallback callback);

    void updateUserInfo(String nickname, String avatarUrl, String region, int sex,Map<String, Object> ext, RXJSONCallback callback);


    /**
     * 绑定手机
     * @param phone        手机号
     * @param password     密码
     * @param captcha_code 验证码
     * @param migrate_args 任意合法的 json 类型, 比如 string, number，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
     * @param callback     callback
     */
    void bindPhone(String phone, String password, String captcha_code, Object migrate_args, RXJSONCallback callback);

    /**
     * 修改手机号
     * @param newPhone        新手机号
     * @param newPhoneCaptcha 新手机号验证码
     * @param oldPhoneCaptcha 旧手机号验证码
     * @param migrateArgs     任意合法的 json 类型, 比如 string, number，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
     * @param callback        callback
     */
    void changePhone(String newPhone, String newPhoneCaptcha, String oldPhoneCaptcha, Object migrateArgs, RXJSONCallback callback);


    /**
     * 解绑手机
     * @param phone        手机号
     * @param captcha_code 验证码
     * @param callback     callback
     */
    void unBindPhone(String phone, String captcha_code, RXJSONCallback callback);


    void changeEmail(String newEmail, String newEmailCaptcha, String oldEmailCaptcha, Object migrateArgs, RXJSONCallback callback);

    /**
     * 绑定邮箱
     * @param email        邮箱
     * @param password     密码
     * @param captcha_code 验证码
     * @param migrate_args 任意合法的 json 类型, 比如 string, nujber，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
     */
    void bindEmail(String email, String password, String captcha_code, Object migrate_args, RXJSONCallback callback);

    /**
     * 解绑邮箱
     * @param email        邮箱
     * @param captcha_code 验证码
     * @param callback     callback
     */
    void unBindEmail(String email, String captcha_code, RXJSONCallback callback);

    /**
     * 申请注销账号
     * @param deregisterConfig {@link  RXDeregisterConfig}类
     * @param callback
     */
    void deregister(RXDeregisterConfig deregisterConfig, RXJSONCallback callback);


    /**
     * 撤销注销申请
     */
    void deregisterCancel(RXJSONCallback callback);


    void searchBindingAccounts(RXJSONCallback callback);
}
