//
//  RXOSPriView.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/2/14.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef void(^RXOSPriViewAgreeBlock)(void);
typedef void(^RXOSPriViewAgreeQuickBlock)(void);

@interface RXOSPriView : UIView

@property (nonatomic, assign) BOOL isQuickLogin;
@property (nonatomic, copy) RXOSPriViewAgreeBlock agreeBlock;
@property (nonatomic, copy) RXOSPriViewAgreeQuickBlock quickAgreeBlock;

@end

NS_ASSUME_NONNULL_END
