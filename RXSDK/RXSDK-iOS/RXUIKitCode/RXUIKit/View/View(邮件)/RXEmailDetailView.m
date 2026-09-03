//
//  RXEmailDetailView.m
//  RXUIKit-OS
//
//  Created by root11 on 2024/7/23.
//

#import "RXEmailDetailView.h"
#import "RXUICommonTool.h"
#import <WebKit/WebKit.h>
#import "RXCommonWKWebView.h"
#import "RXEmailGiftView.h"
#import "RXTopAlignedLabel.h"
#import "RXGiftPopView.h"
#import "RXEmailBrowserView.h"
#import <RXSDK_Pure/RX_CommonNetworkExcuteManager.h>

@interface RXEmailDetailView ()<WKUIDelegate, WKNavigationDelegate,WKScriptMessageHandler,UIScrollViewDelegate>

@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;//邮箱
@property (nonatomic, strong) UIButton *backBtn;
@property (nonatomic, strong) UIButton *closeBtn;
@property (nonatomic, strong) UIView *grayBgView;
@property (nonatomic, strong) UILabel *nameLabel;//横屏标题
@property (nonatomic, strong) RXTopAlignedLabel *topNameLabel;//竖屏
@property (nonatomic, strong) WKWebView *wkWebview;
@property (nonatomic, strong) UIScrollView *scrollView;
@property (nonatomic, strong) UIButton *receiveBtn;
@property (nonatomic, strong) UIButton *deleteBtn;
@property (nonatomic, strong) UIImageView *leftImageView;
@property (nonatomic, strong) UIImageView *rightImageView;

@property (nonatomic, copy) NSString *cpUserId;
@property (nonatomic, copy) NSString *emailId;
@property (nonatomic, strong) RXGiftPopView *giftPopView;
@property (nonatomic, strong) NSMutableArray *subviewsArray;
@property (nonatomic, strong) NSMutableDictionary *detailDic;
@property (nonatomic, strong) NSMutableArray *imageUrlArr;

@end

@implementation RXEmailDetailView


- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithCpUserId:(NSString *)cpUserId emailId:(NSString *)emailId
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        //        [[UIApplication sharedApplication].keyWindow addSubview:self];
        [[UIViewController currentViewController].view addSubview:self];
        [[UIViewController currentViewController].view bringSubviewToFront:self];
        
        self.orientation = [RXUICommonTool getInterfaceOrientation];
        
        self.cpUserId = cpUserId;
        self.emailId = emailId;
        
        [self setUI];
        [self show];
        [self loadEmailDetail];
        
    }
    return self;
}

#pragma mark - request
- (void)loadEmailDetail{
    [RXHUD showHUD];
    __weak typeof(self) weakSelf = self;
    [[RXApiService sharedSDK] getEmailDetailWithCpUserID:self.cpUserId emailID:[self.emailId integerValue] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
        [RXHUD hideHUD];
            if ([response[@"code"] integerValue] == 0) {
            [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_refreshEmailList object:nil];
                weakSelf.detailDic = [NSMutableDictionary dictionaryWithDictionary:response[@"data"]];
            //计算道具名字高度,放回到字典中
            NSMutableArray *mArr = [NSMutableArray arrayWithArray:weakSelf.detailDic[@"props"]];
            for (int i = 0; i < mArr.count; i ++) {
                NSMutableDictionary *mDic = [NSMutableDictionary dictionaryWithDictionary:mArr[i]];
                float nameHeight = [mDic[@"name"] heightForFont:[UIFont boldSystemFontOfSize:13] width:89];
                mDic[@"nameHeight"] = [NSString stringWithFormat:@"%f",nameHeight];
                mArr[i] = mDic;
            }
            weakSelf.detailDic[@"props"] = mArr;
            
            [weakSelf refreshUI];
        }else{
            [RXHUD showErrorText:@"加载失败"];
        }
        }else{
            [RXHUD showErrorText:@"加载失败"];
            [weakSelf closeBtnClick];
        }
    }];
}

- (void)gainGift{
    [RXHUD showHUD];
    __weak typeof(self) weakSelf = self;
    [[RXApiService sharedSDK] receivePropsWithCpUserID:self.cpUserId type:1 emailID:[self.emailId integerValue] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            if ([response[@"code"] integerValue] == 0) {
            [RXHUD showSuccessText:@"领取成功"];
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_refreshEmailList object:nil];
                [weakSelf loadEmailDetail];
            });
        }else{
            [RXHUD showErrorText:@"领取失败"];
        }
        }else{
            [RXHUD showErrorText:@"领取失败"];
        }
    }];
}

