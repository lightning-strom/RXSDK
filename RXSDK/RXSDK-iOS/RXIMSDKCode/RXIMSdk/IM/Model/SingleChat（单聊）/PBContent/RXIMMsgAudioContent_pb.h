//
//  RXIMMsgAudioContent_pb.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/13.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMMsgAudioContent_pb : NSObject

/** 云端语音地址*/
@property(nonatomic, copy) NSString *url;
/** 语音时长 单位：秒 */
@property(nonatomic, assign) NSInteger duration;
/** 语音尺寸 */
@property (nonatomic, assign) NSInteger size;
@end

NS_ASSUME_NONNULL_END
