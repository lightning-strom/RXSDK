//
//  RXPayViewController.m
//  RXSDKDemo-Public
//
//  Created by root11 on 2024/5/16.
//
#pragma mark - 注：支付功能步骤说明
/*
说明：支付功能，需要按照以下步骤进行调用（文件中方法调用与参数仅为样例，功能不一定调用成功，涉及方法调用与参数以‘瑞雪文档中心——支付——客户端接入’为准）
1.SDK初始化准备。按照瑞雪文档对需要的SDK进行集成，按照文档要求配置对应的Bundle Identifier、Info.plist与其他文件中相关信息(以文档为准)，集成后进行支付功能的调用。
  app应处于登录状态方可调用分享功能。
 
2.调用查询商品接口。
根据商品id，调用查询商品信息方法
 '- (void)getProductInfoWithProductIdArr:(NSArray *)productIdArr
 complete:(void(^)(NSArray<SKProduct *> *productInfoList))complete;'
 获取商品信息，并缓存到本地。在调用‘下单’接口时会将对应计费点的 user_real_currency 和 user_real_price 作为参数传递给服务端，如果客户端下单时传了 user_real_currency 和 user_real_price 将以客户端传入的为准。
 如果没调用‘查询商品信息’接口，下单时SDK不会传入 user_real_currency 和 user_real_price。
 
3.调用下单支付接口。
 '- (void)requestWithDict:(NSDictionary *)dict completeHandle:(RequestComplete)handle'
 进行下单支付。
 
 */

#import "RXPayViewController.h"
#import "CHMarco.h"
#import "CHSettingCellModel.h"

@interface RXPayViewController ()<UITableViewDelegate, UITableViewDataSource>
@property (nonatomic, strong) UITableView *tableView;
@property (nonatomic, strong) NSMutableArray *payTypeArray;

@end

@implementation RXPayViewController

- (void)viewWillDisappear:(BOOL)animated{
    [super viewWillDisappear:animated];
    self.navigationController.navigationBar.hidden = YES;
}

- (void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    self.navigationController.navigationBar.hidden = NO;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.navigationController.navigationBar.tintColor = [UIColor blackColor];
    self.title = @"支付方式";
    self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"back_black"] style:UIBarButtonItemStylePlain target:self action:@selector(backClick)];
    self.view.backgroundColor = [UIColor whiteColor];
    
