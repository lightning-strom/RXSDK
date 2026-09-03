/**
 * RuixueBridge.h
 * 瑞雪 SDK C++ 桥接层 - 跨平台接口定义
 * 
 * 设计原则：
 * 1. 参数使用 JSON 字符串，原生层解析
 * 2. 回调统一返回 JSON 字符串（包含 code、msg、data）
 * 3. 简单方法（无参数）保留简洁接口
 */

#ifndef __RUIXUE_BRIDGE_H__
#define __RUIXUE_BRIDGE_H__

#include <string>
#include <functional>

namespace ruixue {

// ==================== 回调类型定义 ====================

/**
 * 统一回调类型
 * @param responseJson 响应 JSON 字符串，格式:
 *        {
 *          "code": 0,           // 0 成功，其他失败
 *          "msg": "success",    // 提示信息
 *          "data": {...}        // 业务数据（JSON 对象）
 *        }
 * 
 * 示例响应:
 * - 初始化成功: {"code":0,"msg":"初始化成功","data":{}}
 * - 登录成功: {"code":0,"msg":"登录成功","data":{"openid":"xxx","token":"yyy"}}
 * - 支付成功: {"code":0,"msg":"支付成功","data":{"orderId":"xxx"}}
 * - 失败: {"code":1001,"msg":"网络错误","data":{}}
 */
using ResultCallback = std::function<void(const std::string& responseJson)>;

// ==================== 常用 Key 常量（方便构建 JSON） ====================

namespace Key {
    // 初始化参数
    constexpr const char* CPID = "cpid";
    constexpr const char* PRODUCT_ID = "productId";
    constexpr const char* CHANNEL_ID = "channelId";
    constexpr const char* BASE_URLS = "baseUrls";
    
    // 登录参数
    constexpr const char* LOGIN_TYPE = "loginType";
    constexpr const char* LOGIN_OPENID = "loginOpenid";
    constexpr const char* USERNAME = "username";
    constexpr const char* PASSWORD = "password";
    constexpr const char* PHONE = "phone";
    constexpr const char* CAPTCHA_CODE = "captchaCode";
    
    // 支付参数
    constexpr const char* PAY_TYPE = "payType";       // 支付类型: wechat / alipay / xy
    constexpr const char* GOODS_TAG = "goodsTag";     // 瑞雪后台计费点名称
    constexpr const char* TRADE_NO = "tradeNo";       // CP 订单号
    constexpr const char* TRANSMIT_ARGS = "transmitArgs"; // CP 透传参数
    constexpr const char* GAME_CHARACTER_ID = "gameCharacterId"; // 角色 ID
    constexpr const char* IS_H5 = "is_h5";            // 星驿 H5 支付在 ext 中传 int 1
    constexpr const char* GAME_SERVER_ID = "gameServerId";       // 区服 ID
    constexpr const char* INDULGE_AUTH = "indulgeAuth"; // 防沉迷验证
    
    // 一键分享参数
    constexpr const char* SHARE_FUNC = "func";           // 埋点标识
    constexpr const char* SHARE_PLATFORM = "platform";   // 分享平台: wechat/system/facebook 等
    constexpr const char* SHARE_REGION = "region";       // 地区码
    constexpr const char* SHARE_TRANSMITS = "transmits"; // 透传参数
    constexpr const char* SHARE_SCENE = "shareScene";    // 0 好友, 1 朋友圈
    
    // 自定义分享参数
    constexpr const char* SHARE_TYPE = "type";           // 分享类型: text/image/link/video
    constexpr const char* TITLE = "title";
    constexpr const char* CONTENT = "content";
    constexpr const char* IMAGE_URL = "image";
    constexpr const char* SHARE_URL = "url";
    
