//
//  RXIMMsgVideoContent.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/13.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMMsgVideoContent : NSObject

/** 视频源数据 */
@property (nonatomic, copy) NSData *video_data;
/** 视频封面图片数据 */
@property (nonatomic, copy) NSData *cover_data;
/** 语音文件url */
@property(nonatomic, copy) NSString *video_url;
/** 视频封面图片url */
@property (nonatomic,copy) NSString *cover_url;
/** 视频封面图片宽 */
@property (nonatomic,assign) NSInteger cover_width;
/** 视频封面图片高 */
@property (nonatomic,assign) NSInteger cover_height;
/** 视频格式，不含"." */
@property (nonatomic, copy) NSString *video_type;
/** 本地视频路径 */
@property(nonatomic, copy) NSString *path;
/** 视频时长，单位：秒 */
@property(nonatomic, assign) NSInteger duration;

@end

NS_ASSUME_NONNULL_END
