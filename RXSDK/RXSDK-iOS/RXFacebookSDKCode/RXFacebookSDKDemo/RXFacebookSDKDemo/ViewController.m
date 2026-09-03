//
//  ViewController.m
//  RXFacebookSDKDemo
//
//  Created by 陈汉 on 2023/7/19.
//

#import "ViewController.h"
#import <RXFacebookSDK/RXFacebookSDK.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <AVFoundation/AVFoundation.h>

@interface ViewController () <RXLoginDelegate, AVAudioPlayerDelegate>

@property (nonatomic, strong) AVAudioPlayer *player;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    // fb登录
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"fb登录" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    // fb分享
    UIButton *btn2 = [[UIButton alloc] initWithFrame:CGRectMake(150, 100, 130, 30)];
    [btn2 setTitle:@"fb分享" forState:UIControlStateNormal];
    [btn2 setBackgroundColor:[UIColor redColor]];
    [btn2 addTarget:self action:@selector(btnAction2) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn2];
    
    // messenger分享
    UIButton *btn3 = [[UIButton alloc] initWithFrame:CGRectMake(290, 100, 130, 30)];
    [btn3 setTitle:@"messenger分享" forState:UIControlStateNormal];
    [btn3 setBackgroundColor:[UIColor redColor]];
    [btn3 addTarget:self action:@selector(btnAction3) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn3];
    
    // 绑定账号
    UIButton *btn4 = [[UIButton alloc] initWithFrame:CGRectMake(10, 150, 130, 30)];
    [btn4 setTitle:@"绑定账号" forState:UIControlStateNormal];
    [btn4 setBackgroundColor:[UIColor redColor]];
    [btn4 addTarget:self action:@selector(btnAction4) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn4];
    
    // 游客登录
    UIButton *btn5 = [[UIButton alloc] initWithFrame:CGRectMake(150, 150, 130, 30)];
    [btn5 setTitle:@"游客登录" forState:UIControlStateNormal];
    [btn5 setBackgroundColor:[UIColor redColor]];
    [btn5 addTarget:self action:@selector(btnAction5) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn5];
    
//    [RXService sharedSDK].loginDelegate = self;
    
    
//    NSString *urlStr = @"https://cloud-img.7nightapp.com/client/msg/17439_c4ac787f014afc60d76482980826d10d.mp3";
//    NSURL *url = [[NSURL alloc]initWithString:urlStr];
//    NSData *audioData = [NSData dataWithContentsOfURL:url];
//
//    //设置保存文件夹
//    NSString *docDirPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
//    //设置保存路径和生成文件名
//    NSString *filePath = [NSString stringWithFormat:@"%@/music.mp3",docDirPath];
//    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//
//
//    });

    
    NSString *filePath = [[NSBundle mainBundle] pathForResource:@"5103.wav" ofType:nil];

//    NSURL *url = [NSURL URLWithString:[filePath stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
//
////    NSData *audioData = [NSData dataWithContentsOfURL:url];
////
//    NSError *error = nil;
//
//    self.player = [[AVAudioPlayer alloc] initWithContentsOfURL:url error:&error];
////    self.player = [[AVAudioPlayer alloc] initWithData:audioData error:&error];
//    self.player.volume = 1;
//    if (error) {
//        NSLog(@"%@", error);
//    }
//    [self.player prepareToPlay];
//    [self.player play];
//
//    self.player.delegate = self;
}

- (void)btnAction5
{
    RXLoginConfig *loginConfig = [[RXLoginConfig alloc] init];
    loginConfig.loginType = LoginTypeVisitor;
    
    [[RXSDK sharedSDK] loginWithConfig:loginConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSLog(@"");
    }];
}

- (void)btnAction4
{
    [[RXService sharedSDK] bindAccountWithExt:@{@"method" : @"facebook"} complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSLog(@"");
    }];
}

- (void)audioPlayerDidFinishPlaying:(AVAudioPlayer *)player successfully:(BOOL)flag{
    
    NSLog(@"播放完成");
    
//    if (player == _player && flag) {
//        [self.startBtn setBackgroundImage:[UIImage imageNamed:@"播放"] forState:0];
//    }
}
- (void)audioPlayerBeginInterruption:(AVAudioPlayer *)player{
//    if (player == _player){
        NSLog(@"播放被中断");
//    }
}

- (void)audioPlayerDecodeErrorDidOccur:(AVAudioPlayer *)player error:(NSError * __nullable)error
{
    NSLog(@"");
}


