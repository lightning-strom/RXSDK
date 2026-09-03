/**
 * RuixueSDKWrapper.h
 * 瑞雪 SDK iOS 原生层封装 - 核心模块
 * 
 * 包含核心功能：初始化、API 登录、登出、获取用户信息、IAP 支付、分享
 * 依赖：RXSDK_Pure（IAP 支付、分享均为基础库自带功能）
 * 
 * UI 模块见 RuixueSDKWrapper+UI.h（需引入 RXUIKit）
 */

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RuixueSDKWrapper : NSObject

/**
 * 获取单例实例
 */
+ (instancetype)sharedInstance;

// ==================== 工具方法（供 Category 使用） ====================

/**
 * 解析 JSON 字符串为 NSDictionary
 */
- (NSDictionary *)parseJsonString:(NSString *)jsonString;

/**
 * NSDictionary 转 JSON 字符串
 */
- (NSString *)dictToJsonString:(NSDictionary *)dict;

/**
 * 构建响应 JSON 字符串
 */
- (NSString *)buildResponseWithCode:(NSInteger)code msg:(NSString *)msg data:(nullable NSDictionary *)data;

/**
 * 通过 action + response dict 回调 C++ 层
 */
- (void)callbackWithAction:(NSString *)action response:(NSDictionary *)response;

/**
 * 通过 action + code/msg/data 回调 C++ 层
 */
- (void)callbackWithAction:(NSString *)action code:(NSInteger)code msg:(NSString *)msg data:(nullable NSDictionary *)data;

/**
 * 显示 Toast 提示
 */
- (void)showToast:(NSString *)message;

/**
 * SDK 是否已初始化
 */
@property (nonatomic, assign, readonly) BOOL initialized;

// ==================== SDK 生命周期 ====================

/**
 * 初始化 SDK
 * @param paramsJson 初始化参数 JSON 字符串，包含:
 *        - cpid: CP 唯一 ID
 *        - productId: 应用 ID
 *        - channelId: 渠道 ID
 *        - baseUrls: 服务器地址列表数组
 */
- (void)initWithParamsJson:(NSString *)paramsJson;

/**
 * 设置游戏角色和区服信息。
 */
- (void)setGameInfoWithRoleId:(NSString *)roleId serverId:(NSString *)serverId;

// ==================== 用户系统（核心） ====================

/**
 * API 登录（直接调用接口，不弹出 UI）
 * @param paramsJson 登录参数 JSON 字符串:
 *        - loginType: 登录类型（guest/username/phone/apple/wechat 等）
 *        - username: 用户名（账号登录时使用）
 *        - password: 密码（账号登录时使用）
 *        - captchaCode: 验证码（手机登录时使用）
 */
- (void)loginWithParamsJson:(NSString *)paramsJson;

/**
 * 登出
 */
- (void)logout;

/**
 * 获取用户信息
 */
- (void)getUserInfo;

/**
 * 获取指定用户信息
 * @param paramsJson 请求参数 JSON 字符串
 */
- (void)getUserInfoByFieldWithParamsJson:(NSString *)paramsJson;

/**
 * 游戏版本检查 V2
 * @param paramsJson 请求参数 JSON 字符串，包含 modules 数组及可选 type
 */
- (void)updateGameVersionWithParamsJson:(NSString *)paramsJson;

// ==================== GDT 转化归因 ====================

- (void)gdtRegisterSdk;
- (void)gdtInitializeWithActionSetId:(NSString *)actionSetId secretKey:(NSString *)secretKey;
- (void)gdtReportRegisterWithMethod:(NSString *)method success:(BOOL)success;
- (void)gdtReportLoginWithMethod:(NSString *)method success:(BOOL)success;
- (void)gdtReportCreateRole:(NSString *)role;
- (void)gdtReportCheckoutWithType:(NSString *)type
                             name:(NSString *)name
                        contentId:(NSString *)contentId
                           number:(NSInteger)number
                virtualCurrency:(BOOL)isVirtualCurrency
              virtualCurrencyType:(NSString *)virtualCurrencyType
                         currency:(NSString *)currency
                          success:(BOOL)success;