- (void)deleteGift{
    [RXHUD showHUD];
    __weak typeof(self) weakSelf = self;
    [[RXApiService sharedSDK] deleteEmailWithCpUserID:self.cpUserId type:1 emailID:[self.emailId integerValue] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            if ([response[@"code"] integerValue] == 0) {
            [RXHUD showSuccessText:@"删除成功"];
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_refreshEmailList object:nil];
                [weakSelf hide];
            });
        }else{
            [RXHUD showErrorText:@"删除失败"];
        }
        }else{
            [RXHUD showErrorText:@"删除失败"];
        }
    }];
}

#pragma mark -- <setUI>
- (BOOL)onDeviceOrientationDidChange{
    //获取当前设备Device
    UIDevice *device = [UIDevice currentDevice] ;
    //识别当前设备的旋转方向
    switch (device.orientation) {
        case UIDeviceOrientationLandscapeLeft:
            NSLog(@"屏幕向左橫置");
            self.orientation = 2;
            [self layoutViews];
            break;
            
        case UIDeviceOrientationLandscapeRight:
            NSLog(@"屏幕向右橫置");
            self.orientation = 2;
            [self layoutViews];
            break;
            
        case UIDeviceOrientationPortrait:
            NSLog(@"屏幕直立");
            self.orientation = 1;
            [self layoutViews];
            break;
            
        case UIDeviceOrientationPortraitUpsideDown:
            NSLog(@"屏幕直立，上下顛倒");
            self.orientation = 1;
            [self layoutViews];
            break;
            
        default:
            NSLog(@"无法识别");
            break;
    }
    return YES;
}

