//
//  RXDragView.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/6/28.
//

#import "RXDragView.h"
#import "RXUICommonTool.h"

#define ViewSize 41

@interface RXDragView() {
    void(^_actionBlock)(void);
}
@property (nonatomic, weak) UIViewController * vc;
@property (nonatomic, assign) CGPoint lastPoint;
@property (nonatomic, assign) UIInterfaceOrientation orientation;
@property (nonatomic, assign) CGFloat changeHig;//按钮高度位置比例
@property (nonatomic, assign) CGFloat changeWid;//按钮宽度位置比例

@end

@implementation RXDragView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

#pragma mark - life cycle
- (instancetype)initWithFrame:(CGRect)frame vc:(UIViewController *)vc {
    if (self = [super initWithFrame:frame]) {
        _vc = vc;
        
        _clickImgView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, frame.size.width, frame.size.height)];
        _clickImgView.image = [UIImage rxBundleImageNamed:@"rx_service_minimized"];
        _clickImgView.layer.cornerRadius = frame.size.width / 2;
        [self addSubview:_clickImgView];
        
        _redTip = [[UIImageView alloc] initWithFrame:CGRectMake(CGRectGetWidth(_clickImgView.frame) - 14, 0, 14, 14)];
        _redTip.image = [UIImage rxBundleImageNamed:@"rx_service_red"];
        _redTip.hidden = YES;
        [self addSubview:_redTip];
        
        self.orientation = [[UIApplication sharedApplication] statusBarOrientation];
        
        self.userInteractionEnabled = YES;
        //创建移动手势事件
        UIPanGestureRecognizer *panRcognize = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(handlePanGesture:)];
        [panRcognize setMinimumNumberOfTouches:1];
        [panRcognize setEnabled:YES];
        [panRcognize delaysTouchesEnded];
        [panRcognize cancelsTouchesInView];
        [self addGestureRecognizer:panRcognize];
        //创建点击手势事件
        UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleTapGesture:)];
        [self addGestureRecognizer:tapGesture];
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(showTip) name:RXUINoti_showTip object:nil];
    }
    return self;
}

- (void)setDragHeight:(CGFloat)dragHeight {
    CGRect frame = _clickImgView.frame;
    frame.size.height = dragHeight;
    _clickImgView.frame = frame;
}

#pragma mark -- <notiActions>
- (void)showTip
{
    self.redTip.hidden = NO;
}

#pragma mark - event response
/*
 *  悬浮按钮移动事件处理
 */
