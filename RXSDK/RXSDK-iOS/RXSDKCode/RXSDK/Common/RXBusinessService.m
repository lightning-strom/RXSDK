//
//  RXBusinessService.m
//  RXSDK
//
//  Created by 陈汉 on 2023/5/27.
//

#import "RXBusinessService.h"
#import "RXCommonTool.h"
#import "RXBusinessManager.h"

typedef void(^BusinessComplete)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error);

@interface RXBusinessService ()

@property (nonatomic, copy) BusinessComplete complete;

@end

@implementation RXBusinessService

static RXBusinessService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXBusinessService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(busRequestSuccess) name:noti_busRequestSuc object:nil];
    }
    return self;
}

- (void)busRequestSuccess
{
    NSMutableArray *busRequestList = [RXUserUtility sharedManager].busRequestList;
    
    if (busRequestList && busRequestList.count > 0) {
        for (int i = 0; i < busRequestList.count; i++) {
            NSMutableDictionary *busRequestDic = busRequestList[i];
            [self getBusinessDataWithWindow_key:[busRequestDic valueForKey:@"window_key"] event:[busRequestDic valueForKey:@"event"] before_event:[busRequestDic valueForKey:@"before_event"] complete:[busRequestDic valueForKey:@"complete"]];
        }
    }
}

/**
 * 获取商业化窗口全量数据，数据通过delegate回调
 */
- (void)getAllBusinessData
{
    NSDictionary *bus_data = [RXUserUtility valueForKey:keyUserData_busData];
    [self.delegate businessCallBackWithResponse:bus_data error:nil];
}

/**
 * 更新商业化数据
 * 本接口用于立即更新商业化窗口数据
 * ！！！商业化窗口数据会定时更新，请谨慎使用本接口，避免造成资源浪费！！！
 */
- (void)refreshBusinessData
{
    [[RXBusinessManager sharedSDK] getBusinessInfo];
}

/**
 * 获取商业化窗口数据
 * @param window_key 窗口key
 * @param event 事件
 * @param before_event 前置事件
 */
