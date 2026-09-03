//
//  RXPlayerFeedbackPictureView.m
//  RXUIKit-OS
//
//  Created by root11 on 2024/8/17.
//

#import "RXPlayerFeedbackPictureView.h"
#import "RXFeedbackTool.h"
#import <AVKit/AVKit.h>

@interface RXPlayerFeedbackPictureView ()<UIScrollViewDelegate>
@property (nonatomic, strong) UIScrollView *scrollView;
@property (nonatomic, strong) UIImageView *imageView;

@property (nonatomic,strong)AVPlayerViewController *avPlayerVC;

@end

@implementation RXPlayerFeedbackPictureView

/**
 * 初始化
 * picArray 图片数组
 */
- (instancetype)initWithFrame:(CGRect)frame object:(NSObject *)object{
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
        [_scrollView addSubview:_imageView];
        
        if ([object isKindOfClass:[NSString class]]) {
            NSString *objStr = (NSString *)object;
            
            if ([objStr hasPrefix:@"http"]) {
                if ([objStr hasSuffix:@"flv"]|| [objStr hasSuffix:@"avi"] || [objStr hasSuffix:@"mov"]||[objStr hasSuffix:@"MOV"] ||[objStr hasSuffix:@"wmv"]|| [objStr hasSuffix:@"mp4"] || [objStr hasSuffix:@"MP4"] || [objStr hasSuffix:@"swf"] || [objStr hasSuffix:@"mkv"]) {//网络视频
                    NSString *urlString = [objStr stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet characterSetWithCharactersInString:@"`#%^{}\"[]|\\<> "].invertedSet];
                    AVPlayer *avPlayer = [[AVPlayer alloc] initWithURL:[NSURL URLWithString:urlString]];
                    _avPlayerVC =[[AVPlayerViewController alloc] init];
                    _avPlayerVC.player = avPlayer;
                    _avPlayerVC.view.frame = self.bounds;
                    [self addSubview:_avPlayerVC.view];
                    
//                    UIButton *starBtn =  [[UIButton alloc]initWithFrame:CGRectMake((self.bounds.size.width - 40) / 2 , (self.bounds.size.height - 40) / 2, 40, 40)];
//                    [starBtn setImage:[UIImage imageNamed:@"videoPlay"] forState:UIControlStateNormal];
//                    [starBtn addTarget:self action:@selector(click_starWithBtn:) forControlEvents:UIControlEventTouchUpInside];
//                    [_imageView addSubview:starBtn];
                }else{//网络图片
                    NSString *urlString = [objStr stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet characterSetWithCharactersInString:@"`#%^{}\"[]|\\<> "].invertedSet];
                    NSURL *imageUrl = [NSURL URLWithString:urlString];
                    NSData *data = [NSData dataWithContentsOfURL:imageUrl];
                    UIImage *image = [UIImage imageWithData:data];
                    _imageView.image = image;
                }
            }else{//本地视频
                NSString *pathStr = [objStr stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet characterSetWithCharactersInString:@"`#%^{}\"[]|\\<> "].invertedSet];
                AVPlayer *avPlayer = [[AVPlayer alloc] initWithURL:[NSURL fileURLWithPath:pathStr]];
                _avPlayerVC =[[AVPlayerViewController alloc] init];
                _avPlayerVC.player = avPlayer;
                _avPlayerVC.view.frame = _imageView.bounds;
                [_imageView addSubview:_avPlayerVC.view];
                
//                UIButton *starBtn =  [[UIButton alloc]initWithFrame:CGRectMake((self.bounds.size.width - 40) / 2 , (self.bounds.size.height - 40) / 2, 40, 40)];
//                [starBtn setImage:[UIImage imageNamed:@"videoPlay"] forState:UIControlStateNormal];
//                [starBtn addTarget:self action:@selector(click_starWithBtn:) forControlEvents:UIControlEventTouchUpInside];
//                [_imageView addSubview:starBtn];
            }
        }else if ([object isKindOfClass:[UIImage class]]) {//本地图片
            UIImage *image = (UIImage *)object;
            [_imageView setImage:image];
        }
        
        UITapGestureRecognizer *singleTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleSingleTap:)];
        singleTap.numberOfTapsRequired = 1;
        singleTap.numberOfTouchesRequired = 1;
        [_imageView addGestureRecognizer:singleTap];
        
        UITapGestureRecognizer *doubleTapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleDoubleTap:)];
        doubleTapGesture.numberOfTapsRequired = 2; // 设置双击手势
        [_imageView addGestureRecognizer:doubleTapGesture];
        [singleTap requireGestureRecognizerToFail:doubleTapGesture];//如果双击了，则不响应单击事件
        
        UISwipeGestureRecognizer *swipeDown = [[UISwipeGestureRecognizer alloc] initWithTarget:self action:@selector(handleSwipeDown:)];
        swipeDown.direction = UISwipeGestureRecognizerDirectionDown;
        [self addGestureRecognizer:swipeDown];
    }
    return self;
}

#pragma mark - action
- (void)plaverViewIsVisable{
    if (_avPlayerVC) {
        [_avPlayerVC.player pause];
    }
}

-(void)click_starWithBtn:(UIButton *)btn{
    btn.hidden = YES;
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
- (void)handleSwipeDown:(UISwipeGestureRecognizer *)swipe{
    if ([self.delegate respondsToSelector:@selector(singleTapHiddenView)]) {
        [self.delegate singleTapHiddenView];
    }
}

-(void)handleSingleTap:(UITapGestureRecognizer *)gestureRecognizer{
    if ([self.delegate respondsToSelector:@selector(singleTapHiddenView)]) {
        [self.delegate singleTapHiddenView];
    }
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