//MARK: 支付平台：appstore、yeepay（wechat）、wechat、ruixue_h5_trade、unipin
    __block NSArray *payTypes = @[@"appstore", @"yeepay", @"wechat", @"ruixue_h5_trade"];//国内平台
    __block NSArray *payTitles = [NSArray array];
    __block NSArray *payImgs = [NSArray array];
    
    if ([CHUtility sharedManager].isOS) {//海外平台
        payTypes = @[@"appstore", @"unipin"];
    }
    
    [[CHUtility sharedManager] checkPayTypes:payTypes backBlock:^(NSArray * _Nonnull sloginTypes, NSArray * _Nonnull sloginTitles, NSArray * _Nonnull sloginImgs) {
        payTypes = sloginTypes;
        payTitles = sloginTitles;
        payImgs = sloginImgs;
    }];
    
    for (int i = 0; i < payTypes.count; i++) {
        CHSettingCellModel *model = [[CHSettingCellModel alloc] init];
        model.loginType = payTypes[i];
        model.title = payTitles[i];
        model.img = payImgs[i];
        [self.payTypeArray addObject:model];
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
- (NSMutableArray *)payTypeArray{
    if (!_payTypeArray) {
        _payTypeArray = [[NSMutableArray alloc] init];
    }
    return _payTypeArray;
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
    return self.payTypeArray.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    static NSString *cellIdentifier = @"cell";
    RXLoginViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
    if (cell == nil) {
        cell = [[RXLoginViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier];
    }
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    
    if (self.payTypeArray.count > 0) {
        CHSettingCellModel *model = self.payTypeArray[indexPath.row];
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
    CHSettingCellModel *model = self.payTypeArray[indexPath.row];
    __weak typeof(self) weakSelf = self;
//MARK: 支付步骤一：调用根据商品ID查询商品信息。获取计费点user_real_currency、user_real_price缓存在本地
    [[RXIAPService sharedSDK] getProductInfoWithProductIdArr:@[@"com.ruixue.sdk1"] complete:^(NSArray<SKProduct *> *productInfoList) {
        
//MARK: 支付步骤二：调用下单支付
        NSMutableDictionary *dict = [NSMutableDictionary dictionary];
    //    [dict setValue:@"iap7" forKey:@"goods_tag"]; //商品标签
    //    [dict setValue:@"831000076" forKey:@"goods_tag"]; //商品标签
    //    [dict setValue:@(20) forKey:@"age"]; //用户年龄,indulge_auth为1时必传该字段
        
        [dict setValue:@"ios_tag2" forKey:@"goods_tag"];//商品标签
        [dict setValue:[[Tool sharedSDK] getTime] forKey:@"trade_no"];//订单号，此处仅为示例，具体以您的应用侧订单号规则为准
        [dict setValue:@(1) forKey:@"is_debug"];//是否测试订单 默认 0 正式；1 测试订单
        [dict setValue:@(1) forKey:@"env"];//是否使用沙盒环境支付 0 正式；1 测试
        [dict setValue:@"" forKey:@"notify_url"];//支付成功通知CP发货地址，以您的应用侧为准
        [dict setValue:@"" forKey:@"transmit_args"];//客户端透传参数 非必传
        [dict setValue:@(1) forKey:@"indulge_auth"];//是否进行防沉迷验证  0不验证，1验证，默认不验证
        [dict setValue:@{@"cp_game_character_id" : @"123", @"cp_game_area_id" : @"456"} forKey:@"game_info"];
        
//        [dict setValue:@"HKD" forKey:@"user_real_currency"];//实际支付币种,调用查询商品信息后无需设置此值，如设置，则覆盖本地缓存的user_real_currency对应值;user_real_price同理。
//        [dict setValue:@{@"country_code" : @"KR"} forKey:@"ext"];//国家编码、币种字典
        
//        [dict setValue:@"appstore" forKey:@"pay_type"];//支付类型，传错或不支持的类型默认为appstore
        [dict setValue:@"CNY" forKey:@"currency"]; //币种 默认传:CNY，详见：雪文档-支付-客户端接入-iOS-下单支付-参数说明-国家编码、币种字典
        
        if ([model.loginType isEqualToString:@"appstore"]) {
            [dict setValue:@"CNY" forKey:@"currency"];
            [dict setValue:@"iap" forKey:@"hq_type"];
            
        }else if ([model.loginType isEqualToString:@"yeepay"]) {
            [dict setValue:@"CNY" forKey:@"currency"];
            [dict setValue:@"yeepay" forKey:@"pay_type"];
            [dict setValue:@{@"pay_type" : @"wechat"} forKey:@"ext"];//支付扩展字段,三方支付额外传递参数,详见瑞雪文档-支付-客户端接入-iOS-下单支付-参数说明
        }else if ([model.loginType isEqualToString:@"wechat"]) {
            [dict setValue:@"CNY" forKey:@"currency"];
            [dict setValue:@"wechat" forKey:@"pay_type"];
            
        }else if ([model.loginType isEqualToString:@"ruixue_h5_trade"]) {
            [dict setValue:@"CNY" forKey:@"currency"];
            [dict setValue:@"ruixue_h5_trade" forKey:@"pay_type"];
            
        }else if ([model.loginType isEqualToString:@"unipin"]) {
            [dict setValue:@"IDR" forKey:@"currency"]; // 币种 默认传: CNY
            [dict setValue:@"unipin" forKey:@"pay_type"];
        }
        
        
        [[RXIAPService sharedSDK] iap:dict complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            NSString *str = [NSString stringWithFormat:@"%@", response];
            if(!error){
                NSLog(@"支付成功");
            }else{
                NSLog(@"支付失败");
                str = [NSString stringWithFormat:@"%@", error.responesObject];
            }
            
            [[Tool sharedSDK] alertWithTitle:@"提示" content:str sureBtnTitle:@"确定"];
        }];
    }];
    
    
}




@end