- (void)show
{
    [RXUICommonTool transformWithView:self.bgView];
    [UIView animateWithDuration:0.1 animations:^{
        [RXUICommonTool showWithAnimate:self.bgView];
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
    
}

- (void)setUI
{
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.backBtn];
    [self.bgView addSubview:self.closeBtn];
    [self.bgView addSubview:self.grayBgView];
    
    if (RXAC) {
        [self.grayBgView addSubview:self.nameLabel];
        self.nameLabel.hidden = NO;
        self.topNameLabel.hidden = YES;
    }else{
        [self.grayBgView addSubview:self.topNameLabel];
        self.nameLabel.hidden = YES;
        self.topNameLabel.hidden = NO;
    }
    
    [self.grayBgView addSubview:self.wkWebview];
    [self.bgView addSubview:self.scrollView];
    [self.bgView addSubview:self.receiveBtn];
    [self.bgView addSubview:self.deleteBtn];
    [self.bgView addSubview:self.giftPopView];
    [self.bgView addSubview:self.leftImageView];
    [self.bgView addSubview:self.rightImageView];
    
    [self layoutViews];
}

- (void)layoutViews
{
    [self.subviewsArray removeAllObjects];
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    if (RXAC) {//横屏 左右100 上下30，间距尽量不动，其他等比例
        self.bgView.frame = CGRectMake(100, 30, RXUScaleWidth(531), RXUScaleWidth(311));
        self.bgView.center = window.center;
        //横屏
        CGFloat bgViewWidth = self.bgView.frame.size.width;
        CGFloat bgViewHeight = self.bgView.frame.size.height;
        
        self.titleLbl.frame = CGRectMake(0, 0, bgViewWidth, RXUScaleWidth(45));
        
        self.grayBgView.frame = CGRectMake(15, RXUScaleWidth(45), bgViewWidth - 30, bgViewHeight - RXUScaleWidth(109));
        
        self.nameLabel.frame = CGRectMake(5, RXUScaleWidth(10), CGRectGetWidth(self.grayBgView.frame) - 10, RXUScaleWidth(20));
        self.topNameLabel.hidden = YES;
        
        self.wkWebview.frame = CGRectMake(5, RXUScaleWidth(42), CGRectGetWidth(self.grayBgView.frame) - 10 , CGRectGetHeight(self.grayBgView.frame) - RXUScaleWidth(42) - 16);
        
        self.giftPopView.frame = CGRectMake(0, 0, 160, 160);
        
        self.receiveBtn.frame = CGRectMake(bgViewWidth - RXUScaleWidth(135) - 15, bgViewHeight - 13 - RXUScaleWidth(38), RXUScaleWidth(135), RXUScaleWidth(38));
        
        self.deleteBtn.frame = CGRectMake(bgViewWidth - RXUScaleWidth(135) - 15, bgViewHeight - 13 - RXUScaleWidth(38), RXUScaleWidth(135), RXUScaleWidth(38));
        
        CGFloat viewHeight = 40;
        CGFloat totalWidth = (14 * 5) + (viewHeight * 6);
        
        self.scrollView.frame = CGRectMake(36, bgViewHeight - 13 - 40, totalWidth, viewHeight);
        
        self.leftImageView.frame = CGRectMake(12, self.scrollView.frame.origin.y + 12 , 16, 16);
        
        self.rightImageView.frame = CGRectMake(CGRectGetMaxX(self.scrollView.frame) + 8, self.scrollView.frame.origin.y + 12, 16, 16);
        
        UIImage *backImage = [UIImage rxBundleImageNamed:@"rx_back"];
        [self.backBtn setImage:backImage forState:UIControlStateNormal];
        self.backBtn.frame = CGRectMake(12, RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
        
        self.closeBtn.frame = CGRectMake(bgViewWidth - 17 - RXUScaleWidth(25), RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            
    }else{//竖屏 左右20，高度固定为455等比例，间距尽量不动，其他等比例
        self.bgView.frame = CGRectMake((RXUScreenWidth - RXUScaleWidth(313))/2, (RXUScreenHeight - RXUScaleWidth(455))/2, RXUScaleWidth(313), RXUScaleWidth(455));
        self.bgView.center = window.center;
        
        CGFloat bgViewWidth = self.bgView.frame.size.width;
        CGFloat bgViewHeight = self.bgView.frame.size.height;
        
        self.titleLbl.frame = CGRectMake(0, 0, bgViewWidth, RXUScaleWidth(45));
        
        //        self.backBtn.frame = CGRectMake(12, 10, 20, 20);
        
        self.grayBgView.frame = CGRectMake(10, RXUScaleWidth(45), bgViewWidth - 20, bgViewHeight - RXUScaleWidth(45) - 19 - RXUScaleWidth(40) - 19 - RXUScaleWidth(38) - 22);
        
        //        self.nameLabel.frame = CGRectMake(10, 10, CGRectGetWidth(self.grayBgView.frame) - 20, 40);
        self.nameLabel.hidden = YES;
        self.topNameLabel.frame = CGRectMake(10, 10, self.grayBgView.frame.size.width - 20, RXUScaleWidth(40));
        
        self.wkWebview.frame = CGRectMake(10, RXUScaleWidth(50), CGRectGetWidth(self.grayBgView.frame) - 20 , CGRectGetHeight(self.grayBgView.frame) - RXUScaleWidth(50) - 17);
        
        CGFloat viewHeight = 50;
        CGFloat totalWidth = (14 * 3) + (viewHeight * 4);
        
        self.scrollView.frame = CGRectMake((self.bgView.frame.size.width - totalWidth)/2, self.grayBgView.frame.origin.y + self.grayBgView.frame.size.height + 17, totalWidth, viewHeight);
        
        self.leftImageView.frame = CGRectMake(self.scrollView.frame.origin.x - 8 - 16, self.scrollView.frame.origin.y + 17 , 16, 16);
        
        self.rightImageView.frame = CGRectMake(CGRectGetMaxX(self.scrollView.frame) + 8, self.scrollView.frame.origin.y + 17, 16, 16);
        
        self.receiveBtn.frame = CGRectMake((bgViewWidth - RXUScaleWidth(208))/2, bgViewHeight - 22 - RXUScaleWidth(38), RXUScaleWidth(208), RXUScaleWidth(38));
        
        self.deleteBtn.frame = CGRectMake((bgViewWidth - RXUScaleWidth(208))/2, bgViewHeight - 22 - RXUScaleWidth(38), RXUScaleWidth(208), RXUScaleWidth(38));
        
        self.giftPopView.frame = CGRectMake(0, 0, 160, 160);
        
        self.closeBtn.frame = CGRectMake(bgViewWidth - 17 - RXUScaleWidth(25), RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
    }
}

- (void)refreshUI{
    
    self.nameLabel.text = self.detailDic[@"title"];
    self.topNameLabel.text = self.detailDic[@"title"];
    [self loadHtmlString:self.detailDic[@"content"]];
    if ([self.detailDic[@"status"] integerValue] == 2) {//已领
        self.receiveBtn.hidden = YES;
        self.deleteBtn.hidden = NO;
    }else{//已读或未读
        self.receiveBtn.hidden = NO;
        self.deleteBtn.hidden = YES;
    }
    
    for (UIView *subview in self.scrollView.subviews) {
        [subview removeFromSuperview];
    }
    
    NSArray *propsArray = self.detailDic[@"props"];
    int propsCount = (int)propsArray.count;
    
#pragma mark - 测试数据,需要删除并且将NSMutableArray *propsArray修改回NSArray
//    NSArray *arr = self.detailDic[@"props"];
//    propsArray = [NSMutableArray array];
//    for (int i = 0; i < 10; i ++) {
//        [propsArray addObject:arr[0]];
//    }
//    propsCount = (int)propsArray.count;
#pragma mark - 测试数据,需要删除
    
    if (propsCount == 0) {
        self.scrollView.hidden = YES;
        self.receiveBtn.hidden = YES;//如果无道具，隐藏接收按钮，显示删除按钮
        self.deleteBtn.hidden = NO;
    }else{
        self.scrollView.hidden = NO;
    }
    
    if (RXAC) {
        CGFloat scrollViewTotalWidth = propsCount * 40 + (propsCount - 1) * 14;
        CGFloat scrollViewTotalHeight = 40;
        CGFloat viewWidth = 40;
        CGFloat viewHeight = 40;
        CGFloat horizontalSpacing = 14;
        
        if (propsCount < 7) {
            self.leftImageView.hidden = YES;
            self.rightImageView.hidden = YES;
        }else{
            self.leftImageView.hidden = YES;
            self.rightImageView.hidden = NO;
        }
        
        self.scrollView.contentSize = CGSizeMake(scrollViewTotalWidth, scrollViewTotalHeight);
        
        for (int i = 0; i < propsCount; i ++) {
            RXEmailGiftView *giftView = [[RXEmailGiftView alloc] init];
            giftView.tag = i;
            [giftView setGiftDic:propsArray[i]];
            [giftView setStatus:[self.detailDic[@"status"] integerValue]];
            giftView.frame = CGRectMake(i * (horizontalSpacing + viewWidth), 0, viewWidth, viewHeight);
            [self.scrollView addSubview:giftView];
            [self.subviewsArray addObject:giftView];
            
            UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleTap:)];
            [giftView addGestureRecognizer:tapGesture];
        }
    }else{
        CGFloat totalWidth = (propsCount - 1) * 14 + propsCount * 50 ;
        CGFloat scrollViewFrameWidth = self.scrollView.frame.size.width;
        CGFloat viewWidth = 50;
        CGFloat viewHeight = 50;
        CGFloat horizontalSpacing = 14;
        
        CGFloat contentHeight = 50;
        self.scrollView.contentSize = CGSizeMake(totalWidth, contentHeight);
        
        if (propsCount < 5) {
            self.leftImageView.hidden = YES;
            self.rightImageView.hidden = YES;
        }else{
            self.leftImageView.hidden = YES;
            self.rightImageView.hidden = NO;
        }
        
        for (int i = 0; i < propsCount; i ++) {
            RXEmailGiftView *giftView = [[RXEmailGiftView alloc] init];
            giftView.tag = i;
            [giftView setGiftDic:propsArray[i]];
            [giftView setStatus:[self.detailDic[@"status"] integerValue]];
            
            CGFloat xPosition = 0;
            if (propsCount < 4) {
                xPosition = (scrollViewFrameWidth - totalWidth)/2 + (viewWidth + horizontalSpacing) * i;
            }else{
                xPosition = (viewWidth + horizontalSpacing) * i;
            }
            
            CGFloat yPosition = 0;
            giftView.frame = CGRectMake(xPosition, yPosition, viewWidth, viewHeight);
            [self.scrollView addSubview:giftView];
            [self.subviewsArray addObject:giftView];
            
            UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleTap:)];
            [giftView addGestureRecognizer:tapGesture];
        }
    }
    
}

