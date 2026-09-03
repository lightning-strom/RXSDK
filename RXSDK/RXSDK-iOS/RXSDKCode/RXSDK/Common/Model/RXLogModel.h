//
//  RXLogModel.h
//  RXSDK
//
//  Created by 陈汉 on 2022/3/1.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXLogModel : NSObject
@property (nonatomic, copy) NSString *type;  // 事件类型（目前默认为 track，SDK自动设置）
@property (nonatomic, copy) NSString *time;  // 事件发生时间，格式为 yyyy-mm-dd hh:ii:ss.fff（SDK自动设置）
@property (nonatomic, copy) NSString *distinct_id;  // 用户唯一标识，一般为 OpenID（由CP调用时传入）
@property (nonatomic, copy) NSString *event;  // 埋点标识（由CP调用时传入）
@property (nonatomic, copy) NSString *uuid;  // 本事件 uuid（SDK自动设置）
@property (nonatomic, assign) NSInteger cpid;  // CPID（SDK自动设置）
@property (nonatomic, copy) NSString *appid;  // 应用ID（SDK自动设置）
@property (nonatomic, copy) NSString *channelid;  // 渠道ID（SDK自动设置）
@property (nonatomic, copy) NSString *subchannelid;  // 子渠道ID（SDK自动设置）
@property (nonatomic, strong) NSDictionary *properties;  // CP 自定义属性（由CP调用时传入）
@end

NS_ASSUME_NONNULL_END
