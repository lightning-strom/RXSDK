//
//  RXUserUtility.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/29.
//

#import "RXUserUtility.h"

@implementation RXUserUtility

+ (instancetype)sharedManager
{
    static RXUserUtility *manager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        manager = [[RXUserUtility alloc] init];
    });
    return manager;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.busRequestList = [NSMutableArray array];
        self.productInfoDic = [NSMutableDictionary dictionary];
        self.isInit = NO;
        self.sk2 = NO;
        self.openRacing = NO;
    }
    return self;
}

+ (void)setValue:(id)value ForKey:(NSString *)key
{
    [[NSUserDefaults standardUserDefaults] setValue:value forKey:key];
    if ([key isEqualToString:keyUserData_access]) {
        [[NSUserDefaults standardUserDefaults] setValue:value forKey:@"RXNotiKey_token"];
    }
}

+ (void)setBool:(BOOL)value ForKey:(NSString *)key
{
    [[NSUserDefaults standardUserDefaults] setBool:value forKey:key];
}

+ (BOOL)boolForKey:(NSString *)key
{
    return [[NSUserDefaults standardUserDefaults] boolForKey:key];
}

+ (id)valueForKey:(NSString *)key
{
    return [[NSUserDefaults standardUserDefaults] valueForKey:key];
}

#pragma mark -- <非本地保存>

@end
