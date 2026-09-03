//
//  RXLimitsView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/28.
//

#import "RXLimitsView.h"
#import "RXCommonTool.h"
#import "YYModel.h"

#import <AVFoundation/AVFoundation.h>
#import <CoreLocation/CoreLocation.h>

#define TitleArr @[@"电话", @"读取/储存", @"麦克风", @"相机", @"定位", @"通话"]
#define IconArr @[@"phoneCode", @"readwrite", @"sound", @"camera", @"location", @"phone"]

@interface RXLimitsView () <UITextFieldDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UILabel *desLbl;
@property (nonatomic, strong) UIButton *confirmBtn;
@property (nonatomic, strong) UIButton *closeBtn;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, assign) BOOL needSet;
@property (nonatomic, strong) RXLegalData_permission *model;
@property (nonatomic, strong) CLLocationManager *locManager;
@property (nonatomic, copy) RXLimitsClickBlock clickBlock;
@property (nonatomic, strong) NSArray *keys;

@end

@implementation RXLimitsView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithKeys:(NSArray *)keys
                  clickBlock:(RXLimitsClickBlock)clickBlock
{
    
    self = [super initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXCommonTool getInterfaceOrientation];
        self.needSet = YES;
        self.clickBlock = clickBlock;
        self.keys = keys;
        
        RXLegalData *model = [RXLegalData yy_modelWithDictionary:[RXUserUtility sharedManager].legalModel];
        self.model = model.permissions;
        
        if (keys.count > 0) {
            NSMutableArray *limits = [NSMutableArray array];
            for (int i = 0; i < self.model.list.count; i++) {
                RXLegalData_permissionList *list = [RXLegalData_permissionList yy_modelWithDictionary:self.model.list[i]];
                for (int j = 0; j < keys.count; j++) {
                    NSString *key = keys[j];
                    if ([list.key isEqualToString:key]) {
                        [limits addObject:list];
                    }
                }
            }
            self.model.list = limits;
        }
        
        [self setUI];
        [self show];
        
        // 监听屏幕旋转（横竖屏）
//        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDeviceOrientationDidChange)
//                             name:UIDeviceOrientationDidChangeNotification
//                                                       object:nil];
    }
    return self;
}

- (BOOL)onDeviceOrientationDidChange{
    //获取当前设备Device
    UIDevice *device = [UIDevice currentDevice] ;
    //识别当前设备的旋转方向
    switch (device.orientation) {
        case UIDeviceOrientationLandscapeLeft:
            NSLog(@"屏幕向左橫置");
            self.orientation = 2;
            [self layoutViews];
            break;

        case UIDeviceOrientationLandscapeRight:
            NSLog(@"屏幕向右橫置");
            self.orientation = 2;
            [self layoutViews];
            break;

        case UIDeviceOrientationPortrait:
            NSLog(@"屏幕直立");
            self.orientation = 1;
            [self layoutViews];
            break;

        case UIDeviceOrientationPortraitUpsideDown:
            NSLog(@"屏幕直立，上下顛倒");
            self.orientation = 1;
            [self layoutViews];
            break;

        default:
            NSLog(@"无法识别");
            break;
    }
    return YES;
}

- (void)show
{
    [UIView animateWithDuration:0.15 animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.6];

        CGFloat bgH = self.orientation == 2 ? 335 : 320;
        
        if (self.model.list.count < 4) {
            bgH -= 70;
        }
        
        self.bgView.sd_layout.bottomSpaceToView(self, window.frame.size.height / 2 - bgH / 2);
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [UIView animateWithDuration:0.15 animations:^{
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        
        CGFloat bgH = self.orientation == 2 ? 335 : 320;
        
        if (self.model.list.count < 4) {
            bgH -= 70;
        }
        self.bgView.sd_layout.bottomSpaceToView(self, -bgH);
        [self layoutSubviews];
    }];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.15 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self removeFromSuperview];
    });
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self sd_addSubviews:@[self.bgView]];
    [self.bgView sd_addSubviews:@[self.titleLbl, self.desLbl, self.confirmBtn, self.closeBtn]];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;

    CGFloat bgW = self.orientation == 2 ? 355 : 355;
    CGFloat bgH = self.orientation == 2 ? 335 : 320;
    
    if (self.model.list.count < 4) {
        bgH -= 70;
    }
    
    _bgView.sd_layout.centerXEqualToView(window)
    .bottomSpaceToView(self, -bgH)
    .widthIs(bgW)
    .heightIs(bgH);
    
    _titleLbl.sd_layout.topSpaceToView(self.bgView, 10)
    .leftSpaceToView(self.bgView, 0)
    .rightSpaceToView(self.bgView, 0)
    .heightIs(25);
    
    _desLbl.sd_layout.topSpaceToView(self.titleLbl, 0)
    .leftSpaceToView(self.bgView, 20)
    .rightSpaceToView(self.bgView, 20)
    .heightIs(60);
    
    CGFloat closeW = self.orientation == 2 ? 151 : 152;
    CGFloat closeX = self.orientation == 2 ? 20 : 20;
    
    _confirmBtn.sd_layout.bottomSpaceToView(self.bgView, 20)
    .rightSpaceToView(self.bgView, closeX)
    .widthIs(closeW)
    .heightIs(42);

    _closeBtn.sd_layout.bottomEqualToView(self.confirmBtn)
    .rightSpaceToView(self.confirmBtn, 10)
    .widthIs(closeW)
    .heightIs(42);
    
    if (self.needSet) {
        NSInteger count = 0;
        for (int i = 0; i < self.model.list.count; i++) {
            if (i == 3) count = 0;
            
            CGFloat viewW = self.orientation == 2 ? 93 : 100;
            CGFloat viewH = self.orientation == 2 ? 66 : 68;
            CGFloat viewX = 18 + (viewW + 10) * count;
            CGFloat viewY = 8;
            
            if (i > 2) {
                viewY = 82;
            }
            
            RXLegalData_permissionList *list = [[RXLegalData_permissionList alloc] init];
            if (self.keys.count > 0) {
                list = self.model.list[i];
            } else {
                list = [RXLegalData_permissionList yy_modelWithDictionary:self.model.list[i]];
            }
            
            UIView *limitView = [self createLimitViewWithTitle:list.title icon:IconArr[i] des:list.content];
            [self.bgView addSubview:limitView];
            
            limitView.sd_layout.leftSpaceToView(self.bgView, viewX)
            .topSpaceToView(self.desLbl, viewY)
            .widthIs(viewW)
            .heightIs(viewH);
            
            count++;
            if (i == 5) self.needSet = NO;
        }
    }
    [self layoutSubviews];
}

