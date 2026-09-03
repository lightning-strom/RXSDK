//
//  RXIMDownload.m
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/27.
//

#import "RXIMDownload.h"
#import <AFNetworking/AFNetworking.h>
#import "RXIMLogManager.h"

@implementation RXIMDownload

+ (void)downloadFileWithUrl:(NSString *)url
                       path:(NSString *)path
                   progress:(void(^)(NSProgress * _Nonnull downloadProgress))progress
          completionHandler:(void(^)(NSString * _Nullable filePath, NSError * _Nullable error))completionHandler
{
    RXLogDebug(prefixStr, nil);
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    
    NSURLRequest *requset = [NSURLRequest requestWithURL:[NSURL URLWithString:url]];
    
    //返回一个下载任务对象
    NSURLSessionDownloadTask *loadTask = [manager downloadTaskWithRequest:requset progress:^(NSProgress * _Nonnull downloadProgress) {
        // completedUnitCount 下载的大小
        // totalUnitCount文件的总大小
        RXLogInfo(prefixStr, @"下载的大小:%lld---文件的总大小:%lld",downloadProgress.completedUnitCount,downloadProgress.totalUnitCount);
        if (progress) {
            progress(downloadProgress);
        }
        
    } destination:^NSURL * _Nonnull(NSURL * _Nonnull targetPath, NSURLResponse * _Nonnull response) {
        
        NSString *fullPath = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES).lastObject stringByAppendingString:path];
        RXLogInfo(prefixStr, @"targetPath-：%@---fullPath:-%@", targetPath, fullPath);
        //这个block 需要返回一个目标 地址 存储下载的文件
        return [NSURL fileURLWithPath:fullPath];
    } completionHandler:^(NSURLResponse * _Nonnull response, NSURL * _Nullable filePath, NSError * _Nullable error) {
        RXLogInfo(prefixStr, @"下载完成地址:%@",[filePath path]);
        if (completionHandler) {
            if (error) {
                completionHandler(@"", error);
            } else {
                completionHandler([filePath path], nil);
            }
        }
    }];
    
    //启动下载任务--开始下载
    [loadTask resume];
}

@end
