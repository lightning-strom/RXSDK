//
//  RXOSHUD.m
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/15.
//

#import "RXOSHUD.h"
#import <objc/message.h>
#import "RXOSCommonTool.h"
#import "UIImage+RXOSAddition.h"

NSString * const showText = @"正在加载";

#define msgSend(...) ((void (*)(void *, SEL, id))objc_msgSend)(__VA_ARGS__)
#define msgTarget(target) (__bridge void *)(target)

#define HUDTAG 100000
#define WEBHUDTAG 100001

@interface RXOSHUD () <MBOSProgressHUDDelegate>
@property (nonatomic,strong) id target;
@property (nonatomic,assign) SEL method;
@property (nonatomic,strong) UIWindow *keyWindow;

@end

@implementation RXOSHUD

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

+ (instancetype)instantce
{
    static dispatch_once_t onceToken;
    static RXOSHUD *obj = nil;
    dispatch_once(&onceToken, ^{
        obj = [[RXOSHUD alloc] init];
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
    [RXOSHUD instantce];

    UIView *view = [[UIApplication sharedApplication] keyWindow];
    
    if (!view) {
        return;
    }
    
    [RXOSHUD hideHUDForView:view];
    MBOSProgressHUD *hud = [[MBOSProgressHUD alloc] initWithView:view];
    hud.tag = HUDTAG;
    hud.userInteractionEnabled = YES;
    hud.removeFromSuperViewOnHide = YES;
    hud.mode = MBOSProgressHUDModeText;
    
    hud.bezelView.style = MBOSProgressHUDBackgroundStyleSolidColor;
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

+ (void)showErrorText:(NSString *)text
{
    [RXOSHUD instantce];

    UIView *view = [[UIApplication sharedApplication] keyWindow];
    
    if (!view) {
        return;
    }
    
    [RXOSHUD hideHUDForView:view];
    MBOSProgressHUD *hud = [[MBOSProgressHUD alloc] initWithView:view];
    hud.tag = HUDTAG;
    hud.userInteractionEnabled = YES;
    hud.removeFromSuperViewOnHide = YES;
    hud.mode = MBOSProgressHUDModeCustomView;
//    hud.margin = 5;
    
//    UIImage *i = [UIImage rxOSBundleImageNamed:@"rx_loading_fail"];
//    i = [i translatePixelColorByTargetNearBlackColorRGBA:0x000000FF nearWhiteColorRGBA:0x323232FF transColorRGBA:0xFF0000FF inRect:CGRectMake(0, 0, 100, 100)];
    
    UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage rxOSBundleImageNamed:@"rx_loading_fail"]];
    imageView.clipsToBounds = YES;
    imageView.contentMode = UIViewContentModeScaleToFill;
    hud.customView = imageView;
    
    hud.bezelView.style = MBOSProgressHUDBackgroundStyleSolidColor;
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

+ (void)showSuccessText:(NSString *)text
{
    [RXOSHUD instantce];

    UIView *view = [[UIApplication sharedApplication] keyWindow];
    
    if (!view) {
        return;
    }
    
    [RXOSHUD hideHUDForView:view];
    MBOSProgressHUD *hud = [[MBOSProgressHUD alloc] initWithView:view];
    hud.tag = HUDTAG;
    hud.userInteractionEnabled = YES;
    hud.removeFromSuperViewOnHide = YES;
    hud.mode = MBOSProgressHUDModeCustomView;
    
    UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage rxOSBundleImageNamed:@"rx_loading_success"]];
    imageView.clipsToBounds = YES;
    imageView.contentMode = UIViewContentModeScaleToFill;
    hud.customView = imageView;
    
    hud.bezelView.style = MBOSProgressHUDBackgroundStyleSolidColor;
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
    [RXOSHUD instantce];

    UIView *view = [[UIApplication sharedApplication] keyWindow];
    
    if (!view) {
        return;
    }
    
    MBOSProgressHUD *hud = [[MBOSProgressHUD alloc] initWithView:view];
    hud.tag = HUDTAG;
    hud.userInteractionEnabled = YES;
    hud.removeFromSuperViewOnHide = YES;
    hud.mode = MBOSProgressHUDModeCustomView;
    hud.animationType = MBOSProgressHUDAnimationFade;
    
    hud.bezelView.style = MBOSProgressHUDBackgroundStyleSolidColor;
    hud.bezelView.backgroundColor = [UIColor colorWithHexString:@"#272A2B"];
    hud.bezelView.alpha = 0.96;
    hud.bezelView.layer.cornerRadius = 12;


    
    UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage rxOSBundleImageNamed:@"rx_loading"]];
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
    [RXOSHUD instantce];

    UIView *view = [[UIApplication sharedApplication] keyWindow];
    
    if (!view) {
        return;
    }
    
    MBOSProgressHUD *hud = [[MBOSProgressHUD alloc] initWithView:view];
    hud.tag = HUDTAG;
    hud.userInteractionEnabled = YES;
    hud.removeFromSuperViewOnHide = YES;
    hud.mode = MBOSProgressHUDModeCustomView;
    hud.animationType = MBOSProgressHUDAnimationFade;
    
    hud.bezelView.style = MBOSProgressHUDBackgroundStyleSolidColor;
    hud.bezelView.backgroundColor = [UIColor colorWithHexString:@"#272A2B"];
    hud.bezelView.alpha = 0.96;
    hud.bezelView.layer.cornerRadius = 12;


    
    UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage rxOSBundleImageNamed:@"rx_loading"]];
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
        if ([subview isKindOfClass:[MBOSProgressHUD class]]) {
            if (subview != nil) {
                ((MBOSProgressHUD * )subview).removeFromSuperViewOnHide = YES;
                dispatch_async(dispatch_get_main_queue(), ^{
                    [((MBOSProgressHUD * )subview) hideAnimated:YES];
                });
            }
        }
    }
}

+ (void)hideHUDForView:(UIView *)view
{
    NSEnumerator *subviewsEnum = [view.subviews reverseObjectEnumerator];
    for (UIView *subview in subviewsEnum) {
        if ([subview isKindOfClass:[MBOSProgressHUD class]]) {
            if (subview != nil) {
                ((MBOSProgressHUD * )subview).removeFromSuperViewOnHide = YES;
                dispatch_async(dispatch_get_main_queue(), ^{
                    [((MBOSProgressHUD * )subview) hideAnimated:YES];
                });
            }
        }
    }
}

+ (void)showHUDWithOffset:(CGRect)rect
{
    UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage rxOSBundleImageNamed:@"rx_webloading"]];
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
            [subview removeFromSuperview];
        }
    }
}


@end
