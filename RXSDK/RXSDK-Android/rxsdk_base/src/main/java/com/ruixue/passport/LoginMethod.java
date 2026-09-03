package com.ruixue.passport;

import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.ruixue.openapi.RXGlobalData;
import com.ruixue.utils.ResUtils;

import java.util.HashSet;

public class LoginMethod {
    public static final String MORE = "more";
    /**
     * 游客登录:
     * method: guest
     */
    public static final String GUEST = "guest";
    /**
     * appid
     */
    public static final String WECHAT = "wechat";
    /**
     * 账号密码登录
     * method: username
     */
    public static final String USERNAME = "username";
    /**
     * 手机一键登录
     * method:quickphone
     * ext:
     * access_token
     */
    public static final String QUICKPHONE = "quickphone";

    /**
     * 手机/邮箱验证码登录，username 可为手机号或者邮箱地址
     */
    public static final String CAPTCHACODE = "captchacode";

    /**
     * /应用宝SDK登录:
     * //method: ysdk
     * //ext:
     * //    form
     * //    openid
     * //    avatar
     * //    nickname
     */
    public static final String YSDK = "ysdk";
    /**
     * //快手登录
     * //method: kuaishou
     * //ext:
     * //    game_id
     * //    game_token
     */
    public static final String KUAISHOU = "kuaishou";
    /**
     * 百度网讯
     * method:baidunet
     * ext:
     * access_token  # 百度返回的用户token
     */
    public static final String BAIDUNET = "baidunet";
    /**
     * 华为
     * method:huawei
     * ext:
     * playerId  # 华为返回的用户id
     * displayName # 华为返回的显示名称
     */
    public static final String HUAWEI = "huawei";

    public static final String HONOR = "hihonor";
    /**
     * 华为
     * method:hwjos
     * ext:
     * playerId  # 华为返回的用户id
     * openid # 华为返回的openid
     * displayName # 华为返回的displayName
     * playerLevel # 华为返回的playerLevel
     * playerSign # 华为返回的playerSign
     * ts # 华为返回的ts
     */
    public static final String HWJOS = "hwjos";
    /**
     * 小米
     * method:mi
     * ext:
     * session # 小米返回的用户会话session
     * uid # 小米返回的用户id
     * nickname # 小米返回的nickname昵称
     */
    public static final String MI = "mi";
    /**
     * OPPO
     * method:oppo
     * ext:
     * token # oppo返回的token
     * openid # oppo返回的openid
     * OPPO小游戏
     * method:oppomini
     * ext:
     * token # oppo小游戏返回的用户token
     */
    public static final String OPPO = "oppo";

    /**
     * OPPO 海外
     */
    public static final String OPPO_OS = "oppo_os";
    /**
     * VIVO
     * method:vivo
     * ext:
     * authToken # vivo返回的用户token
     * username # vivo返回的username用户名
     */
    public static final String VIVO = "vivo";
    public static final String XUTENG = "xuteng";
    public static final String HUYA = "huya";
    /**
     * 抖音联运
     * method:douyin
     * ext:
     * access_token # 抖音用户access_token
     */
    public static final String DOUYIN = "douyin";
    /**
     * 虚拟账号登录（用于未接入通行证但又想使用瑞雪其他接口的场景）
     * method:virtual
     * ext:
     * logindata # (必须)登录凭证，由 ruixuego 服务端 SDK 的 GenerateVirtualLoginData 接口生成
     * nickname # (非必须)用户昵称
     * avatar # (非必须)用户头像
     * sex # (非必须)性别,1:男,0:女.(必须是字符串类型的值)
     * regtime # (必须)注册时间，格式为 YYYY-MM-DD HH:ii:ss，例：2022-01-02 09:10:11
     */
    public static final String VIRTUAL = "virtual";

    public static final String BILIBILI = "bilibili";
    public static final String M4399 = "4399";

    public static final String TAPTAP = "taptap";

    public static final String GOOGLE = "google";

    public static final String FACEBOOK = "facebook";

    public static final String LINE = "line";

    public static final String ZALO = "zalo";

    public static final String TIKTOK = "tiktok";

    public static final String QOO = "qoo";

    public static final String SNAPCHAT = "snapchat";

    public static final String INSTAGRAM = "instagram";

    public static final String REDDIT = "reddit";

    public static final String MUMU = "mumu";

    public static final String M9GAME = "jiuyou";

    public static final String LEIDIAN = "leidian";

    public static final String M007 = "client_007";

    public static final String QUICK = "quick";
    public static final String WEIZHI = "weizhi";

    public static final String VK = "vk";

    private static final HashSet<String> OWN_LOGIN = new HashSet<>();

    static {
        OWN_LOGIN.add(VIRTUAL);
        OWN_LOGIN.add(GUEST);
        OWN_LOGIN.add(USERNAME);
        OWN_LOGIN.add(CAPTCHACODE);
    }


    private final String method;
    private final String name;
    private final int icon;
    private String ext = "";

    public String getMethod() {
        return method;
    }

    public String getName() {
        return TextUtils.isEmpty(name) ? method : name;
    }

    public int getIcon() {
        return icon;
    }

    public LoginMethod(@NonNull String method, String ext) {
        this.method = method;
        if (GUEST.equals(this.method) && !TextUtils.isEmpty(RXGlobalData.getGuestTitle())) {
            this.name = RXGlobalData.getGuestTitle();
        } else {
            this.name = ResUtils.getInstance().getString("method_" + method + ext);
        }
        this.icon = ResUtils.getInstance().getDrawableId("rx_ico_" + method + ext);
    }

    public static String getName(String method) {
        return new LoginMethod(method, "").getName();
    }

    public static LoginMethod create(String method) {
        return new LoginMethod(method, "");
    }

    public static LoginMethod create(String method, String ext) {
        return new LoginMethod(method, ext);
    }

    public static boolean isChannel(String method) {
        return method != null && !OWN_LOGIN.contains(method);
    }


}


