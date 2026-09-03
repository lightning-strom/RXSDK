//
//  RXShareViewController.m
//  RXSDKDemo-Public
//
//  Created by root11 on 2024/5/16.
//

#pragma mark - 注：分享功能步骤说明
/*
说明：分享功能，需要按照以下步骤进行调用（文件中方法调用与参数仅为样例，功能不一定调用成功，涉及方法调用与参数以‘瑞雪文档中心——分享——客户端接入’为准）
1.SDK初始化准备。按照瑞雪文档对需要的SDK进行集成，按照文档要求配置对应的Bundle Identifier、Info.plist与其他文件中相关信息(以文档为准)，集成后进行分享功能的调用。
  app应处于登录状态方可调用分享功能。
 
2.调用分享功能。以下是不同的分享方式：
 （1）一键分享：在成功设置了埋点标识后，调用
 '- (void)share:(RXShareConfig *)config
      complete:(RequestComplete)complete'
 方法进行一键分享；
 
 （2）自定义分享：或根据个性化的需求修改分享内容，调用
 '- (void)getShareInfoWithFunc:(NSString *)func
 platform:(NSString *)platform
   region:(NSString *)region
transmits:(NSString * _Nullable)transmits
      ext:(NSDictionary * _Nullable)ext
readCache:(BOOL)readCache
 complete:(RequestComplete)complete;'
 
 获取分享信息后，根据返回的分享内容，对应自定义分享方法config需要的参数进行赋值，在赋值过程中对于需要个性化修改的参数进行修改，然后调用
 '- (void)shareCustom:(RXCustomShareConfig *)config
 complete:(RequestComplete)complete'
 进行自定义分享。
 
3.分享结果上报。调用
 '- (void)shareSchedulingReportWithFunc:(NSString *)func
 platform:(NSString *)platform
   region:(NSString *)region
transmits:(NSString * _Nullable)transmits
scheduling_event:(BOOL)scheduling_event
scheduling_type:(NSString *)scheduling_type
properties:(NSDictionary * _Nullable)properties
 complete:(RequestComplete)complete;'
 
 进行分享结果上报。
 
 */


#import "RXShareViewController.h"
#import "CHMarco.h"
#import "CHSettingCellModel.h"
#import "Tool.h"

@interface RXShareViewController ()<UITableViewDelegate, UITableViewDataSource>

@property (nonatomic, strong) UITableView *tableView;
@property (nonatomic, strong) NSMutableArray *shareTypeArray;

@end

@implementation RXShareViewController

- (void)viewWillDisappear:(BOOL)animated{
    [super viewWillDisappear:animated];
    self.navigationController.navigationBar.hidden = YES;
}

- (void)viewWillAppear:(BOOL)animated{
    [super viewDidAppear:animated];
    self.navigationController.navigationBar.hidden = NO;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.navigationController.navigationBar.tintColor = [UIColor blackColor];
    self.title = @"分享方式";
    self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"back_black"] style:UIBarButtonItemStylePlain target:self action:@selector(backClick)];
    self.view.backgroundColor = [UIColor whiteColor];
    
//MARK: 分享平台：wechat、system、facebook、messenger、line、tiktok、zalo、snapchat
    __block NSArray *loginTypes = @[@"wechat", @"system"];//国内平台
    __block NSArray *loginTitles = [NSArray array];
    __block NSArray *loginImgs = [NSArray array];
    
    if ([CHUtility sharedManager].isOS) {//海外平台
        loginTypes = @[@"system", @"facebook", @"messenger", @"line", @"tiktok", @"zalo", @"snapchat"];
    }
    
    [[CHUtility sharedManager] checkShareTypes:loginTypes backBlock:^(NSArray * _Nonnull sloginTypes, NSArray * _Nonnull sloginTitles, NSArray * _Nonnull sloginImgs) {
        loginTypes = sloginTypes;
        loginTitles = sloginTitles;
        loginImgs = sloginImgs;
    }];
    
    for (int i = 0; i < loginTypes.count; i++) {
        CHSettingCellModel *model = [[CHSettingCellModel alloc] init];
        model.title = loginTitles[i];
        model.img = loginImgs[i];
        model.loginType = loginTypes[i];
        [self.shareTypeArray addObject:model];
    }

    [self setUI];
}

