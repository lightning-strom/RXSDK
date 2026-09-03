//
//  RXLoginUIConfig.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/15.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <RXSDK_Pure/RXLoginUIModel.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXLoginUIConfig : NSObject

/**
 * 登录模式
 */
@property (nonatomic, assign) LoginMode loginMode;
/**
 * @param loginTypes 要配置的登录类型，按照数组顺序展示
 * wechat          微信
 * visitor            游客登录
 * apple             苹果登录
 * account         账号登录
 * captchacode 验证码登录
 * quickphone   一键登录
 */
@property (nonatomic, strong) NSArray *loginTypes;
/**
 * 协议地址，顺序为 0位用户协议，1位隐私协议
 */
@property (nonatomic, strong) NSArray *privacies;
/**
 * 协议显示名称，顺序为 0位用户协议，1位隐私协议
 */
@property (nonatomic, strong) NSArray *privacieTitles;
/**
 * 登录显示的logo
 */
@property (nonatomic, strong) UIImage *logoImage;
/**
 * 登录页是否显示关闭按钮，默认显示
 */
@property (nonatomic, assign) BOOL isShowClose;
/**
 * 显示账号密码登录或验证码登录，0 账号密码登录  1 验证码登录  默认验证码登录
 */
@property (nonatomic, assign) NSInteger loginViewType;
/**
 * 账号密码登录方式键盘类型，1 全键盘  2 数字键盘 3 邮箱键盘  默认全键盘
 */
@property (nonatomic, assign) NSInteger keyboardType;
/**
 * 验证码登录的新用户是否弹出设置密码，默认不弹出
 * 注：弹出设置密码后登录数据将在设置成功或关闭设置页面后返回
 */
@property (nonatomic, assign) BOOL needSetPassword;
/**
 * 是否显示底部快速登录按钮，默认显示
 */
@property (nonatomic, assign) BOOL isQuickButtonBarVisible;
/**
 * 处于注销中的用户登录后是否显示注销窗口，默认不显示
 */
@property (nonatomic, assign) BOOL isShowDeregister;
/**
 * 注销按钮显示继续登录或退出登录
 * login登录，logout退出登录
 */
@property (nonatomic, strong) NSString *deregisterType;
/**
 * 快速开始登录方式显示名称
 * @note 默认显示 “快速开始”
 */
@property (nonatomic, strong) NSString *guestTitle;
/**
 * 自定义参数
 */
@property (nonatomic, strong) NSDictionary *setCustomParams;
/**
 * 自定义透传参数
 */
@property (nonatomic, strong) NSDictionary *setCustomExt;
/**
 * 是否为审核模式
 * @note 审核模式只展示苹果登录，且和正常样式不同
 */
@property (nonatomic, assign) BOOL isAudit;
/**
 * 是否展示登录历史弹窗，true 展示，false 不展示，默认 ture
 * @note SDK 会记录已登录的账号记录，下次调用会展示登录历史弹窗
 */
@property (nonatomic, assign) BOOL isHistoryViewEnable;
/**
 * 未实名用户登录成功后是否需要强制实名认证，默认强制
 * 注：强制实名后登录数据将在实名认证成功后返回
 */
@property (nonatomic, assign) BOOL needRealAuth;
/**
 * 实名认证是否可关闭，默认可关闭
 */
@property (nonatomic, assign) BOOL canCloseRealAuth;
/**
 * 协议是否勾选
 */
@property (nonatomic, assign) BOOL isPrivacySelected;
/**
 * 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]
 */
@property (nonatomic, strong) NSArray *signFields;
/**
 * 任意合法的 json 类型, 比如 string, number，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP
 */
@property (nonatomic, assign) id migrateArgs;
/**
 * 二次登录 loginOpenid
 * @note 传入 method 和 loginOpenid 后将不会拉起登录 UI，直接调用二次登录，登录失效会默认进行授权登录
 */
@property (nonatomic, strong) NSString *loginOpenid;
/**
 * 二次登录 method
 * @note 传入 method 和 loginOpenid 后将不会拉起登录 UI，直接调用二次登录，登录失效会默认进行授权登录
 */
@property (nonatomic, strong) NSString *method;

@end

NS_ASSUME_NONNULL_END
