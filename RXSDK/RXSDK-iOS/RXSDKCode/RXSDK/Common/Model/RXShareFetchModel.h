//
//  RXShareFetchModel.h
//  RXSDK
//
//  Created by 陈汉 on 2022/8/19.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXShareFetchModel : NSObject
@property (nonatomic, copy) NSString *title;          // 标题
@property (nonatomic, copy) NSString *url;            // 链接
@property (nonatomic, copy) NSString *material_type;  // 素材类型
@property (nonatomic, assign) NSInteger material_id;  // 素材ID
@property (nonatomic, assign) NSInteger landing_id;   // 落地页ID
@property (nonatomic, copy) id image;                 // 图片对象（UIImage, url, NSData）
@property (nonatomic, copy) NSString *content;        // 素材内容
@property (nonatomic, assign) NSInteger x;            // 图片类型时 二维码x轴坐标
@property (nonatomic, assign) NSInteger y;            // 图片类型时 二维码y轴坐标
@property (nonatomic, assign) NSInteger width;        // 图片类型时 二维码宽度
@property (nonatomic, assign) NSInteger height;       // 图片类型时 二维码高度
@end

NS_ASSUME_NONNULL_END
