//
//  RXShareModel.h
//  RXSDK
//
//  Created by 陈汉 on 2021/12/8.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXSharePlatforms : NSObject  // 平台信息，代表某个平台可用的分享方式 -1代表不限制 // 是否要再优化下 如果客户端有传平台那么此值应该恒定为一个
@property (nonatomic, assign) NSInteger wechat;  // 微信， 1:好友 2:朋友圈
@end

@interface RXShareContent : NSObject  // 分享素材数据
@property (nonatomic, copy) NSString *title;          // 标题
@property (nonatomic, copy) NSString *url;            // 链接
@property (nonatomic, copy) NSString *material_type;  // 素材类型
@property (nonatomic, assign) NSInteger material_id;  // 素材ID
@property (nonatomic, assign) NSInteger landing_id;   // 落地页ID
@property (nonatomic, copy) NSString *image;          // 图片地址
@property (nonatomic, copy) NSString *content;        // 素材内容
@property (nonatomic, assign) NSInteger x;            // 图片类型时 二维码x轴坐标
@property (nonatomic, assign) NSInteger y;            // 图片类型时 二维码y轴坐标
@property (nonatomic, assign) NSInteger width;        // 图片类型时 二维码宽度
@property (nonatomic, assign) NSInteger height;       // 图片类型时 二维码高度
@property (nonatomic, assign) float borderSize;       // 图片类型时 二维码高度白边尺寸
@end

@interface RXShareStrategy : NSObject  // 策略数据
@property (nonatomic, assign) NSInteger id;   // 策略ID
@property (nonatomic, assign) NSInteger type; // 策略类型
@end

@interface RXShareTrigger : NSObject  // 埋点数据
@property (nonatomic, assign) NSInteger id;        // 埋点ID
@property (nonatomic, copy) NSString *title;       // 埋点标题
@property (nonatomic, copy) NSString *tag;         // 埋点标识
@property (nonatomic, copy) NSString *failed_msg;  // 错误提示
@property (nonatomic, assign) NSInteger type;      // 埋点类型
@end

@interface RXShareModel : NSObject
@property (nonatomic, strong) RXShareTrigger *trigger;
@property (nonatomic, strong) RXShareStrategy *strategy;
@property (nonatomic, strong) RXShareContent *content;
@property (nonatomic, strong) RXSharePlatforms *platforms;
@property (nonatomic, copy) NSString *identity;  // 平台标识，如果是微信时返回的为微信ID
@property (nonatomic, copy) NSString *transmits;
@end

NS_ASSUME_NONNULL_END
