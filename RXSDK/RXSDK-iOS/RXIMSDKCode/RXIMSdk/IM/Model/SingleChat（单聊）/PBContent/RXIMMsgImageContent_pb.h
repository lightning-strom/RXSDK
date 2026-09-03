//
//  RXIMMsgImageContent_pb.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/7/8.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMMsgImageContent_pb : NSObject

/** 原始图片url */
@property (nonatomic, copy) NSString *original_url;
/** 缩略图二进制base64数据 */
@property (nonatomic, copy) NSString *blurred_data;
/** 缩略图url */
@property (nonatomic, copy) NSString *thumbnail_url;
/** 文件格式，不含‘.’ */
@property (nonatomic, copy) NSString *file_type;
/** 图片旋转方向，1:normal；2:flip_horizontal；3:flip_vertical；4:rotate_90；5:rotate_180；6:rotate_270；*/
@property (nonatomic, assign) NSInteger orientation;
/** 原始图片大小 byte */
@property (nonatomic, assign) NSInteger size;
/** 图片宽度 */
@property (nonatomic, assign) NSInteger width;
/** 图片高度 */
@property (nonatomic, assign) NSInteger height;

@end

NS_ASSUME_NONNULL_END
