//
//  JXQRCodeScanVC.m
//  MisApp-iOS
//
//  Created by wjy on 2021/9/17.
//

#import "JXQRCodeScanVC.h"
#import "SGQRCode.h"
#import "JXQRCodeNavigationView.h"
#import <RXUIKit/RXWKWebView.h>
//#import "JXScanSuccessVC.h"
//#import "JXCommonTipAlertView.h"
//#import "JXJoinGroupVC.h"

// - 设备屏幕宽
#define RXUScreenWidth          [UIScreen mainScreen].bounds.size.width
// - 设备屏幕高
#define RXUScreenHeight         [UIScreen mainScreen].bounds.size.height

@interface JXQRCodeScanVC ()
{
    SGScanCode *scanCode;
}
@property (nonatomic, strong) SGScanView *scanView;                 // 扫描view
@property (nonatomic, strong) JXQRCodeNavigationView *navigationV;  // 导航
//@property (nonatomic, strong) UIButton *flashlightBtn;              // 手电筒
//@property (nonatomic, strong) UILabel *remindLabel;                 // 提示
//@property (nonatomic, assign) BOOL isOpen;                          // 是否打开手电筒

@end

@implementation JXQRCodeScanVC

#pragma mark - <lazy>
- (SGScanView *)scanView
{
    if (!_scanView) {
        _scanView = [[SGScanView alloc] initWithFrame:CGRectMake(0, 0, RXUScreenWidth, RXUScreenHeight)];
    }
    return _scanView;
}


- (JXQRCodeNavigationView *)navigationV
{
    if (!_navigationV) {
        _navigationV = [[JXQRCodeNavigationView alloc] initWithFrame:CGRectMake(0, 24, RXUScreenWidth, 60)];
        [_navigationV.cancelBtn addTarget:self action:@selector(cancelBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _navigationV;
}


//- (UILabel *)remindLabel
//{
//    if (!_remindLabel) {
//        _remindLabel = [[UILabel alloc] init];
//        _remindLabel.backgroundColor = [UIColor clearColor];
//        CGFloat remindLabelX = 0;
//        CGFloat remindLabelY = 0.73 * self.view.frame.size.height;
//        CGFloat remindLabelW = self.view.frame.size.width;
//        CGFloat remindLabelH = 25;
//        _remindLabel.frame = CGRectMake(remindLabelX, remindLabelY, remindLabelW, remindLabelH);
//        _remindLabel.textAlignment = NSTextAlignmentCenter;
//        _remindLabel.font = [UIFont boldSystemFontOfSize:13.0];
//        _remindLabel.textColor = [[UIColor whiteColor] colorWithAlphaComponent:0.6];
//        _remindLabel.text = @"将二维码/条码放入框内, 即可自动扫描";
//    }
//    return _remindLabel;
//}
//
//
//- (UIButton *)flashlightBtn
//{
//    if (!_flashlightBtn) {
//        _flashlightBtn = [UIButton buttonWithType:(UIButtonTypeCustom)];
//        CGFloat flashlightBtnW = 30;
//        CGFloat flashlightBtnH = 30;
//        CGFloat flashlightBtnX = 0.5 * (self.view.frame.size.width - flashlightBtnW);
//        CGFloat flashlightBtnY = 0.55 * self.view.frame.size.height;
//        _flashlightBtn.frame = CGRectMake(flashlightBtnX, flashlightBtnY, flashlightBtnW, flashlightBtnH);
//        [_flashlightBtn setBackgroundImage:[UIImage imageNamed:@"SGQRCodeFlashlightOpenImage"] forState:(UIControlStateNormal)];
//        [_flashlightBtn setBackgroundImage:[UIImage imageNamed:@"SGQRCodeFlashlightCloseImage"] forState:(UIControlStateSelected)];
//        [_flashlightBtn addTarget:self action:@selector(flashlightBtnAction:) forControlEvents:UIControlEventTouchUpInside];
//    }
//    return _flashlightBtn;
//}


- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    
    [scanCode startRunningWithBefore:nil completion:nil];
}


- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    
    [self.scanView startScanning];
}


- (void)viewDidLoad {
    [super viewDidLoad];
    
//    self.view.backgroundColor = JXClearColor;
//
//    self.customNavigationBar.hidden = YES;
    
    scanCode = [SGScanCode scanCode];
    
    [self setUI];
    [self configQRCodeScan];

}


- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    
    [self.scanView stopScanning];
//    [self removeFlashlightBtn];
    [scanCode stopRunning];
}


