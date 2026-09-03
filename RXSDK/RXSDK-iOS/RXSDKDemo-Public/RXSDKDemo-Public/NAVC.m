//
//  NAVC.m
//  RXSDKDemo
//
//  Created by 陈汉 on 2023/5/19.
//

#import "NAVC.h"
#import "Tool.h"

@interface NAVC ()

@end

@implementation NAVC

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    if (@available(iOS 16.0, *)) {
    } else {
        if ([Tool sharedSDK].interface == 1)
        {
            //横屏
            [[UIDevice currentDevice] setValue:@(UIInterfaceOrientationPortrait) forKey:@"orientation"];
        }else
        {
            //竖屏
            [[UIDevice currentDevice] setValue:@(UIInterfaceOrientationLandscapeRight) forKey:@"orientation"];
        }   
    }
}

@end
