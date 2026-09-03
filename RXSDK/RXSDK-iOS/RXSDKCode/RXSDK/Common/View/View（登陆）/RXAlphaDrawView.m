//
//  RXAlphaDrawView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/10/15.
//

#import "RXAlphaDrawView.h"
#import "RXCommonHeader.h"
#import "UIView+RXHit.h"

@interface RXAlphaDrawView ()

@property (nonatomic, weak) CAShapeLayer *fillLayer;

@property (nonatomic, strong) UIBezierPath *overlayPath;

@property (nonatomic, strong) NSMutableArray *transparentPaths;

@end

@implementation RXAlphaDrawView

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
//        [self setUp];
        self.userInteractionEnabled = YES;
        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapAction:)];
        [self addGestureRecognizer:tap];
    }
    
    return self;
}

- (void)tapAction:(UITapGestureRecognizer *)tap
{
    if (self.clickBlock) {
        self.clickBlock();
    }
    [self removeFromSuperview];
}

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event{
    
    UIView *hitView = [super hitTest:point withEvent:event];
    
    CGFloat x = point.x;
    CGFloat y = point.y;
    
    CGFloat alertWidth = 335;
    CGFloat alertHeight = 280;
    CGFloat alertX = __MainScreen_Width / 2 - alertWidth / 2;
    CGFloat alertY = __MainScreen_Height / 2 - alertHeight / 2;
    
    //事件传递
    if (x > alertX && x < alertWidth && y > alertY && y < alertY + alertWidth) {
        self.hidden = YES;
        return nil;//方便，直接让事件传递，无需返回具体的view
    } else {
        self.hidden = NO;
    }

    return hitView;

}

@end