- (void)getBusinessDataWithWindow_key:(NSString *)window_key
                                event:(NSString *)event
                         before_event:(NSString * _Nullable)before_event
{
    BOOL isBusSuccess = [RXUserUtility sharedManager].isBusSuccess;
    if (!isBusSuccess) {
        NSMutableArray *busRequestList = [RXUserUtility sharedManager].busRequestList;
        NSMutableDictionary *busRequestDic = [NSMutableDictionary dictionary];
        [busRequestDic setValue:window_key forKey:@"window_key"];
        [busRequestDic setValue:event forKey:@"event"];
        [busRequestDic setValue:before_event forKey:@"before_event"];
        [busRequestDic setValue:self.complete forKey:@"complete"];
        [busRequestList addObject:busRequestDic];
        [RXUserUtility sharedManager].busRequestList = busRequestList;
        return;
    }
    
    NSMutableDictionary *bus_data = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_busData]];
    NSArray *main_window_list = [bus_data valueForKey:@"main_window_list"];
    NSString *main_window_key = @"";
    
    // 先匹配main_window_key
    NSMutableDictionary *window_data = [NSMutableDictionary dictionary];
    if (!main_window_list || ![main_window_list isKindOfClass:[NSArray class]] || main_window_list.count <= 0)
    {
        NSDictionary *bus_data = [RXUserUtility valueForKey:keyUserData_busData];
        
        [self.delegate businessCallBackWithResponse:@{@"data" : @{}, @"code" : @(0)} error:nil];
        
        if (self.complete) {
            self.complete(@{@"data" : @{}, @"code" : @(0)}, nil);
        }
        return;
    }
    
    for (int i = 0; i < main_window_list.count; i++) {
        NSMutableDictionary *main_window_data = main_window_list[i];
        main_window_key = [main_window_data valueForKey:@"window_key"];
        
        // 找到对应的main_window_key后将数据保存
        if ([main_window_key isEqualToString:window_key]) {
            window_data = main_window_data;
            break;
        }
    }
    
    // 匹配auto_popups
    NSMutableDictionary *auto_popups_data = [NSMutableDictionary dictionaryWithDictionary:[window_data valueForKey:@"auto_popups"]];
    NSMutableArray *auto_popups_list = [NSMutableArray array];
    
    if (auto_popups_data.allKeys.count > 0) {
        auto_popups_list = [NSMutableArray arrayWithArray:[auto_popups_data valueForKey:event]];
    }
    
    // 匹配manual_popups
    NSMutableDictionary *manual_popups_data = [NSMutableDictionary dictionaryWithDictionary:[window_data valueForKey:@"manual_popups"]];
    NSMutableDictionary *manual_popups_normalData = [NSMutableDictionary dictionaryWithDictionary:[manual_popups_data valueForKey:event]];
    NSMutableArray *manual_popups_list = [NSMutableArray array];
    
    if (manual_popups_normalData.allKeys.count > 0) {
        if ([NSString rx_isNullToString:before_event].length > 0) {
            manual_popups_list = [NSMutableArray arrayWithArray:[manual_popups_normalData valueForKey:before_event]];
        } else {
            manual_popups_list = [NSMutableArray arrayWithArray:[manual_popups_normalData valueForKey:@"__DEFAULT__"]];
        }
    }
    
    // 根据上面步骤找出的window_key在window_list中匹配数据
    NSMutableArray *window_list = [NSMutableArray arrayWithArray:[bus_data valueForKey:@"window_list"]];
    NSMutableArray *finishData = [NSMutableArray array];
    
    if (!window_list || ![window_list isKindOfClass:[NSArray class]] || window_list.count <= 0)
    {
        NSDictionary *bus_data = [RXUserUtility valueForKey:keyUserData_busData];
        
        [self.delegate businessCallBackWithResponse:@{@"data" : @{}, @"code" : @(0)} error:nil];
        
        if (self.complete) {
            self.complete(@{@"data" : @{}, @"code" : @(0)}, nil);
        }
        return;
    }
    
    for (int i = 0; i < window_list.count; i++) {
        NSMutableDictionary *window_list_data = [NSMutableDictionary dictionaryWithDictionary:window_list[i]];
        // 取出window_list中的key进行匹配
        NSString *window_list_key = [window_list_data valueForKey:@"window_key"];
        
        // 和auto_popups进行匹配
        for (int j = 0; j < auto_popups_list.count; j++) {
            NSMutableDictionary *auto_popups_detail = [NSMutableDictionary dictionaryWithDictionary:auto_popups_list[j]];
            NSString *auto_popups_detailKey = [auto_popups_detail valueForKey:@"window_key"];
            NSInteger day_limit = [[auto_popups_detail valueForKey:@"day_limit"] integerValue];
            
            if ([window_list_key isEqualToString:auto_popups_detailKey]) {
                // 判断是否达到展示次数，当日达到次数不再返回
                NSString *limitKey = [NSString stringWithFormat:@"%@_%@_%@_%@", main_window_key, event, auto_popups_detailKey, [RXUserUtility valueForKey:keyUserData_openId]];
                
                // 日期比对，过一天清空计数
                if ([self isYesterday:[RXUserUtility valueForKey:keyUserData_getBusinessDate]]) {
                    [RXUserUtility setValue:@(0) ForKey:limitKey];
                }
                
                NSInteger local_day_limit = [[RXUserUtility valueForKey:limitKey] integerValue];
                local_day_limit++;
                [RXUserUtility setValue:@(local_day_limit) ForKey:limitKey];
                
                if (local_day_limit > day_limit) {
                    continue;
                }
                
                [finishData addObject:window_list_data];
                
                // 记录当前获取的日期
                [RXUserUtility setValue:[NSDate date] ForKey:keyUserData_getBusinessDate];
            }
        }
        
        // 和manual_popups的key进行匹配
        for (int j = 0; j < manual_popups_list.count; j++) {
            NSMutableDictionary *manual_popups_detail = [NSMutableDictionary dictionaryWithDictionary:manual_popups_list[j]];
            NSString *manual_popups_detailKey = [manual_popups_detail valueForKey:@"window_key"];
            
            if ([window_list_key isEqualToString:manual_popups_detailKey]) {
                [finishData addObject:window_list_data];
            }
        }
    }
    
    bus_data = [RXUserUtility valueForKey:keyUserData_busData];
    
    [self.delegate businessCallBackWithResponse:@{@"data" : finishData, @"code" : @(0)} error:nil];
    
    if (self.complete) {
        self.complete(@{@"data" : finishData, @"code" : @(0)}, nil);
    }
}

/**
 * 获取商业化窗口数据，数据通过block回调
 * @param window_key 窗口key
 * @param event 事件
 * @param before_event 前置事件
 */
- (void)getBusinessDataWithWindow_key:(NSString *)window_key
                                event:(NSString *)event
                         before_event:(NSString * _Nullable)before_event
                             complete:(RequestComplete)complete
{
    self.complete = complete;
    
    [self getBusinessDataWithWindow_key:window_key event:event before_event:before_event];
}

/**
 * 商业化下单
 * @param trade_no CP订单号
 * @param sign 获取商业化数据返回的sign
 */
- (void)requestBusinessOrderWithTrade_no:(NSString *)trade_no
                                    sign:(NSString *)sign
                                complete:(RequestComplete)complete
{
    [[RXBusinessManager sharedSDK] requestBusinessOrderWithTrade_no:trade_no sign:sign complete:complete];
}

// 判断是否是昨天
- (BOOL)isYesterday:(NSDate *)beforeDate
{
//    NSCalendar *calendar = [NSCalendar currentCalendar];
//    [calendar isDateInYesterday:beforeDate];
    
  NSDate *date1 = beforeDate;
  NSDate *date2 = [NSDate date];
  NSCalendar *calendar = [NSCalendar currentCalendar];
  NSCalendarUnit type = NSCalendarUnitYear | NSCalendarUnitMonth | NSCalendarUnitDay | NSCalendarUnitHour | NSCalendarUnitMinute | NSCalendarUnitSecond;
  NSDateComponents *cmps = [calendar components:type fromDate:date1 toDate:date2 options:0];
    
    return [calendar isDateInYesterday:beforeDate] || cmps.day >= 1 || cmps.month >= 1 || cmps.year >= 1;
}

@end
