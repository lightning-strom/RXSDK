//
//  RXPriView.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/2/14.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef void(^RXPriViewAgreeBlock)(void);
typedef void(^RXPriViewAgreeQuickBlock)(void);

@interface RXPriView : UIView

@property (nonatomic, assign) BOOL isQuickLogin;
@property (nonatomic, copy) RXPriViewAgreeBlock agreeBlock;
@property (nonatomic, copy) RXPriViewAgreeQuickBlock quickAgreeBlock;

@end

NS_ASSUME_NONNULL_END
