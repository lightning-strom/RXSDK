#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <RXGDTSDK/RXGDTSDK.h>
#import "AppDelegateListener.h"

static NSString *RXGDTString(const char *value)
{
    return value ? [NSString stringWithUTF8String:value] : @"";
}

extern "C" {
    void rx_gdt_register()
    {
        [[RXGDTService sharedSDK] regist];
    }

    void rx_gdt_initialize(const char *actionSetId, const char *secretKey)
    {
        [[RXGDTService sharedSDK] initWithActionSetId:RXGDTString(actionSetId)
                                           secretKey:RXGDTString(secretKey)];
    }

    void rx_gdt_report_register(const char *method, int success)
    {
        [[RXGDTService sharedSDK] reportRegisterActionWithMethod:RXGDTString(method)
                                                      isSuccess:success != 0];
    }

    void rx_gdt_report_login(const char *method, int success)
    {
        [[RXGDTService sharedSDK] reportLoginActionWithMethod:RXGDTString(method)
                                                   isSuccess:success != 0];
    }

    void rx_gdt_report_create_role(const char *role)
    {
        [[RXGDTService sharedSDK] reportCreateRoleActionWithRole:RXGDTString(role)];
    }

    void rx_gdt_report_checkout(const char *type, const char *name, const char *contentId,
        int number, int isVirtualCurrency, const char *virtualCurrencyType, const char *currency,
        int success)
    {
        [[RXGDTService sharedSDK]
            reportCheckoutActionWithContentType:RXGDTString(type)
                                    contentName:RXGDTString(name)
                                      contentID:RXGDTString(contentId)
                                  contentNumber:(NSUInteger)number
                              isVirtualCurrency:isVirtualCurrency != 0
                            virtualCurrencyType:RXGDTString(virtualCurrencyType)
                               realCurrencyType:RXGDTString(currency)
                                      isSuccess:success != 0];
    }

    void rx_gdt_report_purchase(const char *type, const char *name, const char *contentId,
        int number, const char *channel, const char *currency, int valueInCents, int success)
    {
        [[RXGDTService sharedSDK]
            reportPurchaseActionWithContentType:RXGDTString(type)
                                    contentName:RXGDTString(name)
                                      contentID:RXGDTString(contentId)
                                  contentNumber:(NSUInteger)number
                                 paymentChannel:RXGDTString(channel)
                                   realCurrency:RXGDTString(currency)
                                 currencyAmount:(unsigned long long)valueInCents
                                      isSuccess:success != 0];
    }

    void rx_gdt_report_quest_finish(const char *questId, const char *type, const char *name,
        int number, const char *description, int success)
    {
        [[RXGDTService sharedSDK]
            reportFinishQuestActionWithQuestID:RXGDTString(questId)
                                     questType:RXGDTString(type)
                                     questName:RXGDTString(name)
                                    questNumer:(NSUInteger)number
                                   description:RXGDTString(description)
                                     isSuccess:success != 0];
    }

    void rx_gdt_report_share(const char *channel, int success)
    {
        [[RXGDTService sharedSDK] reportShareActionWithChannel:RXGDTString(channel)
                                                    isSuccess:success != 0];
    }

    void rx_gdt_report_update_level(int level)
    {
        [[RXGDTService sharedSDK] reportUpgradeLevelActionWithLevel:(NSUInteger)level];
    }

    void rx_gdt_report_rate_app(float value)
    {
        [[RXGDTService sharedSDK] reportRateActionWithRate:(CGFloat)value];
    }

    void rx_gdt_report_view_content(const char *type, const char *name, const char *contentId)
    {
        [[RXGDTService sharedSDK]
            reportViewContentActionWithContentType:RXGDTString(type)
                                       contentName:RXGDTString(name)
                                         contentID:RXGDTString(contentId)];
    }

    void rx_gdt_report_add_to_cart(const char *type, const char *name, const char *contentId,
        int number, int success)
    {
        [[RXGDTService sharedSDK]
            reportAddingToCartActionWithContentType:RXGDTString(type)
                                        contentName:RXGDTString(name)
                                          contentID:RXGDTString(contentId)
                                      contentNumber:(NSUInteger)number
                                          isSuccess:success != 0];
    }
}

@interface RuiXueIOSBridgeGDTDelegate : NSObject <AppDelegateListener>
+ (instancetype)sharedInstance;
@end

@implementation RuiXueIOSBridgeGDTDelegate

+ (void)load
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [RuiXueIOSBridgeGDTDelegate sharedInstance];
    });
}

+ (instancetype)sharedInstance
{
    static RuiXueIOSBridgeGDTDelegate *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [RuiXueIOSBridgeGDTDelegate new];
        UnityRegisterAppDelegateListener(sharedInstance);
        [[NSNotificationCenter defaultCenter]
            addObserverForName:UIApplicationDidBecomeActiveNotification
                        object:nil
                         queue:[NSOperationQueue mainQueue]
                    usingBlock:^(__unused NSNotification *notification) {
            [[RXGDTService sharedSDK] logAction:@"START_APP" actionParam:@{}];
        }];
    });
    return sharedInstance;
}

- (void)onOpenURL:(NSNotification *)notification
{
    NSURL *url = notification.userInfo[@"url"];
    if (url) {
        [[RXGDTService sharedSDK] handleOpenUrl:url];
    }
}

@end
