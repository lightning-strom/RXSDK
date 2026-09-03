//
//  RXFeedbackLocation.m
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/16.
//

#import "RXFeedbackLocation.h"
#import "RXPlayerFeedbackService.h"
#import "RXFeedbackTool.h"
#import <RXLanguageKit/RXLanguageKit.h>
#import <objc/message.h>
#import <objc/runtime.h>

@implementation RXFeedbackLocation

+ (NSString *)osLaunguage:(NSString *)text
{
    //国内
    NSString *cName = @"RXUIKitService";
    Class class = NSClassFromString(cName);
    if (class) {
        return text;
    }
    
    //海外
    NSString *cNameOS = @"RXOSUIKitService";
    Class classOS = NSClassFromString(cNameOS);
    if (classOS) {
    // 1. 获取 RXOSUserUtility 的 sharedManager 实例
        id sharedManager = [self getSharedManagerFromClass:NSClassFromString(@"RXOSUserUtility")];
        id feedbackLoginConfig = nil;
        if (sharedManager) {
            // 2. 获取 loginConfig 属性，使用 getter 方法获取 loginConfig 属性值
            id loginConfig = [self getPropertyValue:@"loginConfig" fromObject:sharedManager];

            if (loginConfig) {
                // 3. 获取 RXFeedbackUILoginConfig 类
                Class feedbackLoginConfigClass = NSClassFromString(@"RXFeedbackUILoginConfig");
                feedbackLoginConfig = [[feedbackLoginConfigClass alloc] init];

                // 4. 将 loginConfig 中的属性值复制到 feedbackLoginConfig
                [self copyPropertiesFrom:loginConfig toObject:feedbackLoginConfig];

                // 使用 feedbackLoginConfig...
                NSLog(@"Converted feedbackLoginConfig: %@", feedbackLoginConfig);
            }
        }
        if (feedbackLoginConfig != nil) {
            [RXFeedbackUserUtility sharedManager].loginConfig = feedbackLoginConfig;
        }
        RXFeedbackUILoginConfig *config = [RXFeedbackUserUtility sharedManager].loginConfig;
        
        NSString *setLanguage = [[NSUserDefaults standardUserDefaults] valueForKey:keyUser_setLanguage];
        if (setLanguage && setLanguage.length > 0) {
            config.language_default = setLanguage;
        }
        
    //    NSBundle *bundle = [NSBundle bundleForClass:[RXPlayerFeedbackService class]];
        
    //    NSString *package = @"RXOSLocationEN";
    //    if ([[config.language_default lowercaseString] isEqualToString:@"ja"]) {
    //        package = @"RXOSLocationJP";
    //    }
    //
    //    NSString *plistPath = [bundle pathForResource:package ofType:@"plist"];
    //
    //    NSMutableDictionary *launguage = [[NSMutableDictionary alloc] initWithContentsOfFile:plistPath];
        
        NSString *osStr = text;
        BOOL isOS = [[NSUserDefaults standardUserDefaults] boolForKey:keyUser_isOS];
        if (isOS) {
    //        NSString *value = [launguage valueForKey:text];
            
            if ([[config.language_default lowercaseString] isEqualToString:@"zh"] || [[config.language_default lowercaseString] isEqualToString:@"zh-cn"]) {
                
            } else {
                osStr = [RXLanguageService getTestWithLanguage:[config.language_default lowercaseString] text:text];
    //            if (value && value.length > 0) {
    //                osStr = [launguage valueForKey:text];
    //            }
            }
        }
        
        return osStr;
    }
    
    return text;
}

// 通过 runtime 获取 sharedManager 单例
+ (id)getSharedManagerFromClass:(Class)cls {
    SEL sharedManagerSelector = NSSelectorFromString(@"sharedManager");
    if ([cls respondsToSelector:sharedManagerSelector]) {
        IMP imp = [cls methodForSelector:sharedManagerSelector];
        id (*func)(id, SEL) = (void *)imp;
        return func(cls, sharedManagerSelector);
    }
    return nil;
}

// 通过 runtime 获取对象的属性值（通过 getter 方法）
+ (id)getPropertyValue:(NSString *)propertyName fromObject:(id)obj {
    // 获取属性的 getter 方法选择器
    SEL getterSelector = NSSelectorFromString(propertyName);
    if ([obj respondsToSelector:getterSelector]) {
        // 获取函数指针
        IMP imp = [obj methodForSelector:getterSelector];
        id (*func)(id, SEL) = (void *)imp;
        // 调用 getter 方法
        return func(obj, getterSelector);
    }
    return nil;
}

// 通过 runtime 将一个对象的属性值复制到另一个对象
+ (void)copyPropertiesFrom:(id)sourceObject toObject:(id)destinationObject {
    unsigned int outCount, i;
    objc_property_t *properties = class_copyPropertyList([sourceObject class], &outCount);

    for (i = 0; i < outCount; i++) {
        objc_property_t property = properties[i];
        const char *propName = property_getName(property);
        NSString *propertyName = [NSString stringWithUTF8String:propName];

        // 检查 destinationObject 是否有相同的属性
        if ([self doesClass:[destinationObject class] haveProperty:propertyName]) {
            id value = [sourceObject valueForKey:propertyName];
            [destinationObject setValue:value forKey:propertyName];
        }
    }
    free(properties);
}

// 检查类是否有某个属性
+ (BOOL)doesClass:(Class)cls haveProperty:(NSString *)propertyName {
    objc_property_t property = class_getProperty(cls, [propertyName UTF8String]);
    return property != NULL;
}

@end
