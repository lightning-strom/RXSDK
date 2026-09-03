//
//  RXPlayerFeedbackUploadManager.h
//  RXUIKit-OS
//
//  Created by root11 on 2024/9/12.
//

#import <Foundation/Foundation.h>
#import <Photos/Photos.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXPlayerFeedbackUploadManager : NSObject
/**
 * 单例
 */
+ (instancetype)sharedSDK;

/**
 * 将视频类型的asset转为mp4格式，并存储到沙盒的Documents/feedbackVideo文件夹中
 * asset 视频类型的asset
 *
 */
- (void)exportVideoToMP4FromAsset:(PHAsset *)asset completion:(void (^)(NSURL *mp4URL, NSError *error))completion;

/**
 * 将视频地址转换成NSData，同步转换
 */
- (NSData *)convertMP4URLToData:(NSURL *)mp4URL;

/**
 * 删除Documents/feedbackVideo文件夹中的所有视频文件
 */
- (void)clearFeedbackVideoDirectory;

/**
 * 获取网络视频第一帧的图片
 */
+ (UIImage *)getThumbnailImage:(NSString *)videoURL;

/**
 * 获取urlSting是图片还是视频，image为图片，video为视频, @""为无法判断类型
 */
+ (NSString *)isImageURL:(NSString *)urlString;

/**
 * 根据网络地址转UIImage
 */
+ (UIImage *)getImageWithUrlString:(NSString *)imageUrlString;

@end

NS_ASSUME_NONNULL_END