#pragma mark -- setUI
- (void)setUI{
    [self.view addSubview:self.tableView];
}

- (void)viewWillLayoutSubviews{
    [super viewWillLayoutSubviews];
    CGFloat statusBarHeight = [Tool getStatusBarHeight];
    self.tableView.sd_layout.topSpaceToView(self.view, statusBarHeight + 44)
    .leftEqualToView(self.view)
    .rightEqualToView(self.view)
    .bottomSpaceToView(self.view, 35);
}

#pragma mark - action
- (void)backClick{
    [self.navigationController popViewControllerAnimated:YES];
}

#pragma mark - lazy load
- (NSMutableArray *)shareTypeArray{
    if (!_shareTypeArray) {
        _shareTypeArray = [[NSMutableArray alloc] init];
    }
    return _shareTypeArray;
}

- (UITableView *)tableView{
    if (!_tableView) {
        _tableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStylePlain];
        _tableView.backgroundColor = [UIColor clearColor];
        _tableView.separatorStyle = UITableViewCellSeparatorStyleSingleLine;
        _tableView.delegate = self;
        _tableView.dataSource = self;
//        _tableView.estimatedRowHeight = 100;
//        _tableView.rowHeight = UITableViewAutomaticDimension;
        _tableView.keyboardDismissMode = UIScrollViewKeyboardDismissModeOnDrag;
        if (@available(iOS 11.0, *) ) {
            _tableView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
        }
        if (@available(iOS 15.0, *) ) {
            _tableView.sectionHeaderTopPadding = 0.0;
        }
    }
    return _tableView;
}

#pragma mark - tableview delegate
- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.shareTypeArray.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    static NSString *cellIdentifier = @"cell";
    RXLoginViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
    if (cell == nil) {
        cell = [[RXLoginViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier];
    }
    cell.selectionStyle = UITableViewCellSelectionStyleNone;

    if (self.shareTypeArray.count > 0) {
        CHSettingCellModel *model = self.shareTypeArray[indexPath.row];
        cell.model = model;
    }
    
    return cell;
}

#pragma mark - UITableViewDelegate

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    return 60;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    CHSettingCellModel *model = self.shareTypeArray[indexPath.row];
    __weak typeof(self) weakSelf = self;
//MARK: 分享步骤一：调用一键分享或自定义分享。以下tiktok一键分享示例。在设置埋点标识后，直接分享即可。
        if ([model.title isEqualToString:@"tiktok分享图片"]) {
            RXShareConfig *config = [[RXShareConfig alloc] init];
//MARK: config.func:埋点标识，在瑞雪企业管理后台中成功设置分享埋点、策略、素材后可获取此埋点标识。
            config.func = @"sdk_chengjiu";
            config.platform = @"tiktok";
            config.useShortUrl = YES;
            [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//MARK: 分享步骤二：tiktok分享上报示例。
                BOOL ret = NO;
                if (error == nil) {
                    ret = YES;
                }
                [weakSelf reportWithFunc:@"sdk_chengjiu" platform:@"tiktok" region:@"" transmits:@"" scheduling_event:ret scheduling_type:@"share" properties:nil];
            }];
            
        }else if ([model.title isEqualToString:@"tiktok分享图集"]) {
            RXShareConfig *config = [[RXShareConfig alloc] init];
            config.func = @"sdk_chengjius";
            config.platform = @"tiktok";
            config.useShortUrl = YES;
            [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                BOOL ret = NO;
                if (error == nil) {
                    ret = YES;
                }
                [weakSelf reportWithFunc:@"sdk_chengjius" platform:@"tiktok" region:@"" transmits:@"" scheduling_event:ret scheduling_type:@"share" properties:nil];
            }];

        }else if ([model.title isEqualToString:@"wechat分享图片(朋友圈)"]) {
            RXShareConfig *config = [[RXShareConfig alloc] init];
            config.func = @"share_image";
            config.platform = @"wechat";
            config.useShortUrl = YES;
            config.shareScene = 1;
            
            [[RXShareService sharedSDK] getShareInfoWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
               
                RXCustomShareConfig *customConfig = [[RXCustomShareConfig alloc] init];
                customConfig.materialType = @"image";
                customConfig.url = response[@"data"][@"content"][@"url"];
                customConfig.image = response[@"data"][@"content"][@"image"];
                customConfig.platform = @"wechat";
                customConfig.thirdAppid = @"wx5d34c56f0c58e881";
                customConfig.x = [response[@"data"][@"content"][@"x"] integerValue];
                customConfig.y = [response[@"data"][@"content"][@"y"] integerValue];
                customConfig.width = [response[@"data"][@"content"][@"width"] integerValue];
                customConfig.height = [response[@"data"][@"content"][@"height"] integerValue];
                customConfig.borderSize = 10;
                customConfig.shareScene = 1;
                
                [[RXShareService sharedSDK] shareCustom:customConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    if (!error) {
                        NSLog(@"分享成功");
                        [RXHUD showText:@"分享成功"];
                    } else {
                        NSLog(@"分享失败");
                        [RXHUD showText:[NSString stringWithFormat:@"分享失败：%@", error.responesObject]];
                    }
                }];
                
            }];
            
