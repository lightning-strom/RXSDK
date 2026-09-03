//
//  TestVC.m
//  RuiXueDemo
//
//  Created by 陈汉 on 2025/4/14.
//

#import "TestVC.h"
#import <StoreKit/StoreKit.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <Network/Network.h> // 添加Network框架
#import <Social/Social.h> // 添加Social框架

typedef void(^ProductInfoBlock)(NSArray<SKProduct *> *productInfoList);

@interface TestVC ()

@property (nonatomic, strong) SKProductsRequest *productsRequest;
@property (nonatomic, strong) SKProduct *product;
@property (nonatomic, copy) ProductInfoBlock productInfoBlock;
@property (nonatomic, strong) nw_path_monitor_t networkMonitor; // 添加网络监听器属性
@property (nonatomic, strong) RXKeyboardPanel *keyboardPanel;

@end

@implementation TestVC

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    self.view.backgroundColor = [UIColor whiteColor];
    
    [self setupNetworkMonitoring]; // 添加网络监听
    
    // 修改分享按钮
    UIButton *shareButton = [UIButton buttonWithType:UIButtonTypeSystem];
    [shareButton setTitle:@"推特分享" forState:UIControlStateNormal];
    shareButton.frame = CGRectMake(100, 200, 200, 44);
    [shareButton addTarget:self action:@selector(shareToTwitter) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:shareButton];
    
    // 例如点击按钮弹出
    UIButton *showBtn = [UIButton buttonWithType:UIButtonTypeSystem];
    showBtn.frame = CGRectMake(100, 100, 120, 44);
    [showBtn setTitle:@"弹出键盘" forState:UIControlStateNormal];
    [showBtn addTarget:self action:@selector(showKeyboardPanel) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:showBtn];
    
//    [self getLocaleIdentifierWithProductId:@"com.ruixue.sdkdemo2" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSLog(@"");
//    }];
}

// 添加网络监听方法
- (void)setupNetworkMonitoring {
    self.networkMonitor = nw_path_monitor_create();
    
    nw_path_monitor_set_queue(self.networkMonitor, dispatch_get_main_queue());
    
    nw_path_monitor_set_update_handler(self.networkMonitor, ^(nw_path_t _Nonnull path) {
        if (nw_path_get_status(path) == nw_path_status_satisfied) {
            NSLog(@"网络连接已授权并可用");
            // 在这里处理网络首次连接的逻辑
        } else {
            NSLog(@"网络未连接或未授权");
        }
    });
    
    nw_path_monitor_start(self.networkMonitor);
}

/**
 * 获取地区 货币符号
 * @param productId 商品 id
 */
- (void)getLocaleIdentifierWithProductId:(NSString *)productId
                                complete:(RequestComplete)complete
{
    if (productId.length > 0) {
        [self getProductInfoWithProductIdArr:@[productId] complete:^(NSArray<SKProduct *> * _Nonnull productInfoList) {
            @try {
                if (productInfoList.count > 0) {
                    SKProduct *sk = productInfoList[0];
                    NSLocale *locale = sk.priceLocale;
                    NSString *currency = locale.localeIdentifier.description;
                    
                    NSArray *components = [currency componentsSeparatedByString:@"@"];
                    if (components.count > 1) {
                        NSString *area = components[0];
                        NSString *cur = components[1];
                        
                        NSMutableDictionary *res = [NSMutableDictionary dictionary];
                        NSMutableDictionary *resData = [NSMutableDictionary dictionary];
                        if (area.length > 0) {
                            [resData setValue:area forKey:@"area"];
                        }
                   
                        if (cur.length > 0) {
                            NSString *curStr = [cur stringByReplacingOccurrencesOfString:@"currency=" withString:@""];
                            [resData setValue:curStr forKey:@"currency"];
                        }
                        if (resData.allKeys.count > 0) {
                            [res setValue:resData forKey:@"data"];
                        }
                        [res setValue:@(0) forKey:@"code"];
                        
                        if (complete) {
                            complete(res, nil);
                        }
                    } else {
                        NSDictionary *userInfo = @{@"code" : @(-1),
                                                   @"msg" : @"没有商品"
                        };
                        RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
                        rxError.responesObject = userInfo;
                        
                        if (complete) {
                            complete(nil, rxError);
                        }
                    }
                    
                } else {
                    NSDictionary *userInfo = @{@"code" : @(-1),
                                               @"msg" : @"没有商品"
                    };
                    RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
                    rxError.responesObject = userInfo;
                    
                    if (complete) {
                        complete(nil, rxError);
                    }
                }
            } @catch (NSException *exception) {
                NSDictionary *userInfo = @{@"code" : @(-1),
                                           @"msg" : @"没有商品"
                };
                RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
                rxError.responesObject = userInfo;
                
                if (complete) {
                    complete(nil, rxError);
                }
            } @finally {
                
            }
            
        }];
    } else {
        NSDictionary *userInfo = @{@"code" : @(-1),
                                   @"msg" : @"没有商品"
        };
        RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
        rxError.responesObject = userInfo;
        
        if (complete) {
            complete(nil, rxError);
        }
    }
}

