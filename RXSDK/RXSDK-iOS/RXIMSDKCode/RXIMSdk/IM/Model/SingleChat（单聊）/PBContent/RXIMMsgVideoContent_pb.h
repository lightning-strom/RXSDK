//
//  RXIMMsgVideoContent_pb.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/7/15.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMMsgVideoContent_pb : NSObject

/** 语音文件url */
@property(nonatomic, copy) NSString *video_url;
/** 视频封面图片url */
@property (nonatomic,copy) NSString *cover_url;
/** 视频封面图片宽 */
@property (nonatomic,assign) NSInteger cover_width;
/** 视频封面图片高 */
@property (nonatomic,assign) NSInteger cover_height;
/** 文件格式，不含"." */
@property (nonatomic, copy) NSString *file_type;
/** 视频时长，单位：秒 */
@property(nonatomic, assign) NSInteger duration;
/** 视频文件大小，单位：byte */
@property (nonatomic, assign) NSInteger size;

@end

NS_ASSUME_NONNULL_END
