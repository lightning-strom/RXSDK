//
//  RXLBSKitService.m
//  RXLBSKit
//
//  Created by 陈汉 on 2026/7/20.
//

#import "RXLBSKitService.h"
#import <AMapFoundationKit/AMapFoundationKit.h>
#import <AMapLocationKit/AMapLocationKit.h>

static NSString * const RXLBSKitErrorDomain = @"com.ruixue.RXLBSKit";

@interface RXLBSKitService () <CLLocationManagerDelegate>

@property (nonatomic, strong) AMapLocationManager *mLocationManager;
@property (nonatomic, strong) CLLocationManager *mAuthorizationManager;
@property (nonatomic, copy) void (^mAuthorizationBlock)(BOOL authorization);

@end

@implementation RXLBSKitService

+ (instancetype)sharedSDK
{
    static RXLBSKitService *service = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        service = [[RXLBSKitService alloc] init];
    });
    return service;
}

- (void)registeAMWithAppkey:(NSString *)appkey
{
    [AMapServices sharedServices].apiKey = appkey;
}

- (BOOL)enableLocationAuthorizationStatus
{
    if (![CLLocationManager locationServicesEnabled]) {
        return NO;
    }

    CLAuthorizationStatus status = [self currentAuthorizationStatus];
    return status == kCLAuthorizationStatusAuthorizedWhenInUse ||
           status == kCLAuthorizationStatusAuthorizedAlways;
}

- (void)requestLocationAuthorization:(void (^)(BOOL))complete
{
    if (!complete) {
        return;
    }

    if (![NSThread isMainThread]) {
        dispatch_async(dispatch_get_main_queue(), ^{
            [self requestLocationAuthorization:complete];
        });
        return;
    }

    if (![CLLocationManager locationServicesEnabled]) {
        complete(NO);
        return;
    }

    CLAuthorizationStatus status = [self currentAuthorizationStatus];
    if (status != kCLAuthorizationStatusNotDetermined) {
        complete([self enableLocationAuthorizationStatus]);
        return;
    }

    self.mAuthorizationBlock = complete;
    self.mAuthorizationManager = [[CLLocationManager alloc] init];
    self.mAuthorizationManager.delegate = self;
    [self.mAuthorizationManager requestWhenInUseAuthorization];
}

- (void)getLocationInfo:(void (^)(RXLBSModel *, NSError *))complete
{
    if (!complete) {
        return;
    }

    if (![NSThread isMainThread]) {
        dispatch_async(dispatch_get_main_queue(), ^{
            [self getLocationInfo:complete];
        });
        return;
    }

    BOOL accepted = [self.mLocationManager requestLocationWithReGeocode:YES
                                                        completionBlock:^(CLLocation *location,
                                                                          AMapLocationReGeocode *regeocode,
                                                                          NSError *error) {
        [self dispatchOnMainQueue:^{
            if (error) {
                complete(nil, error);
                return;
            }

            RXLBSModel *model = [[RXLBSModel alloc] init];
            model.formattedAddress = regeocode.formattedAddress ?: @"";
            model.country = regeocode.country ?: @"";
            model.province = regeocode.province ?: @"";
            model.city = regeocode.city ?: @"";
            model.district = regeocode.district ?: @"";
            model.citycode = regeocode.citycode ?: @"";
            model.adcode = regeocode.adcode ?: @"";
            model.street = regeocode.street ?: @"";
            model.number = regeocode.number ?: @"";
            model.POIName = regeocode.POIName ?: @"";
            model.AOIName = regeocode.AOIName ?: @"";
            model.longitude = location.coordinate.longitude;
            model.latitude = location.coordinate.latitude;
            complete(model, nil);
        }];
    }];

    if (!accepted) {
        NSError *error = [NSError errorWithDomain:RXLBSKitErrorDomain
                                             code:6001
                                         userInfo:@{NSLocalizedDescriptionKey: @"无法发起定位请求"}];
        [self dispatchOnMainQueue:^{
            complete(nil, error);
        }];
    }
}

- (void)setAllowsBackgroundLocationUpdates:(BOOL)allow
{
    self.mLocationManager.allowsBackgroundLocationUpdates = allow;
}

- (void)setLocationTimeout:(NSInteger)locationTimeout
{
    self.mLocationManager.locationTimeout = MAX(2, locationTimeout);
}

#pragma mark - CLLocationManagerDelegate

- (void)locationManagerDidChangeAuthorization:(CLLocationManager *)manager
{
    [self completeAuthorizationRequestIfNeeded];
}

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-implementations"
- (void)locationManager:(CLLocationManager *)manager
didChangeAuthorizationStatus:(CLAuthorizationStatus)status
{
    [self completeAuthorizationRequestIfNeeded];
}
#pragma clang diagnostic pop

#pragma mark - Private

- (AMapLocationManager *)mLocationManager
{
    if (!_mLocationManager) {
        _mLocationManager = [[AMapLocationManager alloc] init];
        _mLocationManager.locationTimeout = 2;
        _mLocationManager.reGeocodeTimeout = 2;
    }
    return _mLocationManager;
}

- (CLAuthorizationStatus)currentAuthorizationStatus
{
    if (@available(iOS 14.0, *)) {
        return self.mAuthorizationManager
            ? self.mAuthorizationManager.authorizationStatus
            : [[CLLocationManager alloc] init].authorizationStatus;
    }
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
    return [CLLocationManager authorizationStatus];
#pragma clang diagnostic pop
}

- (void)completeAuthorizationRequestIfNeeded
{
    CLAuthorizationStatus status = [self currentAuthorizationStatus];
    if (status == kCLAuthorizationStatusNotDetermined || !self.mAuthorizationBlock) {
        return;
    }

    void (^complete)(BOOL) = self.mAuthorizationBlock;
    self.mAuthorizationBlock = nil;
    self.mAuthorizationManager.delegate = nil;
    self.mAuthorizationManager = nil;
    [self dispatchOnMainQueue:^{
        complete([self enableLocationAuthorizationStatus]);
    }];
}

- (void)dispatchOnMainQueue:(dispatch_block_t)block
{
    if ([NSThread isMainThread]) {
        block();
    } else {
        dispatch_async(dispatch_get_main_queue(), block);
    }
}

@end
