//
//  RXIMMsgImageContent.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/13.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMMsgImageContent : NSObject

/** 原始图片数据 */
@property (nonatomic, copy) NSData *original_data;
/** 原始图片url */
@property (nonatomic, copy) NSString *original_url;
/** 缩略图二进制数据 */
@property (nonatomic, copy) NSData *blurred_data;
/** 缩略图url */
@property (nonatomic, copy) NSString *thumbnail_url;
/** 本地图片路径 */
@property(nonatomic, copy) NSString *path;
/** 图片宽度 */
@property (nonatomic, assign) NSInteger width;
/** 图片高度 */
@property (nonatomic, assign) NSInteger height;

@end

NS_ASSUME_NONNULL_END
