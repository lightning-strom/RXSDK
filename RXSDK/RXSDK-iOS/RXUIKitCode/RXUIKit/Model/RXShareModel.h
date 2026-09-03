//
//  RXShareModel.h
//  RXSDK
//
//  Created by 陈汉 on 2021/12/8.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXShareModel : NSObject
@property (nonatomic, copy) NSString *title;  // 内容标题
@property (nonatomic, copy) NSString *url;  // 内容URL
@property (nonatomic, copy) NSString *webpageUrl;  // 小程序URL
@property (nonatomic, copy) NSString *wxid;  // 微信分享appid
@property (nonatomic, copy) NSString *domain;  // 内容域名
@property (nonatomic, copy) NSString *material;  // 分享素材类型，url：分享链接，image：分享图片，card：小卡片，a2m：app分享至小游戏，text：分享文本
@property (nonatomic, assign) NSInteger materialid;  // 分享素材ID，上报原样返回
@property (nonatomic, copy) NSString *image;  // 素材图标或图片地址
@property (nonatomic, copy) NSString *content;  // 分享内容
@property (nonatomic, copy) NSString *gh_id;  // material a2m使用
@property (nonatomic, assign) NSInteger strategy_id;  // 策略id
@property (nonatomic, assign) NSInteger landing_id;  // 落地页id
@property (nonatomic, copy) NSString *android_download_url;  // 安卓落地页下载地址
@property (nonatomic, copy) NSString *ios_download_url;  // iOS落地页下载地址
@property (nonatomic, assign) NSInteger active;  // 1 活动 2 非活动
@property (nonatomic, assign) NSInteger qrCodeX; // 二维码坐标x
@property (nonatomic, assign) NSInteger qrCodeY; // 二维码坐标y
@property (nonatomic, assign) NSInteger qrCodeW; // 二维码宽
@property (nonatomic, assign) NSInteger qrCodeH; // 二维码高
@property (nonatomic, copy) NSString *download_url;
@property (nonatomic, assign) NSInteger download_link_id;
@property (nonatomic, assign) NSInteger content_type; // 分享内容类型 1图片 2落地页 3卡片
@property (nonatomic, copy) NSString *download_app_name;
@property (nonatomic, copy) NSString *download_app_id;
@property (nonatomic, copy) NSString *download_channel_id;
@property (nonatomic, copy) NSString *protocol_ios; // iOS启动协议
@property (nonatomic, strong) NSDictionary *ext;
@end

@interface RXShareData : NSObject
@property (nonatomic, strong) RXShareModel *share_content;
@property (nonatomic, copy) NSString *transmitargs;  // 透传参数，原样返回
@property (nonatomic, copy) NSString *custom;  // 自定义参数，URLENCODE
@property (nonatomic, copy) NSString *share_type;  // 分享方式 达到指定分享后有值 (normal:正常分享->游戏自己决定哪一种分享方式 stf: 指定好友分享)
@end

NS_ASSUME_NONNULL_END
