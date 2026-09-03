//
//  RXHUD.h
//  MisApp-iOS
//
//  Created by 陈汉 on 2023/2/14.
//

#import <Foundation/Foundation.h>
#import <MBProgressHUD/MBProgressHUD.h>
//#import "MBProgressHUD+Extension.h"

static CGFloat showDelayTime = 1.5;
OBJC_EXPORT NSString * const showText;

NS_ASSUME_NONNULL_BEGIN

@interface RXHUD : NSObject

@property (nonatomic,strong) MBProgressHUD * hud;

+ (instancetype)instantce;

+ (void)showHUD;
+ (void)showHUDWithOffset:(CGRect)rect;
+ (void)hideHUD;
+ (void)hideWebHUD;

+ (void)showText:(NSString *)text;

+ (void)showSuccessText:(NSString *)text;

+ (void)showErrorText:(NSString *)text;

@end

NS_ASSUME_NONNULL_END
