//
//  ViewController.m
//  RxRedditSDKDemo
//
//  Created by root11 on 2024/4/9.
//

#import "ViewController.h"
#import <RXRedditSDK/RXRedditSDK.h>
#import <RXSDK_Pure/RXSDK_Pure.h>

@interface ViewController ()<RXLoginDelegate>

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    
    [RXService sharedSDK].loginDelegate = self;
    
    // 登录
    UIButton *btn1 = [[UIButton alloc] initWithFrame:CGRectMake(10, 100, 130, 30)];
    [btn1 setTitle:@"登录" forState:UIControlStateNormal];
    [btn1 setBackgroundColor:[UIColor redColor]];
    [btn1 addTarget:self action:@selector(btnAction1) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    // 分享
    UIButton *btn2 = [[UIButton alloc] initWithFrame:CGRectMake(150, 100, 130, 30)];
    [btn2 setTitle:@"分享url" forState:UIControlStateNormal];
    [btn2 setBackgroundColor:[UIColor redColor]];
    [btn2 addTarget:self action:@selector(btnAction2) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn2];
    
    // 分享
    UIButton *btn3 = [[UIButton alloc] initWithFrame:CGRectMake(290, 100, 130, 30)];
    [btn3 setTitle:@"分享文本" forState:UIControlStateNormal];
    [btn3 setBackgroundColor:[UIColor redColor]];
    [btn3 addTarget:self action:@selector(btnAction3) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn3];
}

- (void)btnAction1{
//    [[RXRedditService sharedSDK] login];
    [[RXService sharedSDK] loginWithExtDic:nil username:nil password:nil sign_fields:nil loginType:LoginTypeReddit migrate_args:nil];
}

- (void)btnAction2{
    /*
    NSString *accessToken = [[NSUserDefaults standardUserDefaults] objectForKey:@"redditAccessToken"];
//    contributor   subscriber订阅的社区
    NSURL *url = [NSURL URLWithString:@"https://oauth.reddit.com/subreddits/mine/subscriber"];
    //根据请求结果解析data后dict是否为nil判断是否有此社区
//    NSURL *url = [NSURL URLWithString:@"https://oauth.reddit.com/r/gaming/about"];
    
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setValue:[NSString stringWithFormat:@"Bearer %@", accessToken] forHTTPHeaderField:@"Authorization"];
    
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
            NSLog(@"Error fetching data: %@", error);
        } else {
            NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
            NSLog(@"%@",dict);
        }
    }];
    [dataTask resume];
    */
    [[RXRedditService sharedSDK] sendShareTypeWithType:RXRedditShareTypeUrl title:@"look at the video" url:@"https://media.w3.org/2010/05/sintel/trailer.mp4" text:@"" sr:@"gaming" completion:^(NSDictionary * _Nonnull response, NSDictionary * _Nonnull error) {
        if (error == nil) {
            NSLog(@"%@,%@", response[@"code"], response[@"msg"]);
        }else{
            NSLog(@"%@---%@",error[@"code"], error[@"msg"]);
        }
        
    }];
    
}

- (void)btnAction3{
    [[RXRedditService sharedSDK] sendShareTypeWithType:RXRedditShareTypeText title:@"look at the new person" url:@"" text:@"Hello everyone, just come here to learn something, please take care of me, I will try my best to learn from you" sr:@"gaming" completion:^(NSDictionary * _Nonnull response, NSDictionary * _Nonnull error) {
        if (error == nil) {
            NSLog(@"%@,%@", response[@"code"], response[@"msg"]);
        }else{
            NSLog(@"%@---%@",error[@"code"], error[@"msg"]);
        }
    }];
}


#pragma mark - RXLoginDelegate
- (void)rx_LoginCallBackWithResponse:(NSDictionary *)response error:(RX_CommonRequestError *)error
{
    if (!error) {
        NSString *loginOpenid = response[@"data"][@"login_openid"];
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:response options:NSJSONWritingPrettyPrinted error:nil];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSString *log = [[RXLogService sharedSDK] getSDKLog];
        NSLog(@"");
    } else {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:error.responesObject options:NSJSONWritingPrettyPrinted error:nil];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSLog(@"");
    }
}

@end
