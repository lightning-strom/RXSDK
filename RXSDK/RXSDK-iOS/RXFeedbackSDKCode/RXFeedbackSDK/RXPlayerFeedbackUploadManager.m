//
//  RXPlayerFeedbackUploadManager.m
//  RXUIKit-OS
//
//  Created by root11 on 2024/9/12.
//

#import "RXPlayerFeedbackUploadManager.h"
#import <AVFoundation/AVFoundation.h>
#import "RXFeedbackTool.h"

@implementation RXPlayerFeedbackUploadManager
static RXPlayerFeedbackUploadManager *sharedSDK = nil;

+ (instancetype)sharedSDK {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedSDK = [[self alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        
    }
    return self;
}

+ (instancetype)allocWithZone:(struct _NSZone *)zone {
    static dispatch_once_t once_Token;
    dispatch_once(&once_Token, ^{
        sharedSDK = [super allocWithZone:zone];
        
    });
    return sharedSDK;
}

- (id)copyWithZone:(NSZone *)zone {
    return sharedSDK;
}

- (id)mutableCopyWithZone:(NSZone *)zone {
    return sharedSDK;
}


- (NSString *)feedbackVideoDirectoryPath {
    // 获取应用沙盒中的 Documents/feedbackVideo 文件夹
    NSString *documentsPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject];
    NSString *feedbackVideoPath = [documentsPath stringByAppendingPathComponent:@"feedbackVideo"];
    
    // 创建 feedbackVideo 文件夹（如果不存在）
    NSFileManager *fileManager = [NSFileManager defaultManager];
    if (![fileManager fileExistsAtPath:feedbackVideoPath]) {
        [fileManager createDirectoryAtPath:feedbackVideoPath withIntermediateDirectories:YES attributes:nil error:nil];
    }
    
    return feedbackVideoPath;
}

- (void)exportVideoToMP4FromAsset:(PHAsset *)asset completion:(void (^)(NSURL *mp4URL, NSError *error))completion {
    PHVideoRequestOptions *options = [[PHVideoRequestOptions alloc] init];
    options.networkAccessAllowed = YES;  // 允许从 iCloud 下载视频
    
    [[PHImageManager defaultManager] requestAVAssetForVideo:asset options:options resultHandler:^(AVAsset *avAsset, AVAudioMix *audioMix, NSDictionary *info) {
        if (avAsset) {
            // 定义导出的目标路径
            NSString *feedbackVideoPath = [self feedbackVideoDirectoryPath];
            NSString *outputPath = [feedbackVideoPath stringByAppendingPathComponent:[NSString stringWithFormat:@"video-%@.mp4", [[NSUUID UUID] UUIDString]]];
            NSURL *outputURL = [NSURL fileURLWithPath:outputPath];
            
            // 设置 AVAssetExportSession
            AVAssetExportSession *exportSession = [[AVAssetExportSession alloc] initWithAsset:avAsset presetName:AVAssetExportPresetHighestQuality];
            exportSession.outputURL = outputURL;
            exportSession.outputFileType = AVFileTypeMPEG4;  // 指定输出格式为 mp4
            
            // 开始导出
            [exportSession exportAsynchronouslyWithCompletionHandler:^{
                if (exportSession.status == AVAssetExportSessionStatusCompleted) {
                    NSLog(@"Video successfully exported to mp4: %@", outputURL);
                    if (completion) {
                        completion(outputURL, nil);  // 返回成功后的 URL
                    }
                } else {
                    if (completion) {
                        completion(nil, exportSession.error);  // 返回导出错误
                    }
                }
            }];
        } else {
            if (completion) {
                completion(nil, [NSError errorWithDomain:@"PHAssetErrorDomain" code:1001 userInfo:@{NSLocalizedDescriptionKey: @"Failed to fetch AVAsset from PHAsset"}]);
            }
        }
    }];
}

- (void)clearFeedbackVideoDirectory {
    NSString *feedbackVideoPath = [self feedbackVideoDirectoryPath];
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSError *error = nil;
    
    NSArray *files = [fileManager contentsOfDirectoryAtPath:feedbackVideoPath error:&error];
    if (!error) {
        for (NSString *file in files) {
            NSString *filePath = [feedbackVideoPath stringByAppendingPathComponent:file];
            [fileManager removeItemAtPath:filePath error:&error];
            if (error) {
                NSLog(@"Failed to delete file: %@", filePath);
            }
        }
        NSLog(@"feedbackVideo directory cleared.");
    } else {
        NSLog(@"Error fetching contents of feedbackVideo directory: %@", error);
    }
}

- (NSData *)convertMP4URLToData:(NSURL *)mp4URL {
    NSError *error = nil;
    NSData *videoData = [NSData dataWithContentsOfURL:mp4URL options:0 error:&error];
    
    if (error) {
        NSLog(@"Error converting MP4 URL to data: %@", error);
        return nil;
    }
    
    return videoData;
}

- (void)convertMP4URLToDataAsync:(NSURL *)mp4URL completion:(void (^)(NSData *videoData, NSError *error))completion {
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        NSError *error = nil;
        NSData *videoData = [NSData dataWithContentsOfURL:mp4URL options:0 error:&error];
        
        dispatch_async(dispatch_get_main_queue(), ^{
            if (completion) {
                completion(videoData, error);
            }
        });
    });
}

+ (UIImage *)getThumbnailImage:(NSString *)videoURL{
    NSString *paramUrlStr = [videoURL stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet characterSetWithCharactersInString:@"`#%^{}\"[]|\\<> "].invertedSet];
    AVURLAsset *asset = [[AVURLAsset alloc] initWithURL:[NSURL URLWithString:paramUrlStr] options:nil];
    
    NSParameterAssert(asset);//断言

    AVAssetImageGenerator *assetImageGenerator = [[AVAssetImageGenerator alloc] initWithAsset:asset];
    assetImageGenerator.appliesPreferredTrackTransform = YES;
    assetImageGenerator.apertureMode = AVAssetImageGeneratorApertureModeEncodedPixels;

    NSTimeInterval time = 0.1;
    CGImageRef thumbnailImageRef =NULL;
    CFTimeInterval thumbnailImageTime = time;
    NSError*error =nil;
    thumbnailImageRef = [assetImageGenerator copyCGImageAtTime:CMTimeMake(thumbnailImageTime,60) actualTime:NULL error:&error];

    if( error ) {
        NSLog(@"%@", error );
    }

    if( thumbnailImageRef ) {
        return[[UIImage alloc]initWithCGImage:thumbnailImageRef];
    }

    return nil;

}

+ (NSString *)isImageURL:(NSString *)urlString {
    // 将 URL 字符串转换为小写，以便进行不区分大小写的匹配
    NSString *lowercasedURLString = [urlString lowercaseString];
    
    // 检查 URL 是否以指定的图片后缀结尾
    if ([lowercasedURLString hasSuffix:@"png"] ||
        [lowercasedURLString hasSuffix:@"jpg"] ||
        [lowercasedURLString hasSuffix:@"jpeg"]) {
        return @"image";  // 是图片格式
    }
    
    // 检查 URL 是否以 "mp4" 结尾
    if ([lowercasedURLString hasSuffix:@"mp4"]) {
        return @"video";
    }
    
    return @"";
}

+ (UIImage *)getImageWithUrlString:(NSString *)imageUrlString{
    NSURL *url = [NSURL URLWithString:imageUrlString];
    NSData *data = [NSData dataWithContentsOfURL:url];
    return [UIImage imageWithData:data];
}

@end