    // 响应字段
    constexpr const char* CODE = "code";
    constexpr const char* MSG = "msg";
    constexpr const char* DATA = "data";
    constexpr const char* OPENID = "openid";
    constexpr const char* TOKEN = "token";
}

// ==================== 登录类型常量 ====================

namespace LoginType {
    constexpr const char* GUEST = "guest";
    constexpr const char* USERNAME = "username";
    constexpr const char* PHONE = "phone";
    constexpr const char* APPLE = "apple";
    constexpr const char* WECHAT = "wechat";
    constexpr const char* GOOGLE = "google";
    constexpr const char* FACEBOOK = "facebook";
    constexpr const char* LINE = "line";
    constexpr const char* TIKTOK = "tiktok";
    constexpr const char* BAIDU_NET = "baidunet";
    constexpr const char* XUTENG = "xuteng";
}

// ==================== 渠道通用动作常量 ====================

namespace ChannelAction {
    constexpr const char* SHOW_SPLASH = "showSplash";
    constexpr const char* SHOW_FLOAT_VIEW = "showFloatView";
    constexpr const char* HIDE_FLOAT_VIEW = "hideFloatView";
}

/**
 * 瑞雪 SDK 桥接类
 * 单例模式，提供跨平台的 SDK 调用接口
 */
class RuixueBridge {
public:
    /**
     * 获取单例实例
     */
    static RuixueBridge* getInstance();
    
    /**
     * 销毁单例
     */
    static void destroyInstance();
    
    // ==================== SDK 生命周期 ====================
    
    /**
     * 初始化 SDK
     * @param paramsJson 初始化参数 JSON 字符串
     * @param callback 回调，返回完整响应 JSON
     */
    void init(const std::string& paramsJson, ResultCallback callback);

    /**
     * 初始化第三方渠道 SDK。虎牙需传 game_id、login_client_id、
     * login_client_secret、pay_app_id 等参数。
     */
    void initThirdSdk(const std::string& paramsJson, ResultCallback callback);
    
    /**
     * 检查 SDK 是否已初始化
     */
    bool isInitialized() const;
    
    /**
     * 获取顶部安全区域高度（点坐标）
     * 用于处理刘海屏/打孔屏
     */
    float getTopSafeArea();
    
    // ==================== 用户系统 ====================
    
    /**
     * 显示找回密码 UI
     * @param paramsJson 配置参数 JSON 字符串
     *        - username: 默认填充的账号（可选）
     *        - account_type: 账号类型 1-通用 2-手机号 3-邮箱（可选，默认2）
     *        - password_hint: 密码输入提示（可选）
     * @param callback 回调，返回完整响应 JSON
     */
    void showResetPasswordUI(const std::string& paramsJson, ResultCallback callback);
    
    /**
     * 显示实名认证 UI
     * @param paramsJson 配置参数 JSON 字符串
     *        - cancelable: 是否可关闭（可选，默认 false 强制实名）
     * @param callback 回调，返回完整响应 JSON
     */
    void showRealNameAuthUI(const std::string& paramsJson, ResultCallback callback);
    
    /**
     * 显示绑定手机 UI
     * @param callback 回调，返回完整响应 JSON
     * 注意：如果已绑定手机会跳转到换绑页面
     */
    void showBindPhoneUI(ResultCallback callback);
    
    /**
     * 显示申请注销账号 UI
     * @param paramsJson 配置参数 JSON 字符串
     *        - game_user_id: 游戏用户 ID（可选）
     *        - nickname: 用户昵称（可选）
     * @param callback 回调，返回完整响应 JSON
     */
    void showDeleteAccountUI(const std::string& paramsJson, ResultCallback callback);
    
    /**
     * 显示撤销注销弹窗
     * @param paramsJson 配置参数 JSON 字符串
     *        - is_login_continue: 撤销后是否继续登录（可选，默认 true）
     * @param callback 回调，返回完整响应 JSON
     */
    void showCancelDeleteUI(const std::string& paramsJson, ResultCallback callback);
    
    /**
     * 显示协议页面
     * @param paramsJson 配置参数 JSON 字符串
     *        - key: 默认展示的协议 key（如 "00001" 用户协议，"00002" 隐私政策）
     *        - key_list: 要展示的协议列表（如 ["00001", "00002"]）
     */
    void showProtocolUI(const std::string& paramsJson);
    
