//
//  RXOSEmailBrowserView.m
//  RXUIKit-OS
//
//  Created by root11 on 2024/8/18.
//

#import "RXOSEmailBrowserView.h"
#import "RXOSCommonTool.h"
#import "RXOSEmailPictureView.h"

@interface RXOSEmailBrowserView ()<RXOSEmailPictureViewDelegate>
@property (nonatomic, strong) NSArray *picArray;
@property (nonatomic, strong) UIScrollView *scrollView;
@property(nonatomic, assign) NSInteger currentIndex;

@end

@implementation RXOSEmailBrowserView

/**
 * 初始化
 * picArray 图片数组
 * index 第几张图片
 */
- (instancetype)initWithPicArray:(NSArray *)picArray index:(NSInteger)index{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        //        [[UIApplication sharedApplication].keyWindow addSubview:self];
        [[UIViewController currentViewController].view addSubview:self];
        [[UIViewController currentViewController].view bringSubviewToFront:self];
        self.backgroundColor = HexRGBAlpha(0x000000, 1.0);
        self.picArray = picArray;
        self.currentIndex = index;
        
        [self setUI];
        [self show];
    }
    return self;
}

- (void)setUI{
    [self addSubview:self.scrollView];
    [self layoutViews];
}

- (void)layoutViews{
    self.scrollView.frame = self.bounds;
    self.scrollView.contentSize = CGSizeMake(RXUScreenWidth * self.picArray.count, RXUScreenHeight);
    
    for (int i = 0; i < self.picArray.count; i ++) {
        RXOSEmailPictureView *picView = nil;
        if ([RXOSCommonTool isRTL]) {
            picView = [[RXOSEmailPictureView alloc] initWithFrame:CGRectMake(self.scrollView.contentSize.width - (i + 1) * RXUScreenWidth, 0, RXUScreenWidth, RXUScreenHeight) urlString:self.picArray[i]];
        }else{
            picView = [[RXOSEmailPictureView alloc] initWithFrame:CGRectMake(RXUScreenWidth * i, 0, RXUScreenWidth, RXUScreenHeight) urlString:self.picArray[i]];
        }
        picView.delegate = self;
        [self.scrollView addSubview:picView];
    }
    if ([RXOSCommonTool isRTL]) {
        [self.scrollView setContentOffset:CGPointMake((self.picArray.count - 1 -  self.currentIndex) * RXUScreenWidth, 0) animated:NO];
    }else{
        [self.scrollView setContentOffset:CGPointMake(self.currentIndex * RXUScreenWidth, 0) animated:NO];
    }
}

- (void)show
{
    [RXOSCommonTool transformWithView:self];
    [UIView animateWithDuration:0.1 animations:^{
        [RXOSCommonTool showWithAnimate:self];
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [self removeFromSuperview];
}

#pragma mark - RXOSEmailPictureViewDelegate
- (void)singleTapHiddenView{
    [self hide];
}

#pragma mark - lazy load
- (NSArray *)picArray{
    if (!_picArray) {
        _picArray = [[NSArray alloc] init];
    }
    return _picArray;
}

- (UIScrollView *)scrollView{
    if (!_scrollView) {
        _scrollView = [[UIScrollView alloc] init];
        _scrollView.pagingEnabled = YES;
        _scrollView.scrollEnabled = YES;
        _scrollView.showsVerticalScrollIndicator = NO;
        _scrollView.showsHorizontalScrollIndicator = NO;
        _scrollView.userInteractionEnabled = YES;
    }
    return _scrollView;
}


@end
