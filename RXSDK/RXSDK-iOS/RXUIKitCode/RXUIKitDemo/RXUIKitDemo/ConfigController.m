//
//  ConfigController.m
//  RXUIKitDemo
//
//  Created by 陈汉 on 2023/11/28.
//

#import "ConfigController.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXUIKit/RXHUD.h>

@interface ConfigController () <UITextFieldDelegate>

@property (nonatomic, strong) UITextField *productidTf;
@property (nonatomic, strong) UITextField *cpTf;
@property (nonatomic, strong) UITextField *chTf;
@property (nonatomic, strong) UITextField *urlTf;

@end

@implementation ConfigController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    self.view.backgroundColor = [UIColor whiteColor];
    
    self.title = @"RXSDK配置";
    
    [self setUI];
}

- (void)setUI
{
    // 初始化配置
    UILabel *label1 = [[UILabel alloc] initWithFrame:CGRectMake(10, 110, CGRectGetWidth(self.view.frame) - 20, 30)];
    label1.textAlignment = NSTextAlignmentCenter;
    label1.text = @"初始化配置（初始化成功后自动返回上一级页面）";
    label1.font = [UIFont boldSystemFontOfSize:18];
    [self.view addSubview:label1];
    
    // productid
//    UILabel *pLbl = [[UILabel alloc] initWithFrame:CGRectMake(20, CGRectGetMaxY(label1.frame) + 10, 200, 24)];
//    pLbl.text = @"设置product_id";
//    pLbl.font = [UIFont systemFontOfSize:16];
//    [self.view addSubview:pLbl];
    
    _productidTf = [[UITextField alloc] initWithFrame:CGRectMake(20, CGRectGetMaxY(label1.frame) + 20, CGRectGetWidth(self.view.frame) - 40, 30)];
    _productidTf.placeholder = @"  请输入product_id";
    _productidTf.layer.cornerRadius = 6;
    _productidTf.text = @"SDK";
    _productidTf.layer.borderColor = [UIColor lightGrayColor].CGColor;
    _productidTf.layer.borderWidth = 1;
    [self.view addSubview:_productidTf];
    
    _cpTf = [[UITextField alloc] initWithFrame:CGRectMake(20, CGRectGetMaxY(_productidTf.frame) + 12, CGRectGetWidth(self.view.frame) - 40, 30)];
    _cpTf.placeholder = @"  请输入cp_id";
    _cpTf.layer.cornerRadius = 6;
    _cpTf.text = @"120";
    _cpTf.layer.borderColor = [UIColor lightGrayColor].CGColor;
    _cpTf.layer.borderWidth = 1;
    [self.view addSubview:_cpTf];
    
    _chTf = [[UITextField alloc] initWithFrame:CGRectMake(20, CGRectGetMaxY(_cpTf.frame) + 12, CGRectGetWidth(self.view.frame) - 40, 30)];
    _chTf.placeholder = @"  请输入channel_id";
    _chTf.layer.cornerRadius = 6;
    _chTf.layer.borderColor = [UIColor lightGrayColor].CGColor;
    _chTf.layer.borderWidth = 1;
    [self.view addSubview:_chTf];
    
    _urlTf = [[UITextField alloc] initWithFrame:CGRectMake(20, CGRectGetMaxY(_chTf.frame) + 12, CGRectGetWidth(self.view.frame) - 40, 30)];
    _urlTf.placeholder = @"  请输入base_url";
    _urlTf.layer.cornerRadius = 6;
    _urlTf.text = @"http://os-api-demo.ruixuecloud.com";
    _urlTf.layer.borderColor = [UIColor lightGrayColor].CGColor;
    _urlTf.layer.borderWidth = 1;
    [self.view addSubview:_urlTf];
    
    UIButton *confirmBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    confirmBtn.frame = CGRectMake(40, CGRectGetMaxY(_urlTf.frame) + 30, CGRectGetWidth(self.view.frame) - 80, 40);
    [confirmBtn setTitle:@"初始化" forState:UIControlStateNormal];
    [confirmBtn setBackgroundColor:[UIColor redColor]];
    confirmBtn.layer.cornerRadius = 8;
    [confirmBtn addTarget:self action:@selector(confirmBtnAction) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:confirmBtn];
}

- (void)confirmBtnAction
{
    [[RXService sharedSDK] initWithProductId:self.productidTf.text
                                   channelId:self.chTf.text
                                        cpid:self.cpTf.text
                                 baseUrlList:@[self.urlTf.text] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        [self.navigationController popViewControllerAnimated:YES];
    }];
}

@end
