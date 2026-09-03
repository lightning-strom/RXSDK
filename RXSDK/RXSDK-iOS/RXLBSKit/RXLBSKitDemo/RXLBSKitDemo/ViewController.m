//
//  ViewController.m
//  RXLBSKitDemo
//
//  Created by 陈汉 on 2022/4/26.
//

#import "ViewController.h"
#import <RXLBSKit/RXLBSKit.h>

@interface ViewController ()

@property (nonatomic, strong) UIButton *mGetLocationButton;

@end

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    NSString *appKey = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"AMapAPIKey"];
    if (appKey.length > 0) {
        [[RXLBSKitService sharedSDK] registeAMWithAppkey:appKey];
    }

    self.mGetLocationButton = [UIButton buttonWithType:UIButtonTypeSystem];
    [self.mGetLocationButton setTitle:@"获取位置信息" forState:UIControlStateNormal];
    [self.mGetLocationButton addTarget:self
                                action:@selector(getLocationButtonTapped)
                      forControlEvents:UIControlEventTouchUpInside];
    self.mGetLocationButton.translatesAutoresizingMaskIntoConstraints = NO;
    [self.view addSubview:self.mGetLocationButton];

    [NSLayoutConstraint activateConstraints:@[
        [self.mGetLocationButton.centerXAnchor constraintEqualToAnchor:self.view.centerXAnchor],
        [self.mGetLocationButton.centerYAnchor constraintEqualToAnchor:self.view.centerYAnchor]
    ]];
}

- (void)getLocationButtonTapped
{
    NSString *appKey = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"AMapAPIKey"];
    if (appKey.length == 0) {
        [self showMessage:@"请先在 Info.plist 的 AMapAPIKey 中配置高德 Key"];
        return;
    }

    __weak typeof(self) weakSelf = self;
    [[RXLBSKitService sharedSDK] requestLocationAuthorization:^(BOOL authorization) {
        if (!authorization) {
            [weakSelf showMessage:@"未获得定位权限"];
            return;
        }

        [[RXLBSKitService sharedSDK] getLocationInfo:^(RXLBSModel *location, NSError *error) {
            if (error) {
                [weakSelf showMessage:error.localizedDescription];
                return;
            }

            NSString *message = [NSString stringWithFormat:@"%@\n经度：%f\n纬度：%f",
                                 location.formattedAddress,
                                 location.longitude,
                                 location.latitude];
            [weakSelf showMessage:message];
        }];
    }];
}

- (void)showMessage:(NSString *)message
{
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"RXLBSKit"
                                                                   message:message
                                                            preferredStyle:UIAlertControllerStyleAlert];
    [alert addAction:[UIAlertAction actionWithTitle:@"确定"
                                              style:UIAlertActionStyleDefault
                                            handler:nil]];
    [self presentViewController:alert animated:YES completion:nil];
}

@end