- (void)shareWithContent:(NSString *)content
                     url:(NSString *)url
{
    NSString *shareMsg = @"";
    
    if (content && content.length > 0) {
        shareMsg = content;
        
        if (url && url.length > 0) {
            shareMsg = [NSString stringWithFormat:@"%@\n%@", content, url];
        }
    } else {
        if (url && url.length > 0) {
            shareMsg = [NSString stringWithFormat:@"%@", url];
        }
    }
    
    if (url && url.length > 0) {
        NSString *contentKey = (__bridge NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,
                                                                                            
                                                                                            (CFStringRef)shareMsg,
                                                                                            
                                                                                            NULL,
                                                                                            
                                                                                            (CFStringRef)@"!*'();:@&=+$,/?%#[]",
                                                                                            
                                                                                            kCFStringEncodingUTF8);
        
        NSString *contentType = @"";
        
//        NSString *urlString = [NSString stringWithFormat:@"fb-messenger://share/?link=%@%@",
//                               
//                               contentType, contentKey];
        
        
        NSString *urlString = [NSString stringWithFormat:@"fb-messenger://share/?link=%@",contentKey];
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:urlString] options:nil completionHandler:nil];
    } else {
        NSLog(@"缺少链接");
    }
}

- (void)btnAction1
{
//    [self shareWithContent:@"" url:@"test share https://iwn478abe.fishinggamezone.com/landing/third/LBwCfDfGEdF7DBfKDzZXfS/1694160696/06-vi/index.html?identity=6lA8FViSg&api=wygzt.homelandfishingarcade.com"];
//    return;
    [[RXService sharedSDK] loginWithLoginType:LoginTypeFacebook username:@"" password:@"" captchaCode:@"" permissions:@[@"public_profile",@"email"] loginOpenId:@"" extDic:nil signFields:@[@"test",@"hh"] migrateArgs:@{@"ss":@"aa"}];
//    [[RXFacebookService sharedSDK] FBLoginWithPermissions:@[@"public_profile"] extDic:nil migrate_args:nil sign_fields:nil];
}

- (void)btnAction2
{
    RXCustomShareConfig *customConfig = [[RXCustomShareConfig alloc] init];
    customConfig.materialType = @"image";
//        customConfig.url = response[@"data"][@"content"][@"url"];
//        customConfig.url = @"https://4ccdhy.dummygameth.com/landing/local/HQsB64gG2RJr23xX8cPudz/1753260076/dist/index.html?identity=-g5qyOwHg&region=-1&fbclid=46b1a52c-8108-490d-a2ad-e7aa1beeff37&protocol_android=weileqzw&protocol_ios=weileqzw&api=https%3A%2F%2Fi4ksyn.dummygameth.com%2F";
//    customConfig.url = @"https://4ccdhy.dummygameth.com/landing/local/HQsB64gG2RJr23xX8cPudz/1753260076/dist/index.html?ts=123";
    customConfig.image = @"https://rx-fish40-yuenan.oss-ap-southeast-1.aliyuncs.com/share/1745238080985_ZH.png";
    customConfig.platform = @"facebook";
    customConfig.title = @""
//    customConfig.thirdAppid = @"wx5d34c56f0c58e881";
//    customConfig.x = [response[@"data"][@"content"][@"x"] integerValue];
//    customConfig.y = [response[@"data"][@"content"][@"y"] integerValue];
//    customConfig.width = [response[@"data"][@"content"][@"width"] integerValue];
//    customConfig.height = [response[@"data"][@"content"][@"height"] integerValue];
    customConfig.borderSize = 10;
    customConfig.shareScene = 1;
    
    [[RXShareService sharedSDK] shareCustom:customConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSLog(@"");
        
        [[RXShareService sharedSDK] shareSchedulingReportWithFunc:@"dd" platform:@"wechat" region:@"333" transmits:nil scheduling_event:YES scheduling_type:@"share" properties:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            NSLog(@"");
        }];
    }];
    
    
    
    
    