//            [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//                BOOL ret = NO;
//                if (error == nil) {
//                    ret = YES;
//                }
//                [weakSelf reportWithFunc:@"sdk_chengjiushare" platform:@"wechat" region:@"" transmits:@"" scheduling_event:ret scheduling_type:@"share" properties:nil];
//            }];
            
        }else if ([model.title isEqualToString:@"wechat分享链接(朋友圈)"]) {
            
            RXShareConfig *config = [[RXShareConfig alloc] init];
            config.func = @"share_link";
            config.platform = @"wechat";
            config.useShortUrl = YES;
            config.shareScene = 1;
            
            [[RXShareService sharedSDK] getShareInfoWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
               
                RXCustomShareConfig *customConfig = [[RXCustomShareConfig alloc] init];
                customConfig.materialType = @"link";
                customConfig.url = response[@"data"][@"content"][@"url"];
                customConfig.image = response[@"data"][@"content"][@"image"];
                customConfig.platform = @"wechat";
                customConfig.thirdAppid = @"wx5d34c56f0c58e881";
                customConfig.x = [response[@"data"][@"content"][@"x"] integerValue];
                customConfig.y = [response[@"data"][@"content"][@"y"] integerValue];
                customConfig.width = [response[@"data"][@"content"][@"width"] integerValue];
                customConfig.height = [response[@"data"][@"content"][@"height"] integerValue];
                customConfig.borderSize = 10;
                customConfig.shareScene = 1;
                
                [[RXShareService sharedSDK] shareCustom:customConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    if (!error) {
                        NSLog(@"分享成功");
                        [RXHUD showText:@"分享成功"];
                    } else {
                        NSLog(@"分享失败");
                        [RXHUD showText:[NSString stringWithFormat:@"分享失败：%@", error.responesObject]];
                    }
                }];
                
            }];
            
