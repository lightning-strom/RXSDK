//
//  RXHUD.m
//  MisApp-iOS
//
//  Created by 陈汉 on 2023/2/14.
//

#import "RXHUD.h"
#import <objc/message.h>
#import "RXUICommonTool.h"
#import "UIImage+RXAddition.h"

NSString * const showText = @"正在加载";

#define msgSend(...) ((void (*)(void *, SEL, id))objc_msgSend)(__VA_ARGS__)
#define msgTarget(target) (__bridge void *)(target)

#define HUDTAG 100000
#define WEBHUDTAG 100001

@interface RXHUD () <MBProgressHUDDelegate>
@property (nonatomic,strong) id target;
@property (nonatomic,assign) SEL method;
@property (nonatomic,strong) UIWindow *keyWindow;

@end

@implementation RXHUD

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

+ (instancetype)instantce
{
    static dispatch_once_t onceToken;
    static RXHUD *obj = nil;
    dispatch_once(&onceToken, ^{
        obj = [[RXHUD alloc] init];
    });
    return obj;
}

- (instancetype)init
{
    self = [super init];
    if (self) {

    }
    return self;
}

+ (void)showText:(NSString *)text
{
    [RXHUD instantce];

    UIView *view = [[UIApplication sharedApplication] keyWindow];
    
    if (!view) {
        return;
    }
    
    [RXHUD hideHUDForView:view];
    MBProgressHUD *hud = [[MBProgressHUD alloc] initWithView:view];
    hud.tag = HUDTAG;
    hud.userInteractionEnabled = YES;
    hud.removeFromSuperViewOnHide = YES;
    hud.mode = MBProgressHUDModeText;
    
    hud.bezelView.style = MBProgressHUDBackgroundStyleSolidColor;
    hud.bezelView.alpha = 0.96;
    hud.bezelView.backgroundColor = [UIColor colorWithHexString:@"#272A2B"];
    hud.bezelView.layer.cornerRadius = 12;
    
    hud.detailsLabel.text = text;
    hud.detailsLabel.textColor = [UIColor whiteColor];
    hud.detailsLabel.font = [UIFont systemFontOfSize:14];
    
    
    [view addSubview:hud];
    [hud showAnimated:YES];
    [hud hideAnimated:YES afterDelay:1.5];
}

/**
 * 添加文字loading，没有icon，支持设置展示时长
 */
+ (void)showText:(NSString *)text delay:(NSInteger)delay
{
    [RXHUD instantce];

    UIView *view = [[UIApplication sharedApplication] keyWindow];
    
    if (!view) {
        return;
    }
    
    [RXHUD hideHUDForView:view];
    MBProgressHUD *hud = [[MBProgressHUD alloc] initWithView:view];
    hud.tag = HUDTAG;
    hud.userInteractionEnabled = YES;
    hud.removeFromSuperViewOnHide = YES;
    hud.mode = MBProgressHUDModeText;
    
    hud.bezelView.style = MBProgressHUDBackgroundStyleSolidColor;
    hud.bezelView.alpha = 0.96;
    hud.bezelView.backgroundColor = [UIColor colorWithHexString:@"#272A2B"];
    hud.bezelView.layer.cornerRadius = 12;
    
    hud.detailsLabel.text = text;
    hud.detailsLabel.textColor = [UIColor whiteColor];
    hud.detailsLabel.font = [UIFont systemFontOfSize:14];
    
    
    [view addSubview:hud];
    [hud showAnimated:YES];
    [hud hideAnimated:YES afterDelay:delay];
}

+ (void)showErrorText:(NSString *)text
{
    [RXHUD instantce];

    UIView *view = [[UIApplication sharedApplication] keyWindow];
    
    if (!view) {
        return;
    }
    
    [RXHUD hideHUDForView:view];
    MBProgressHUD *hud = [[MBProgressHUD alloc] initWithView:view];
    hud.tag = HUDTAG;
    hud.userInteractionEnabled = YES;
    hud.removeFromSuperViewOnHide = YES;
    hud.mode = MBProgressHUDModeCustomView;
//    hud.margin = 5;
    
//    UIImage *i = [UIImage rxBundleImageNamed:@"rx_loading_fail"];
//    i = [i translatePixelColorByTargetNearBlackColorRGBA:0x000000FF nearWhiteColorRGBA:0x323232FF transColorRGBA:0xFF0000FF inRect:CGRectMake(0, 0, 100, 100)];
    
    UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage rxBundleImageNamed:@"rx_loading_fail"]];
    imageView.clipsToBounds = YES;
    imageView.contentMode = UIViewContentModeScaleToFill;
    hud.customView = imageView;
    
    hud.bezelView.style = MBProgressHUDBackgroundStyleSolidColor;
    hud.bezelView.alpha = 0.96;
    hud.bezelView.backgroundColor = [UIColor colorWithHexString:@"#272A2B"];
    hud.bezelView.layer.cornerRadius = 12;
    
    hud.detailsLabel.text = text;
    hud.detailsLabel.textColor = [UIColor whiteColor];
    hud.detailsLabel.font = [UIFont systemFontOfSize:14];
    
    
    [view addSubview:hud];
    [hud showAnimated:YES];
    [hud hideAnimated:YES afterDelay:1.5];
}

