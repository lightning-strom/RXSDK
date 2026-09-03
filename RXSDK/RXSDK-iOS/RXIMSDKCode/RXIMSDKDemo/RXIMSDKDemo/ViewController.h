//
//  ViewController.h
//  RXIMSdkDemo
//
//  Created by 陈汉 on 2021/8/18.
//

#import <UIKit/UIKit.h>

@interface ViewController : UIViewController

@property (nonatomic, strong) NSString *productId;
@property (nonatomic, assign) NSInteger cpId;
@property (nonatomic, strong) NSString *channelId;
@property (nonatomic, strong) NSString *domain;

- (void)getDebugParams;

@end