- (void)gdtReportPurchaseWithType:(NSString *)type
                             name:(NSString *)name
                        contentId:(NSString *)contentId
                           number:(NSInteger)number
                          channel:(NSString *)channel
                         currency:(NSString *)currency
                     valueInCents:(NSInteger)valueInCents
                          success:(BOOL)success;
- (void)gdtReportQuestFinishWithId:(NSString *)questId
                              type:(NSString *)type
                              name:(NSString *)name
                            number:(NSInteger)number
                       description:(NSString *)description
                           success:(BOOL)success;
- (void)gdtReportShareWithChannel:(NSString *)channel success:(BOOL)success;
- (void)gdtReportUpdateLevel:(NSInteger)level;
- (void)gdtReportRateApp:(CGFloat)value;
- (void)gdtReportViewContentWithType:(NSString *)type
                                name:(NSString *)name
                           contentId:(NSString *)contentId;
- (void)gdtReportAddToCartWithType:(NSString *)type
                              name:(NSString *)name
                         contentId:(NSString *)contentId
                            number:(NSInteger)number
                           success:(BOOL)success;
- (void)gdtApplicationDidBecomeActive;
- (void)gdtHandleOpenURL:(NSURL *)url;

// ==================== 支付系统（IAP，基础库自带） ====================

/**
 * 发起 Apple IAP 支付
 * @param paramsJson 支付参数 JSON 字符串:
 *        - goodsTag: 商品标签/计费点（必填）
 *        - tradeNo: CP 订单号（必填）
 *        - currency: 币种（可选，默认 CNY）
 *        - transmitArgs: CP 透传参数（可选）
 *        - ext: 扩展参数（可选）
 *        - notifyUrl: 发货回调地址（可选）
 */
- (void)payWithParamsJson:(NSString *)paramsJson;

// ==================== 分享系统（基础库自带） ====================

/**
 * 一键分享
 * @param paramsJson 分享参数 JSON 字符串:
 *        - func: 埋点标识（必填）
 *        - platform: 分享平台 wechat/system/facebook 等（必填）
 *        - shareScene: 0 好友, 1 朋友圈（可选）
 */
- (void)shareWithParamsJson:(NSString *)paramsJson;

/**
 * 自定义分享
 * @param paramsJson 分享参数 JSON 字符串:
 *        - platform: 分享平台（必填）
 *        - type: 分享类型 text/image/link/video（必填）
 *        - title/content/url/image: 分享内容（可选）
 */
- (void)shareCustomWithParamsJson:(NSString *)paramsJson;

// ==================== 账号扩展（基础库自带） ====================

- (void)registerAccountWithParamsJson:(NSString *)paramsJson;
- (void)sendCaptchaWithParamsJson:(NSString *)paramsJson;
- (void)realAuthWithParamsJson:(NSString *)paramsJson;
- (void)searchBindingAccounts;

// ==================== 游戏区服/角色（基础库自带） ====================

- (void)createGameAreaWithParamsJson:(NSString *)paramsJson;
- (void)searchGameAreaList;
- (void)searchGameAreaInfoWithParamsJson:(NSString *)paramsJson;
- (void)createGameCharacterWithParamsJson:(NSString *)paramsJson;
- (void)searchGameCharacterListWithParamsJson:(NSString *)paramsJson;
- (void)searchGameCharacterInfoWithParamsJson:(NSString *)paramsJson;
- (void)updateGameCharacterWithParamsJson:(NSString *)paramsJson;
- (void)deleteGameCharacterWithParamsJson:(NSString *)paramsJson;

// ==================== 数据埋点（基础库自带） ====================

- (void)getDistinctId;
- (void)dataTrackWithParamsJson:(NSString *)paramsJson;
- (void)trackUserActionWithParamsJson:(NSString *)paramsJson;

// ==================== 运营功能（基础库自带） ====================

- (void)createFeedbackWithParamsJson:(NSString *)paramsJson;
- (void)getTempNotice;
- (void)getUnreadMessageCount;
- (void)getPromoDisplayKey;

// ==================== 其他功能（核心） ====================

/**
 * 获取设备信息
 */
- (NSString *)getDeviceInfo;

@end

NS_ASSUME_NONNULL_END