- (void)loadHtmlString:(NSString *)htmlString{
    [self.wkWebview loadHTMLString:htmlString baseURL:nil];
#pragma mark - 测试数据 需要删除
//     NSString *htmlString1 = @"<html><head><style type=\"text/css\">p { font-size: 11px; }</style><img src=' https://pco-member-imgs.oss-cn-qingdao.aliyuncs.com/images/f3c2bd84-7a9f-743d-5fee-e46b4746f36a/notification/20190918/5d81e31bb44b9.png'/></head><body><p>这里是邮箱的正文，这里支持富文本，可以<strong>加粗</strong>，<span style=\"color: red;\">描红</span>、<em>斜体</em>，感谢您在过去24小时内通过邮箱与我们联系，相关的邮件领取详情，如果是你本人或获得授权的其他人查看了你通过邮箱领取详情，则无需再进行其他操作。这里是邮箱的正文。</p><p><a href=\"https://www.baidu.com\">访问百度</a></p></body><img src=' https://pco-member-imgs.oss-cn-qingdao.aliyuncs.com/images/f3c2bd84-7a9f-743d-5fee-e46b4746f36a/notification/20190918/5d81e31bb44b9.png'/></html>";
//     [self.wkWebview loadHTMLString:htmlString1 baseURL:nil];
#pragma mark - 测试数据 需要删除
}

#pragma mark -- <actions>
- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
    self.giftPopView.hidden = YES;
}

- (void)backBtnAction
{
    [RXHUD hideHUD];
    [self hide];
}

- (void)closeBtnClick{
    [RXHUD hideHUD];
    [self hide];
}

- (void)receiveBtnAction{
    self.giftPopView.hidden = YES;
    [self gainGift];
}

- (void)deleteBtnAction{
    self.giftPopView.hidden = YES;
    [self deleteGift];
}

