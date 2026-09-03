//
//  RXAlphaDrawView.h
//  RXSDK
//
//  Created by 陈汉 on 2021/10/15.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef void(^DrawViewClickBlock)(void);

@interface RXAlphaDrawView : UIView

@property (nonatomic, copy) DrawViewClickBlock clickBlock;

@end

NS_ASSUME_NONNULL_END