    /**
     * 显示防沉迷提示弹窗
     * @param paramsJson 配置参数 JSON 字符串
     *        - title: 弹窗标题
     *        - content: 提示内容
     *        - btn_text: 按钮文本
     * @param callback 回调，返回完整响应 JSON
     */
    void showAntiAddictionUI(const std::string& paramsJson, ResultCallback callback);
    
    /**
     * 显示邮件中心
     * @param paramsJson 配置参数 JSON 字符串
     *        - cp_user_id: CP 用户 ID
     * @param callback 回调，返回完整响应 JSON
     */
    void showMailCenterUI(const std::string& paramsJson, ResultCallback callback);
    
    /**
     * 显示公告页面
     * @param paramsJson 配置参数 JSON 字符串
     *        - limit: 展示公告条数（默认 10）
     * @param callback 回调，返回完整响应 JSON
     */
    void showAnnouncementUI(const std::string& paramsJson, ResultCallback callback);
    
    /**
     * 显示版本更新
     * @param paramsJson 配置参数 JSON 字符串
     *        - version: 当前版本号（必填）
     *        - region: 地区码（默认 "150000"）
     *        - show_ui: 是否显示 UI（默认 true）
     * @param callback 回调，返回完整响应 JSON
     */
    void showVersionUpdateUI(const std::string& paramsJson, ResultCallback callback);

    /**
     * 游戏版本检查 V2
     * @param paramsJson 请求参数 JSON 字符串:
     *        - modules: 模块数组，每项包含以下必填字段:
     *          - module_tag: 模块标识
     *          - category_tag: 分类标识
     *          - clientversion: 客户端当前版本，0 表示首次接入或当前无相关版本
     *          - checkversion: 优先检查版本，不指定时传 0
     *        - type: 客户端类型（可选）
     * @param callback 回调，返回完整响应 JSON
     */
    void updateGameVersion(const std::string& paramsJson, ResultCallback callback);
    
    /**
     * 显示帮助中心
     * @param paramsJson 配置参数 JSON 字符串
     * @param callback 回调，返回完整响应 JSON
     */
    void showHelpCenterUI(const std::string& paramsJson, ResultCallback callback);
    
    /**
     * 显示登录 UI
     * @param paramsJson 登录 UI 配置 JSON 字符串
     * @param callback 回调，返回完整响应 JSON
     */
    void showLoginUI(const std::string& paramsJson, ResultCallback callback);
    
    /**
     * API 登录
     * @param paramsJson 登录参数 JSON 字符串
     * @param callback 回调，返回完整响应 JSON
     */
    void login(const std::string& paramsJson, ResultCallback callback);
    
    /**
     * 显示用户中心
     * @param paramsJson 用户中心配置 JSON 字符串:
     *        - game_user_id: 游戏用户 ID
     *        - nickname: 用户昵称
     *        - head_img_url: 用户头像 URL
     *        - queue_name: 客服接入节点（默认 "default"）
     *        - transmit_args: 透传参数
     *        - btns: 显示的按钮数组（real_name/privacy_policy/acount_cancel/phone_management/change_pwd）
     * @param callback 回调，返回完整响应 JSON
     */
    void showUserCenter(const std::string& paramsJson, ResultCallback callback);
    
    /**
     * 登出
     * @param callback 回调，返回完整响应 JSON
     */
    void logout(ResultCallback callback);

    /**
     * 请求当前渠道退出应用。
     * @param callback 回调 data.confirmed 区分确认和取消
     */
    void exitApp(ResultCallback callback);
    
    /**
     * 获取用户信息
     * @param callback 回调，返回完整响应 JSON
     */
    void getUserInfo(ResultCallback callback);

    /**
     * 获取指定用户信息
     * @param paramsJson 请求参数 JSON 字符串
     * @param callback 回调，返回完整响应 JSON
     */
    void getUserInfoByField(const std::string& paramsJson, ResultCallback callback);
    
    /**
     * 注册
     * @param paramsJson 注册参数 JSON 字符串
     */
    void registerAccount(const std::string& paramsJson, ResultCallback callback);
    
    /**
     * 发送验证码
     * @param paramsJson 参数: type(phone/email), target, purpose
     */
    void sendCaptcha(const std::string& paramsJson, ResultCallback callback);
    
