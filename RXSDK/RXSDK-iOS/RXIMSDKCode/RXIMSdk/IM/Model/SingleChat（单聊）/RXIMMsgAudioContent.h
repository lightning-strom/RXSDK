//
//  RXIMMsgAudioContent.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/13.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMMsgAudioContent : NSObject

/** 语音数据 */
@property (nonatomic, copy) NSData *audioData;
/** 云端语音地址*/
@property(nonatomic, copy) NSString *url;
/** 本地语音路径 */
@property(nonatomic, copy) NSString *path;
/** 语音格式，不含"." */
@property (nonatomic,copy) NSString *audio_type;
/** 语音时长 单位：秒 */
@property(nonatomic, assign) NSInteger duration;
/** 语音本地是否播放 */
@property (nonatomic,assign) BOOL isPlay;

@end

NS_ASSUME_NONNULL_END
