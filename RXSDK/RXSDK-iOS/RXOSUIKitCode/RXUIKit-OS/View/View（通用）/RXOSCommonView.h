//
//  RXOSCommonView.h
//  RXUIKit
//
//  Created by 陈汉 on 2022/12/22.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXOSCommonView : UIView

- (instancetype)initWithDesStr:(NSString *)desStr
                         title:(NSString *)title
                         image:(NSString *)image
                      complete:(void(^)(void))complete;

@end

NS_ASSUME_NONNULL_END