- (void)handleTap:(UITapGestureRecognizer *)gesture {
    UIView *tappedView = gesture.view;
    CGRect tappedViewRectInScrollView = tappedView.frame;
    CGRect tappedViewTransferInBgView = [self.scrollView convertRect:tappedViewRectInScrollView toView:self.bgView];
    
    if (tappedViewTransferInBgView.origin.x < self.bgView.frame.size.width/2) {
        // 将 tappedView 的坐标转换为相对于 self.bgView 的坐标
        CGRect tappedViewRectInBgView = [self.scrollView convertRect:tappedViewRectInScrollView toView:self.bgView];
        
        CGFloat popViewX = tappedViewRectInBgView.origin.x;
        CGFloat popViewY = tappedViewRectInBgView.origin.y - self.giftPopView.frame.size.height;
        // 计算 popView 的位置，并确保它可见
        self.giftPopView.frame = CGRectMake(popViewX, popViewY, self.giftPopView.frame.size.width, self.giftPopView.frame.size.height);
    }else{
        // 将 tappedView 的坐标转换为相对于 self.bgView 的坐标
        CGRect tappedViewRectInBgView = [self.scrollView convertRect:tappedViewRectInScrollView toView:self.bgView];
        
        CGFloat popViewX = tappedViewRectInBgView.origin.x + tappedViewRectInBgView.size.width - self.giftPopView.frame.size.width;
        CGFloat popViewY = tappedViewRectInBgView.origin.y - self.giftPopView.frame.size.height;
        // 计算 popView 的位置，并确保它可见
        self.giftPopView.frame = CGRectMake(popViewX, popViewY, self.giftPopView.frame.size.width, self.giftPopView.frame.size.height);
    }
    
    NSArray *propsArray = self.detailDic[@"props"];
    NSDictionary *giftDic = propsArray[tappedView.tag];
    [self.giftPopView setPopViewDic:giftDic];
    self.giftPopView.hidden = NO;
}

- (void)addImgClickJS {
    //获取所以的图片标签
    [self.wkWebview evaluateJavaScript:@"function getImages(){\
         var imgs = document.getElementsByTagName('img');\
         var imgScr = '';\
         for(var i=0;i<imgs.length;i++){\
             if (i == 0){ \
                imgScr = imgs[i].src; \
             } else {\
                imgScr = imgScr +'***'+ imgs[i].src;\
             } \
         };\
         return imgScr;\
     };" completionHandler:nil];//注入js方法
    
    __weak typeof(self)weakSelf = self;
    [self.wkWebview evaluateJavaScript:@"getImages()" completionHandler:^(id _Nullable result, NSError * _Nullable error) {
        
        if (!error) {
            NSMutableArray * urlArray = result?[NSMutableArray arrayWithArray:[result componentsSeparatedByString:@"***"]]:nil;
            NSLog(@"urlArray = %@",urlArray);
            weakSelf.imageUrlArr = urlArray;
        } else {
            weakSelf.imageUrlArr = nil;
        }
    }];
    //添加图片点击的回调
    [self.wkWebview evaluateJavaScript:@"function registerImageClickAction(){\
         var imgs = document.getElementsByTagName('img');\
         for(var i=0;i<imgs.length;i++){\
             imgs[i].customIndex = i;\
             imgs[i].onclick=function(){\
                window.webkit.messageHandlers.imageClicked.postMessage({index: this.customIndex});\
             }\
         }\
     }" completionHandler:nil];
    [self.wkWebview evaluateJavaScript:@"registerImageClickAction();" completionHandler:nil];
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor whiteColor];
        _bgView.layer.cornerRadius = 4;
    }
    return _bgView;
}

- (UIView *)grayBgView{
    if (!_grayBgView) {
        _grayBgView = [[UIView alloc] init];
        _grayBgView.backgroundColor = HexRGBAlpha(0xF4F4F4, 1);
        _grayBgView.layer.cornerRadius = 4;
    }
    return _grayBgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = @"邮件";
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.backgroundColor = [UIColor clearColor];
        _titleLbl.font = [UIFont systemFontOfSize:RXUScaleWidth(18) weight:UIFontWeightMedium];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_closeBtn setImage:[UIImage rxBundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(closeBtnClick) forControlEvents:UIControlEventTouchUpInside];
        [_closeBtn setImageEdgeInsets:UIEdgeInsetsMake(4, 4, 4, 4)];
    }
    return _closeBtn;
}

- (UIButton *)backBtn{
    if (!_backBtn) {
        _backBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_backBtn setImage:[UIImage rxBundleImageNamed:@"rx_back"] forState:UIControlStateNormal];
        [_backBtn addTarget:self action:@selector(backBtnAction) forControlEvents:UIControlEventTouchUpInside];
        [_backBtn setImageEdgeInsets:UIEdgeInsetsMake(4, 4, 4, 4)];
    }
    return _backBtn;
}

