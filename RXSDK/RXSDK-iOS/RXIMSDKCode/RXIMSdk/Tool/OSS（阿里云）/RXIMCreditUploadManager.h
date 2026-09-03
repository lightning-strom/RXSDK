//
//  RXIMCreditUploadManager.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/23.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <AliyunOSSiOS/AliyunOSSiOS.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMCreditUploadManager : NSObject

@property (nonatomic, strong) OSSClient *imDefaultClient;
@property (nonatomic, strong) NSMutableArray *imOSSTaskArray;
+ (instancetype)sharedManager;

/**
 运用普通上传 图片
 
 @param data 文件data
 @param path 路径
 @param folderName 文件夹命名（自定义）
 @param uploadProgress 上传进度
 @param success successBlock
 @param failure failureBlock
 */
+ (void)RXIMOSSUpload:(NSData *)data path:(NSString *)path folderName:(NSString *)folderName fileType:(NSString *)fileType uploadProgress: (OSSNetworkingUploadProgressBlock)uploadProgress success:(void (^_Nullable)(id result))success failure:(void (^_Nullable)(void))failure;

@end

NS_ASSUME_NONNULL_END
