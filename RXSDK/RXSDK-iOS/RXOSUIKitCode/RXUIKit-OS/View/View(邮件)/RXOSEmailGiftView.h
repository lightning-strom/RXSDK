//
//  RXOSEmailGiftView.h
//  RXUIKit-OS
//
//  Created by root11 on 2024/7/23.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXOSEmailGiftView : UIView

@property (nonatomic, strong) UIImageView *imageView;
@property (nonatomic, strong) UILabel *tipLabel;
@property (nonatomic, strong) UILabel *countLable;


/// 加载道具
/// - Parameter NSDictionary: 道具信息
- (void)setGiftDic:(NSDictionary *)dic;

/// 设置状态
/// - Parameter status: status 1-已读 2-已领 3-未读
- (void)setStatus:(NSInteger)status;


/// 意见反馈加载道具
/// - Parameter NSDictionary: 道具信息
- (void)setPropDic:(NSDictionary *)propInfo;

/// 意见反馈设置状态
/// - Parameter get_prop: status 1-已领取 2-未领取
- (void)setGet_prop:(NSInteger)get_prop;

@end

NS_ASSUME_NONNULL_END
