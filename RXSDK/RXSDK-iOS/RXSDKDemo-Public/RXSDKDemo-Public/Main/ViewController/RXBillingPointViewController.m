//
//  RXBillingPointViewController.m
//  RXSDKDemo-Public
//
//  Created by root11 on 2024/6/24.
//

#import "RXBillingPointViewController.h"
#import "CHMarco.h"
#import <RXSDK_Pure/RX_CommonNetworkExcuteManager.h>
#import <RXSDK_Pure/RXConfig.h>

@interface RXBillingPointViewController ()<UITableViewDelegate, UITableViewDataSource>
@property (nonatomic, strong) UITableView *tableView;
@property (nonatomic, strong) NSMutableArray *billingPointArray;

@end

@implementation RXBillingPointViewController

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
    [self setUI];
    [self loadData];
}

- (void)setUI{
    //navigation
    self.navigationController.navigationBar.tintColor = [UIColor blackColor];
    self.title = @"请选择计费点";
    self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"back_black"] style:UIBarButtonItemStylePlain target:self action:@selector(backClick)];
    self.view.backgroundColor = [UIColor whiteColor];
    //tableView
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

- (void)loadData{
    [self.billingPointArray removeAllObjects];
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"api/v1/operationtools/third_goods/all" andParams:dic requsetMethod:RequestMethod_Get];
    //转换计费点需要的请求地址
    if ([[RXConfig sharedManager].apiDomain containsString:@"http://cn-api-demo.ruixuecloud.com"]) {
        
        request.baseUrl = @"https://cn-admin-demo.ruixuecloud.com/";
        
    }else if ([[RXConfig sharedManager].apiDomain containsString:@"http://cn-api-test.ruixuecloud.com"]){
        
        request.baseUrl = @"https://cn-admin-test.ruixuecloud.com/";
        
    }else if ([[RXConfig sharedManager].apiDomain containsString:@"http://os-api-test.ruixuecloud.com"]){
        
        request.baseUrl = @"https://os-admin-test.ruixuecloud.com/";
        
    }else if ([[RXConfig sharedManager].apiDomain containsString:@"http://os-api-demo.ruixuecloud.com"]){
        
        request.baseUrl = @"https://os-admin-demo.ruixuecloud.com/";
    }
    
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    __weak typeof(self) weakSelf = self;
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        //有三方计费点，先展示对应有三方计费点的计费点
        NSArray *thirdGoodsArray =  responseObject[@"data"][@"pay_goods"][@"third_goods"];
        for (NSDictionary *dict in thirdGoodsArray) {
            if ([dict[@"type"] isEqualToString:self.payType]) {
                for (NSDictionary *pointDict in dict[@"tag"]) {
                    [self.billingPointArray addObject:pointDict];
                }
            }
        }
        if (self.billingPointArray > 0) {//设置三方计费点标题
            self.title = [NSString stringWithFormat:@"请选择计费点(%@)", self.payType];
        }
        
        //无三方计费点则展示公共计费点
        if (self.billingPointArray.count == 0) {
            NSArray *publicGoodsArray =  responseObject[@"data"][@"pay_goods"][@"public"];
            for (NSDictionary *dict in publicGoodsArray) {
                NSMutableDictionary *mDic = [NSMutableDictionary dictionary];
                mDic[@"ruixue_tag"] = dict[@"tag"];
                mDic[@"third_tag"] = @"";
                [self.billingPointArray addObject:mDic];
            }
            if (self.billingPointArray > 0) {//设置公用计费点标题
                self.title = @"请选择计费点(公用)";
            }
        }
        
        if (weakSelf.billingPointArray.count > 0) {
            [weakSelf.tableView reloadData];
        }else{
            self.title = @"请选择计费点";
            [weakSelf.view makeToast:@"此渠道下无计费点" duration:3 position:CSToastPositionCenter];
        }
        
    } failure:^(RX_CommonRequestError * _Nullable error) {
        [self.view makeToast:error.responesObject[@"msg"] duration:1.5 position:CSToastPositionCenter];
    }];

    
    
}


#pragma mark - action
- (void)backClick{
    [self.navigationController popViewControllerAnimated:YES];
}

#pragma mark - lazy load
- (NSMutableArray *)billingPointArray{
    if (!_billingPointArray) {
        _billingPointArray = [[NSMutableArray alloc] init];
    }
    return _billingPointArray;
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
    return self.billingPointArray.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    static NSString *cellIdentifier = @"cell";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier];
    }
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    
    if (self.billingPointArray.count > 0) {
        NSDictionary *pointDict = self.billingPointArray[indexPath.row];
        NSString *goodTagKey = pointDict[@"ruixue_tag"];
        cell.textLabel.text = goodTagKey;
        cell.textLabel.textAlignment = NSTextAlignmentCenter;
    }
    
    return cell;
}

