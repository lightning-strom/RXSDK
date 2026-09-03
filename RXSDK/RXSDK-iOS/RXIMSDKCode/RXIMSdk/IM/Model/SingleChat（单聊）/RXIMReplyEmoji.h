//
//  RXIMReplyEmoji.h
//  RXIMSdk
//
//  Created by Elbay on 2024/8/26.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMReplyEmoji : NSObject <NSCoding>
@property(nonatomic, copy) NSString *emojiName;
@property(nonatomic, strong) NSArray <NSString*> *members;
@end

NS_ASSUME_NONNULL_END
