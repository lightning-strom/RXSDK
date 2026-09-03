//
//  RXGDTService.m
//  RXGDTSDK
//
//  Created by 陈汉 on 2025/12/1.
//

#import "RXGDTService.h"
#import "GDTAction.h"
#import "GDTAction+convenience.h"
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>

@interface RXGDTService ()

@property (nonatomic, assign) BOOL gdtInitialized;
@property (nonatomic, assign) BOOL autoTrack;
@property (nonatomic, strong) NSMutableArray<NSDictionary *> *pendingActions;

@end

@implementation RXGDTService

static RXGDTService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXGDTService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        
        self.autoTrack = YES;
        self.pendingActions = [NSMutableArray array];
        [RXSubPackage sharedSDK].aRXGDT = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(gdtInit:) name:rxUserDefault_gdt_init object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(gdtRegister:) name:rxUserDefault_gdt_register object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(gdtLogin:) name:rxUserDefault_gdt_login object:nil];
    }
    return self;
}

#pragma mark -- from main framework
- (void)gdtInit:(NSNotification *)noti
{
    @try {
        if (!self.autoTrack) {
            return;
        }
        
        NSDictionary *dic = noti.userInfo;
        NSString *actionSetId = dic[@"actionSetId"];
        NSString *secretKey = dic[@"secretKey"];
        
        [self initWithActionSetId:actionSetId secretKey:secretKey];
        
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

- (void)gdtRegister:(NSNotification *)noti
{
    @try {
        if (!self.autoTrack) {
            return;
        }
        
        NSDictionary *dic = noti.userInfo;
        NSString *method = dic[@"method"];
        
        [self reportRegisterActionWithMethod:method isSuccess:YES];
        
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

- (void)gdtLogin:(NSNotification *)noti
{
    @try {
        if (!self.autoTrack) {
            return;
        }
        
        NSDictionary *dic = noti.userInfo;
        NSString *method = dic[@"method"];
        
        [self reportLoginActionWithMethod:method isSuccess:YES];
        
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

- (void)setAutoTrack:(BOOL)autoTrack
{
    _autoTrack = autoTrack;
}

- (void)regist
{
//    [OpenInstallSDK initWithDelegate:self];
    NSLog(@"RXGDTSDK 初始化成功");
}

/**
 * 处理 openUrl 唤起数据
 */
- (void)handleOpenUrl:(NSURL *)url
{
    @try {
        NSString *urlStr = url.absoluteString;
        
        if (urlStr && urlStr.length > 0) {
            [self logAction:@"START_APP" actionParam:@{@"open_url" : urlStr}];
        } else {
            [self logAction:@"START_APP" actionParam:@{}];
        }
        
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

/**
 * 通用上报
 */
- (void)logAction:(NSString *)actionName actionParam:(NSDictionary *)actionParam
{
    @try {
        @synchronized (self) {
            if (!self.gdtInitialized) {
                [self.pendingActions addObject:@{
                    @"actionName" : [actionName copy],
                    @"actionParam" : [actionParam copy]
                }];
                return;
            }
        }
        
        [GDTAction logAction:actionName actionParam:actionParam];
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

/**
 * 激活
 */
- (void)initWithActionSetId:(NSString *)actionSetId secretKey:(NSString *)secretKey
{
    [GDTAction init:actionSetId secretKey:secretKey];
    [GDTAction start];
    
    @synchronized (self) {
        NSArray<NSDictionary *> *pendingActions = [self.pendingActions copy];
        [self.pendingActions removeAllObjects];
        self.gdtInitialized = YES;
        
        for (NSDictionary *action in pendingActions) {
            [self logAction:action[@"actionName"] actionParam:action[@"actionParam"]];
        }
    }
}

/**
 * 注册
 * @param method 表示注册方式，业务方可以传任意可标识注册方式的值，如注册方式为手机号（method = @"phone" ）、微信注册（method = @“WeChat” ）、邮箱（method = @"mail"）等；方便业务方在数据平台以method为key查询数据
 * @param isSuccess 是否注册成功
 */
- (void)reportRegisterActionWithMethod:(NSString *)method isSuccess:(BOOL)isSuccess
{
    [GDTAction reportRegisterActionWithMethod:method isSuccess:isSuccess];
}

/**
 * 登录
 * @param method 表示登录的方式，如游戏账号、手机号等
 * @param isSuccess 是否登录成功
 */
- (void)reportLoginActionWithMethod:(NSString *)method isSuccess:(BOOL)isSuccess
{
    [GDTAction reportLoginActionWithMethod:method isSuccess:isSuccess];
}

/**
 * 创建角色
 * @param role 游戏角色
 */
- (void)reportCreateRoleActionWithRole:(NSString *)role
{
    [GDTAction reportCreateRoleActionWithRole:role];
}

/**
 * 下单
 * @param type 内容类型如“配备”、“皮肤"
 * @param name 商品或内容名称
 * @param contentID 商品或内容标识符
 * @param number 商品数量
 * @param isVirtualCurrency 是否使用的是虚拟货币
 * @param virtualCurrencyType 虚拟货币类型，如"元宝"、“金币”等
 * @param realCurrencyType 真实货币类型，ISO 4217代码，如：“USD”
 * @param isSuccess 提交购买/下单是否成功
 */
- (void)reportCheckoutActionWithContentType:(NSString *)type contentName:(NSString *)name contentID:(NSString *)contentID contentNumber:(NSUInteger)number isVirtualCurrency:(BOOL)isVirtualCurrency virtualCurrencyType:(NSString *)virtualCurrencyType realCurrencyType:(NSString *)realCurrencyType isSuccess:(BOOL)isSuccess
{
    [GDTAction reportCheckoutActionWithContentType:type contentName:name contentID:contentID contentNumber:number isVirtualCurrency:isVirtualCurrency virtualCurrencyType:virtualCurrencyType realCurrencyType:realCurrencyType isSuccess:isSuccess];
}

/**
 * 支付
 * @param type 内容类型如“配备”、“皮肤”
 * @param name 商品或内容名称
 * @param contentID 商品或内容标识符
 * @param number 商品数量
 * @param channel 支付渠道名，如支付宝、微信等 @param realCurrency 真实货币类型，ISO 4217代码，如：“USD”
 * @param amount 本次支付的真实货币的金额
 * @param isSuccess 支付是否成功
 */
- (void)reportPurchaseActionWithContentType:(NSString *)type contentName:(NSString *)name contentID:(NSString *)contentID contentNumber:(NSUInteger)number paymentChannel:(NSString *)channel realCurrency:(NSString *)realCurrency currencyAmount:(unsigned long long)amount isSuccess:(BOOL)isSuccess
{
    [GDTAction reportPurchaseActionWithContentType:type contentName:name contentID:contentID contentNumber:number paymentChannel:channel realCurrency:realCurrency currencyAmount:amount isSuccess:isSuccess];
}

/**
 * 完成节点（如教学/任务/副本）时调用此接口
 * @param questID 教学/任务/副本等关卡标识符
 * @param type 节点类型
 * @param name 教学/任务/副本等关卡名称
 * @param number 第几个任务节点
 * @param desc 节点描述
 * @param isSuccess 节点是否完成*
 */
- (void)reportFinishQuestActionWithQuestID:(NSString *)questID questType:(NSString *)type questName:(NSString *)name questNumer:(NSUInteger)number description:(NSString *)desc isSuccess:(BOOL)isSuccess
{
    [GDTAction reportFinishQuestActionWithQuestID:questID questType:type questName:name questNumer:number description:desc isSuccess:isSuccess];
}

/**
 * 分享至社交媒体时调用此接口
 * @param channel 社交媒体
 * @param isSuccess 分享是否成功
 */
- (void)reportShareActionWithChannel:(NSString *)channel isSuccess:(BOOL)isSuccess
{
    [GDTAction reportShareActionWithChannel:channel isSuccess:isSuccess];
}

/**
 * 用户升级后调用此接口
 * @param level 当前用户等级
 */
- (void)reportUpgradeLevelActionWithLevel:(NSUInteger)level
{
    [GDTAction reportUpgradeLevelActionWithLevel:level];
}

/**
 * 对APP进行应用商店评分时调用此接口
 * @param rate 评分
 */
- (void)reportRateActionWithRate:(CGFloat)rate
{
    [GDTAction reportRateActionWithRate:rate];
}

/**
 * 查看内容/商品详情时调用此接口
 * @param type 内容类型如“配备”、“皮肤”
 * @param name 商品或内容名称
 * @param contentID 商品或内容标识符
 */
- (void)reportViewContentActionWithContentType:(NSString *)type contentName:(NSString *)name contentID:(NSString *)contentID
{
    [GDTAction reportViewContentActionWithContentType:type contentName:name contentID:contentID];
}

/**
 * 加入购物车时调用此接口
 * @param type 内容类型如“配备”、“皮肤”
 * @param name 商品或内容名称
 * @param contentID 商品或内容标识符
 * @param number 商品数量
 * @param isSuccess 加入购买/购物车是否成功
 */
- (void)reportAddingToCartActionWithContentType:(NSString *)type contentName:(NSString *)name contentID:(NSString *)contentID contentNumber:(NSUInteger)number isSuccess:(BOOL)isSuccess
{
    [GDTAction reportAddingToCartActionWithContentType:type contentName:name contentID:contentID contentNumber:number isSuccess:isSuccess];
}

@end
