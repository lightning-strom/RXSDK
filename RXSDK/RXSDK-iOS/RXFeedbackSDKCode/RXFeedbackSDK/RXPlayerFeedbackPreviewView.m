//
//  RXPlayerFeedbackPreviewView.m
//  RXUIKit-OS
//
//  Created by root11 on 2024/8/18.
//

#import "RXPlayerFeedbackPreviewView.h"
#import "RXFeedbackTool.h"
#import "RXPlayerFeedbackPictureView.h"

@interface RXPlayerFeedbackPreviewView ()<RXPlayerFeedbackPictureViewDelegate, UIScrollViewDelegate>
@property (nonatomic, strong) NSArray *picArray;
@property (nonatomic, strong) UIScrollView *scrollView;
@property(nonatomic, assign) NSInteger currentIndex;
@property (nonatomic, strong) RXPlayerFeedbackPictureView *lastVisibleView;

@end

@implementation RXPlayerFeedbackPreviewView

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
        RXPlayerFeedbackPictureView *picView = nil;
        if ([RXFeedbackTool isRTL]) {
            picView = [[RXPlayerFeedbackPictureView alloc] initWithFrame:CGRectMake(self.scrollView.contentSize.width - (i + 1) * RXUScreenWidth, 0, RXUScreenWidth, RXUScreenHeight) object:self.picArray[i]];
        }else{
            picView = [[RXPlayerFeedbackPictureView alloc] initWithFrame:CGRectMake(RXUScreenWidth * i, 0, RXUScreenWidth, RXUScreenHeight) object:self.picArray[i]];
        }
        picView.delegate = self;
        [self.scrollView addSubview:picView];
    }
    if ([RXFeedbackTool isRTL]) {
        [self.scrollView setContentOffset:CGPointMake((self.picArray.count - 1 -  self.currentIndex) * RXUScreenWidth, 0) animated:NO];
    }else{
        [self.scrollView setContentOffset:CGPointMake(self.currentIndex * RXUScreenWidth, 0) animated:NO];
    }
}

- (void)show
{
    [RXFeedbackTool transformWithView:self];
    [UIView animateWithDuration:0.1 animations:^{
        [RXFeedbackTool showWithAnimate:self];
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [self removeFromSuperview];
}

- (void)backBtnAction{
    [self hide];
}

#pragma mark - RXPlayerFeedbackPictureViewDelegate
- (void)singleTapHiddenView{
    [self hide];
}

#pragma mark - UIScrollViewDelegate
- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView{
    [self detectCurrentAndPreviousVisibleViewInScrollView:scrollView];
}

- (void)detectCurrentAndPreviousVisibleViewInScrollView:(UIScrollView *)scrollView {
    // 获取当前可见区域
    CGRect visibleRect;
    visibleRect.origin = scrollView.contentOffset;
    visibleRect.size = scrollView.bounds.size;
    
    UIView *currentVisibleView = nil;
    
    // 遍历 scrollView 的子视图，找出当前可见的视图
    for (UIView *subview in scrollView.subviews) {
        if (CGRectIntersectsRect(visibleRect, subview.frame)) {
            currentVisibleView = subview;
            break;
        }
    }
    
    if (currentVisibleView) {
        // 判断上一个可见的视图是否存在且不同于当前可见的视图
        if (self.lastVisibleView && self.lastVisibleView != currentVisibleView) {
            [self.lastVisibleView plaverViewIsVisable];
        }
        
        // 记录当前可见的视图为 lastVisibleView
        self.lastVisibleView = currentVisibleView;
    }
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
        _scrollView.delegate = self;
    }
    return _scrollView;
}


@end