/**
 * 查询商品信息
 * @param productIdArr 商品id
 */
- (void)getProductInfoWithProductIdArr:(NSArray *)productIdArr
                              complete:(void(^)(NSArray<SKProduct *> *productInfoList))complete
{
    self.productInfoBlock = complete;
    NSSet *productSets = [[NSSet alloc] initWithArray:productIdArr];
    self.productsRequest = [[SKProductsRequest alloc] initWithProductIdentifiers:productSets];
    self.productsRequest.delegate = self;
    [self.productsRequest start];
    
    // 添加2秒超时处理
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        if (self.productInfoBlock) {
            self.productInfoBlock(@[]);
            self.productInfoBlock = nil;
        }
        [self.productsRequest cancel];
    });
}

- (void)productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response
{
    NSLog(@"接收商品信息");
    
    if (self.productInfoBlock) {  // 检查回调是否还存在（未超时）
        NSArray *products = response.products;
        if (products.count == 0) {
            self.productInfoBlock([NSMutableArray arrayWithArray:products].copy);
        } else {
            // 保存商品信息
            for (int i = 0; i < products.count; i++) {
                SKProduct *skP = products[i];
                // 获取商品币种
                NSLocale *locale = skP.priceLocale;
                NSString *currency = locale.localeIdentifier;
                NSArray *currencyArr = [currency componentsSeparatedByString:@"="];
                if (currencyArr.count > 1) {
                    currency = currencyArr[1];
                }
                // 获取商品金额
                NSString *price = [skP.price description];
                
                NSString *identifier = skP.productIdentifier;
                
                NSMutableDictionary *productDic = [NSMutableDictionary dictionary];
                [productDic setValue:price forKey:@"price"];
                [productDic setValue:currency forKey:@"currency"];
            }
            
            if (self.productInfoBlock) {
                self.productInfoBlock([NSMutableArray arrayWithArray:products].copy);
            }
        }
        self.productInfoBlock = nil;  // 清除回调
    }
}

// 修改分享方法
- (void)shareToTwitter {
    NSString *text = @"要分享的文本内容";
    NSString *url = @"https://your-website.com";
    
    // URL encode分享内容
    NSString *encodedText = [text stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]];
    NSString *encodedUrl = [url stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]];
    
    // 构建Twitter分享URL
    NSString *twitterURL = [NSString stringWithFormat:@"twitter://post?message=%@%%20%@", encodedText, encodedUrl];
    NSURL *URL = [NSURL URLWithString:twitterURL];
    
    // 检查是否安装了Twitter应用
    if ([[UIApplication sharedApplication] canOpenURL:URL]) {
        [[UIApplication sharedApplication] openURL:URL options:@{} completionHandler:^(BOOL success) {
            if (success) {
                NSLog(@"成功打开Twitter应用");
            } else {
                NSLog(@"无法打开Twitter应用");
                [self openTwitterWebShare]; // 降级使用网页方式分享
            }
        }];
    } else {
        [self openTwitterWebShare]; // 未安装Twitter应用，使用网页方式分享
    }
}

// 使用网页方式分享
- (void)openTwitterWebShare {
    NSString *text = @"要分享的文本内容";
    NSString *url = @"https://your-website.com";
    
    // URL encode分享内容
    NSString *encodedText = [text stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]];
    NSString *encodedUrl = [url stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]];
    
    // 构建Twitter网页分享URL
    NSString *webURL = [NSString stringWithFormat:@"https://twitter.com/intent/tweet?text=%@&url=%@", encodedText, encodedUrl];
    NSURL *URL = [NSURL URLWithString:webURL];
    
    // 打开网页
    [[UIApplication sharedApplication] openURL:URL options:@{} completionHandler:^(BOOL success) {
        if (success) {
            NSLog(@"成功打开Twitter网页");
        } else {
            NSLog(@"无法打开Twitter网页");
            [self showAlertWithMessage:@"无法打开Twitter，请确保设备可以访问Twitter服务"];
        }
    }];
}

// 显示提示框
- (void)showAlertWithMessage:(NSString *)message {
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"提示"
                                                                 message:message
                                                          preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction *okAction = [UIAlertAction actionWithTitle:@"确定"
                                                     style:UIAlertActionStyleDefault
                                                   handler:nil];
    [alert addAction:okAction];
    [self presentViewController:alert animated:YES completion:nil];
}

- (void)showKeyboardPanel {
    if (!self.keyboardPanel) {
        self.keyboardPanel = [[RXKeyboardPanel alloc] initWithKeyboardStyle:RXKeyboardStyleDefault];
    }
    
    self.keyboardPanel.defaultText = @"123123";
    self.keyboardPanel.animationDuration = 0.25;
    [self.keyboardPanel showInView:self.view];
}

@end
