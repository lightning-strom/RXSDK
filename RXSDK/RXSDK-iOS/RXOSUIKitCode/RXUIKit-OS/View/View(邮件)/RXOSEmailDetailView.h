//
//  RXOSEmailDetailView.h
//  RXUIKit-OS
//
//  Created by root11 on 2024/7/23.
//

#import <UIKit/UIKit.h>


NS_ASSUME_NONNULL_BEGIN

@interface RXOSEmailDetailView : UIView

/**
 * 初始化
 * status 1-已读 2-已领 3-未读，注意：已领时也是已读状态
 */
- (instancetype)initWithCpUserId:(NSString *)cpUserId emailId:(NSString *)emailId;

@end

NS_ASSUME_NONNULL_END