/**
 * 失败icon+文字，支持设置展示时长
 */
+ (void)showErrorText:(NSString *)text delay:(NSInteger)delay
{
    [RXHUD instantce];

    UIView *view = [[UIApplication sharedApplication] keyWindow];
    
    if (!view) {
        return;
    }
    
    [RXHUD hideHUDForView:view];
    MBProgressHUD *hud = [[MBProgressHUD alloc] initWithView:view];
    hud.tag = HUDTAG;
    hud.userInteractionEnabled = YES;
    hud.removeFromSuperViewOnHide = YES;
    hud.mode = MBProgressHUDModeCustomView;
//    hud.margin = 5;
    
//    UIImage *i = [UIImage rxBundleImageNamed:@"rx_loading_fail"];
//    i = [i translatePixelColorByTargetNearBlackColorRGBA:0x000000FF nearWhiteColorRGBA:0x323232FF transColorRGBA:0xFF0000FF inRect:CGRectMake(0, 0, 100, 100)];
    
    UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage rxBundleImageNamed:@"rx_loading_fail"]];
    imageView.clipsToBounds = YES;
    imageView.contentMode = UIViewContentModeScaleToFill;
    hud.customView = imageView;
    
    hud.bezelView.style = MBProgressHUDBackgroundStyleSolidColor;
    hud.bezelView.alpha = 0.96;
    hud.bezelView.backgroundColor = [UIColor colorWithHexString:@"#272A2B"];
    hud.bezelView.layer.cornerRadius = 12;
    
    hud.detailsLabel.text = text;
    hud.detailsLabel.textColor = [UIColor whiteColor];
    hud.detailsLabel.font = [UIFont systemFontOfSize:14];
    
    
    [view addSubview:hud];
    [hud showAnimated:YES];
    [hud hideAnimated:YES afterDelay:delay];
}

+ (void)showSuccessText:(NSString *)text
{
    [RXHUD instantce];

    UIView *view = [[UIApplication sharedApplication] keyWindow];
    
    if (!view) {
        return;
    }
    
    [RXHUD hideHUDForView:view];
    MBProgressHUD *hud = [[MBProgressHUD alloc] initWithView:view];
    hud.tag = HUDTAG;
    hud.userInteractionEnabled = YES;
    hud.removeFromSuperViewOnHide = YES;
    hud.mode = MBProgressHUDModeCustomView;
    
    UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage rxBundleImageNamed:@"rx_loading_success"]];
    imageView.clipsToBounds = YES;
    imageView.contentMode = UIViewContentModeScaleToFill;
    hud.customView = imageView;
    
    hud.bezelView.style = MBProgressHUDBackgroundStyleSolidColor;
    hud.bezelView.alpha = 0.96;
    hud.bezelView.backgroundColor = [UIColor colorWithHexString:@"#272A2B"];
    hud.bezelView.layer.cornerRadius = 12;
    
    hud.detailsLabel.text = text;
    hud.detailsLabel.textColor = [UIColor whiteColor];
    hud.detailsLabel.font = [UIFont systemFontOfSize:14];
    
    [view addSubview:hud];
    [hud showAnimated:YES];
    [hud hideAnimated:YES afterDelay:1.5];
}

+ (void)showHUD
{
    [RXHUD instantce];

    UIView *view = [[UIApplication sharedApplication] keyWindow];
    
    if (!view) {
        return;
    }
    
    MBProgressHUD *hud = [[MBProgressHUD alloc] initWithView:view];
    hud.tag = HUDTAG;
    hud.userInteractionEnabled = YES;
    hud.removeFromSuperViewOnHide = YES;
    hud.mode = MBProgressHUDModeCustomView;
    hud.animationType = MBProgressHUDAnimationFade;
    
    hud.bezelView.style = MBProgressHUDBackgroundStyleSolidColor;
    hud.bezelView.backgroundColor = [UIColor colorWithHexString:@"#272A2B"];
    hud.bezelView.alpha = 0.96;
    hud.bezelView.layer.cornerRadius = 12;


    
    UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage rxBundleImageNamed:@"rx_loading"]];
    imageView.clipsToBounds = YES;
    imageView.contentMode = UIViewContentModeScaleToFill;
    
    CABasicAnimation *anima = [CABasicAnimation animationWithKeyPath:@"transform.rotation.z"];
    anima.fromValue = [NSNumber numberWithFloat:0.f];
    anima.toValue = [NSNumber numberWithFloat: M_PI * 2];
    anima.duration = 1;
    anima.repeatCount = MAXFLOAT;
    anima.removedOnCompletion = NO;
    [imageView.layer addAnimation:anima forKey:nil];
    hud.customView = imageView;
    
    [view addSubview:hud];
    [hud showAnimated:YES];
    [hud hideAnimated:YES afterDelay:10];
}

