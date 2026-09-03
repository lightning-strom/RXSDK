//
//  RXOSUserCenterConfig.h
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/15.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXOSUserCenterConfig : NSObject

/**
 * 显示的logo
 */
@property (nonatomic, strong) UIImage *logoImage;

/**
 * 透传给客服面板的参数 使用jsonString形式（客服用）
 */
@property (nonatomic, strong) NSString *transmit_args;
/**
 * 用户的游戏id（客服用）
 */
@property (nonatomic, strong) NSString *game_user_id;
/**
 * 用户昵称，不传默认取登录nickname（客服用）
 */
@property (nonatomic, strong) NSString *nickname;
/**
 * 用户头像（客服用）
 */
@property (nonatomic, strong) NSString *head_img_url;
/**
 * 在瑞雪客服系统设置的接入点名称 不填写默认为default（客服用）
 */
@property (nonatomic, strong) NSString *queue_name;
/**
 * 设置主体模式，默认为浅色
 * YES 为浅色，NO 为深色模式
 */
@property (nonatomic, assign) BOOL setLightTheme;
/**
 * @note 不可用
 * 用户中心是否展示同步信息按钮，默认不展示
 * 用于同步三方信息
 * YES 为展示，NO 为不展示
 */
@property (nonatomic, assign) BOOL setSyncInfoEnable;
/**
 * 用户中心配置
 * 如不需要展示某一项可以将配置去掉，默认全展示
 * 配置用户中心入口结构如下：
 * @{@"btns" : @[@"real_name",                    实名认证
              @"privacy_policy",              隐私政策
              @"acount_cancel",              账号注销
              @"phone_management",    账号管理
              @"change_pwd"]                修改密码
 
 *   }
 */
@property (nonatomic, strong) NSDictionary *setConfigParams;
/**
 * 帮助中心和客服页面是否允许横竖屏旋转
 * @note 使用该属性工程配置必须支持横竖屏旋转
 * YES 为可以，NO 为不可以，默认 NO
 */
@property (nonatomic, assign) BOOL orientationVisible;
/**
 * 是否开启 webview 数据上报
 * @note 临时使用，YES 开启，NO 不开启，默认 NO
 */
@property (nonatomic, assign) BOOL openWebViewLog;
@end

NS_ASSUME_NONNULL_END