#pragma mark - <setUI>
- (void)setUI
{
//    [self.view sd_addSubviews:@[self.scanView, self.navigationV]];
    
    [self.view addSubview:self.scanView];
    [self.view addSubview:self.navigationV];
//    [self.view addSubview:self.remindLabel];
}


#pragma mark - <actions>
- (void)configQRCodeScan
{
    
    BOOL isCameraDeviceRearAvailable = scanCode.isCameraDeviceRearAvailable;
    if (isCameraDeviceRearAvailable == NO) {
        return;
    }
    
    scanCode.openLog = YES;
//    scanCode.brightness = YES;
    
    // 扫描结果回调
    __weak typeof(self) weakSelf = self;
    [scanCode scanWithController:self resultBlock:^(SGScanCode *scanCode, NSString *result) {
        if (result) {
            [scanCode stopRunning];
            [scanCode playSoundName:@"SGQRCode.bundle/scanEndSound.caf"];
            
            RXWKWebView *webView = [[RXWKWebView alloc] initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
            webView.urlStr = result;
//            webView.complete = self.complete;
    //        webView.urlStr =  @"https://www.baidu.com";
            [[UIApplication sharedApplication].keyWindow addSubview:webView];
            
            [self.navigationController popViewControllerAnimated:YES];
        }
        
    }];
}


#pragma mark 取消
- (void)cancelBtnAction
{
    [self dismissViewControllerAnimated:YES completion:nil];
}


#pragma mark 移除扫描view
- (void)removeScanningView
{
    [self.scanView stopScanning];
    [self.scanView removeFromSuperview];
    self.scanView = nil;
}


//- (void)flashlightBtnAction:(UIButton *)btn
//{
//    if (btn.selected == NO) {
//        [scanCode turnOnFlashlight];
//        self.isOpen = YES;
//        btn.selected = YES;
//    } else {
//        [self removeFlashlightBtn];
//    }
//}
//
//
//- (void)removeFlashlightBtn
//{
//    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//        [self->scanCode turnOffFlashlight];
//        self.isOpen = NO;
//        self.flashlightBtn.selected = NO;
//        [self.flashlightBtn removeFromSuperview];
//    });
//}



//// 相册
//- (void)photoBtnAction
//{
//    __weak typeof(self) weakSelf = self;
//    [scanCode readWithResultBlock:^(SGScanCode *scanCode, NSString *result) {
////        [MBProgressHUD SG_showMBProgressHUDWithModifyStyleMessage:@"正在处理..." toView:weakSelf.view];
//        if (result == nil) {
//            NSLog(@"暂未识别出二维码");
//            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
////                [MBProgressHUD SG_hideHUDForView:weakSelf.view];
////                [MBProgressHUD SG_showMBProgressHUDWithOnlyMessage:@"未发现二维码/条形码" delayTime:1.0];
//            });
//        } else {
////            JXScanSuccessVC *successVC = [[JXScanSuccessVC alloc] init];
////            successVC.comeFromVC = ScanSuccessJumpComeFromWC;
//
////            if ([result hasPrefix:@"http"]) {
////                successVC.qrCodeUrl = result;
////            } else {
////                successVC.barCodeUrl = result;
////            }
//
//            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
////                [MBProgressHUD SG_hideHUDForView:weakSelf.view];
////                [weakSelf.navigationController pushViewController:successVC animated:YES];
//            });
//        }
//    }];
//
//    if (scanCode.albumAuthorization == YES) {
//        [self.scanView stopScanning];
//    }
//
//    [scanCode albumDidCancelBlock:^(SGScanCode *scanCode) {
//        [weakSelf.scanView startScanning];
//    }];
//}


- (void)dealloc
{
    [self removeScanningView];
}


@end