    /**
     * 实名认证 API
     * @param paramsJson 参数: realname, idcard
     */
    void realAuth(const std::string& paramsJson, ResultCallback callback);
    
    /**
     * 获取 IIFAA 支付宝授权跳转地址（快速实名）
     * @param paramsJson 参数: app_name, third_part_schema
     */
    void getIIFAARedirectURL(const std::string& paramsJson, ResultCallback callback);
    
    /**
     * 查询绑定账号列表
     */
    void searchBindingAccounts(ResultCallback callback);
    
    /**
     * 检查是否已登录
     */
    bool isLoggedIn() const;
    
    /**
     * 获取当前用户 ID
     */
    std::string getUserId() const;
    
    // ==================== 支付系统 ====================
    
    /**
     * 发起支付
     * @param paramsJson 支付参数 JSON 字符串
     * Android 星驿 App 支付传 payType=xy；H5 支付额外传 ext.is_h5=1。
     * iOS 不支持星驿支付，payType=xy 会直接返回平台不支持。
     * @param callback 回调，返回完整响应 JSON
     */
    void pay(const std::string& paramsJson, ResultCallback callback);
    
    // ==================== 其他功能 ====================
    
    /**
     * 一键分享
     * @param paramsJson 分享参数 JSON 字符串:
     *        - func: 埋点标识（必填）
     *        - platform: 分享平台 wechat/system/facebook 等（必填）
     *        - shareScene: 0 好友, 1 朋友圈（可选）
     *        - region: 地区码（可选）
     *        - transmits: 透传参数（可选）
     * @param callback 回调，返回完整响应 JSON
     */
    void share(const std::string& paramsJson, ResultCallback callback);
    
    /**
     * 自定义分享
     * @param paramsJson 分享参数 JSON 字符串:
     *        - platform: 分享平台 wechat/system/facebook 等（必填）
     *        - type: 分享类型 text/image/link/video（必填）
     *        - title: 分享标题（可选）
     *        - content: 分享描述（可选）
     *        - url: 分享链接（可选）
     *        - image: 图片 URL 或本地路径（可选）
     *        - shareScene: 0 好友, 1 朋友圈（可选）
     * @param callback 回调，返回完整响应 JSON
     */
    void shareCustom(const std::string& paramsJson, ResultCallback callback);
    
    /**
     * 打开客服
     */
    void openCustomerService();
    
    // ==================== 游戏功能 ====================
    
    void createGameArea(const std::string& paramsJson, ResultCallback callback);
    void searchGameAreaList(ResultCallback callback);
    void searchGameAreaInfo(const std::string& paramsJson, ResultCallback callback);
    void createGameCharacter(const std::string& paramsJson, ResultCallback callback);
    void searchGameCharacterList(const std::string& paramsJson, ResultCallback callback);
    void searchGameCharacterInfo(const std::string& paramsJson, ResultCallback callback);
    void updateGameCharacter(const std::string& paramsJson, ResultCallback callback);
    void deleteGameCharacter(const std::string& paramsJson, ResultCallback callback);

    /**
     * 上报第三方渠道角色快照。
     * @param paramsJson GameInfo 字段 JSON
     */
    void setGameInfo(const std::string& paramsJson, ResultCallback callback);

    /**
     * 调用当前 Android 渠道实现的通用动作。
     * @param action ChannelAction 中定义的渠道无关动作
     * @param paramsJson 渠道动作参数 JSON
     */
    void invokeChannelAction(const std::string& action,
                             const std::string& paramsJson,
                             ResultCallback callback);

    // ==================== GDT 转化归因 ====================