- (UILabel *)nameLabel{
    if (!_nameLabel) {
        _nameLabel = [[UILabel alloc] init];
        _nameLabel.text = @"";
        _nameLabel.textColor = [UIColor blackColor];
        _nameLabel.backgroundColor = [UIColor clearColor];
        _nameLabel.lineBreakMode = NSLineBreakByTruncatingTail;
        _nameLabel.font = [UIFont systemFontOfSize:RXUScaleWidth(16) weight:UIFontWeightHeavy];
        _nameLabel.textAlignment = NSTextAlignmentLeft;
        
    }
    return _nameLabel;
}

- (RXTopAlignedLabel *)topNameLabel{
    if (!_topNameLabel) {
        _topNameLabel = [[RXTopAlignedLabel alloc] init];
        _topNameLabel.text = @"";
        _topNameLabel.textColor = [UIColor blackColor];
        _topNameLabel.backgroundColor = [UIColor clearColor];
        _topNameLabel.lineBreakMode = NSLineBreakByTruncatingTail;
        _topNameLabel.numberOfLines = 2;
        _topNameLabel.font = [UIFont systemFontOfSize:RXUScaleWidth(16) weight:UIFontWeightHeavy];
        _topNameLabel.textAlignment = NSTextAlignmentLeft;
        
    }
    return _topNameLabel;
}

- (WKWebView *)wkWebview
{
    if (!_wkWebview) {
        WKUserContentController *userContentController = [[WKUserContentController alloc] init];
        [userContentController addScriptMessageHandler:self name:@"imageClicked"];
        WKWebViewConfiguration *wkWebConfig = [[WKWebViewConfiguration alloc] init];
        wkWebConfig.userContentController = userContentController;
        _wkWebview = [[WKWebView alloc] initWithFrame:CGRectZero configuration:wkWebConfig];
        _wkWebview.backgroundColor = [UIColor clearColor];
        _wkWebview.opaque = NO;
        _wkWebview.navigationDelegate = self;
        _wkWebview.UIDelegate = self;
        _wkWebview.hidden = NO;
        _wkWebview.scrollView.showsVerticalScrollIndicator = NO;
        _wkWebview.scrollView.showsHorizontalScrollIndicator = NO;
    }
    return _wkWebview;
}

- (UIScrollView *)scrollView{
    if (!_scrollView) {
        _scrollView = [[UIScrollView alloc] initWithFrame:CGRectZero];
        _scrollView.showsHorizontalScrollIndicator = NO;
        _scrollView.showsVerticalScrollIndicator = NO;
        _scrollView.backgroundColor = [UIColor clearColor];
        _scrollView.delegate = self;
    }
    return _scrollView;
}

- (UIButton *)receiveBtn{
    if (!_receiveBtn) {
        _receiveBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_receiveBtn addTarget:self action:@selector(receiveBtnAction) forControlEvents:UIControlEventTouchUpInside];
        _receiveBtn.layer.cornerRadius = 10;
        _receiveBtn.backgroundColor = HexRGBAlpha(0x20C0B3, 1);
        [_receiveBtn setTitle:@"领取道具" forState:UIControlStateNormal];
        [_receiveBtn.titleLabel setFont:[UIFont systemFontOfSize:RXUScaleWidth(14) weight:UIFontWeightMedium]];
        [_receiveBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _receiveBtn.titleLabel.lineBreakMode = NSLineBreakByWordWrapping;
        _receiveBtn.titleLabel.numberOfLines = 0;
    }
    return _receiveBtn;
}

- (UIButton *)deleteBtn{
    if (!_deleteBtn) {
        _deleteBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_deleteBtn addTarget:self action:@selector(deleteBtnAction) forControlEvents:UIControlEventTouchUpInside];
        _deleteBtn.layer.cornerRadius = 10;
        _deleteBtn.backgroundColor = HexRGBAlpha(0xDC6E6E, 1);
        [_deleteBtn setTitle:@"删除邮件" forState:UIControlStateNormal];
        [_deleteBtn.titleLabel setFont:[UIFont systemFontOfSize:RXUScaleWidth(14) weight:UIFontWeightMedium]];
        [_deleteBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _deleteBtn.titleLabel.lineBreakMode = NSLineBreakByWordWrapping;
        _deleteBtn.titleLabel.numberOfLines = 0;
        _deleteBtn.hidden = YES;
    }
    return _deleteBtn;
}

- (RXGiftPopView *)giftPopView{
    if (!_giftPopView) {
        _giftPopView = [[RXGiftPopView alloc] init];
        _giftPopView.hidden = YES;
    }
    return _giftPopView;
}

- (NSMutableArray *)subviewsArray{
    if (!_subviewsArray) {
        _subviewsArray = [[NSMutableArray alloc] init];
    }
    return _subviewsArray;
}

