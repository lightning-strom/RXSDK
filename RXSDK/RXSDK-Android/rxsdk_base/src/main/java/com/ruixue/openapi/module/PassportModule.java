package com.ruixue.openapi.module;

import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXRequestCallback;
import com.ruixue.openapi.RXDeregisterConfig;
import com.ruixue.openapi.CaptchaType;
import com.ruixue.passport.LoginParams;
import com.ruixue.passport.RegisterParams;
import com.ruixue.passport.UserInfoParams;

import java.util.Map;

/**
 * 通行证功能模块
 *
 * <p>
 * 提供登录、注册、用户信息、绑定、验证码等通行证相关功能。
 * </p>
 *
 * <p>
 * 调用方式：{@code RXSDK.getInstance().passport.接口名()}
 * </p>
 *
 * @author ROC LEE
 * @date 2026/1/19
 */
public class PassportModule {

    private final com.ruixue.openapi.RXSDK sdk;

    public PassportModule(com.ruixue.openapi.RXSDK sdk) {
        this.sdk = sdk;
    }

    /**
     * 用户登录
     *
     * @param activity Activity（可选，某些登录方式需要）
     * @param params   登录参数
     * @param callback 回调接口
     */
    public void login(@Nullable Activity activity, @NonNull LoginParams params, @NonNull RXRequestCallback callback) {
        sdk.login(activity, params, callback);
    }

    /**
     * 用户登录（简化版本，使用默认 Activity）
     *
     * @param params   登录参数
     * @param callback 回调接口
     */
    public void login(@NonNull LoginParams params, @NonNull RXRequestCallback callback) {
        sdk.login(params, callback);
    }

    /**
     * 用户注册
     *
     * @param params   注册参数
     * @param callback 回调接口
     */
    public void register(@NonNull RegisterParams params, @NonNull RXRequestCallback callback) {
        sdk.register(params, callback);
    }

    /**
     * 获取用户信息
     *
     * @param callback 回调接口
     */
    public void getUserInfo(@NonNull RXRequestCallback callback) {
        sdk.getUserInfo(callback);
    }

    /**
     * 获取指定用户信息
     *
     * @param params   请求参数 map
     * @param callback 回调接口
     */
    public void getUserInfoByField(@NonNull Map<String, Object> params, @NonNull RXRequestCallback callback) {
        sdk.getUserInfoByField(params, callback);
    }

    /**
     * 更新用户信息
     *
     * @param params   用户信息参数
     * @param callback 回调接口
     */
    public void updateUserInfo(@NonNull UserInfoParams params, @NonNull RXRequestCallback callback) {
        sdk.updateUserInfo(params, callback);
    }

    /**
     * 发送验证码
     *
     * @param type     验证码类型（手机或邮箱）
     * @param target   手机号或邮箱
     * @param purpose  用途
     * @param callback 回调接口
     * @return 是否成功发起请求
     */
    public boolean sendCaptcha(@NonNull CaptchaType type, @NonNull String target, @NonNull String purpose,
            @NonNull RXRequestCallback callback) {
        return sdk.sendCaptcha(type, target, purpose, callback);
    }

    /**
     * 验证验证码
     *
     * @param type        验证码类型（手机或邮箱）
     * @param target      手机号或邮箱
     * @param purpose     用途
     * @param captchaCode 验证码
     * @param callback    回调接口
     * @return 是否成功发起请求
     */
    public boolean verifyCaptcha(@NonNull CaptchaType type, @NonNull String target, @NonNull String purpose,
            @NonNull String captchaCode, @NonNull RXRequestCallback callback) {
        return sdk.verifyCaptcha(type, target, purpose, captchaCode, callback);
    }

    /**
     * 修改密码
     *
     * @param oldPassword 旧密码
     * @param newPassword 新密码
     * @param callback    回调接口
     */
    public void changePassword(@NonNull String oldPassword, @NonNull String newPassword,
            @NonNull RXRequestCallback callback) {
        sdk.changePassword(oldPassword, newPassword, callback);
    }

    /**
     * 重置密码
     *
     * @param username    手机号
     * @param password    新密码
     * @param captchaCode 验证码
     * @param migrateArgs 迁移参数（可选）
     * @param callback    回调接口
     */
    public void resetPassword(@NonNull String username, @NonNull String password, @NonNull String captchaCode,
            @Nullable Object migrateArgs, @NonNull RXRequestCallback callback) {
        sdk.resetPassword(username, password, captchaCode, migrateArgs, callback);
    }

    /**
     * 实名认证
     *
     * @param realname 姓名
     * @param idcard   身份证号
     * @param callback 回调接口
     */
    public void realAuth(@NonNull String realname, @NonNull String idcard, @NonNull RXRequestCallback callback) {
        sdk.realAuth(realname, idcard, callback);
    }

