//
//  RXUIKitService.h
//  RXUIKit
//
//  Created by 陈汉 on 2022/2/19.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import "RXLoginUIConfig.h"

NS_ASSUME_NONNULL_BEGIN

typedef enum : NSUInteger {
    AntiBtnType_logout, // 退出登录
    AntiBtnType_default // 知道了
} AntiBtnType; // 防沉迷按钮类型

@interface RXUIKitService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 配置logo
 * @param logo 展示的logo
 * @param titleImage 展示的标题图片
 */
- (void)configLogo:(UIImage *)logo titleImage:(UIImage *)titleImage;

/**
 * 调用登录弹窗
 * @param config 登录页基础配置
 * @param loginEvent 页面操作事件，可回调自定义参数
 * @param complete 登录结果
 */
- (void)setLoginViewWithConfig:(RXLoginUIConfig *)config
                    loginEvent:(NSDictionary *(^)(NSDictionary *loginEvent, LoginType loginType))loginEvent
                      complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

// 关闭登陆弹窗
- (void)closeLoginView;

/**
 * 注册/添加账号
 * @param extDic 扩展字段，可传nil
 * @param isSelect 协议是否勾选
 */
- (void)setAddAccountViewWithIsSelect:(BOOL)isSelect
                               extDic:(NSMutableDictionary * _Nullable)extDic
                             complete:(void(^)(BOOL success, NSString *username, NSString *password))complete;

/**
 * 协议声明
 * @param key 默认展示的条款key
 * @param legalData 法务信息api返回的数据
 */
- (void)setPrivacyViewWithKey:(NSString *)key
                    legalData:(NSDictionary *)legalData;

/**
 * 实名认证
 * @param canClose 是否展示关闭按钮，默认不展示
 */
- (void)setRealauthViewWithCanClose:(BOOL)canClose
                           complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/**
 * 防沉迷弹框
 * @param title 标题
 * @param des 内容
 * @param type 按钮类型   AntiBtnType_logout按钮为退出游戏   AntiBtnType_default按钮为知道了，点击后block回调
 */
- (void)setAntiAdditionViewWithTitle:(NSString *)title
                                 des:(NSString *)des
                                type:(AntiBtnType)type
                            complete:(void(^)(void))complete;

/**
 * 权限说明弹框
 * @param keys 要展示的权限key 传空展示所有权限
 * @param clickBlock 点击事件回调   status 0拒绝  1同意
 */
- (void)setLimitViewWithKeys:(NSArray * _Nullable)keys
                  clickBlock:(void(^)(NSInteger status))clickBlock;

/**
 * 权限说明弹框
 * @param legalData 法务信息api返回的数据
 * @param clickBlock 点击事件回调   status 0拒绝  1同意
 */
- (void)setPermissionViewWithLegalData:(NSDictionary *)legalData
                            clickBlock:(void(^)(NSInteger status))clickBlock;

/**
 * 绑定手机
 */
- (void)bindingPhoneWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/**
 * 找回密码
 */
- (void)getBackPasswordWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/**
 * 获取账号密码
 */
- (NSDictionary *)getAccountInfo;

@end

NS_ASSUME_NONNULL_END
