//
//  RXOSAnnouncementView.h
//  RXUIKit-OS
//
//  Created by root11 on 2024/9/5.
//

#import <UIKit/UIKit.h>
#import "RXOSCommonTool.h"

typedef void(^linkBlock)(NSString * _Nullable link);
typedef void(^HaveAnnounceBlock)(BOOL ishas);
typedef void(^RequestBlcok)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error);

NS_ASSUME_NONNULL_BEGIN

@interface RXOSAnnouncementView : UIView

@property (nonatomic, copy) linkBlock linkBlock;

@property (nonatomic, copy) HaveAnnounceBlock haveBlock;

@property (nonatomic, copy) RequestBlcok requestBlock;

/**
 * 展示公告
 * limit 展示公告条数
 * linkCallBack 如果用户点击了链接，则链接由此返回，后续可使用此链接做业务处理
 * ishasCallBack 是否有公告，YES有，NO没有
 */
- (instancetype)initWithAnnouncementWithLimit:(int)limit linkCallBack:(void(^)(NSString *link))linkCallBack isHasCallBack:(void(^)(BOOL isHas))ishasCallBack;

/**
 * 展示维护公告
 * limit 1
 * title 标题
 * linkCallBack 如果用户点击了链接，则链接由此返回，后续可使用此链接做业务处理
 */
- (instancetype)initWithAnnouncementWithLimit:(int)limit title:(NSString *)title content:(NSString *)content linkCallBack:(void(^)(NSString *link))linkCallBack;


@end

NS_ASSUME_NONNULL_END
