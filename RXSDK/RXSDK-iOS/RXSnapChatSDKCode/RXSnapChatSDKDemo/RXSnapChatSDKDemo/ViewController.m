//
//  ViewController.m
//  RXSnapChatSDKDemo
//
//  Created by 陈汉 on 2024/4/3.
//

#import "ViewController.h"
#import <RXSnapChatSDK/RXSnapChatSDK.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <SCSDKCreativeKit/SCSDKCreativeKit.h>
#import <Photos/Photos.h>

@interface ViewController () <RXLoginDelegate, UIImagePickerControllerDelegate, UINavigationControllerDelegate>

@property (nonatomic, strong) UIImagePickerController *imagePickerVC;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    [RXService sharedSDK].loginDelegate = self;
    
    self.navigationItem.title = @"title";
    
    // 登录
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"登录" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    // 分享
    UIButton *btn2 = [[UIButton alloc] initWithFrame:CGRectMake(150, 100, 130, 30)];
    [btn2 setTitle:@"分享单图" forState:UIControlStateNormal];
    [btn2 setBackgroundColor:[UIColor redColor]];
    [btn2 addTarget:self action:@selector(btnAction2) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn2];
}

- (void)btnAction1
{
//snapchat登录
//    [[RXSnapChatService sharedSDK] login];
//    游客登录
    [RXService sharedSDK].loginDelegate = self;
    [[RXService sharedSDK] loginWithExtDic:@{@"method":@"guest"} username:@"rxaccount" password:@"111111aA!" sign_fields:nil loginType:LoginTypeVisitor migrate_args:nil];
}

- (void)btnAction2
{
//    [self imagePicker];
    
//    UIImage *img = [UIImage imageNamed:@"test"];
//    SCSDKSnapPhoto *photo = [[SCSDKSnapPhoto alloc] initWithImage:img];
//    SCSDKPhotoSnapContent *content = [[SCSDKPhotoSnapContent alloc] initWithSnapPhoto:photo];
//    SCSDKSnapAPI *snapApi = [SCSDKSnapAPI new];
    
    /* Stickers to be used in Snap */
//    UIImage *stickerImage = [UIImage imageNamed:@"test"];
//    SCSDKSnapSticker *sticker = [[SCSDKSnapSticker alloc] initWithStickerImage:stickerImage];
//    /* Alternatively, use a URL instead */
//    // SCSDKSnapSticker *sticker = [[SCSDKSnapSticker alloc] initWithStickerUrl:stickerImageUrl isAnimated:NO];
//
//    /* Modeling a Snap using SCSDKNoSnapContent*/
//    SCSDKNoSnapContent *snap = [[SCSDKNoSnapContent alloc] init];
//    snap.sticker = sticker; /* Optional */
//    snap.caption = @"Snap on Snapchat!"; /* Optional */
//    snap.attachmentUrl = @"https://www.snapchat.com"; /* Optional */
    
//    SCSDKSnapAPI *snapApi = [SCSDKSnapAPI new];
//
    NSString *filePath = [[NSBundle mainBundle] pathForResource:@"test.png" ofType:nil];
//    
////    SCSDKSnapPhoto *photo = [[SCSDKSnapPhoto alloc] initWithImage:[UIImage imageNamed:@"test"]];
//    SCSDKSnapPhoto *photo = [[SCSDKSnapPhoto alloc] initWithImageUrl:[NSURL URLWithString:@"https://oss-anchor-v2.weile.com/share/link_contents/13.png"]];
//    SCSDKPhotoSnapContent *content = [[SCSDKPhotoSnapContent alloc] initWithSnapPhoto:photo];
//    
//    [snapApi startSendingContent:content completionHandler:^(NSError * _Nullable error) {
//        NSLog(@"");
//    }];
    
    
//    NSDictionary *dic = @{
//        @"materialType" : @"video",
////        @"image" : @"https://oss-anchor-v2.weile.com/share/link_contents/13.png",
////        @"image" : filePath,
//        @"video" : @"http://guanwangyun.oss-cn-beijing.aliyuncs.com/document/460_1712035728.mp4",
//        @"title" : @"title"
//    };
//    [[RXSnapChatService sharedSDK] shareWithShareInfo:dic complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//        NSLog(@"");
//    }];
//    
//    NSThread *thread = [[NSThread alloc] initWithTarget:self selector:@selector(run) object:nil];
//    // 2. 启动线程
//    [thread start];
    
    RXShareConfig *config = [[RXShareConfig alloc] init];
    config.func = @"sdk_chengjiu";
    config.platform = @"snapchat";
    
    [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSLog(@"55555");
    }];
    
}

