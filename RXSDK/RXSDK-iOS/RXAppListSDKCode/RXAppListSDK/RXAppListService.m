//
//  RXAppListService.m
//  RXAppListSDK
//
//  Created by 陈汉 on 2024/3/28.
//

#import "RXAppListService.h"
#import <objc/runtime.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>

@interface RXAppListService ()

@property (nonatomic, strong) NSMutableArray *appInfoList;
@property (nonatomic, copy) GetAppInfoBlock getAppInfoBlock;
@property (nonatomic, strong) NSDictionary *config;

@end

@implementation RXAppListService

static RXAppListService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXAppListService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.appInfoList = [NSMutableArray array];
        
        [RXSubPackage sharedSDK].aRXList = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(listAction:) name:rxUserDefault_alist object:nil];
    }
    return self;
}

#pragma mark -- from main framework
- (void)listAction:(NSNotification *)noti
{
    NSDictionary *appsConfig = noti.userInfo[@"appsConfig"];
    GetAppInfoBlock callback = noti.userInfo[@"callback"];
    
    [self getAppInfoWithConfig:appsConfig complete:callback];
}

- (void)regist
{
    NSLog(@"RXAppListSDK 初始化成功");
}

- (void)getAppInfoWithConfig:(NSDictionary *)config
                    complete:(GetAppInfoBlock)complete
{
    self.getAppInfoBlock = complete;
    self.config = config;
    NSThread *thread = [[NSThread alloc] initWithTarget:self selector:@selector(run) object:nil];
    [thread start];
}

- (void)run
{
    [self getAppInfoList];
}

- (void)getAppInfoList {
    Class LSApplicationWorkspace = objc_getClass("LSApplicationWorkspace");
    Class LSApplicationProxy = objc_getClass("LSApplicationProxy");

    id defaultWorkspace = [LSApplicationWorkspace performSelector:@selector(defaultWorkspace)];
  
    // 此方法在iOS12+获取不到
//    id allApplications = [defaultWorkspace performSelector:@selector(allInstalledApplications)];
    NSArray *plugins = [defaultWorkspace performSelector:@selector(installedPlugins)];
    
    NSMutableSet *list = [[NSMutableSet alloc] init];
    for (id plugin in plugins) {
        id bundle = [plugin performSelector:@selector(containingBundle)];
        if (bundle) {
            [list addObject:bundle];
        }
    }

    // 遍历所有app信息
    for (id plugin in list) {
        NSMutableDictionary *appInfoDic = [NSMutableDictionary dictionary];
        // BundleID
        NSString *bundleIdentifier = [plugin performSelector:@selector(bundleIdentifier)];
        if (![bundleIdentifier containsString:@"com.apple"]) {
            
            NSArray *items = self.config[@"in"];
            
            for (int i = 0; i < items.count; i++) {
                NSString *item = items[i];
                if ([item isEqualToString:@"rx_app_name"]) {
                    // 应用名
                    NSString *itemName = [plugin performSelector:@selector(itemName)];
                    if (itemName && itemName.length > 0) {
                        [appInfoDic setValue:itemName forKey:@"rx_app_name"];
                    }
                }
                if ([item isEqualToString:@"rx_package_id"]) {
                    // BundleID
                    if (bundleIdentifier && bundleIdentifier.length > 0) {
                        [appInfoDic setValue:bundleIdentifier forKey:@"rx_package_id"];
                    }
                }
                if ([item isEqualToString:@"rx_version"]) {
                    // 版本号
                    NSString *shortVersionString = [plugin performSelector:@selector(shortVersionString)];
                    if (shortVersionString && shortVersionString.length > 0) {
                        [appInfoDic setValue:shortVersionString forKey:@"rx_version"];
                    }
                }
                if ([item isEqualToString:@"rx_teamid"]) {
                    // 项目所属团队 id
                    NSString *teamID = [plugin performSelector:@selector(teamID)];
                    if (teamID && teamID.length > 0) {
                        [appInfoDic setValue:teamID forKey:@"rx_teamid"];
                    }
                }
                if ([item isEqualToString:@"rx_minimum_system_version"]) {
                    // 支持的系统版本
                    NSString *minimumSystemVersion = [plugin performSelector:@selector(minimumSystemVersion)];
                    if (minimumSystemVersion && minimumSystemVersion.length > 0) {
                        [appInfoDic setValue:minimumSystemVersion forKey:@"rx_minimum_system_version"];
                    }
                }
                if ([item isEqualToString:@"rx_vendor_name"]) {
                    // 所属的开发者账号
                    NSString *vendorName = [plugin performSelector:@selector(vendorName)];
                    if (vendorName && vendorName.length > 0) {
                        [appInfoDic setValue:vendorName forKey:@"rx_vendor_name"];
                    }
                }
            }
            
            [self.appInfoList addObject:appInfoDic];
            
//            NSString *applicationDSID = [plugin performSelector:@selector(applicationDSID)];
//            NSLog(@"applicationDSID -> %@", applicationDSID);
//            
//            NSString *applicationIdentifier = [plugin performSelector:@selector(applicationIdentifier)];
//            NSLog(@"applicationIdentifier -> %@", applicationIdentifier);
//            
//            NSString *applicationType = [plugin performSelector:@selector(applicationType)];
//            NSLog(@"applicationType -> %@", applicationType);
//            
//            NSString *dynamicDiskUsage = [plugin performSelector:@selector(dynamicDiskUsage)];
//            NSLog(@"dynamicDiskUsage -> %@", dynamicDiskUsage);
//            
//            NSString *itemID = [plugin performSelector:@selector(itemID)];
//            NSLog(@"itemID -> %@", itemID);
            
//            NSString *requiredDeviceCapabilities = [plugin performSelector:@selector(requiredDeviceCapabilities)];
//            NSLog(@"requiredDeviceCapabilities -> %@", requiredDeviceCapabilities);
            
//            NSString *sdkVersion = [plugin performSelector:@selector(sdkVersion)];
//            NSLog(@"sdkVersion -> %@", sdkVersion);
            

            
//            NSString *sourceAppIdentifier = [plugin performSelector:@selector(sourceAppIdentifier)];
//            NSLog(@"sourceAppIdentifier -> %@", sourceAppIdentifier);
            
//            NSString *staticDiskUsage = [plugin performSelector:@selector(staticDiskUsage)];
//            NSLog(@"staticDiskUsage -> %@", staticDiskUsage);
        }
    }
    
    if (self.getAppInfoBlock) {
        self.getAppInfoBlock(self.appInfoList);
    }
}

@end
