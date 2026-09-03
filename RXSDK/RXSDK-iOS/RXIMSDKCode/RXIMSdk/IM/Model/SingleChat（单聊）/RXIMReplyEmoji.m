//
//  RXIMReplyEmoji.m
//  RXIMSdk
//
//  Created by Elbay on 2024/8/26.
//

#import "RXIMReplyEmoji.h"

@implementation RXIMReplyEmoji

// 编码方法
- (void)encodeWithCoder:(NSCoder *)coder {
    [coder encodeObject:self.emojiName forKey:@"emojiName"];
    [coder encodeObject:self.members forKey:@"members"];
}

// 解码方法
- (instancetype)initWithCoder:(NSCoder *)coder {
    self = [super init];
    if (self) {
        self.emojiName = [coder decodeObjectForKey:@"emojiName"];
        self.members = [coder decodeObjectForKey:@"members"];
    }
    return self;
}

// 覆写 init
- (instancetype)init {
    self = [super init];
    if (self) {
        // 初始化代码
    }
    return self;
}
@end
