//
//  RXIMMessage.m
//  RXIMSdk
//
//  Created by 陈汉 on 2021/8/24.
//

#import "RXIMMessage.h"

@implementation RXIMMessage

- (instancetype)init
{
    self = [super init];
    if (self) {
        // 消息默认发送失败，发送成功后更改状态
        self.status = RXIMMsgStatus_sending;
    }
    return self;
}

-(void)initAttr:(NSInteger)attr
{
    _attr = attr;
}

+ (BOOL)accessInstanceVariablesDirectly
{
    return NO;
}

@end