- (void)run
{
    NSString *filePath = [[NSBundle mainBundle] pathForResource:@"test.png" ofType:nil];
    
    SCSDKSnapPhoto *photo = [[SCSDKSnapPhoto alloc] initWithImage:[UIImage imageNamed:@"test"]];
//    SCSDKSnapPhoto *photo = [[SCSDKSnapPhoto alloc] initWithImageUrl:[NSURL URLWithString:@"https://oss-anchor-v2.weile.com/share/link_contents/13.png"]];
    SCSDKPhotoSnapContent *content = [[SCSDKPhotoSnapContent alloc] initWithSnapPhoto:photo];
        
    //    [snapApi startSendingContent:content completionHandler:^(NSError * _Nullable error) {
    //        NSLog(@"");
    //    }];
    SCSDKSnapAPI *snapApi = [[SCSDKSnapAPI alloc] initWithContent:content];

    [snapApi startSnappingWithCompletionHandler:^(NSError * _Nullable error) {
        NSLog(@"");
    }];
}

- (void)rx_LoginCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
{
    if (!error) {
        
    }
}

#pragma mark -- imagePicker
- (void)imagePicker
{
    if (@available(iOS 14, *)) {
        PHAuthorizationStatus status = [PHPhotoLibrary authorizationStatusForAccessLevel:PHAccessLevelReadWrite];
        if (status != PHAuthorizationStatusAuthorized) { // 未授权
            [PHPhotoLibrary requestAuthorizationForAccessLevel:PHAccessLevelReadWrite handler:^(PHAuthorizationStatus status) {
                switch (status) {
                    case PHAuthorizationStatusLimited:
                        NSLog(@"limited");
                        break;
                    case PHAuthorizationStatusDenied:
                        NSLog(@"denied");
                        break;
                    case PHAuthorizationStatusAuthorized:
                        NSLog(@"authorized");
                        [self pushIntoAlbumAction];
                        break;
                    default:
                        break;
                }
            }];
        } else {
            [self pushIntoAlbumAction];
        }
        
    } else {
        PHAuthorizationStatus authStatus = [PHPhotoLibrary authorizationStatus];
        if (authStatus != PHAuthorizationStatusAuthorized) // 未授权
        {
            [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status) {
                if (status != PHAuthorizationStatusAuthorized)  //已授权
                {
                    NSLog(@"用户拒绝访问相册！");
                }
                else
                {
                    NSLog(@"用户允许访问相册！");
                }
            }];
        }
    }
}

- (void)pushIntoAlbumAction
{
//    [RXHUD showHUD];
    dispatch_async(dispatch_get_main_queue(), ^{
        // 主线程
        self.imagePickerVC.modalPresentationStyle = UIModalPresentationOverFullScreen;
        UIImagePickerControllerSourceType sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
        if ([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypePhotoLibrary]) {
            self.imagePickerVC.sourceType = sourceType;
            [self.navigationController presentViewController:self.imagePickerVC animated:YES completion:nil];
        }else{
            NSLog(@"模拟器中无法打开照相机, 请在真机中使用!");
        }
    });
}

- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary<UIImagePickerControllerInfoKey,id> *)info{
    [picker dismissViewControllerAnimated:YES completion:nil];
    
    NSString *type = [info objectForKey:UIImagePickerControllerMediaType];
    UIImage *image = [info objectForKey:UIImagePickerControllerOriginalImage];
    
//    UIImageView *imgv = [[UIImageView alloc] initWithFrame:CGRectMake(100, 100, 100, 100)];
//    imgv.image = image;
//    [self.view addSubview:imgv];
    
    SCSDKSnapAPI *snapApi = [SCSDKSnapAPI new];
    
    SCSDKSnapPhoto *photo = [[SCSDKSnapPhoto alloc] initWithImage:image];
//    SCSDKSnapPhoto *photo
    SCSDKPhotoSnapContent *content = [[SCSDKPhotoSnapContent alloc] initWithSnapPhoto:photo];
    
    [snapApi startSendingContent:content completionHandler:^(NSError * _Nullable error) {
        NSLog(@"");
    }];
}

- (UIImagePickerController *)imagePickerVC
{
    if (!_imagePickerVC) {
        _imagePickerVC = [[UIImagePickerController alloc] init];
        _imagePickerVC.modalPresentationStyle= UIModalPresentationOverFullScreen;
        _imagePickerVC.delegate = self;
    }
    return _imagePickerVC;
}

@end