- (NSMutableDictionary *)detailDic{
    if (!_detailDic) {
        _detailDic = [[NSMutableDictionary alloc] init];
    }
    return _detailDic;
}

- (UIImageView *)leftImageView{
    if (!_leftImageView) {
        _leftImageView = [[UIImageView alloc] init];
        _leftImageView.image = [UIImage rxBundleImageNamed:@"rx_emailLeft"];
    }
    return _leftImageView;
}

- (UIImageView *)rightImageView{
    if (!_rightImageView) {
        _rightImageView = [[UIImageView alloc] init];
        _rightImageView.image = [UIImage rxBundleImageNamed:@"rx_emailRight"];
    }
    return _rightImageView;
}

#pragma mark - UIScrollViewDelegate
- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    if (RXAC) {//横屏40
        CGFloat contentWidth = scrollView.contentSize.width;
        CGFloat offsetX = scrollView.contentOffset.x;
        CGFloat visibleWidth = scrollView.bounds.size.width;
        
        CGFloat leftRemainingSpace = offsetX;
        CGFloat rightRemainingSpace = contentWidth - offsetX - visibleWidth;
        
        if (leftRemainingSpace > 40) {
            self.leftImageView.hidden = NO;
        } else {
            self.leftImageView.hidden = YES;
        }
        
        if (rightRemainingSpace > 40) {
            self.rightImageView.hidden = NO;
        } else {
            self.rightImageView.hidden = YES;
        }
    }else{//竖屏50
        CGFloat contentWidth = scrollView.contentSize.width;
        CGFloat offsetX = scrollView.contentOffset.x;
        CGFloat visibleWidth = scrollView.bounds.size.width;
        
        CGFloat leftRemainingSpace = offsetX;
        CGFloat rightRemainingSpace = contentWidth - offsetX - visibleWidth;
        
        if (leftRemainingSpace > 50) {
            self.leftImageView.hidden = NO;
        } else {
            self.leftImageView.hidden = YES;
        }
        
        if (rightRemainingSpace > 50) {
            self.rightImageView.hidden = NO;
        } else {
            self.rightImageView.hidden = YES;
        }
    }
}

#pragma mark - <WKWebView delegate>
// 页面开始加载时调用
- (void)webView:(WKWebView *)webView didStartProvisionalNavigation:(WKNavigation *)navigation{
//    UIWindow *window = [UIApplication sharedApplication].keyWindow;
//    [RXHUD showHUDWithOffset:CGRectMake(CGRectGetWidth(window.frame) / 2 - 20, (CGRectGetHeight(self.frame) - CGRectGetMaxY(self.line.frame)) / 2, 40, 40)];
#pragma mark -修改字体颜色
//    [webView evaluateJavaScript:@"document.getElementsByTagName('body')[0].style.webkitTextFillColor= \"#767676\"" completionHandler:nil];
#pragma mark -修改背景颜色
//    [webView evaluateJavaScript:@"document.body.style.backgroundColor=\"#F4FCFB\"" completionHandler:nil];
#pragma mark - 控制字体号
    NSString *css = @"p { font-size: 11px; }";
    NSString *fontJs = [NSString stringWithFormat:
                        @"var style = document.createElement('style');"
                        "style.innerHTML = '%@';"
                        "document.head.appendChild(style);", css];
    [webView evaluateJavaScript:fontJs completionHandler:nil];
#pragma mark -增大字体大小
//    NSString *script = @"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '100%'";
//    if (RXAC) {
//        script = @"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '180%'";
//    }else{
//        script = @"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '250%'";
//    }
//    if ([ISPAD isEqualToString:@"iPad"]) {
//        script = @"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '220%'";
//    }
//    [webView evaluateJavaScript:script completionHandler:nil];
#pragma mark - 禁止网页缩放，并且控制网页宽度应适配设备宽度（这有助于设置字体、图片宽高后，视觉与手机端保持一致）
    NSString *injectionJSString = @"var script = document.createElement('meta');"
    "script.name = 'viewport';"
    "script.content=\"width=device-width,height=device-height,user-scalable=no\";"
    "document.getElementsByTagName('head')[0].appendChild(script);";
    [webView evaluateJavaScript:injectionJSString completionHandler:nil];
#pragma mark - 修改图片宽高
    NSString *imageScript = @"var images = document.getElementsByTagName('img'); \
                         for (var i = 0; i < images.length; i++) { \
                             images[i].style.width = '67px'; \
                             images[i].style.height = '57px'; \
                         }";
    [webView evaluateJavaScript:imageScript completionHandler:nil];
}

// 当内容开始返回时调用
- (void)webView:(WKWebView *)webView didCommitNavigation:(WKNavigation *)navigation{

}

// 页面加载失败时调用
- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(WKNavigation *)navigation{
    NSLog(@"加载失败");
}

