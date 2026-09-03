//
//  RXEmailPictureView.m
//  RXUIKit-OS
//
//  Created by root11 on 2024/8/17.
//

#import "RXEmailPictureView.h"
#import "RXUICommonTool.h"

@interface RXEmailPictureView ()<UIScrollViewDelegate>
@property (nonatomic, strong) UIScrollView *scrollView;
@property (nonatomic, strong) UIImageView *imageView;

@end

@implementation RXEmailPictureView

/**
 * 初始化
 * picArray 图片数组
 * index 第几张图片
 */
- (instancetype)initWithFrame:(CGRect)frame urlString:(NSString *)urlString{
    self = [super initWithFrame:frame];
    if (self) {
        _scrollView = [[UIScrollView alloc] initWithFrame:self.bounds];
        _scrollView.delegate = self;
        _scrollView.pagingEnabled = YES;
        _scrollView.scrollEnabled = YES;
        _scrollView.showsVerticalScrollIndicator = NO;
        _scrollView.showsHorizontalScrollIndicator = NO;
        _scrollView.minimumZoomScale = 1.0;
        _scrollView.maximumZoomScale = 3.0;
        _scrollView.userInteractionEnabled = YES;
        [self addSubview:_scrollView];
        
        //添加图片
        _imageView = [[UIImageView alloc] init];
        if (RXAC) {
            _imageView.frame = CGRectMake((RXUScreenWidth - RXUScaleWidth(300))/2, 0, RXUScaleWidth(300), RXUScreenHeight);
        }else{
            _imageView.frame = CGRectMake(0, (RXUScreenHeight - RXUScaleWidth(300))/2, RXUScreenWidth, RXUScaleWidth(300));
        }
        _imageView.contentMode = UIViewContentModeScaleAspectFill;
        [_imageView setUserInteractionEnabled:YES];
        NSURL *imageUrl = [NSURL URLWithString:urlString];
        NSData *data = [NSData dataWithContentsOfURL:imageUrl];
        UIImage *image = [UIImage imageWithData:data];
        _imageView.image = image;
        [_scrollView addSubview:_imageView];
        
        UITapGestureRecognizer *singleTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleSingleTap:)];
        singleTap.numberOfTapsRequired = 1;
        singleTap.numberOfTouchesRequired = 1;
        [_imageView addGestureRecognizer:singleTap];
        
        UITapGestureRecognizer *doubleTapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleDoubleTap:)];
        doubleTapGesture.numberOfTapsRequired = 2; // 设置双击手势
        [_imageView addGestureRecognizer:doubleTapGesture];
        [singleTap requireGestureRecognizerToFail:doubleTapGesture];//如果双击了，则不响应单击事件
    }
    return self;
}

#pragma mark - UIScrollViewDelegate
-(void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView{
    
}

- (UIView *)viewForZoomingInScrollView:(UIScrollView *)scrollView{
    return self.imageView;
}

//2.重新确定缩放完后的缩放倍数
-(void)scrollViewDidEndZooming:(UIScrollView *)scrollView withView:(UIView *)view atScale:(CGFloat)scale{
    [scrollView setZoomScale:scale+0.01 animated:NO];
    [scrollView setZoomScale:scale animated:NO];
}

-(void)scrollViewDidZoom:(UIScrollView *)scrollView{
    CGFloat xcenter = scrollView.center.x,ycenter = scrollView.center.y;

    xcenter = scrollView.contentSize.width > scrollView.frame.size.width?scrollView.contentSize.width/2 :xcenter;
    ycenter = scrollView.contentSize.height > scrollView.frame.size.height ?scrollView.contentSize.height/2 : ycenter;

    [self.imageView setCenter:CGPointMake(xcenter, ycenter)];
}

#pragma mark - 图片的点击，touch事件
-(void)handleSingleTap:(UITapGestureRecognizer *)gestureRecognizer{
    [self.delegate singleTapHiddenView];
}

-(void)handleDoubleTap:(UITapGestureRecognizer *)gestureRecognizer{
    if (gestureRecognizer.numberOfTapsRequired == 2) {
        if(_scrollView.zoomScale == 1){
            float newScale = [_scrollView zoomScale] *2;
            CGRect zoomRect = [self zoomRectForScale:newScale withCenter:[gestureRecognizer locationInView:gestureRecognizer.view]];
            [_scrollView zoomToRect:zoomRect animated:YES];
        }else{
            float newScale = [_scrollView zoomScale]/2;
            CGRect zoomRect = [self zoomRectForScale:newScale withCenter:[gestureRecognizer locationInView:gestureRecognizer.view]];
            [_scrollView zoomToRect:zoomRect animated:YES];
        }
    }
}
// 根据放大比例和中心点计算缩放区域
- (CGRect)zoomRectForScale:(CGFloat)scale withCenter:(CGPoint)center {
    CGRect zoomRect;
    zoomRect.size.height = _scrollView.frame.size.height / scale;
    zoomRect.size.width  = _scrollView.frame.size.width  / scale;
    zoomRect.origin.x = center.x - (zoomRect.size.width / 2.0);
    zoomRect.origin.y = center.y - (zoomRect.size.height / 2.0);
    return zoomRect;
}

@end