    /**
     * 实名认证（快速认证）
     *
     * @param realname       姓名
     * @param idcard         身份证号
     * @param isFastRealAuth 是否使用快速认证
     * @param callback       回调接口
     */
    public void realAuth(@NonNull String realname, @NonNull String idcard, boolean isFastRealAuth,
            @NonNull RXRequestCallback callback) {
        sdk.realAuth(realname, idcard, isFastRealAuth, callback);
    }

    /**
     * 查询 IIFAA 认证结果。
     *
     * @param retryCount 310039 错误重试次数，传 0 不重试
     * @param callback   回调接口
     */
    public void getIIFAAResultWithRetryCount(int retryCount, @NonNull RXRequestCallback callback) {
        sdk.getIIFAAResultWithRetryCount(retryCount, callback);
    }

    /**
     * 查询 IIFAA 认证结果，相比 {@link #getIIFAAResultWithRetryCount(int, RXRequestCallback)} 新增 {@code source} 请求参数。
     *
     * @param source     业务场景，deregister 表示注销场景，传空表示正常认证逻辑
     * @param retryCount 310039 错误重试次数，传 0 不重试
     * @param callback   回调接口
     */
    public void getIIFAAResultWithSource(@Nullable String source, int retryCount, @NonNull RXRequestCallback callback) {
        sdk.getIIFAAResultWithSource(source, retryCount, callback);
    }

    /**
     * 获取 IIFAA 支付宝授权跳转地址。
     */
    public void getIIFAARedirectURL(@Nullable String appName, @Nullable String thirdPartSchema, @NonNull RXRequestCallback callback) {
        sdk.getIIFAARedirectURL(appName, thirdPartSchema, callback);
    }

    /**
     * 绑定手机
     *
     * @param phone       手机号
     * @param password    密码
     * @param captchaCode 验证码
     * @param migrateArgs 迁移参数（可选）
     * @param callback    回调接口
     */
    public void bindPhone(@NonNull String phone, @NonNull String password, @NonNull String captchaCode,
            @Nullable Object migrateArgs, @NonNull RXRequestCallback callback) {
        sdk.bindPhone(phone, password, captchaCode, migrateArgs, callback);
    }

    /**
     * 修改手机号
     *
     * @param newPhone        新手机号
     * @param newPhoneCaptcha 新手机号验证码
     * @param oldPhoneCaptcha 旧手机号验证码
     * @param migrateArgs     迁移参数（可选）
     * @param callback        回调接口
     */
    public void changePhone(@NonNull String newPhone, @NonNull String newPhoneCaptcha, @NonNull String oldPhoneCaptcha,
            @Nullable Object migrateArgs, @NonNull RXRequestCallback callback) {
        sdk.changePhone(newPhone, newPhoneCaptcha, oldPhoneCaptcha, migrateArgs, callback);
    }

    /**
     * 解绑手机
     *
     * @param phone       手机号
     * @param captchaCode 验证码
     * @param callback    回调接口
     */
    public void unBindPhone(@NonNull String phone, @NonNull String captchaCode, @NonNull RXRequestCallback callback) {
        sdk.unBindPhone(phone, captchaCode, callback);
    }

    /**
     * 绑定邮箱
     *
     * @param email       邮箱
     * @param password    密码
     * @param captchaCode 验证码
     * @param migrateArgs 迁移参数（可选）
     * @param callback    回调接口
     */
    public void bindEmail(@NonNull String email, @NonNull String password, @NonNull String captchaCode,
            @Nullable Object migrateArgs, @NonNull RXRequestCallback callback) {
        sdk.bindEmail(email, password, captchaCode, migrateArgs, callback);
    }

    /**
     * 解绑邮箱
     *
     * @param email       邮箱
     * @param captchaCode 验证码
     * @param callback    回调接口
     */
    public void unBindEmail(@NonNull String email, @NonNull String captchaCode, @NonNull RXRequestCallback callback) {
        sdk.unBindEmail(email, captchaCode, callback);
    }

    /**
     * 申请注销账号
     *
     * @param deregisterConfig 注销配置
     * @param callback         回调接口
     */
    public void deregister(@NonNull RXDeregisterConfig deregisterConfig, @NonNull RXRequestCallback callback) {
        sdk.deregister(deregisterConfig, callback);
    }

    /**
     * 撤销注销申请
     *
     * @param callback 回调接口
     */
    public void deregisterCancel(@NonNull RXRequestCallback callback) {
        sdk.deregisterCancel(callback);
    }

    /**
     * 查询绑定账号列表
     *
     * @param callback 回调接口
     */
    public void searchBindingAccounts(@NonNull RXRequestCallback callback) {
        sdk.searchBindingAccounts(callback);
    }
}