+ (void)showHUDNotAutoHide
{
    [RXHUD instantce];

    UIView *view = [[UIApplication sharedApplication] keyWindow];
    
    if (!view) {
        return;
    }
    
    MBProgressHUD *hud = [[MBProgressHUD alloc] initWithView:view];
    hud.tag = HUDTAG;
    hud.userInteractionEnabled = YES;
    hud.removeFromSuperViewOnHide = YES;
    hud.mode = MBProgressHUDModeCustomView;
    hud.animationType = MBProgressHUDAnimationFade;
    
    hud.bezelView.style = MBProgressHUDBackgroundStyleSolidColor;
    hud.bezelView.backgroundColor = [UIColor colorWithHexString:@"#272A2B"];
    hud.bezelView.alpha = 0.96;
    hud.bezelView.layer.cornerRadius = 12;


    
    UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage rxBundleImageNamed:@"rx_loading"]];
    imageView.clipsToBounds = YES;
    imageView.contentMode = UIViewContentModeScaleToFill;
    
    CABasicAnimation *anima = [CABasicAnimation animationWithKeyPath:@"transform.rotation.z"];
    anima.fromValue = [NSNumber numberWithFloat:0.f];
    anima.toValue = [NSNumber numberWithFloat: M_PI * 2];
    anima.duration = 1;
    anima.repeatCount = MAXFLOAT;
    anima.removedOnCompletion = NO;
    [imageView.layer addAnimation:anima forKey:nil];
    hud.customView = imageView;
    
    [view addSubview:hud];
    [hud showAnimated:YES];
}

+ (void)hideHUD
{
    NSEnumerator *subviewsEnum = [[[UIApplication sharedApplication] keyWindow].subviews reverseObjectEnumerator];
    for (UIView *subview in subviewsEnum) {
        if ([subview isKindOfClass:[MBProgressHUD class]]) {
            if (subview != nil) {
                ((MBProgressHUD * )subview).removeFromSuperViewOnHide = YES;
                dispatch_async(dispatch_get_main_queue(), ^{
                    [((MBProgressHUD * )subview) hideAnimated:YES];
                });
            }
        }
    }
}

+ (void)hideHUDForView:(UIView *)view
{
    NSEnumerator *subviewsEnum = [view.subviews reverseObjectEnumerator];
    for (UIView *subview in subviewsEnum) {
        if ([subview isKindOfClass:[MBProgressHUD class]]) {
            if (subview != nil) {
                ((MBProgressHUD * )subview).removeFromSuperViewOnHide = YES;
                dispatch_async(dispatch_get_main_queue(), ^{
                    [((MBProgressHUD * )subview) hideAnimated:YES];
                });
            }
        }
    }
}

+ (void)showHUDWithOffset:(CGRect)rect
{
    for (UIView *subViews in [UIApplication sharedApplication].keyWindow.subviews) {
        if (subViews.tag == WEBHUDTAG) {
            return;
        }
    }
    
    UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage rxBundleImageNamed:@"rx_webloading"]];
    imageView.image = [imageView.image imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
    imageView.frame = rect;
    imageView.tag = WEBHUDTAG;
//    imageView.clipsToBounds = YES;
//    imageView.contentMode = UIViewContentModeScaleToFill;
    
//    imageView.image = [[UIImage imageNamed:@"ico_title_city.png"] imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
    imageView.tintColor = [UIColor colorWithHexString:@"20C0B3"];
    
    CABasicAnimation *anima = [CABasicAnimation animationWithKeyPath:@"transform.rotation.z"];
    anima.fromValue = [NSNumber numberWithFloat:0.f];
    anima.toValue = [NSNumber numberWithFloat: M_PI * 2];
    anima.duration = 1;
    anima.repeatCount = MAXFLOAT;
    anima.removedOnCompletion = NO;
    [imageView.layer addAnimation:anima forKey:nil];
    
    [[UIApplication sharedApplication].keyWindow addSubview:imageView];
    
    
    
//    CABasicAnimation *pathAnimation=[CABasicAnimation animationWithKeyPath:@"strokeEnd"];
//    pathAnimation.duration = 1;
//    pathAnimation.timingFunction = [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionLinear];
//    // 开始位置
//    pathAnimation.fromValue = [NSNumber numberWithFloat:0];
//    // 过程中的位置，即到什么位置结束
//    pathAnimation.toValue = [NSNumber numberWithFloat:1];
//    // 插入值
//    //pathAnimation.byValue = [NSNumber numberWithFloat:0.5];
//    transformAnima.removedOnCompletion = NO;
//    transformAnima.fillMode = kCAFillModeForwards;

}

+ (void)hideWebHUD
{
    for (UIView *subview in [UIApplication sharedApplication].keyWindow.subviews) {
        if (subview.tag == WEBHUDTAG) {
            dispatch_async(dispatch_get_main_queue(), ^{
                [subview removeFromSuperview];
            });
        }
    }
}

@end