    void gdtRegisterSdk();
    void gdtInitialize(const std::string& actionSetId, const std::string& secretKey,
                       const std::string& channel, const std::string& channelId);
    void gdtReportRegister(const std::string& method, bool success);
    void gdtReportLogin(const std::string& method, bool success);
    void gdtReportCreateRole(const std::string& role);
    void gdtReportCheckout(const std::string& type, const std::string& name,
                           const std::string& contentId, int number, bool isVirtualCurrency,
                           const std::string& virtualCurrencyType, const std::string& currency,
                           bool success);
    /**
     * @param valueInCents 真实货币金额，单位：分
     */
    void gdtReportPurchase(const std::string& goodsType, const std::string& goodsName,
                           const std::string& goodsId, int number,
                           const std::string& goodsChannel, const std::string& currency,
                           int valueInCents, bool success);
    void gdtReportQuestFinish(const std::string& id, const std::string& type,
                              const std::string& name, int number,
                              const std::string& description, bool success);
    void gdtReportShare(const std::string& channel, bool success);
    void gdtReportUpdateLevel(int level);
    void gdtReportRateApp(float value);
    void gdtReportViewContent(const std::string& type, const std::string& name,
                              const std::string& contentId);
    void gdtReportAddToCart(const std::string& type, const std::string& name,
                            const std::string& contentId, int number, bool success);
    
    // ==================== 数据埋点 ====================
    
    void getDistinctId(ResultCallback callback);
    void dataTrack(const std::string& paramsJson, ResultCallback callback);
    void trackUserAction(const std::string& paramsJson, ResultCallback callback);
    
    // ==================== 运营功能 ====================
    
    void createFeedback(const std::string& paramsJson, ResultCallback callback);
    void getTempNotice(ResultCallback callback);
    void getUnreadMessageCount(ResultCallback callback);
    void getPromoDisplayKey(ResultCallback callback);
    
    // ==================== 其他 ====================
    
    /**
     * 获取设备信息
     */
    std::string getDeviceInfo();
    
    
    // ==================== 回调处理（供原生层调用） ====================
    
    void onResult(const std::string& action, const std::string& responseJson);

private:
    RuixueBridge();
    ~RuixueBridge();
    
    // 禁止拷贝
    RuixueBridge(const RuixueBridge&) = delete;
    RuixueBridge& operator=(const RuixueBridge&) = delete;
    
    static RuixueBridge* _instance;
    
    bool _initialized;
    bool _loggedIn;
    std::string _userId;
    std::string _token;
    
    // 回调存储
    ResultCallback _initCallback;
    ResultCallback _initThirdSdkCallback;
    ResultCallback _loginCallback;
    ResultCallback _userCenterCallback;
    ResultCallback _resetPasswordCallback;
    ResultCallback _realNameAuthCallback;
    ResultCallback _bindPhoneCallback;
    ResultCallback _deleteAccountCallback;
    ResultCallback _cancelDeleteCallback;
    ResultCallback _antiAddictionCallback;
    ResultCallback _mailCenterCallback;
    ResultCallback _announcementCallback;
    ResultCallback _versionUpdateCallback;
    ResultCallback _updateGameVersionCallback;
    ResultCallback _helpCenterCallback;
    ResultCallback _logoutCallback;
    ResultCallback _exitAppCallback;
    ResultCallback _userInfoCallback;
    ResultCallback _userInfoByFieldCallback;
    ResultCallback _payCallback;
    ResultCallback _shareCallback;
    ResultCallback _shareCustomCallback;
    ResultCallback _registerCallback;
    ResultCallback _sendCaptchaCallback;
    ResultCallback _realAuthCallback;
    ResultCallback _getIIFAARedirectURLCallback;
    ResultCallback _searchBindingCallback;
    ResultCallback _createGameAreaCallback;
    ResultCallback _searchGameAreaListCallback;
    ResultCallback _searchGameAreaInfoCallback;
    ResultCallback _createGameCharacterCallback;
    ResultCallback _searchCharacterListCallback;
    ResultCallback _searchCharacterInfoCallback;
    ResultCallback _updateCharacterCallback;
    ResultCallback _deleteCharacterCallback;
    ResultCallback _setGameInfoCallback;
    ResultCallback _channelActionCallback;
    ResultCallback _getDistinctIdCallback;
    ResultCallback _dataTrackCallback;
    ResultCallback _trackUserActionCallback;
    ResultCallback _createFeedbackCallback;
    ResultCallback _tempNoticeCallback;
    ResultCallback _unreadMsgCountCallback;
    ResultCallback _promoDisplayKeyCallback;
};

} // namespace ruixue

#endif // __RUIXUE_BRIDGE_H__
