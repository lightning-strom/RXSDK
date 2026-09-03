//
//  RXIMDownload_BS.m
//  Business
//
//  Created by Elbay on 2024/5/28.
//

#import "RXIMDownload_BS.h"


@implementation RXIMDownload_BS
+ (void)downloadFileWithUrl:(NSString *)url
                       path:(NSString *)path
                   progress:(void(^)(NSProgress * _Nonnull downloadProgress))progress
          completionHandler:(void(^)(NSString * _Nullable filePath, NSError * _Nullable error))completionHandler

{
    [RXIMDownload downloadFileWithUrl:url path:path progress:progress completionHandler:completionHandler];
}
@end