//            RXShareConfig *config = [[RXShareConfig alloc] init];
//            config.func = @"sdk_chengjiulink";
//            config.platform = @"wechat";
//            config.useShortUrl = YES;
//            config.shareScene = 1;
//            [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//                BOOL ret = NO;
//                if (error == nil) {
//                    ret = YES;
//                }
//                [weakSelf reportWithFunc:@"sunshare2" platform:@"wechat" region:@"" transmits:@"" scheduling_event:ret scheduling_type:@"share" properties:nil];
//            }];
            
            
//MARK: 自定义分享示例。以wechat为例子：（1）获取分享信息 （2）自定赋值并分享 （3）分享上报
/*
    [[RXShareService sharedSDK] getShareInfoWithFunc:@"sunshare2" platform:@"wechat" region:@"" transmits:@"" ext:nil readCache:NO complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSString *url = response[@"data"][@"content"][@"url"];
        NSLog(@"contenturl = %@", url);
        
        RXCustomShareConfig *customConfig = [[RXCustomShareConfig alloc] init];
        customConfig.platform = @"wechat";
        customConfig.url = url;
        customConfig.title = @"title";
        customConfig.content = @"content";
        customConfig.materialType = @"link";
        customConfig.shareScene = 1;
        [[RXShareService sharedSDK] shareCustom:customConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
             BOOL ret = NO;
             if (error == nil) {
                 ret = YES;
             }
            [weakSelf reportWithFunc:@"sdk_chengjiu" platform:@"wechat" region:@"" transmits:@"" scheduling_event:ret scheduling_type:@"share" properties:nil];
        }];
    }];
*/
        }else if ([model.title isEqualToString:@"wechat分享图片(好友)"]) {
            RXShareConfig *config = [[RXShareConfig alloc] init];
            config.func = @"share_image";
            config.platform = @"wechat";
            config.useShortUrl = YES;
            config.shareScene = 0;
            
            [[RXShareService sharedSDK] getShareInfoWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
               
                RXCustomShareConfig *customConfig = [[RXCustomShareConfig alloc] init];
                customConfig.materialType = @"image";
                customConfig.url = response[@"data"][@"content"][@"url"];
                customConfig.image = response[@"data"][@"content"][@"image"];
                customConfig.platform = @"wechat";
                customConfig.thirdAppid = @"wx5d34c56f0c58e881";
                customConfig.x = [response[@"data"][@"content"][@"x"] integerValue];
                customConfig.y = [response[@"data"][@"content"][@"y"] integerValue];
                customConfig.width = [response[@"data"][@"content"][@"width"] integerValue];
                customConfig.height = [response[@"data"][@"content"][@"height"] integerValue];
                customConfig.borderSize = 10;
                customConfig.shareScene = 0;
                
                [[RXShareService sharedSDK] shareCustom:customConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    if (!error) {
                        NSLog(@"分享成功");
                        [RXHUD showText:@"分享成功"];
                    } else {
                        NSLog(@"分享失败");
                        [RXHUD showText:[NSString stringWithFormat:@"分享失败：%@", error.responesObject]];
                    }
                }];
                
            }];
            
//            RXShareConfig *config = [[RXShareConfig alloc] init];
//            config.func = @"sdk_chengjiushare";
//            config.platform = @"wechat";
//            config.useShortUrl = YES;
//            config.shareScene = 0;
//            [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//                BOOL ret = NO;
//                if (error == nil) {
//                    ret = YES;
//                }
//                [weakSelf reportWithFunc:@"sdk_chengjiushare" platform:@"wechat" region:@"" transmits:@"" scheduling_event:ret scheduling_type:@"share" properties:nil];
//            }];
            
        }else if ([model.title isEqualToString:@"wechat分享链接(好友)"]) {
            RXShareConfig *config = [[RXShareConfig alloc] init];
            config.func = @"share_link";
            config.platform = @"wechat";
            config.useShortUrl = YES;
            config.shareScene = 0;
            
            [[RXShareService sharedSDK] getShareInfoWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
               
                RXCustomShareConfig *customConfig = [[RXCustomShareConfig alloc] init];
                customConfig.materialType = @"link";
                customConfig.url = response[@"data"][@"content"][@"url"];
                customConfig.image = response[@"data"][@"content"][@"image"];
                customConfig.platform = @"wechat";
                customConfig.thirdAppid = @"wx5d34c56f0c58e881";
                customConfig.x = [response[@"data"][@"content"][@"x"] integerValue];
                customConfig.y = [response[@"data"][@"content"][@"y"] integerValue];
                customConfig.width = [response[@"data"][@"content"][@"width"] integerValue];
                customConfig.height = [response[@"data"][@"content"][@"height"] integerValue];
                customConfig.borderSize = 10;
                customConfig.shareScene = 0;
                
                [[RXShareService sharedSDK] shareCustom:customConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    if (!error) {
                        NSLog(@"分享成功");
                        [RXHUD showText:@"分享成功"];
                    } else {
                        NSLog(@"分享失败");
                        [RXHUD showText:[NSString stringWithFormat:@"分享失败：%@", [Tool dictionaryToUTF8String:error.responesObject]]];
                    }
                }];
                
            }];
            