#pragma mark - UITableViewDelegate

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    return 60;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    
    NSDictionary *pointDict = self.billingPointArray[indexPath.row];
    NSString *goodTagKey = pointDict[@"ruixue_tag"];
    NSString *goodTagValue = pointDict[@"third_tag"];
    
    __weak typeof(self) weakSelf = self;
//MARK: 支付步骤一：调用根据商品ID查询商品信息。获取计费点user_real_currency、user_real_price缓存在本地
    [[RXIAPService sharedSDK] getProductInfoWithProductIdArr:@[goodTagValue] complete:^(NSArray<SKProduct *> *productInfoList) {
        
//MARK: 支付步骤二：调用下单支付
        NSMutableDictionary *dict = [NSMutableDictionary dictionary];
    //    [dict setValue:@"iap7" forKey:@"goods_tag"]; //商品标签
    //    [dict setValue:@"831000076" forKey:@"goods_tag"]; //商品标签
    //    [dict setValue:@(20) forKey:@"age"]; //用户年龄,indulge_auth为1时必传该字段
        
        [dict setValue:goodTagKey forKey:@"goods_tag"];//商品标签
        [dict setValue:[[Tool sharedSDK] getTime] forKey:@"trade_no"];//订单号，此处仅为示例，具体以您的应用侧订单号规则为准
        [dict setValue:@(1) forKey:@"is_debug"];//是否测试订单 默认 0 正式；1 测试订单
        [dict setValue:@(1) forKey:@"env"];//是否使用沙盒环境支付 0 正式；1 测试
        [dict setValue:@"" forKey:@"notify_url"];//支付成功通知CP发货地址，以您的应用侧为准
        [dict setValue:@"" forKey:@"transmit_args"];//客户端透传参数 非必传
        [dict setValue:@(0) forKey:@"indulge_auth"];//是否进行防沉迷验证 0不验证，1验证，默认不验证
        [dict setValue:@{@"cp_game_character_id" : @"123", @"cp_game_area_id" : @"456"} forKey:@"game_info"];
        
//        [dict setValue:@"HKD" forKey:@"user_real_currency"];//实际支付币种,调用查询商品信息后无需设置此值，如设置，则覆盖本地缓存的user_real_currency对应值;user_real_price同理。
//        [dict setValue:@{@"country_code" : @"KR"} forKey:@"ext"];//国家编码、币种字典
        
        [dict setValue:@"appstore" forKey:@"pay_type"];//支付类型，传错或不支持的类型默认为appstore
        [dict setValue:@"CNY" forKey:@"currency"]; //币种 默认传:CNY，详见：雪文档-支付-客户端接入-iOS-下单支付-参数说明-国家编码、币种字典
        
        if ([self.payType isEqualToString:@"appstore"]) {
            [dict setValue:@"CNY" forKey:@"currency"];
            [dict setValue:@"appstore" forKey:@"pay_type"];
            
        }else if ([self.payType isEqualToString:@"yeepay"]) {
            [dict setValue:@"CNY" forKey:@"currency"];
            [dict setValue:@"yeepay" forKey:@"pay_type"];
            [dict setValue:@{@"pay_type" : @"wechat"} forKey:@"ext"];//支付扩展字段,三方支付额外传递参数,详见瑞雪文档-支付-客户端接入-iOS-下单支付-参数说明
        }else if ([self.payType isEqualToString:@"wechat"]) {
            [dict setValue:@"CNY" forKey:@"currency"];
            [dict setValue:@"wechat" forKey:@"pay_type"];
            
        }else if ([self.payType isEqualToString:@"ruixue_h5_trade"]) {
            [dict setValue:@"CNY" forKey:@"currency"];
            [dict setValue:@"ruixue_h5_trade" forKey:@"pay_type"];
            
        }else if ([self.payType isEqualToString:@"unipin"]) {
            [dict setValue:@"IDR" forKey:@"currency"]; // 币种 默认传: CNY
            [dict setValue:@"unipin" forKey:@"pay_type"];
        }
        
        [[RXIAPService sharedSDK] requestWithDict:dict completeHandle:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            NSString *str = [NSString stringWithFormat:@"%@", response];
            if(!error){
                NSLog(@"支付成功");
                [self.view makeToast:@"支付成功" duration:1.5 position:CSToastPositionCenter];
            }else{
                NSLog(@"支付失败");
                str = [NSString stringWithFormat:@"%@", error.responesObject[@"msg"]];
                [self.view makeToast:str duration:1.5 position:CSToastPositionCenter];
            }
        }];
        
    }];
}

@end