////    NSString *filePath = [[NSBundle mainBundle] pathForResource:@"test.mp4" ofType:nil];
////
////    NSURL *url = [NSURL URLWithString:[filePath stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
////
////    NSData *videoData = [NSData dataWithContentsOfFile:filePath];
////    reward_invitation
//    [[RXShareService sharedSDK] getShareInfoWithFunc:@"reward_invitation" platform:@"system" region:@"110000" transmits:@"" ext:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        RXCustomShareConfig *customConfig = [[RXCustomShareConfig alloc] init];
//        customConfig.materialType = @"link";
////        customConfig.url = response[@"data"][@"content"][@"url"];
////        customConfig.url = @"https://4ccdhy.dummygameth.com/landing/local/HQsB64gG2RJr23xX8cPudz/1753260076/dist/index.html?identity=-g5qyOwHg&region=-1&fbclid=46b1a52c-8108-490d-a2ad-e7aa1beeff37&protocol_android=weileqzw&protocol_ios=weileqzw&api=https%3A%2F%2Fi4ksyn.dummygameth.com%2F";
//        customConfig.url = @"https://4ccdhy.dummygameth.com/landing/local/HQsB64gG2RJr23xX8cPudz/1753260076/dist/index.html?ts=123";
//        customConfig.image = response[@"data"][@"content"][@"image"];
//        customConfig.platform = @"messenger";
//        customConfig.thirdAppid = @"wx5d34c56f0c58e881";
//        customConfig.x = [response[@"data"][@"content"][@"x"] integerValue];
//        customConfig.y = [response[@"data"][@"content"][@"y"] integerValue];
//        customConfig.width = [response[@"data"][@"content"][@"width"] integerValue];
//        customConfig.height = [response[@"data"][@"content"][@"height"] integerValue];
//        customConfig.borderSize = 10;
//        customConfig.shareScene = 1;
//        
//        [[RXShareService sharedSDK] shareCustom:customConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//            NSLog(@"");
//            
//            [[RXShareService sharedSDK] shareSchedulingReportWithFunc:@"dd" platform:@"wechat" region:@"333" transmits:nil scheduling_event:YES scheduling_type:@"share" properties:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//                NSLog(@"");
//            }];
//        }];
//        
//    }];
//    
//    return;
//    
//    [[RXShareService sharedSDK] getShareInfoWithFunc:@"埋点" platform:@"facebook" region:@"地区码" transmits:@"" ext:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSDictionary *dic = @{@"platform" : @"facebook",
//                              @"material_type" : @"link", // 图片类型：image，链接类型：link
//                              @"title" : response[@"data"][@"content"][@"title"],
//                              @"content" : response[@"data"][@"content"][@"content"],
//                              @"url" : response[@"data"][@"content"][@"url"],
//                              @"shareMode" : @(1), // 分享样式， 0为弹框样式  1为跳转到fb app分享，默认0
//        };
//
//        
//        [[RXFacebookService sharedSDK] FBShareWithShareInfo:dic complete:^(BOOL success) {
//            
//            [[RXShareService sharedSDK] shareSchedulingReportWithFunc:@"dd" platform:@"wechat" region:@"333" transmits:nil scheduling_event:YES scheduling_type:@"share" properties:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//                NSLog(@"");
//            }];
//            if (success) {
//                NSLog(@"fb分享成功");
//            } else {
//                NSLog(@"fb分享失败");
//            }
//        }];
//    }];
//    
////    RXShareConfig *config = [[RXShareConfig alloc] init];
////    config.func = @"sunurl";
////    config.platform = @"facebook";
////    config.shareScene = 1;
////    
////    [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
////        NSLog(@"");
////        
////    }];
//    
//    
//    NSDictionary *dic = @{@"platform" : @"facebook",
//                          @"material_type" : @"link", // 图片类型：image，链接类型：link
//                          @"title" : @"Don't tease me, boss. It's time to go fishing.❤",
//                          @"content" : @"描述\ndddd",
//                          @"url" : @"https://iwn478abe.fishinggamezone.com/landing/local/FKcLiZboM8UWTmKyEmoXUr/1753350923/dist/index.html?api=wygzt.homelandfishingarcade.com&identity=0zKQygwHg&link_id=349&product_id=264&protocol_android=weile263&protocol_ios=weile263&region=-1&share_lang=zh-CN&type=5&use_scheme=0&devicecode=fec508c6-a825-441a-a9e0-4525db9228e9",
////                          @"url" : @"https://iwn478abe.fishinggamezone.com/landing/third/CMjCMDWaxFrf6c9NFV8Wp3/1695902981/06-vi/index.html?identity=H_Ct-0WIR&fbclid=3d2baa6a-72b4-4ec0-9101-c7989ef889a9&protocol_android=weile264vn&protocol_ios=weile264vn&api=https%3A%2F%2Fwygzt.homelandfishingarcade.com%2F&use_scheme=0", // 链接分享的url
////                          @"image" : self.imageUrl,
////                          @"image" : @"http://guanwangyun.oss-cn-beijing.aliyuncs.com/share/serverAccess/0001.gif", // 支持UIImage/NSData/url类型
////                          @"video" : videoData,
//                          @"shareMode" : @(1), // 分享样式， 0为弹框样式  1为跳转到fb app分享，默认0
//    };

    
//    [[RXFacebookService sharedSDK] FBShareWithShareInfo:dic complete:^(BOOL success) {
//        if (success) {
//            NSLog(@"fb分享成功");
//        } else {
//            NSLog(@"fb分享失败");
//        }
//    }];
    
    //    [[RXFacebookService sharedSDK] messengerShareWithShareInfo:dic complete:^(BOOL success) {
    //        NSLog(@"");
    //    }];
        
    //    [[RXShareService sharedSDK] SystemShareWithShareInfo:dic complete:^(BOOL success) {
    //        NSLog(@"");
    //    }];
    