//            RXShareConfig *config = [[RXShareConfig alloc] init];
//            config.func = @"sunshare2";
//            config.platform = @"wechat";
//            config.useShortUrl = YES;
//            config.shareScene = 0;
//            [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//                BOOL ret = NO;
//                if (error == nil) {
//                    ret = YES;
//                }
//                [weakSelf reportWithFunc:@"sunshare2" platform:@"wechat" region:@"" transmits:@"" scheduling_event:ret scheduling_type:@"share" properties:nil];
//            }];
            
        }else if ([model.title isEqualToString:@"system分享图片"]) {

            RXShareConfig *config = [[RXShareConfig alloc] init];
            config.func = @"share_image";
            config.platform = @"system";
            config.useShortUrl = YES;
            
            [[RXShareService sharedSDK] getShareInfoWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
               
                RXCustomShareConfig *customConfig = [[RXCustomShareConfig alloc] init];
                customConfig.materialType = @"image";
                customConfig.url = response[@"data"][@"content"][@"url"];
                customConfig.image = response[@"data"][@"content"][@"image"];
                customConfig.platform = @"system";
                customConfig.thirdAppid = @"wx5d34c56f0c58e881";
                customConfig.x = [response[@"data"][@"content"][@"x"] integerValue];
                customConfig.y = [response[@"data"][@"content"][@"y"] integerValue];
                customConfig.width = [response[@"data"][@"content"][@"width"] integerValue];
                customConfig.height = [response[@"data"][@"content"][@"height"] integerValue];
                customConfig.borderSize = 10;
                
                [[RXShareService sharedSDK] shareCustom:customConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    if (!error) {
                        NSLog(@"分享成功");
                        [RXHUD showText:@"分享成功"];
                    } else {
                        NSLog(@"分享失败");
                        NSString *msg = @"未知错误";
                        if ([error.responesObject[@"code"] integerValue] == 5002) {
                            msg = @"取消分享";
                        } else {
                            msg = error.responesObject[@"msg"];
                        }
                        [RXHUD showText:[NSString stringWithFormat:@"分享失败：%@", msg]];
                    }
                }];
                
            }];
        }else if ([model.title isEqualToString:@"system分享链接"]) {
            
            RXShareConfig *config = [[RXShareConfig alloc] init];
            config.func = @"share_link";
            config.platform = @"system";
            config.useShortUrl = YES;
            
            [[RXShareService sharedSDK] getShareInfoWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
               
                RXCustomShareConfig *customConfig = [[RXCustomShareConfig alloc] init];
                customConfig.materialType = @"link";
                customConfig.url = response[@"data"][@"content"][@"url"];
                customConfig.image = response[@"data"][@"content"][@"image"];
                customConfig.platform = @"system";
                customConfig.thirdAppid = @"wx5d34c56f0c58e881";
                customConfig.x = [response[@"data"][@"content"][@"x"] integerValue];
                customConfig.y = [response[@"data"][@"content"][@"y"] integerValue];
                customConfig.width = [response[@"data"][@"content"][@"width"] integerValue];
                customConfig.height = [response[@"data"][@"content"][@"height"] integerValue];
                customConfig.borderSize = 10;
                
                [[RXShareService sharedSDK] shareCustom:customConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    if (!error) {
                        NSLog(@"分享成功");
                        [RXHUD showText:@"分享成功"];
                    } else {
                        NSLog(@"分享失败");
                        NSString *msg = @"未知错误";
                        if ([error.responesObject[@"code"] integerValue] == 5002) {
                            msg = @"取消分享";
                        } else {
                            msg = error.responesObject[@"msg"];
                        }
                        [RXHUD showText:[NSString stringWithFormat:@"分享失败：%@", msg]];
                    }
                }];
                
            }];
            
        }else if ([model.title isEqualToString:@"facebook分享图片（弹窗）"]) {
            RXShareConfig *config = [[RXShareConfig alloc] init];
            config.func = @"share_image";
            config.platform = @"facebook";
            config.useShortUrl = YES;
            
            [[RXShareService sharedSDK] getShareInfoWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                
                RXCustomShareConfig *customConfig = [[RXCustomShareConfig alloc] init];
                customConfig.materialType = @"image";
                customConfig.url = response[@"data"][@"content"][@"url"];
                customConfig.image = response[@"data"][@"content"][@"image"];
                customConfig.platform = @"facebook";
                customConfig.thirdAppid = @"wx5d34c56f0c58e881";
                customConfig.x = [response[@"data"][@"content"][@"x"] integerValue];
                customConfig.y = [response[@"data"][@"content"][@"y"] integerValue];
                customConfig.width = [response[@"data"][@"content"][@"width"] integerValue];
                customConfig.height = [response[@"data"][@"content"][@"height"] integerValue];
                customConfig.borderSize = 10;
                
                [[RXShareService sharedSDK] shareCustom:customConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    if (!error) {
                        NSLog(@"分享成功");
                        [RXHUD showText:@"分享成功"];
                    } else {
                        NSLog(@"分享失败");
                        NSString *msg = @"未知错误";
                        if ([error.responesObject[@"code"] integerValue] == 5002) {
                            msg = @"取消分享";
                        } else {
                            msg = error.responesObject[@"msg"];
                        }
                        [RXHUD showText:[NSString stringWithFormat:@"分享失败：%@", msg]];
                    }
                }];
            }];
