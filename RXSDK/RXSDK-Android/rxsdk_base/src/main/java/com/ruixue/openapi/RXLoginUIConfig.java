package com.ruixue.openapi;

import androidx.annotation.DrawableRes;

import java.util.List;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/7/26
 */
public interface RXLoginUIConfig {

    /**
     * 处于注销中的用户登录后是否显示注销窗口，默认不显示
     * @param deregisterShow true|false
     */
    void setDeregisterShow(boolean deregisterShow);

    /**
     * 如果账号在注销中是继续登录还是退出登录
     * @param loginContinue true 继续登录 | false 退出登录
     */
    void setLoginContinue(boolean loginContinue);

    /**
     * 设置首次登录是否显示设置密码界面 默认不弹出。
     * @param firstNeedSetPassword true|false
     */
    void setFirstNeedSetPassword(boolean firstNeedSetPassword);

    /**
     * 设置通行证界面标题图片资源id
     * @param titleResId DrawableRes id
     */
    void setLogoResId(@DrawableRes int titleResId);


    /**
     * 实名认证地区，海外根据不同地区展示不同样式的实名认证 UI，默认 姓名+身份证样式，目前支持 VN（越南地区样式）
     * @param realAuthRegion 实名认证地区
     */
    void setRealAuthRegion(String realAuthRegion);

    /**
     * 登录方式列表
     * @param loginMethodList 登录 method
     */
    void setLoginMethods(List<String> loginMethodList);

    /**
     * 自定义参数
     * @param customParams 登录
     */
    void setCustomParams(Map<String, Object> customParams);



    /**
     * 是否显示底部快速登录按钮，默认显示。
     * @param visible true|false
     */
    void setQuickButtonBarVisible(boolean visible);



    /**
     * 设置用户协议
     * @param privacyOneStr 标题
     * @param privacyOneUrl 地址
     */
    void setPrivacyOne(String privacyOneStr, String privacyOneUrl);

    /**
     * 设置隐私政策
     * @param privacyTwoStr 标题
     * @param privacyTwoUrl 地址
     */
    void setPrivacyTwo(String privacyTwoStr, String privacyTwoUrl);

    /**
     * 设置其他协议  默认空
     * @param privacyThreeStr 标题
     * @param privacyThreeUrl 地址
     */
    void setPrivacyThree(String privacyThreeStr, String privacyThreeUrl);




}
