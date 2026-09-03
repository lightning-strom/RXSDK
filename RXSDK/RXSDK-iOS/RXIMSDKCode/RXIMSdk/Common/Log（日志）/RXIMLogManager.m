//
//  RXIMLogManager.m
//  RXIMSdk
//
//  Created by 魏永健 on 2022/4/20.
//

#import "RXIMLogManager.h"

@implementation RXIMLogManager

static NSFileHandle *CLLogFileHandle()
{
    static NSFileHandle *fileHandle = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        NSFileManager *fileManager = [[NSFileManager alloc] init];
        NSArray *path = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString *baseDirectory = [path objectAtIndex:0];
        NSString *filePath = [baseDirectory stringByAppendingPathComponent:@"rxIMSdk.log"];
        if (![fileManager fileExistsAtPath:filePath]){
            [fileManager createFileAtPath:filePath contents:nil attributes:nil];
        }
        fileHandle = [NSFileHandle fileHandleForWritingAtPath:filePath];
        [fileHandle seekToEndOfFile];
    });
    return fileHandle;
}

void RXLogDebug(NSString *prefix, NSString * _Nullable format, ...)
{
    va_list L;
    va_start(L, format);
    NSString *message = @"";
    if (format != nil) {
        message = [[NSString alloc] initWithFormat:format arguments:L];
    }
    RXLog(LogLevelDebug, prefix, message);
    va_end(L);
}

void RXLogInfo(NSString *prefix, NSString * _Nullable format, ...)
{
    va_list L;
    va_start(L, format);
    NSString *message = @"";
    if (format != nil) {
        message = [[NSString alloc] initWithFormat:format arguments:L];
    }
    RXLog(LogLevelInfo, prefix, message);
    va_end(L);
}

void RXLogError(NSString *prefix, NSString * _Nullable format, ...)
{
    va_list L;
    va_start(L, format);
    NSString *message = @"";
    if (format != nil) {
        message = [[NSString alloc] initWithFormat:format arguments:L];
    }
    RXLog(LogLevelError, prefix, message);
    va_end(L);
}

void RXLog(LogLevel level,NSString *prefix, NSString *message) {
    
    NSString *levelStr;
    switch (level) {
        case LogLevelDebug:
            levelStr = @"[RXIMDebug]";
            break;
        case LogLevelInfo:
            levelStr = @"[RXIMInfo]";
            break;
        case LogLevelError:
            levelStr = @"[RXIMError]";
            break;
        default:
            break;
    }
#ifdef DEBUG
    if (level != LogLevelDebug) {
        NSLog(@"%@%@",levelStr,message);
    }
#else
    
#endif
    // 开启异步子线程，将打印写入文件
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        NSFileHandle *output = CLLogFileHandle();
        if (output != nil) {
            NSString *dataStr = [NSString stringWithFormat:@"%@%@%@",levelStr,prefix,message];
            [output writeData:[dataStr dataUsingEncoding:NSUTF8StringEncoding]];
            static NSData *returnData = nil;
            if (returnData == nil)
                returnData = [@"\n" dataUsingEncoding:NSUTF8StringEncoding];
            [output writeData:returnData];
        }
    });
}

@end
