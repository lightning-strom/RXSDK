//
//  RXLocationManager.m
//  RXSDK
//
//  Created by 陈汉 on 2021/11/26.
//

#import "RXLocationManager.h"
#import <CoreLocation/CoreLocation.h>
#import "RXCommonHeader.h"

typedef void(^LocationBlock)(RXLocationModel *locationModel);

@interface RXLocationManager () <CLLocationManagerDelegate>

@property (nonatomic, strong) CLLocationManager *locationManger;
@property (nonatomic, strong) CLGeocoder *geocoder;
@property (nonatomic, assign) NSInteger duration;
@property (nonatomic, strong) NSTimer *timer;
@property (nonatomic, assign) double lnt;
@property (nonatomic, assign) double lat;
@property (nonatomic, assign) NSInteger updateType; // 0: 更新位置 1: 首次上报
@property (nonatomic, strong) NSArray *types;
@property (nonatomic, copy) LocationBlock locationBlock;
@property (nonatomic, assign) NSInteger localCount; // 定位次数
@property (nonatomic, strong) RXLocationModel *locationModel;

@end

@implementation RXLocationManager

+ (instancetype)sharedManger
{
    static RXLocationManager *manager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        manager = [[RXLocationManager alloc] init];
    });
    return manager;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.duration = 60;
        self.updateType = 1;
        self.locationModel = [[RXLocationModel alloc] init];
        // 打开定位 然后得到数据
        self.locationManger = [[CLLocationManager alloc] init];
        self.geocoder = [[CLGeocoder alloc] init];
        self.locationManger.delegate = self;
        //控制定位精度,越高耗电量越
        self.locationManger.desiredAccuracy = kCLLocationAccuracyBest;

        // 请求授权 requestWhenInUseAuthorization
        // respondsToSelector: 前面manager是否有后面requestWhenInUseAuthorization方法
        if ([self.locationManger respondsToSelector:@selector(requestWhenInUseAuthorization)]) {
            [self.locationManger requestWhenInUseAuthorization];
//            [_locationManger requestAlwaysAuthorization];
        }
    }
    return self;
}

// 获取当前定位
- (void)getLocationInfo:(void(^)(RXLocationModel *locationModel))complete
{
    self.localCount = 0;
    if (!_timer) {
        [self openWithDuration:0 types:@[@"default"]];
        self.locationBlock = complete;
    } else {
        if (complete) {
            complete(self.locationModel);
        }
    }
}

- (void)openWithDuration:(NSInteger)duration
                   types:(NSArray *)types
{
    _types = types;
    _duration = duration;
    // 停止上一次的
    [_locationManger stopUpdatingLocation];
    // 开始新的数据定位
    [_locationManger startUpdatingLocation];
}

- (void)stop {
    [self closeTime];
    [_locationManger stopUpdatingLocation];
}

// 持续获取定位
- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations {
    if (self.duration == 0) {
        if (self.localCount > 0) {
            return;
        }
        CLLocation *local = locations[0];
        CLLocationCoordinate2D local2D = local.coordinate;
        
        self.locationModel.longitude = local2D.longitude;
        self.locationModel.latitude = local2D.latitude;
        
        typeof(self) __weak weakSelf = self;
        [_geocoder reverseGeocodeLocation:local completionHandler:^(NSArray<CLPlacemark *> * _Nullable placemarks, NSError * _Nullable error) {
            typeof(self) __strong strongSelf = weakSelf;
            if (placemarks.count > 0) {
                CLPlacemark *placemark = [placemarks objectAtIndex:0];
                NSLog(@"%@",placemark.name);
                //获取城市
                NSString *city = placemark.locality;
                if (!city) {
                    //四大直辖市的城市信息无法通过locality获得，只能通过获取省份的方法来获得（如果city为空，则可知为直辖市）
                    city = placemark.administrativeArea;
                }
                strongSelf.locationModel.city = city;
                strongSelf.locationModel.name = placemark.name;
                strongSelf.locationModel.thoroughfare = placemark.thoroughfare;
                strongSelf.locationModel.subThoroughfare = placemark.subThoroughfare;
                strongSelf.locationModel.subLocality = placemark.subLocality;
                strongSelf.locationModel.country = placemark.country;
                
                
                if (strongSelf.locationBlock) {
                    strongSelf.locationBlock(strongSelf.locationModel);
                }
                
                // 位置名
                NSLog(@"位置 : %@", placemark.name);
                // 街道
                NSLog(@"街道 : %@", placemark.thoroughfare);
                // 子街道
                NSLog(@"子街道 : %@", placemark.subThoroughfare);
                // 市
                NSLog(@"市 : %@", city);
                // 区
                NSLog(@"区 : %@", placemark.subLocality);
                // 国家
                NSLog(@"国家 : %@", placemark.country);
                // 地区码
                NSLog(@"地区码 : %@", placemark.postalCode);
                NSLog(@"");
            }else if (error == nil && [placemarks count] == 0) {
                NSLog(@"No results were returned.");
            } else if (error != nil){
                NSLog(@"An error occurred = %@", error);
            }
        }];
        [self.locationManger stopUpdatingLocation];
        self.localCount++;
        return;
    }
    
    for (CLLocation *loc in locations) {
        CLLocationCoordinate2D l = loc.coordinate;
        double lat = l.latitude;
        double lnt = l.longitude;

        _lat = lat;
        _lnt = lnt;
        
        [self addMTimer];
    }
}

//失败代理方法
- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
    if ([error code] == kCLErrorDenied) {
        NSLog(@"访问被拒绝");
    }
    if ([error code] == kCLErrorLocationUnknown) {
        NSLog(@"无法获取位置信息");
    }
}

#pragma mark -- timer
-(void)addMTimer
{
    if (!_timer) {
        _timer=[NSTimer timerWithTimeInterval:self.duration target:self selector:@selector(timerAction) userInfo:nil repeats:YES];
        [[NSRunLoop mainRunLoop] addTimer:_timer forMode:NSRunLoopCommonModes];
        [_timer fire];
    }
}

- (void)timerAction
{
    if (self.duration == 0) {
        return;
    }
    [self requestLbsAdd];
}

- (void)closeTime
{
    if (self.timer.isValid) {
        [self.timer invalidate];
        self.timer = nil;
    }
}

#pragma mark -- request
- (void)requestLbsAdd
{
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:[RXApiManager reportLocationWithLon:self.lnt lat:self.lat types:self.types] success:^(id  _Nullable responseObject) {
        NSLog(@"位置上报成功:\n %@", responseObject);
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"位置上报失败:\n %@", error.error);
    }];
}

@end
