//
//  RXPublicWebViewNaviBarView.h
//  RXPublicToolKit
//
//  Created by 陈汉 on 2024/5/15.
//

#import <UIKit/UIKit.h>
#import "RXPublicWebBtn.h"

NS_ASSUME_NONNULL_BEGIN

typedef enum : NSUInteger {
    RXPublicWebviewTitleStyleLeft,
    RXPublicWebviewTitleStyleDefault,
} RXPublicWebviewTitleStyle;

typedef void(^BackBlock)(void);
typedef void(^CloseBlock)(void);

@interface RXPublicWebViewNaviBarView : UIView

@property (nonatomic, strong) UIView *naviBar;
@property (nonatomic, strong) RXPublicWebBtn *backBtn;
@property (nonatomic, strong) RXPublicWebBtn *closeBtn;
@property (nonatomic, assign) BOOL isShowBackBtn;
@property (nonatomic, strong) NSString *titleStr;
@property (nonatomic, copy) BackBlock backBlock;
@property (nonatomic, copy) CloseBlock closeBlock;
@property (nonatomic, assign) RXPublicWebviewTitleStyle titleStyle;

@end

NS_ASSUME_NONNULL_END