//    RXCustomShareConfig *customConfig = [[RXCustomShareConfig alloc] init];
//    customConfig.materialType = @"link";
//    customConfig.url = @"https://iwn478abe.fishinggamezone.com/v1/operationapi/url/landing?type=5&product_id=264&link_id=156&identity=8YumayxHR&region=-1&fbclid=F969BC48-5168-40CC-BDB7-1449D18FAA7A&protocol_android=weile263&protocol_ios=weile263&api=wygzt.homelandfishingarcade.com";
//    customConfig.image = @"https://rx-fish40-yuenan.oss-ap-southeast-1.aliyuncs.com/share/1745238080985_ZH.png";
//    customConfig.platform = @"facebook";
////    customConfig.x = 1577;
////    customConfig.y = 757;
////    customConfig.width = 200;
////    customConfig.height = 200;
////    customConfig.borderSize = 10;
//    customConfig.shareScene = 1;
//    
//    [[RXShareService sharedSDK] shareCustom:customConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSLog(@"");
//    }];
    
    // 链接分享
//    RXFBShareLinkContent *linkContent = [[RXFBShareLinkContent alloc] init];
//    linkContent.contentURL = [NSURL URLWithString:@"https://iwn478abe.fishinggamezone.com/landing/third/TG8sjCLdWBaCgVcbFKkyEP/1695120987/06-vi/index.html"];
//    linkContent.hashtag = @"dddd";
//    linkContent.quote = @"描述";
//
//    // 图片分享
//    RXFBSharePhotoContent *photoContent = [[RXFBSharePhotoContent alloc] init];
//    photoContent.photos = @[@"图片集"];
//    
//    // 视频分享
//    RXFBShareVideoContent *videoContent = [[RXFBShareVideoContent alloc] init];
//    videoContent.videoURL = [NSURL URLWithString:@"视频链接"];
//    // 或视频二进制
////    videoContent.videoData = videoData;
//    videoContent.previewPhoto = @"视频封面";
//
//    [[RXFacebookService sharedSDK] messengerShareWithContent:content complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//            
//    }];
    
//    [[RXFacebookService sharedSDK] FBShareWithContent:linkContent mode:1 complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
//            
//    }];
    
//    [[RXFacebookService sharedSDK] messengerShareWithShareInfo:dic complete:^(BOOL success) {
//        NSLog(@"");
//    }];
}

- (void)btnAction3
{
    NSDictionary *dic = @{@"platform" : @"messenger",
                          @"material_type" : @"link", // 图片类型：image，链接类型：link
                          @"title" : @"标题",
                          @"content" : @"描述\ndddd",
//                          @"url" : @"http://guanwangyun.oss-cn-beijing.aliyuncs.com/share/serverAccess/0001.gif",
                          @"url" : @"https://iwn478abe.fishinggamezone.com/landing/local/oBK54PL8tTqYYb5GiWwVv9/1753266580/dist/index.html?api=https%3A%2F%2Fwygzt.homelandfishingarcade.com%2F&fbclid=IwY2xjawLu4khleHRuA2FlbQIxMQABHnjkP6m64pGcyU-_wx3pHMVuLoD46_MAbQyWlg5MMhJ6ayvxyFaaGrXuyw8C_aem_auagy1_-QoTCpCe0XdoT2A&identity=lSerYgQHg&link_id=345&product_id=264&protocol_android=weile265gl&protocol_ios=weile265gl&region=-1&share_lang=zh-CN&type=5&use_scheme=0&devicecode=a4c8a2fb-d39b-4cd1-b1cf-d0c77457a18f", // 链接分享的url
//                          @"image" : self.imageUrl,
                          @"image" : @"http://guanwangyun.oss-cn-beijing.aliyuncs.com/share/serverAccess/0001.gif", // 支持UIImage/NSData/url类型
//                          @"video" : videoData,
                          @"shareMode" : @(1), // 分享样式， 0为弹框样式  1为跳转到fb app分享，默认0
    };
    
    [[RXFacebookService sharedSDK] messengerShareWithShareInfo:dic complete:^(BOOL success) {
        NSLog(@"");
    }];
}

- (void)rx_LoginCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
{
    NSLog(@"");
}

@end