//            RXShareConfig *config = [[RXShareConfig alloc] init];
//            config.func = @"sdk_chengjiu";
//            config.platform = @"facebook";
//            config.shareScene = 1;
//            config.useShortUrl = YES;
//            [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//                BOOL ret = NO;
//                if (error == nil) {
//                    ret = YES;
//                }
//                [weakSelf reportWithFunc:@"sdk_chengjiu" platform:@"facebook" region:@"" transmits:@"" scheduling_event:ret scheduling_type:@"share" properties:nil];
//            }];
            
        }else if ([model.title isEqualToString:@"facebook分享链接（弹窗）"]) {
            RXShareConfig *config = [[RXShareConfig alloc] init];
            config.func = @"share_link";
            config.platform = @"facebook";
            config.useShortUrl = YES;
            
            [[RXShareService sharedSDK] getShareInfoWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
               
                RXCustomShareConfig *customConfig = [[RXCustomShareConfig alloc] init];
                customConfig.materialType = @"link";
                customConfig.url = response[@"data"][@"content"][@"url"];
                customConfig.image = response[@"data"][@"content"][@"image"];
                customConfig.platform = @"facebook";
                customConfig.thirdAppid = @"wx5d34c56f0c58e881";
                customConfig.x = [response[@"data"][@"content"][@"x"] integerValue];
                customConfig.y = [response[@"data"][@"content"][@"y"] integerValue];
                customConfig.width = [response[@"data"][@"content"][@"width"] integerValue];
                customConfig.height = [response[@"data"][@"content"][@"height"] integerValue];
                customConfig.borderSize = 10;
                
                [[RXShareService sharedSDK] shareCustom:customConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    if (!error) {
                        NSLog(@"分享成功");
                        [RXHUD showText:@"分享成功"];
                    } else {
                        NSLog(@"分享失败");
                        NSString *msg = @"未知错误";
                        if ([error.responesObject[@"code"] integerValue] == 5002) {
                            msg = @"取消分享";
                        } else {
                            msg = error.responesObject[@"msg"];
                        }
                        [RXHUD showText:[NSString stringWithFormat:@"分享失败：%@", msg]];
                    }
                }];
                
            }];
//            RXShareConfig *config = [[RXShareConfig alloc] init];
//            config.func = @"sunurl";
//            config.platform = @"facebook";
//            config.shareScene = 1;
//            config.useShortUrl = YES;
//            [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//                BOOL ret = NO;
//                if (error == nil) {
//                    ret = YES;
//                }
//                [weakSelf reportWithFunc:@"sunurl" platform:@"facebook" region:@"" transmits:@"" scheduling_event:ret scheduling_type:@"share" properties:nil];
//            }];
        
