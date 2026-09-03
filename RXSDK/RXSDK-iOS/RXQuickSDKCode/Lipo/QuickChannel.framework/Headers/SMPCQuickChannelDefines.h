//
//  SMPCQuickPlatformDefines.h
//  QuickPlatforms
//
//  Created by C.Maverick on 14/11/26.
//
//

#ifndef QuickChannel_SMPCQuickChannelDefines_h
#define QuickChannel_SMPCQuickChannelDefines_h

#pragma mark - Notification Name
// 初始化通知
#define kSmpcQCInitDidFinishedNotification      @"kSmpcQCInitDidFinishedNotification"
//取消登陆
#define kSmpcQCLogCancelNotification               @"kSmpcQCLogCancelNotification"
// 登录通知
#define kSmpcQCLoginNotification                @"kSmpcQCLoginNotification"
// 登出通知
#define kSmpcQCLogoutNotification               @"kSmpcQCLogoutNotification"
/** 实名认证结果通知 */
#define kSmpcQCRealAuthNotification               @"kSmpcQCRealAuthNotification"
// 退出暂停页
#define kSmpcQCPauseDidExitNotification         @"kSmpcQCPauseDidExitNotification"
// 充值结果通知
#define kSmpcQCRechargeResultNotification       @"kSmpcQCRechargeResultNotification"
// 查询接商品信息的通知
//#define kSmpcQCGetLocalizedNotification       @"kSmpcQCGetLocalizedNotification"
// 离开平台页面通知
#define kSmpcQCLeavedNotification               @"kSmpcQCLeavedNotification"
/** 特殊方法结果回调通知 */
#define kSmpcQCExtrNotification               @"kSmpcQCExtraNotification"
#define QUICK_CHANNEL_TO_CP_NOTIFICATON_KEY @"quick_channel_to_cp_notification_key" //QUICK_CHANNEL_TO_CP_NOTIFICATON_KEY这个键定义了QuickSDK标准接口不能提供更多的信息给cp那边时的传输方案，这个通知带上渠道SDK需要传递到cp的信息.通常不需要，遇到了再讨论


#pragma mark - Notification UserInfo Key
// 错误编码
#define kSmpcQCNotificationErrorKey             @"error"
// 错误描述
#define kSmpcQCNotificationErrorMsg             @"msg"
// QuickSDK 的订单号
#define kSmpcQCNotificationOrderId              @"orderId"
// 游戏开发商给的订单号
#define kSmpcQCNotificationCpOrderId            @"cpOrderId"
// 第3方渠道sdk给的订单号
#define kSmpcQCNotificationSdkOrderId           @"sdkOrderId"
// 透传参数
#define kSmpcQCNotificationExtraParams          @"extraParams"
// 用户id
#define kSmpcQCNotificationUserId               @"userId"
// sessionID
#define kSmpcQCNotificationSessionId            @"sessionId"
// token
#define kSmpcQCNotificationToken                @"token"
// 二次验证时sdk方提供的数据
#define kSmpcQCNotificationSdkData              @"sdkData"
/** 实名认证回调是否已实名 */
#define kSmpcQCNotificationSdkRealName              @"realName"
/** 实名认证后年龄 */
#define kSmpcQCNotificationSdkRealAge              @"age"
/** 实名认证失败是否可以继续游戏 */
#define kSmpcQCNotificationSdkRealResumeGame              @"realResumeGame"
/** 预留字段 */
#define kSmpcQCNotificationSdkRealOther              @"other"

#pragma mark - Enum

// 版本检测类型
typedef NS_ENUM(NSInteger, SMPC_CHANNEL_VERSION_CHECK_LEVEL) {
    SMPC_CHANNEL_VERSION_CHECK_LEVEL_NORMAL = 0,    // 正常等级
    SMPC_CHANNEL_VERSION_CHECK_LEVEL_STRICT,        // 严格等级
};

// 浮动条位置
typedef NS_ENUM(NSInteger, SMPC_CHANNEL_TOOLBAR_PLACE) {
    SMPC_CHANNEL_TOOLBAR_PLACE_TOP_LEFT = 1,    // 左上
    SMPC_CHANNEL_TOOLBAR_PLACE_TOP_RIGHT,       // 右上
    SMPC_CHANNEL_TOOLBAR_PLACE_MID_LEFT,        // 左中
    SMPC_CHANNEL_TOOLBAR_PLACE_MID_RIGHT,       // 右中
    SMPC_CHANNEL_TOOLBAR_PLACE_BOT_LEFT,        // 左下
    SMPC_CHANNEL_TOOLBAR_PLACE_BOT_RIGHT,       // 右下
};

// 错误编码
typedef NS_ENUM(NSInteger, SMPC_CHANNEL_RESULT_CODE) {
    SMPC_CHANNEL_RESULT_ERROR_NONE                      = 0,    /**< 没有错误 */
    SMPC_CHANNEL_RESULT_ERROR_INIT_FAILED               = -1,   /**< 初始化失败 */
    SMPC_CHANNEL_RESULT_ERROR_CONFIG                    = -2,   /**< 配置文件错误 */
    SMPC_CHANNEL_RESULT_ERROR_NETWORK                   = -3,   /**< 网络连接错误 */
    SMPC_CHANNEL_RESULT_ERROR_PARAM                     = -4,   /**< 参数错误 */
    SMPC_CHANNEL_RESULT_ERROR_UNSUPPORTED               = -10,  /**< 功能不被支持 */

    SMPC_CHANNEL_RESULT_ERROR_NOT_INIT                  = -20,  /**< 没有初始化 */
    SMPC_CHANNEL_RESULT_ERROR_NOT_LOGIN                 = -21,  /**< 没有登录用户 */
    SMPC_CHANNEL_RESULT_ERROR_HAD_LOGIN                 = -22,  /**< 已有登录用户 */
    
    SMPC_CHANNEL_RESULT_ERROR_RECHARGE_INVALID          = -30,  /**< 支付信息无效 */
    SMPC_CHANNEL_RESULT_ERROR_RECHARGE_FAILED           = -31,  /**< 充值失败 */
    SMPC_CHANNEL_RESULT_ERROR_RECHARGE_CANCELLED        = -32,  /**< 充值取消 */
    
    SMPC_CHANNEL_RESULT_ERROR_UNKNOWN                   = -200, /**< 未知错误 */
};

// 登录校验类型
typedef NS_ENUM(NSInteger, SMPC_CHANNEL_LOGINCHECK_LEVEL) {
    SMPC_CHANNEL_LOGINCHECK_LEVEL_NONE      = 0,    // 没有登录校验
    SMPC_CHANNEL_LOGINCHECK_LEVEL_OPTIONAL,         // 登录校验可选
    SMPC_CHANNEL_LOGINCHECK_LEVEL_REQUEST,          // 登录校验必选
};

#endif
