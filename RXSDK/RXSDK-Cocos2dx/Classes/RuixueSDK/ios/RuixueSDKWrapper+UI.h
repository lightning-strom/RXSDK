/**
 * RuixueSDKWrapper+UI.h
 * 瑞雪 SDK iOS 原生层封装 - UI 模块
 * 
 * 包含所有 UI 展示功能：登录UI、用户中心、找回密码、实名认证等
 * 依赖：RXUIKit（如未引入，方法将返回模块不可用错误）
 */

#import "RuixueSDKWrapper.h"

NS_ASSUME_NONNULL_BEGIN

@interface RuixueSDKWrapper (UI)

/**
 * 显示登录 UI
 */
- (void)showLoginUIWithParamsJson:(NSString *)paramsJson;

/**
 * 显示用户中心
 */
- (void)showUserCenterWithParamsJson:(NSString *)paramsJson;

/**
 * 显示找回密码 UI
 */
- (void)showResetPasswordUIWithParamsJson:(NSString *)paramsJson;

/**
 * 显示实名认证 UI
 */
- (void)showRealNameAuthUIWithParamsJson:(NSString *)paramsJson;

/**
 * 显示绑定手机 UI
 */
- (void)showBindPhoneUI;

/**
 * 显示申请注销账号 UI
 */
- (void)showDeleteAccountUIWithParamsJson:(NSString *)paramsJson;

/**
 * 显示撤销注销弹窗
 */
- (void)showCancelDeleteUIWithParamsJson:(NSString *)paramsJson;

/**
 * 显示协议页面
 */
- (void)showProtocolUIWithParamsJson:(NSString *)paramsJson;

/**
 * 显示防沉迷提示弹窗
 */
- (void)showAntiAddictionUIWithParamsJson:(NSString *)paramsJson;

/**
 * 显示邮件中心
 */
- (void)showMailCenterUIWithParamsJson:(NSString *)paramsJson;

/**
 * 显示公告页面
 */
- (void)showAnnouncementUIWithParamsJson:(NSString *)paramsJson;

/**
 * 显示版本更新
 */
- (void)showVersionUpdateUIWithParamsJson:(NSString *)paramsJson;

/**
 * 显示帮助中心
 */
- (void)showHelpCenterUIWithParamsJson:(NSString *)paramsJson;

@end

NS_ASSUME_NONNULL_END