//            NSDictionary *dic = @{@"platform" : @"messenger",
//                                  @"material_type" : @"link", // 图片类型：image，链接类型：link
//                                  @"title" : @"标题",
//                                  @"content" : @"描述\ndddd",
//                                  @"url" : @"http://cn-api-test.ruixuecloud.com/v1/operationapi/url/landingtest/1112",
//                                  @"image" : @"http://guanwangyun.oss-cn-beijing.aliyuncs.com/share/serverAccess/0001.gif", // 支持UIImage/NSData/url类型
//        //                          @"video" : videoData,
//                                  @"shareMode" : @(1), // 分享样式， 0为弹框样式  1为跳转到fb app分享，默认0
//            };
//            [[RXFacebookService sharedSDK] FBShareWithShareInfo:dic complete:^(BOOL success) {
//                if (success) {
//                    NSLog(@"fb分享成功");
//                } else {
//                    NSLog(@"fb分享失败");
//                }
//            }];
            
        } else if ([model.title isEqualToString:@"facebook分享链接（跳转）"]) {
            RXShareConfig *config = [[RXShareConfig alloc] init];
            config.func = @"share_link";
            config.platform = @"facebook";
            config.useShortUrl = YES;
            
            [[RXShareService sharedSDK] getShareInfoWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
               
                RXCustomShareConfig *customConfig = [[RXCustomShareConfig alloc] init];
                customConfig.materialType = @"link";
                customConfig.url = response[@"data"][@"content"][@"url"];
                customConfig.image = response[@"data"][@"content"][@"image"];
                customConfig.platform = @"facebook";
                customConfig.thirdAppid = @"wx5d34c56f0c58e881";
                customConfig.x = [response[@"data"][@"content"][@"x"] integerValue];
                customConfig.y = [response[@"data"][@"content"][@"y"] integerValue];
                customConfig.width = [response[@"data"][@"content"][@"width"] integerValue];
                customConfig.height = [response[@"data"][@"content"][@"height"] integerValue];
                customConfig.borderSize = 10;
                customConfig.shareScene = 1;
                
                [[RXShareService sharedSDK] shareCustom:customConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    if (!error) {
                        NSLog(@"分享成功");
                        [RXHUD showText:@"分享成功"];
                    } else {
                        NSLog(@"分享失败");
                        NSString *msg = @"未知错误";
                        if ([error.responesObject[@"code"] integerValue] == 5002) {
                            msg = @"取消分享";
                        } else {
                            msg = error.responesObject[@"msg"];
                        }
                        [RXHUD showText:[NSString stringWithFormat:@"分享失败：%@", msg]];
                    }
                }];
                
            }];
        } else if ([model.title isEqualToString:@"facebook分享图片（跳转）"]) {
            RXShareConfig *config = [[RXShareConfig alloc] init];
            config.func = @"share_link";
            config.platform = @"facebook";
            config.useShortUrl = YES;
            
            [[RXShareService sharedSDK] getShareInfoWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
               
                RXCustomShareConfig *customConfig = [[RXCustomShareConfig alloc] init];
                customConfig.materialType = @"link";
                customConfig.url = response[@"data"][@"content"][@"url"];
                customConfig.image = response[@"data"][@"content"][@"image"];
                customConfig.platform = @"facebook";
                customConfig.thirdAppid = @"wx5d34c56f0c58e881";
                customConfig.x = [response[@"data"][@"content"][@"x"] integerValue];
                customConfig.y = [response[@"data"][@"content"][@"y"] integerValue];
                customConfig.width = [response[@"data"][@"content"][@"width"] integerValue];
                customConfig.height = [response[@"data"][@"content"][@"height"] integerValue];
                customConfig.borderSize = 10;
                customConfig.shareScene = 1;
                
                [[RXShareService sharedSDK] shareCustom:customConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    if (!error) {
                        NSLog(@"分享成功");
                        [RXHUD showText:@"分享成功"];
                    } else {
                        NSLog(@"分享失败");
                        NSString *msg = @"未知错误";
                        if ([error.responesObject[@"code"] integerValue] == 5002) {
                            msg = @"取消分享";
                        } else {
                            msg = error.responesObject[@"msg"];
                        }
                        [RXHUD showText:[NSString stringWithFormat:@"分享失败：%@", msg]];
                    }
                }];
                
            }];
        } else if ([model.title isEqualToString:@"messenger分享图片"]) {
            [[Tool sharedSDK] alertWithTitle:@"提示" content:@"FBSDK 17.0.0 后不支持" sureBtnTitle:@"确定"];
            return;
            RXShareConfig *config = [[RXShareConfig alloc] init];
            config.func = @"sdk_chengjiu";
            config.platform = @"messenger";
            config.useShortUrl = YES;
            [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                BOOL ret = NO;
                if (error == nil) {
                    ret = YES;
                }
                [weakSelf reportWithFunc:@"sdk_chengjiu" platform:@"messenger" region:@"" transmits:@"" scheduling_event:ret scheduling_type:@"share" properties:nil];
            }];
            
        }else if ([model.title isEqualToString:@"messenger分享链接"]) {
            [[Tool sharedSDK] alertWithTitle:@"提示" content:@"FBSDK 17.0.0 后不支持" sureBtnTitle:@"确定"];
            return;
//TODO: messenger企业后台无法新增链接素材，而旧的素材无法正常使用，导致无法成功分享，此处需要处理
            RXShareConfig *config = [[RXShareConfig alloc] init];
            config.func = @"sunurl";
            config.platform = @"messenger";
            config.useShortUrl = YES;
            [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                BOOL ret = NO;
                if (error == nil) {
                    ret = YES;
                }
                [weakSelf reportWithFunc:@"sunurl" platform:@"messenger" region:@"" transmits:@"" scheduling_event:ret scheduling_type:@"share" properties:nil];
            }];
            
        }else if ([model.title isEqualToString:@"line分享链接"]) {
            RXShareConfig *config = [[RXShareConfig alloc] init];
            config.func = @"sunurl";
            config.platform = @"line";
            config.useShortUrl = YES;
            [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                BOOL ret = NO;
                if (error == nil) {
                    ret = YES;
                }
                [weakSelf reportWithFunc:@"sunurl" platform:@"line" region:@"" transmits:@"" scheduling_event:ret scheduling_type:@"share" properties:nil];
            }];
            
        }else if ([model.title isEqualToString:@"zalo分享链接"]) {
            RXShareConfig *config = [[RXShareConfig alloc] init];
            config.func = @"sunespecial";
            config.platform = @"zalo";
            config.useShortUrl = YES;
            [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                BOOL ret = NO;
                if (error == nil) {
                    ret = YES;
                }
                [weakSelf reportWithFunc:@"sunespecial" platform:@"zalo" region:@"" transmits:@"" scheduling_event:ret scheduling_type:@"share" properties:nil];
            }];
            
        }else if ([model.title isEqualToString:@"snapchat分享图片"]) {
            RXShareConfig *config = [[RXShareConfig alloc] init];
            config.func = @"sdk_chengjiu";
            config.platform = @"snapchat";
            config.useShortUrl = YES;
            [[RXShareService sharedSDK] share:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                BOOL ret = NO;
                if (error == nil) {
                    ret = YES;
                }
                [weakSelf reportWithFunc:@"sdk_chengjiu" platform:@"snapchat" region:@"" transmits:@"" scheduling_event:ret scheduling_type:@"share" properties:nil];
            }];
        }else{
            [[Tool sharedSDK] alertWithTitle:@"提示" content:@"敬请期待" sureBtnTitle:@"确定"];
        }
    
}

#pragma mark - 分享上报方法
- (void)reportWithFunc:(NSString *)func platform:(NSString *)platform region:(NSString *)region transmits:(NSString *)transmits scheduling_event:(BOOL)scheduling_event scheduling_type:(NSString *)scheduling_type properties:(NSDictionary *)properties{
//    transmits拼接示例
//    transmits = @"sharefromtype=value&sharetype=value";
    
    NSCharacterSet *encodeSet = [NSCharacterSet characterSetWithCharactersInString:@"!*'();:@&=+$,/?%#[]"];
    NSString *encode = [transmits stringByAddingPercentEncodingWithAllowedCharacters:encodeSet];
    
    [[RXShareService sharedSDK] shareSchedulingReportWithFunc:func platform:platform region:region transmits:encode scheduling_event:scheduling_event scheduling_type:scheduling_type properties:properties complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            
    }];
}



@end
