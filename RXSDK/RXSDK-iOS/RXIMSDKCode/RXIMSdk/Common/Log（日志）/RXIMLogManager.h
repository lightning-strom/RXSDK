//
//  RXIMLogManager.h
//  RXIMSdk
//
//  Created by 魏永健 on 2022/4/20.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

#define prefixStr [NSString stringWithFormat:@"[%s] %s [第%d行] ",__TIME__,__FUNCTION__,__LINE__]

typedef enum : NSUInteger {
    LogLevelDebug,
    LogLevelInfo,
    LogLevelError,
} LogLevel;

void RXLogDebug(NSString *prefix, NSString * _Nullable format, ...);
void RXLogInfo(NSString *prefix, NSString * _Nullable format, ...);
void RXLogError(NSString *prefix, NSString * _Nullable format, ...);

@interface RXIMLogManager : NSObject

@end

NS_ASSUME_NONNULL_END