- (void)handlePanGesture:(UIPanGestureRecognizer *)recognizer {
    self.orientation = [[UIApplication sharedApplication] statusBarOrientation];
    //移动状态
    UIGestureRecognizerState recState =  recognizer.state;
    switch (recState) {
        case UIGestureRecognizerStateBegan:
            
            break;
        case UIGestureRecognizerStateChanged:
        {
            CGPoint translation = [recognizer translationInView:_vc.navigationController.view];
            recognizer.view.center = CGPointMake(recognizer.view.center.x + translation.x, recognizer.view.center.y + translation.y);
        }
            break;
        case UIGestureRecognizerStateEnded:
        {
            CGPoint stopPoint = CGPointMake(0, __MainScreen_Height/ 2);
            //判断按钮贴靠在屏幕的左边还是右边
            if (recognizer.view.center.x < __MainScreen_Width / 2) {
                stopPoint = CGPointMake(ViewSize/2, recognizer.view.center.y);
            }else{
                //贴靠在右边
                stopPoint = CGPointMake(recognizer.view.center.x,recognizer.view.center.y);
            }
            NSLog(@"stopPoint == %@",NSStringFromCGPoint(stopPoint));
            
            if (stopPoint.y - ViewSize <= 0) {
                NSLog(@"上");
                //加上电池栏的高度
                if (stopPoint.x - ViewSize/2 <= __MainScreen_Width/2) {
                    stopPoint = CGPointMake(0, stopPoint.y + [self vg_safeDistanceTop] + ViewSize);
                    NSLog(@"左上");
                }else{
                    NSLog(@"右上");
                    stopPoint = CGPointMake(__MainScreen_Width, stopPoint.y + [self vg_safeDistanceTop] + ViewSize);
                }
            }
            //如果按钮超出屏幕边缘
            if (stopPoint.y + ViewSize + 20 >= __MainScreen_Height) {
                NSLog(@"下");
                //减去底部状态栏的高度
                if (stopPoint.x - ViewSize/2 <= __MainScreen_Width/2) {
                    NSLog(@"左下");
                    stopPoint = CGPointMake(0, stopPoint.y - [self vg_safeDistanceBottom] - ViewSize/2);
                }else{
                    NSLog(@"右下");
                    stopPoint = CGPointMake(__MainScreen_Width, stopPoint.y - [self vg_safeDistanceBottom] - ViewSize/2);
                }
//                NSLog(@"超出屏幕下方");
            }
            
            if (stopPoint.x - ViewSize/2 <= 0) {
                NSLog(@"左");
                stopPoint = CGPointMake(ViewSize, stopPoint.y);
                //缩进去一半
//                stopPoint = CGPointMake(0, stopPoint.y);
            }
            if (stopPoint.x + ViewSize/2 >= __MainScreen_Width / 2) {
                NSLog(@"右");
                stopPoint = CGPointMake(__MainScreen_Width - ViewSize, stopPoint.y);
//                stopPoint = CGPointMake(__MainScreen_Width, stopPoint.y);
            }
            
            //保存最后的位置
            _lastPoint = stopPoint;
           
            //隐藏悬浮球
            CGRect rect = [self convertRect:self.frame toView:self];
//            if (CGRectIntersectsRect(self.clickImgView.frame, rect)) {//在范围内
//                NSLog(@"悬浮窗在中心imageview内，提示是否隐藏悬浮窗");
////                [self showAlertView];
//                [self.delegate showHideAlertView];
//            }
//            NSLog(@"self.orientation == %ld",(long)self.orientation);
            if (self.orientation == UIInterfaceOrientationLandscapeRight) {//横向home键在右侧，设备左转，刘海在左边
                if (stopPoint.x > __MainScreen_Width/2) {//悬浮窗在屏幕右侧
                    [UIView animateWithDuration:0.2 animations:^{
                        
                        if (recognizer.view.center.y < ViewSize + 50) {
                            recognizer.view.center = CGPointMake(recognizer.view.center.x, 50);
                        } else if (recognizer.view.center.y > __MainScreen_Height - ViewSize - [self vg_safeDistanceBottom]) {
                            recognizer.view.center = CGPointMake(recognizer.view.center.x, __MainScreen_Height - ViewSize - [self vg_safeDistanceBottom]);
                        } else {
                            recognizer.view.center = CGPointMake(__MainScreen_Width - ViewSize, stopPoint.y);
                        }
                    }];
                }else{
                    //悬浮窗在屏幕左侧，留出刘海安全距离
                    [UIView animateWithDuration:0.2 animations:^{
                        
                        if (recognizer.view.center.y < ViewSize + 50) {
                            recognizer.view.center = CGPointMake(recognizer.view.center.x, 50);
                        } else if (recognizer.view.center.y > __MainScreen_Height - ViewSize - [self vg_safeDistanceBottom]) {
                            recognizer.view.center = CGPointMake(recognizer.view.center.x, __MainScreen_Height - ViewSize - [self vg_safeDistanceBottom]);
                        } else {
                            recognizer.view.center = CGPointMake([self vg_safeDistanceTop] + ViewSize + 30, stopPoint.y);
                        }
                    }];
                }
            } else if(self.orientation == UIInterfaceOrientationLandscapeLeft){//横向home键在左侧，设备右转，刘海在右边
                if (stopPoint.x > __MainScreen_Width/2) {//悬浮窗在屏幕右侧
                    //悬浮窗在屏幕左侧，留出刘海安全距离
                    [UIView animateWithDuration:0.2 animations:^{
//                        recognizer.view.center = CGPointMake(__MainScreen_Width - [self vg_safeDistanceTop] - ViewSize - 20, stopPoint.y);
                        if (recognizer.view.center.y < ViewSize + 50) {
                            recognizer.view.center = CGPointMake(recognizer.view.center.x, 50);
                        } else if (recognizer.view.center.y > __MainScreen_Height - ViewSize - [self vg_safeDistanceBottom]) {
                            recognizer.view.center = CGPointMake(recognizer.view.center.x, __MainScreen_Height - ViewSize - [self vg_safeDistanceBottom]);
                        } else {
                            recognizer.view.center = CGPointMake(__MainScreen_Width - ViewSize - [self vg_safeDistanceTop] - 30, stopPoint.y);
                        }
                    }];
                }else{
                    [UIView animateWithDuration:0.2 animations:^{
//                        recognizer.view.center = CGPointMake(0, stopPoint.y);
                        if (recognizer.view.center.y < ViewSize + 50) {
                            recognizer.view.center = CGPointMake(recognizer.view.center.x, 50);
                        } else if (recognizer.view.center.y > __MainScreen_Height - ViewSize - [self vg_safeDistanceBottom]) {
                            recognizer.view.center = CGPointMake(recognizer.view.center.x, __MainScreen_Height - ViewSize - [self vg_safeDistanceBottom]);
                        } else {
                            recognizer.view.center = CGPointMake(__MainScreen_Width - ViewSize, stopPoint.y);
                        }
                    }];
                }
                
            }else{
                [UIView animateWithDuration:0.2 animations:^{
//                    recognizer.view.center = stopPoint;
                    
                    if (recognizer.view.center.y < ViewSize + 50 + [self vg_safeDistanceTop]) {
                        recognizer.view.center = CGPointMake(recognizer.view.center.x, [self vg_safeDistanceTop] + 50);
                    } else if (recognizer.view.center.y > __MainScreen_Height - ViewSize - [self vg_safeDistanceBottom]) {
                        recognizer.view.center = CGPointMake(recognizer.view.center.x, __MainScreen_Height - ViewSize - [self vg_safeDistanceBottom]);
                    } else {
                        recognizer.view.center = CGPointMake(__MainScreen_Width - ViewSize, stopPoint.y);
                    }
                }];
            }
//            [self changeCoordinateScale];
        
//            self.clickImgView.hidden = YES;
            
        }
            break;
            
        default:
            break;
    }
    [recognizer setTranslation:CGPointMake(0, 0) inView:_vc.view];
}

