//
//  RXWelfareCodeManager.m
//  RXSDK-Pure
//
//  Created by root11 on 2024/9/3.
//

#import "RXWelfareCodeManager.h"
#import "RXCommonHeader.h"

@interface RXWelfareCodeManager ()

/**
 * 获取福利码block
 */
@property (nonatomic, copy) wcodeBlock wcodeBlock;
//福利刷新时间，动态改变
@property (nonatomic, assign) NSInteger refreshTime;
//轮循间隔，当刷新倒计时为0的时,或请求失败时，间隔多少秒再次请求，默认为10
@property (nonatomic, assign) NSInteger pollingTime;
//获取福利码的定时器
@property (nonatomic, strong) NSTimer *timer;
//上次获取的福利码值
@property (nonatomic, copy) NSString *promo_code;
//是否自动刷新福利码并返回
@property (nonatomic, assign) BOOL autoRefresh;
//是否为用户直接调用请求福利码，YES表示用户通过(getPromoDisplayKeyWithAutoRefresh:complete:)调用的wcodeRequest;NO表示通过定时器调用的wcodeRequest
@property (nonatomic, assign) BOOL isGetCode;

@end

@implementation RXWelfareCodeManager

static RXWelfareCodeManager *sharedSDK = nil;

+ (instancetype)sharedSDK {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedSDK = [[self alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        // 初始化属性
        self.pollingTime = 10;
    }
    return self;
}

+ (instancetype)allocWithZone:(struct _NSZone *)zone {
    static dispatch_once_t once_Token;
    dispatch_once(&once_Token, ^{
        sharedSDK = [super allocWithZone:zone];
        
    });
    return sharedSDK;
}

- (id)copyWithZone:(NSZone *)zone {
    return sharedSDK;
}

- (id)mutableCopyWithZone:(NSZone *)zone {
    return sharedSDK;
}

/**
 * 请求福利码
 */
- (void)getPromoDisplayKeyWithAutoRefresh:(BOOL)autoRefresh complete:(void(^)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error))complete{
    self.isGetCode = YES;
    self.wcodeBlock = complete;
    self.autoRefresh = autoRefresh;
    [self resetTimer];
    [self wcodeRequest];
}

/**
 * 先开启定时器，然后请求福利码
 */
- (void)startTimer:(NSInteger)interval{
    self.isGetCode = NO;
    [self resetTimer];
    _timer = [NSTimer scheduledTimerWithTimeInterval:interval target:self selector:@selector(wcodeRequest) userInfo:nil repeats:YES];
}

- (void)wcodeRequest{
    NSString *url = [NSString stringWithFormat:@"/v1/operationtoolsapi/exchange/game_display?game_id=%@",[RXUserUtility sharedManager].cp_user_id];
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:url andParams:nil requsetMethod:RequestMethod_Get];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    __weak typeof(self) weakSelf = self;
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        if ([responseObject[@"code"] integerValue] == 0) {
            NSDictionary *dataDic = responseObject[@"data"];
            NSInteger refresh_period_exp = [dataDic[@"refresh_period_exp"] integerValue];
            weakSelf.pollingTime = [dataDic[@"polling"] integerValue] > 0 ? [dataDic[@"polling"] integerValue] : weakSelf.pollingTime;
            NSString *tempPromo_code = dataDic[@"promo_code"];
            
            if (refresh_period_exp < 1) {
                weakSelf.refreshTime = weakSelf.pollingTime;
            }else{
                weakSelf.refreshTime = refresh_period_exp;
            }
            
            if (weakSelf.isGetCode) {//用户直接调用获取福利码
                if (weakSelf.wcodeBlock) {
                    weakSelf.wcodeBlock(responseObject, nil);
                    weakSelf.promo_code = tempPromo_code;
                }
            }else{//通过定时器调用获取福利码
                if (![tempPromo_code isEqualToString:weakSelf.promo_code]) {
                    if (weakSelf.wcodeBlock) {
                        weakSelf.wcodeBlock(responseObject, nil);
                        weakSelf.promo_code = tempPromo_code;
                    }
                }
            }
            
            if (weakSelf.autoRefresh) {
                [weakSelf startTimer:weakSelf.refreshTime];
            }else{
                [weakSelf resetTimer];
            }
            
        }else{//瑞雪场景下的错误，结束轮循，并且callback
            [weakSelf resetTimer];
            if (weakSelf.wcodeBlock) {
                weakSelf.wcodeBlock(responseObject, nil);
            }
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        if (weakSelf.autoRefresh) {
            [weakSelf startTimer:weakSelf.pollingTime];
        }else{
            [weakSelf resetTimer];
            if (weakSelf.wcodeBlock) {
                weakSelf.wcodeBlock(nil, error);
            }
        }
    }];
}

/**
 * 销毁定时器
 */
- (void)resetTimer{
    if (self.timer.isValid) {
        [self.timer invalidate];
        self.timer = nil;
    }
}

/**
 * 销毁定时器；重置轮循时间、本地的福利码
 */
- (void)resetTimerAndPollingTimeAndPromoCode{
    if (self.timer.isValid) {
        [self.timer invalidate];
        self.timer = nil;
    }
    self.pollingTime = 10;
    self.promo_code = @"";
}

/**
 * 获取福利码
 */
- (void)exchangePromoCDKEY:(NSString *)cdkey complete:(void(^)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error))complete{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:cdkey forKey:@"cdkey"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"/v1/operationtoolsapi/exchange/exchange" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        if (complete) {
            complete(nil, error);
        }
    }];
}




@end
