//
//  RXFeedbackHUD.h
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/15.
//

#import <Foundation/Foundation.h>
#import "RXFeedbackProgressHUD.h"

static CGFloat showDelayTime = 1.5;
OBJC_EXPORT NSString * const showText;

NS_ASSUME_NONNULL_BEGIN

@interface RXFeedbackHUD : NSObject

@property (nonatomic,strong) RXFeedbackProgressHUD * hud;

+ (instancetype)instantce;

+ (void)showHUD;
+ (void)showHUDNotAutoHide;
+ (void)showHUDWithOffset:(CGRect)rect;
+ (void)hideHUD;
+ (void)hideWebHUD;

+ (void)showText:(NSString *)text;

+ (void)showSuccessText:(NSString *)text;

+ (void)showErrorText:(NSString *)text;

@end

NS_ASSUME_NONNULL_END
