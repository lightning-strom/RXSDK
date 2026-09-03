//
//  RXIMDownload.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/27.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMDownload : NSObject
 
/**
 * 文件下载工具
 * @param url 文件地址
 * @param path 文件存储路径(绝对路径)
 * @param progress 下载进度
 * @param completionHandler 下载完成回调  filePath文件下载完成路径（同path）
 */
+ (void)downloadFileWithUrl:(NSString *)url
                       path:(NSString *)path
                   progress:(void(^)(NSProgress * _Nonnull downloadProgress))progress
          completionHandler:(void(^)(NSString * _Nullable filePath, NSError * _Nullable error))completionHandler;

@end

NS_ASSUME_NONNULL_END