/*
 *  悬浮按钮点击事件处理
 */
- (void)handleTapGesture:(UITapGestureRecognizer *)tapGesture {
    NSLog(@"touch float icon ....");
//    if (![NSString IsNullOrWhiteSpace:_action]) {
        //注：这里我删掉两行跟业务有关的代码
//    }
    if (_actionBlock) {
        _actionBlock();
    }
}

//- (void)setAction:(NSString *)action {
//    _action = action;
//}

- (void)setActionBlock:(void (^)(void))block {
    _actionBlock = block;
}

//获取头部安全区高度
- (CGFloat)vg_safeDistanceTop {
    if (@available(iOS 13.0, *)) {
        NSSet *set = [UIApplication sharedApplication].connectedScenes;
        UIWindowScene *windowScene = [set anyObject];
        UIWindow *window = windowScene.windows.firstObject;
        return window.safeAreaInsets.top;
    } else if (@available(iOS 11.0, *)) {
        UIWindow *window = [UIApplication sharedApplication].windows.firstObject;
        return window.safeAreaInsets.top;
    }
    return 0;
}

//获取设备底部安全区高度
- (CGFloat)vg_safeDistanceBottom {
    if (@available(iOS 13.0, *)) {
        NSSet *set = [UIApplication sharedApplication].connectedScenes;
        UIWindowScene *windowScene = [set anyObject];
        UIWindow *window = windowScene.windows.firstObject;
        return window.safeAreaInsets.bottom;
    } else if (@available(iOS 11.0, *)) {
        UIWindow *window = [UIApplication sharedApplication].windows.firstObject;
        return window.safeAreaInsets.bottom;
    }
    return 0;
}

//旋转屏幕后修改悬浮窗相对于屏幕的宽高比例以及坐标位置
- (void)changeCoordinateScale{
    _changeHig = self.center.y/__MainScreen_Height;
    _changeWid = self.center.x/__MainScreen_Width;
    //判断设备旋转方向
    if (self.orientation == UIInterfaceOrientationLandscapeRight) {//横向home键在右侧，设备左转，刘海在左边，刘海在左边
        //判断悬浮窗坐标x在屏幕的左边还是右边
        if (self.center.x > __MainScreen_Width/2) {//大于中心x，在右边
            //修改悬浮窗的坐标在最右边
            self.center = CGPointMake(_lastPoint.x, self.center.y);
        }else{
            //修改悬浮窗的坐标在最左边
            self.center = CGPointMake([self vg_safeDistanceTop] + ViewSize + 20, self.center.y);
        }
    }else if(self.orientation == UIInterfaceOrientationLandscapeLeft){//横向home键在左侧，设备右转，刘海在右边
        if (self.center.x > __MainScreen_Width/2) {//大于中心x，在右边
            //修改悬浮窗的坐标在最右边，留出顶部安全距离
            self.center = CGPointMake(__MainScreen_Width - [self vg_safeDistanceTop] - ViewSize - 20, self.center.y);
        }else{
            //修改悬浮窗的坐标在最左边
            self.center = CGPointMake(ViewSize, self.center.y);
        }
    }else{
        //大于中心x，在右边
        if (self.center.x > __MainScreen_Width/2) {
            self.center = CGPointMake(__MainScreen_Width - ViewSize, self.center.y);
        }else{
            self.center = CGPointMake(ViewSize, self.center.y);
        }
    }
//    NSLog(@"changeHig == %f,changeWid == %f",changeHig,changeWid);
//    NSLog(@"设备宽度 == %f, 设备高度== %f, 按钮坐标==%@",SCREEN_WIDTH,SCREEN_HEIGHT,NSStringFromCGPoint(self.center));
}

@end