// 接收到服务器跳转请求之后调用
- (void)webView:(WKWebView *)webView didReceiveServerRedirectForProvisionalNavigation:(WKNavigation *)navigation{

}

// 在收到响应后，决定是否跳转
- (void)webView:(WKWebView *)webView decidePolicyForNavigationResponse:(WKNavigationResponse *)navigationResponse decisionHandler:(void (^)(WKNavigationResponsePolicy))decisionHandler{

    NSLog(@"webview跳转:\n %@",navigationResponse.response.URL.absoluteString);
    
    //允许跳转
    decisionHandler(WKNavigationResponsePolicyAllow);
    //不允许跳转
    //decisionHandler(WKNavigationResponsePolicyCancel);
}

// 在发送请求之前，决定是否跳转
- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler{
    
    NSURL *URL = navigationAction.request.URL;
    NSString *scheme = [URL scheme];
    NSString *absoluteString = [navigationAction.request.URL.absoluteString stringByRemovingPercentEncoding];
    NSLog(@"URLSTRING: %@", absoluteString);
    if (navigationAction.navigationType == WKNavigationTypeLinkActivated) {
        // 通过浏览器访问
        RXCommonWKWebView *webView = [[RXCommonWKWebView alloc] initWithUrl:absoluteString title:@"链接" content:nil];
        decisionHandler(WKNavigationActionPolicyCancel);
    } else {
        decisionHandler (WKNavigationActionPolicyAllow);
    }
    return ;
}

//网页加载完成后调用
- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation{
    [RXHUD hideWebHUD];
#pragma mark -禁止用户选择
    [webView evaluateJavaScript:@"document.documentElement.style.webkitUserSelect='none';" completionHandler:nil];
    [webView evaluateJavaScript:@"document.activeElement.blur();" completionHandler:nil];
#pragma mark -增大字体大小
//    NSString *script = @"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '100%'";
//    if (RXAC) {
//        script = @"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '120%'";
//    } else {
//        script = @"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '220%'";
//    }
//    if ([ISPAD isEqualToString:@"iPad"]) {
//        script = @"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '120%'";
//    }
//    [webView evaluateJavaScript:script completionHandler:nil];


//#pragma mark -修改字体颜色
//    [webView evaluateJavaScript:@"document.getElementsByTagName('body')[0].style.webkitTextFillColor= \"#455452\"" completionHandler:nil];
//#pragma mark -修改背景颜色
//    [webView evaluateJavaScript:@"document.body.style.backgroundColor=\"#F4FCFB\"" completionHandler:nil];
#pragma mark - 只修改普通文字颜色，已设置颜色文字与链接均不受此影响
    NSString *script = @"var elements = document.body.getElementsByTagName('p'); \
                    for (var i = 0; i < elements.length; i++) { \
                        var element = elements[i]; \
                        if (element.tagName !== 'A' && !element.style.color) { \
                            element.style.color = '#767676'; \
                        } \
                    };";
    [webView evaluateJavaScript:script completionHandler:nil];
#pragma mark - 获取所有图片地址，并添加点击手势
    [self addImgClickJS];
}

#pragma mark - WKUIDelegate
- (WKWebView *)webView:(WKWebView *)webView createWebViewWithConfiguration:(WKWebViewConfiguration *)configuration forNavigationAction:(WKNavigationAction *)navigationAction windowFeatures:(WKWindowFeatures *)windowFeatures{
    //该方法是说不需要新建,我只需要在我自己的上加载界面
    WKFrameInfo *frameInfo = navigationAction.targetFrame;
    if (![frameInfo isMainFrame]) {
        [webView loadRequest:navigationAction.request];
    }
    return nil;
}

// 输入框
- (void)webView:(WKWebView *)webView runJavaScriptTextInputPanelWithPrompt:(NSString *)prompt defaultText:(nullable NSString *)defaultText initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(NSString * __nullable result))completionHandler{
    completionHandler(@"http");
}

// 确认框
- (void)webView:(WKWebView *)webView runJavaScriptConfirmPanelWithMessage:(NSString *)message initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(BOOL result))completionHandler{
    completionHandler(YES);
}

// 警告框
- (void)webView:(WKWebView *)webView runJavaScriptAlertPanelWithMessage:(NSString *)message initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(void))completionHandler{
    completionHandler();
}


#pragma mark - WKScriptMessageHandler
//js交互方法
- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
    if ([message.name isEqualToString:@"imageClicked"]) {
        NSDictionary *imageData = (NSDictionary *)message.body;
        NSInteger clickedIndex = [imageData[@"index"] integerValue];
        RXEmailBrowserView *view = [[RXEmailBrowserView alloc] initWithPicArray:self.imageUrlArr index:clickedIndex];
    }
}

@end