#pragma mark -- <getters && setters>
- (UIView *)createLimitViewWithTitle:(NSString *)title
                                icon:(NSString *)icon
                                 des:(NSString *)des
{
    UIView *limitView = [[UIView alloc] init];
    limitView.backgroundColor = [UIColor whiteColor];
    
    UILabel *titleLbl = [[UILabel alloc] init];
    titleLbl.text = title;
    titleLbl.font = [UIFont systemFontOfSize:10];
    
    UILabel *desLbl = [[UILabel alloc] init];
    desLbl.text = des;
    desLbl.textColor = [UIColor colorWithHexString:@"626262"];
    desLbl.numberOfLines = 3;
    desLbl.font = [UIFont systemFontOfSize:10];
    
    UIImageView *iconImgView = [[UIImageView alloc] init];
    iconImgView.image = [UIImage bundleImageNamed:icon];
    
    [limitView sd_addSubviews:@[titleLbl, desLbl, iconImgView]];
    
    titleLbl.sd_layout.topSpaceToView(limitView, 7)
    .leftSpaceToView(limitView, 35)
    .rightSpaceToView(limitView, 0)
    .heightIs(12);
    
    iconImgView.sd_layout.topSpaceToView(limitView, 24)
    .leftSpaceToView(limitView, 8)
    .widthIs(24)
    .heightEqualToWidth();
    
    desLbl.sd_layout.topSpaceToView(titleLbl, 0)
    .leftSpaceToView(iconImgView, 3)
    .widthIs(52)
    .heightIs(42);
    
    return limitView;
}

#pragma mark -- <actions>
- (void)closeBtnAction
{
    if (self.clickBlock) {
        self.clickBlock(0);
    }
    [self hide];
}

- (void)confirmBtnAction
{
    if (self.clickBlock) {
        self.clickBlock(1);
    }
//    for (int i = 0; i < self.model.list.count; i++) {
//        RXLegalData_permissionList *list = [RXLegalData_permissionList yy_modelWithDictionary:self.model.list[i]];
//
//        if ([list.key isEqualToString:@"mic"]) {
//            // 麦克权限请求
//            [AVCaptureDevice requestAccessForMediaType:AVMediaTypeAudio completionHandler:^(BOOL granted) {
//
//            }];
//        } else if ([list.key isEqualToString:@"camera"]) {
//            // 相机权限请求
//            [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
//
//            }];
//        } else if ([list.key isEqualToString:@"locate"]) {
//            [self.locManager requestAlwaysAuthorization];
//        }
//    }
    [self hide];
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor colorWithHexString:@"fafafa"];
//        _bgView.backgroundColor = [UIColor redColor];
        _bgView.layer.cornerRadius = 6;
    }
    return _bgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = @"权限获取";
        _titleLbl.font = [UIFont boldSystemFontOfSize:18];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UILabel *)desLbl
{
    if (!_desLbl) {
        _desLbl = [[UILabel alloc] init];
        _desLbl.text = @"为了游戏的正常体验，将向您申请以下权限，若您需要关闭权限，请于系统设置进行关闭授权，但可能影响部分功能的正常使用。";
        _desLbl.numberOfLines = 3;
        _desLbl.textColor = [UIColor colorWithHexString:@"626262"];
        _desLbl.font = [UIFont systemFontOfSize:14];
    }
    return _desLbl;
}

- (UIButton *)confirmBtn
{
    if (!_confirmBtn) {
        _confirmBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_confirmBtn setBackgroundImage:[UIImage bundleImageNamed:@"confirmBtnBg"] forState:UIControlStateNormal];
        [_confirmBtn setTitle:@"同意" forState:UIControlStateNormal];
        [_confirmBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _confirmBtn.titleLabel.font = [UIFont systemFontOfSize:16];
        [_confirmBtn addTarget:self action:@selector(confirmBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _confirmBtn;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_closeBtn setTitle:@"以后再说" forState:UIControlStateNormal];
        [_closeBtn setTitleColor:[UIColor colorWithHexString:@"32B04D"] forState:UIControlStateNormal];
        _closeBtn.titleLabel.font = [UIFont systemFontOfSize:16];
        _closeBtn.layer.masksToBounds = YES;
        _closeBtn.layer.cornerRadius = 4;
        _closeBtn.layer.borderColor = [UIColor colorWithHexString:@"32B04D"].CGColor;
        _closeBtn.layer.borderWidth = 1;
        [_closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

- (CLLocationManager *)locManager
{
    if (!_locManager) {
        _locManager = [[CLLocationManager alloc] init];
        [_locManager requestWhenInUseAuthorization];
    }
    return _locManager;
}

@end
