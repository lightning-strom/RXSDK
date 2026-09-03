package com.ruixue.demo.config;

/**
 * Demo 测试参数集中配置
 * <p>
 * 将原先散落在 DemoClickHandler 各方法中的硬编码参数统一管理，
 * 方便查找和修改，避免同一参数在多处重复定义。
 */
public final class DemoTestConfig {

    private DemoTestConfig() {}

    // ==================== 支付 ====================

    /** 默认 goods_tag */
    public static final String GOODS_TAG_DEFAULT = "bytest";

    /** Waffo goods_tag */
    public static final String GOODS_TAG_WAFFO = "nbtest";

    /** UPay WWCard goods_tag */
    public static final String GOODS_TAG_UPAY_WWCARD = "upay_wwcard";

    /** 瑞雪H5 goods_tag */
    public static final String GOODS_TAG_RUIXUE_H5 = "842000099";

    /** 瑞雪H5 备选 goods_tag */
    public static final String GOODS_TAG_RUIXUE_H5_ALT = "842000049";

    /** 付费礼包 goods_tag */
    public static final String GOODS_TAG_PAYGIFT = "goods_paygift_1";

    /** 银联云闪付 goods_tag */
    public static final String GOODS_TAG_AUMS_UAC = "bytest";

    /** Checkout 测试 goods_tag */
    public static final String GOODS_TAG_CHECKOUT = "ios_tag";

    // ==================== 支付环境 ====================

    /** 测试环境标识 */
    public static final int ENV_TEST = 1;

    /** 生产环境标识 */
    public static final int ENV_PROD = 0;

    // ==================== 币种 ====================

    public static final String CURRENCY_MYR = "MYR";
    public static final String CURRENCY_IDR = "IDR";
    public static final String CURRENCY_HKD = "HKD";

    // ==================== 回调 URL ====================

    /** 通用支付回调 URL */
    public static final String NOTIFY_URL = "http://game.pay.result.callback";

    /** 京东 callback scheme */
    public static final String JD_CALLBACK_URL = "jixiang433://pay?code=0";

    /** PayerMax 前端回调 URL */
    public static final String PAYERMAX_FRONT_CALLBACK = "jixiang433://";

    /** Checkout return URL */
    public static final String CHECKOUT_RETURN_URL = "https://www.baidu.com?d=3&d13s=3131sjkaskdjkjasdkasdjk";

    // ==================== Web ====================

    /** Web Pay 测试地址 */
    public static final String WEB_PAY_URL = "http://10.10.2.226:2000/h5_ruixueh5/";

    // ==================== 版本检查 ====================

    public static final String CHECK_APP_VERSION = "1.2.7";
    public static final String CHECK_GAME_VERSION = "1.2.3";
    public static final String CHECK_ACTIVITY_TAG = "test";

    // ==================== 测试账号 ====================

    public static final String TEST_PHONE = "18143088888";
    public static final String TEST_USERNAME = "test3";
    public static final String TEST_PASSWORD = "111111aA!";

    // ==================== 广告 ====================

    /** 广点通 SID */
    public static final String GDT_SID = "1201825992";

    /** 广点通 SK */
    public static final String GDT_SK = "5f9c4a84cf6f28dd43ca37be84d0f215";

    /** 腾讯快捷登录 AppID */
    public static final String TX_QUICK_APPID = "1400921157";

    // ==================== 验证码 ====================

    public static final int CAPTCHA_APPID_VERIFY = 193923813;
    public static final int CAPTCHA_APPID_TEST = 193289588;

    // ==================== UTG ====================

    public static final String UTG_CHANNEL_ID = "TG10";

    // ==================== 下载 ====================

    public static final String APK_DOWNLOAD_URL = "https://cloud-file.jixiang.cn/apk/jxmj0301.apk";
    public static final String APK_DOWNLOAD_NAME = "jxmj0301.apk";
    public static final String APK_INSTALL_PATH = "/storage/emulated/0/Android/data/com.weile.cats/files/Download/jxmj0301.apk";

    // ==================== 头像 ====================

    public static final String DEFAULT_AVATAR_URL = "https://rxfile.fishinggamezone.com/2024/06/28/1719560491878.png";

    // ==================== 用户中心 / 注销 cpdata ====================

    public static final String CP_TRANSMIT_ARGS = "透传参数";
    public static final int CP_GAME_USER_ID = 1000;
    public static final String CP_NICKNAME = "用户昵称";
    public static final String CP_HEAD_IMG_URL = "用户头像";
    public static final String CP_QUEUE_NAME = "default";

    // ==================== 分享测试 ====================

    public static final String SHARE_TEST_IMAGE_URL = "https://example.com/share.png";
    public static final String SHARE_TEST_WEB_URL = "https://www.example.com";

    // ==================== Checkout 硬编码测试数据 ====================

    public static final String CHECKOUT_COUNTRY = "HK";
    public static final String CHECKOUT_OPENID = "rxu7yMR4b-K6ZeqwdwytZYi1oixM0QlBGPYkW1pE";
    public static final int CHECKOUT_H5_SETTING_ID = 22;
    public static final String CHECKOUT_H5_PLATFORM_ID = "1716366554976new_create";
}
