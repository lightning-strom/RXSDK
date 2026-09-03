//
//  RXEmailBrowserView.m
//  RXUIKit-OS
//
//  Created by root11 on 2024/8/18.
//

#import "RXEmailBrowserView.h"
#import "RXUICommonTool.h"
#import "RXEmailPictureView.h"

@interface RXEmailBrowserView ()<RXEmailPictureViewDelegate>
@property (nonatomic, strong) NSArray *picArray;
@property (nonatomic, strong) UIScrollView *scrollView;
@property(nonatomic, assign) NSInteger currentIndex;

@end

@implementation RXEmailBrowserView

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
        RXEmailPictureView *picView = nil;
        picView = [[RXEmailPictureView alloc] initWithFrame:CGRectMake(RXUScreenWidth * i, 0, RXUScreenWidth, RXUScreenHeight) urlString:self.picArray[i]];
        picView.delegate = self;
        [self.scrollView addSubview:picView];
    }
    [self.scrollView setContentOffset:CGPointMake(self.currentIndex * RXUScreenWidth, 0) animated:NO];
}

- (void)show
{
    [RXUICommonTool transformWithView:self];
    [UIView animateWithDuration:0.1 animations:^{
        [RXUICommonTool showWithAnimate:self];
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [self removeFromSuperview];
}

#pragma mark - RXEmailPictureViewDelegate
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
