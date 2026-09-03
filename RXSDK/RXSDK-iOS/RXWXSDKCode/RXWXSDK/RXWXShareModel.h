//
//  RXWXShareModel.h
//  RXWXSDK
//
//  Created by 陈汉 on 2022/5/30.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

//@interface RXShareModel : NSObject
//@property (nonatomic, copy) NSString *title;  // 内容标题
//@property (nonatomic, copy) NSString *url;  // 内容URL
//@property (nonatomic, copy) NSString *webpageUrl;  // 小程序URL
//@property (nonatomic, copy) NSString *wxid;  // 微信分享appid
//@property (nonatomic, copy) NSString *domain;  // 内容域名
//@property (nonatomic, copy) NSString *material;  // 分享素材类型，url：分享链接，image：分享图片，card：小卡片，a2m：app分享至小游戏，text：分享文本
//@property (nonatomic, assign) NSInteger materialid;  // 分享素材ID，上报原样返回
//@property (nonatomic, copy) NSString *image;  // 素材图标或图片地址
//@property (nonatomic, copy) NSString *content;  // 分享内容
//@property (nonatomic, copy) NSString *gh_id;  // material a2m使用
//@property (nonatomic, assign) NSInteger strategy_id;  // 策略id
//@property (nonatomic, assign) NSInteger landing_id;  // 落地页id
//@property (nonatomic, copy) NSString *android_download_url;  // 安卓落地页下载地址
//@property (nonatomic, copy) NSString *ios_download_url;  // iOS落地页下载地址
//@property (nonatomic, assign) NSInteger active;  // 1 活动 2 非活动
//@property (nonatomic, assign) NSInteger qrCodeX; // 二维码坐标x
//@property (nonatomic, assign) NSInteger qrCodeY; // 二维码坐标y
//@property (nonatomic, assign) NSInteger qrCodeW; // 二维码宽
//@property (nonatomic, assign) NSInteger qrCodeH; // 二维码高
//@property (nonatomic, copy) NSString *download_url;
//@property (nonatomic, assign) NSInteger download_link_id;
//@property (nonatomic, assign) NSInteger content_type; // 分享内容类型 1图片 2落地页 3卡片
//@property (nonatomic, copy) NSString *download_app_name;
//@property (nonatomic, copy) NSString *download_app_id;
//@property (nonatomic, copy) NSString *download_channel_id;
//@property (nonatomic, copy) NSString *protocol_ios; // iOS启动协议
//@property (nonatomic, strong) NSDictionary *ext;
//@end

//@interface RXShareData : NSObject
//@property (nonatomic, strong) RXShareModel *share_content;
//@property (nonatomic, copy) NSString *transmitargs;  // 透传参数，原样返回
//@property (nonatomic, copy) NSString *custom;  // 自定义参数，URLENCODE
//@property (nonatomic, copy) NSString *share_type;  // 分享方式 达到指定分享后有值 (normal:正常分享->游戏自己决定哪一种分享方式 stf: 指定好友分享)
//@end


@interface RXWXSharePlatforms : NSObject  // 平台信息，代表某个平台可用的分享方式 -1代表不限制 // 是否要再优化下 如果客户端有传平台那么此值应该恒定为一个
@property (nonatomic, assign) NSInteger wechat;  // 微信， 1:好友 2:朋友圈
@end

@interface RXWXShareContent : NSObject  // 分享素材数据
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
@end

@interface RXWXShareStrategy : NSObject  // 策略数据
@property (nonatomic, assign) NSInteger id;   // 策略ID
@property (nonatomic, assign) NSInteger type; // 策略类型
@end

@interface RXWXShareTrigger : NSObject  // 埋点数据
@property (nonatomic, assign) NSInteger id;        // 埋点ID
@property (nonatomic, copy) NSString *title;       // 埋点标题
@property (nonatomic, copy) NSString *failed_msg;  // 错误提示
@property (nonatomic, assign) NSInteger type;      // 埋点类型
@end

@interface RXWXShareModel : NSObject
@property (nonatomic, strong) RXWXShareTrigger *trigger;
@property (nonatomic, strong) RXWXShareStrategy *strategy;
@property (nonatomic, strong) RXWXShareContent *content;
@property (nonatomic, strong) RXWXSharePlatforms *platforms;
@property (nonatomic, copy) NSString *identity;  // 平台标识，如果是微信时返回的为微信ID
@property (nonatomic, copy) NSString *transmits;
@end

NS_ASSUME_NONNULL_END
