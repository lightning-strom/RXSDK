//
//  ViewController.m
//  RXInstagramSDKDemo
//
//  Created by 陈汉 on 2024/4/9.
//

#import "ViewController.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXInstagramSDK/RXInstagramSDK.h>

@interface ViewController () <RXLoginDelegate, UIDocumentInteractionControllerDelegate>

@property (nonatomic,strong)UIDocumentInteractionController * document;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    [RXService sharedSDK].loginDelegate = self;
    
    // 一键登录
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"一键登录" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
}

- (void)btnAction1
{
    /*
    // 构建要分享的图片
//    UIImage *image = [UIImage imageNamed:@"your_image_name"];
//    
//    // 将图片保存到设备相册
//    UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil);
    
    // 获取保存图片的URL
    NSURL *instagramURL = [NSURL URLWithString:@"instagram://library?LocalIdentifier=B5ED0253-11F3-4181-BD7B-28D398EAB5BC/L0/001"];
    
    // 调用Instagram应用程序并打开分享界面
    [[UIApplication sharedApplication] openURL:instagramURL options:@{} completionHandler:nil];
    
    return;
    
    NSString *filePath = [[NSBundle mainBundle] pathForResource:@"test" ofType:@"mp4"];
        NSLog(@"data path: %@", filePath);
        self.document = [UIDocumentInteractionController interactionControllerWithURL:[NSURL fileURLWithPath:filePath]];
        //2.设置分享代理
        self.document.delegate = self;
        //3.哪类文件支持第三方打开，这里不证明就代表所有文件！
        //    _document.UTI = @"com.microsoft.word.doc";
        //4.判断手机中有没有应用可以打开该文件并打开分享界面
        // 用户预览文件，如图1所示
        BOOL canOpen = [self.document presentPreviewAnimated:YES];

        // 用户不预览文件直接分享，如图2所示
    //    BOOL canOpen = [self.document presentOpenInMenuFromRect:self.view.bounds inView:self.view animated:YES];
        
        if (!canOpen) {
            NSLog(@"预览失败");
        }
    
    return;
    */
    [[RXService sharedSDK] loginWithExtDic:nil username:nil password:nil sign_fields:nil loginType:LoginTypeInstagram migrate_args:nil];
}

-(BOOL)documentInteractionController:(UIDocumentInteractionController *)controller canPerformAction:(nullable SEL)action{
    // 响应方法
    NSLog(@"12 %s", __func__);
    return YES;
}
-(BOOL)documentInteractionController:(UIDocumentInteractionController *)controller performAction:(nullable SEL)action{
    //
    NSLog(@"13 %s", __func__);
    return YES;
}
-(void)documentInteractionControllerWillPresentOptionsMenu:(UIDocumentInteractionController *)controller{
    // 页面显示后响应
    NSLog(@"9 %s", __func__);
}
-(void)documentInteractionControllerDidDismissOptionsMenu:(UIDocumentInteractionController *)controller{
    // 取消时响应
    NSLog(@"10 %s", __func__);
}
-(UIViewController *)documentInteractionControllerViewControllerForPreview:(UIDocumentInteractionController *)controller{
    NSLog(@"1 %s", __func__);
    return self;
}
-(UIView *)documentInteractionControllerViewForPreview:(UIDocumentInteractionController *)controller{
    NSLog(@"2 %s", __func__);
    return self.view;
}
-(CGRect)documentInteractionControllerRectForPreview:(UIDocumentInteractionController *)controller{
    NSLog(@"3 %s", __func__);
    return self.view.frame;
}
// 文件分享面板退出时调用
-(void)documentInteractionControllerDidDismissOpenInMenu:(UIDocumentInteractionController *)controller{
    NSLog(@"4 %s", __func__);
    NSLog(@"dismiss");
}
// 文件分享面板弹出的时候调用
-(void)documentInteractionControllerWillPresentOpenInMenu:(UIDocumentInteractionController *)controller{
    NSLog(@"5 %s", __func__);
    NSLog(@"WillPresentOpenInMenu");
}
// 当选择一个文件分享App的时候调用
-(void)documentInteractionController:(UIDocumentInteractionController *)controller willBeginSendingToApplication:(nullable NSString *)application{
    NSLog(@"6 %s", __func__);
    NSLog(@"begin send : %@", application);
}
// Preview presented/dismissed on document.  Use to set up any HI underneath.
-(void)documentInteractionControllerWillBeginPreview:(UIDocumentInteractionController *)controller{
    NSLog(@"7 %s", __func__);
}
-(void)documentInteractionControllerDidEndPreview:(UIDocumentInteractionController *)controller{
    // 完成时响应
    NSLog(@"8 %s", __func__);
}
-(void)documentInteractionController:(UIDocumentInteractionController *)controller didEndSendingToApplication:(nullable NSString *)application{
    NSLog(@"11 %s", __func__);
}

- (void)rx_LoginCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
{
    NSLog(@"");
}

@end
