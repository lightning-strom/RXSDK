//
//  RXPrivacyView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/29.
//

#import "RXPrivacyView.h"
#import "RXUICommonTool.h"
#import "RXWebViewController.h"
#import "UIView+RXShade.h"
#import "RXLegalModel.h"
#import "NSObject+RXUIAdditon.h"
#import "RXWKWebView.h"

#define CellLblTag 10000
#define CellLineTag 20000

@interface RXPrivacyView () <UITableViewDelegate, UITableViewDataSource, WKNavigationDelegate, WKUIDelegate, UIScrollViewDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UITableView *mTableView;
@property (nonatomic, strong) UIScrollView *desBg;
@property (nonatomic, strong) UILabel *desLbl;
@property (nonatomic, strong) UIView *middleView;
@property (nonatomic, strong) UIView *line;
@property (nonatomic, strong) UIButton *closeBtn;
@property (nonatomic, strong) NSArray *privacyArr;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, assign) BOOL needSet;
@property (nonatomic, assign) BOOL isFirst;
@property (nonatomic, strong) NSString *key;

@property (nonatomic, strong) NSMutableArray *lblArr;
@property (nonatomic, strong) NSMutableArray *lineArr;

@property (nonatomic, strong) UITextView *textView;

@end

@implementation RXPrivacyView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithKey:(NSString *)key legalData:(NSDictionary *)legalData
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXUICommonTool getInterfaceOrientation];
        
        NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:legalData];
        
        RXLegalData *model = [RXLegalData rxu_modelWithDictionary:dic];
        
        self.privacyArr = model.terms;
        self.needSet = YES;
        self.isFirst = YES;
        self.lblArr = [NSMutableArray arrayWithCapacity:self.privacyArr.count];
        self.lineArr = [NSMutableArray arrayWithCapacity:self.privacyArr.count];
        self.key = key;
        
        [self setUI];
        [self show];
        
        // 监听屏幕旋转
//        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDeviceOrientationDidChange)
//                             name:UIDeviceOrientationDidChangeNotification
//                                                       object:nil];
    }
    return self;
}

- (BOOL)onDeviceOrientationDidChange{
    //获取当前设备Device
    UIDevice *device = [UIDevice currentDevice];
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

#pragma mark -- <setUI>
- (void)setUI
{
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.mTableView];
    [self.bgView addSubview:self.desBg];
    [self.bgView addSubview:self.closeBtn];
//    [self.bgView addSubview:self.webView];
    [self.bgView addSubview:self.line];
//    [self.desBg addSubview:self.desLbl];
    [self.bgView addSubview:self.textView];
    
    [self layoutViews];
}

- (void)layoutViews
{
    self.frame = [UIApplication sharedApplication].keyWindow.frame;
    
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    CGFloat bgW = self.orientation == 2 ? 480 : 345;
    CGFloat bgH = self.orientation == 2 ? 276 : 360;
    CGFloat bgX = window.frame.size.width / 2 - bgW / 2;
    CGFloat bgY = window.frame.size.height / 2 - bgH / 2;
    _bgView.frame = CGRectMake(bgX, bgY, bgW, bgH);
    
    _titleLbl.frame = CGRectMake(0, 0, CGRectGetWidth(_bgView.frame), 43);
    
    CGFloat tableW = self.orientation == 2 ? 124 : 110;
    _mTableView.frame = CGRectMake(0, CGRectGetMaxY(_titleLbl.frame), tableW, bgH - 43);
    
    RXLegalData_term *term = self.privacyArr[0];
    _desLbl.text = term.content;
    CGFloat scrollH = [term.content heightForFont:self.desLbl.font width:216] + 5;
    
    if ([term.content containsString:@"<p>"]) {
        self.desLbl.hidden = YES;
//        self.webView.hidden = NO;
        self.textView.hidden = NO;
    } else {
        self.desLbl.hidden = NO;
//        self.webView.hidden = YES;
        self.textView.hidden = YES;
    }
    
    _desBg.frame = CGRectMake(CGRectGetMaxX(_mTableView.frame), CGRectGetMinY(_mTableView.frame), bgW - tableW, CGRectGetHeight(_mTableView.frame));

    CGFloat webX = self.orientation == 2 ? 480 : 345;
    
//    _webView.frame = CGRectMake(CGRectGetMaxX(_mTableView.frame) + 8, 42, bgW - tableW - 8 - 4, bgH - 42);
    _textView.frame = CGRectMake(CGRectGetMaxX(_mTableView.frame) + 8, 42, bgW - tableW - 8 - 4, bgH - 42);
    
    _desLbl.frame = CGRectMake(11, 2, CGRectGetWidth(_desBg.frame) - 11, scrollH);

    _closeBtn.frame = CGRectMake(bgW - 30, 12, 16, 16);
    
    _line.frame = CGRectMake(0, 42, bgW, 1);
    
    NSInteger row = 0;
    for (int i = 0; i < self.privacyArr.count; i++) {
        RXLegalData_term *term = self.privacyArr[i];
        if ([term.key isEqualToString:self.key]) {
            row = i;
            break;
        }
    }
    NSIndexPath *indexP = [NSIndexPath indexPathForRow:row inSection:0];
    [_mTableView scrollToRowAtIndexPath:indexP atScrollPosition:UITableViewScrollPositionNone animated:NO];
    
    [self layoutSubviews];
//    _desBg.contentSize = CGSizeMake(_desBg.width_sd, scrollH);
}

- (void)show
{
    [RXUICommonTool transformWithView:self.bgView];
    [UIView animateWithDuration:0.1 animations:^{
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        
        [RXUICommonTool showWithAnimate:self.bgView];
        
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
    
}

#pragma mark - webView delegate
#pragma mark - 需要响应身份验证时调用 同样在block中需要传入用户身份凭证
- (void)webView:(WKWebView *)webView didReceiveAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition, NSURLCredential * _Nullable))completionHandler {
    
    if ([challenge.protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust]) {
//        判断服务器采用的验证方法
        if (challenge.previousFailureCount == 0) {
//        如果没有错误的情况下 创建一个凭证，并使用证书
            NSURLCredential *credential = [NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust];
            completionHandler(NSURLSessionAuthChallengeUseCredential, credential);
        } else {
//        验证失败，取消本次验证
            completionHandler(NSURLSessionAuthChallengeUseCredential, nil);
        }
    } else {
        completionHandler(NSURLSessionAuthChallengeUseCredential, nil);
    }
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation{
#pragma mark -禁止用户选择
    [webView evaluateJavaScript:@"document.documentElement.style.webkitUserSelect='none';" completionHandler:nil];
    [webView evaluateJavaScript:@"document.activeElement.blur();" completionHandler:nil];
#pragma mark -增大字体大小
    if (self.orientation == 1) {
        [webView evaluateJavaScript:@"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '240%'" completionHandler:nil];
    } else {
        [webView evaluateJavaScript:@"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '320%'" completionHandler:nil];
    }
#pragma mark -修改字体颜色
    [webView evaluateJavaScript:@"document.getElementsByTagName('body')[0].style.webkitTextFillColor= \"#455452\"" completionHandler:nil];
#pragma mark -修改背景颜色
    [webView evaluateJavaScript:@"document.body.style.backgroundColor=\"#F4FCFB\"" completionHandler:nil];
}

//- (void)scrollViewDidScroll:(UIScrollView *)scrollView{
//    //防止左右滚动
//    CGPoint point = scrollView.contentOffset;
//    scrollView.contentOffset = CGPointMake(0, point.y);
//}

- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler {
    NSURL *URL = navigationAction.request.URL;
    NSString *scheme = [URL scheme];
    NSString *absoluteString = [navigationAction.request.URL.absoluteString stringByRemovingPercentEncoding];
    NSLog(@"URLSTRING: %@", absoluteString);
    [RXHUD hideHUD];
    if (navigationAction.navigationType == WKNavigationTypeLinkActivated) {
        // 通过浏览器访问
//        RXWebViewController *webVC = [[RXWebViewController alloc] init];
////        webVC.webView.frame = CGRectMake(0, 0, __MainScreen_Width, __MainScreen_Height);
//        webVC.urlStr = absoluteString;
//        webVC.modalPresentationStyle = UIModalPresentationCustom;
//        [[UIViewController currentViewController] presentViewController:webVC animated:YES completion:nil];
        RXWKWebView *webView = [[RXWKWebView alloc] initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
        webView.urlStr = absoluteString;
//        webView.complete = self.complete;
//        webView.urlStr =  @"https://www.baidu.com";
        [[UIApplication sharedApplication].keyWindow addSubview:webView];
        decisionHandler(WKNavigationActionPolicyCancel);
    } else {
        decisionHandler (WKNavigationActionPolicyAllow);
    }
    return ;//不添加会崩溃
}

#pragma mark -- <tableViewDelegate && dataSource>
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.privacyArr.count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 60;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSString *cellIdentifier = [NSString stringWithFormat:@"cell%ld", indexPath.row];
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
    
    RXLegalData_term *term = self.privacyArr[indexPath.row];
    
    UILabel *cellLbl = [[UILabel alloc] init];
    
    UIImageView *cellBg = [[UIImageView alloc] initWithFrame:CGRectMake(0, 15, 3, 30)];
    cellBg.backgroundColor = [UIColor colorWithHexString:@"20C0B3"];
    cellBg.layer.mask = [UIView drawCornerRadiusWithRect:CGRectMake(0, 0, 3, 30) corners:UIRectCornerTopRight | UIRectCornerBottomRight size:CGSizeMake(30, 30)];
    
    if (!cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier];
        
        cellBg.tag = CellLineTag + indexPath.row;
        [cell.contentView addSubview:cellBg];
        [_lineArr addObject:cellBg];
        
        cellLbl.backgroundColor = [UIColor whiteColor];
        cellLbl.tag = CellLblTag + indexPath.row;
        cellLbl.text = [NSString stringWithFormat:@"%@", term.title];
        cellLbl.textColor = [UIColor colorWithHexString:@"9f9f9f"];
        cellLbl.font = [UIFont systemFontOfSize:12];
        cellLbl.numberOfLines = 2;
        cellLbl.textAlignment = NSTextAlignmentCenter;
        [cell.contentView addSubview:cellLbl];
        [_lblArr addObject:cellLbl];
        
        UIView *line = [[UIView alloc] init];
        line.backgroundColor = [UIColor colorWithHexString:@"ECECEC"];
        [cell.contentView addSubview:line];
        
        cellLbl.frame = CGRectMake(14, 0, (self.orientation == 2 ? 124 : 110) - 28, 60);
        
        line.frame = CGRectMake(0, 59, 124, 1);
    }
    
    if ([term.key isEqualToString:self.key]) {
        cell.backgroundColor = [UIColor whiteColor];
        cellLbl.textColor = [UIColor blackColor];
        cellLbl.font = [UIFont boldSystemFontOfSize:12];
        cellBg.hidden = NO;
        
        _desLbl.text = term.content;
//        [self.webView loadHTMLString:term.content baseURL:nil];
        [self showAttributeString:term.content];
        
//        CGFloat scrollH = [term.content heightForFont:self.desLbl.font width:216] + 5;
//        _desLbl.frame = CGRectMake(CGRectGetMinX(_desLbl.frame), CGRectGetMinY(_desLbl.frame), CGRectGetWidth(_desLbl.frame), scrollH);
//        _desBg.contentSize = CGSizeMake(CGRectGetWidth(_desBg.frame), scrollH);
    } else {
        cell.backgroundColor = [UIColor whiteColor];
        cellBg.hidden = YES;
        cellLbl.textColor = [UIColor colorWithHexString:@"9f9f9f"];
        cellLbl.font = [UIFont systemFontOfSize:12];
    }
    
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    RXLegalData_term *term = self.privacyArr[indexPath.row];
    self.key = term.key;
    for (int i = 0; i < _lblArr.count; i++) {
        NSIndexPath *indexP = [NSIndexPath indexPathForRow:i inSection:0];
        
        UILabel *cellLbl = _lblArr[i];
        UIImageView *cellBg = _lineArr[i];
        if (cellLbl.tag == indexPath.row + CellLblTag) {
            cellLbl.textColor = [UIColor blackColor];
            cellLbl.font = [UIFont boldSystemFontOfSize:12];
            cellBg.hidden = NO;
            
//            if ([term.content containsString:@"<p>"]) {
//                self.desLbl.hidden = YES;
//                self.webView.hidden = NO;
//                [self.webView loadHTMLString:term.content baseURL:nil];
//                self.textView.hidden = NO;
//                [self showAttributeString:term.content];
//            } else {
//                self.desLbl.hidden = NO;
//                self.webView.hidden = YES;
//                self.textView.hidden = YES;
//            }
            
            _desLbl.text = term.content;
//            CGFloat scrollH = [term.content heightForFont:self.desLbl.font width:216] + 10;
//            _desLbl.frame = CGRectMake(CGRectGetMinX(_desLbl.frame), CGRectGetMinY(_desLbl.frame), CGRectGetWidth(_desLbl.frame), scrollH);
//            _desBg.contentSize = CGSizeMake(CGRectGetWidth(_desBg.frame), scrollH);
        } else {
            cellLbl.backgroundColor = [UIColor whiteColor];
            cellLbl.textColor = [UIColor colorWithHexString:@"9f9f9f"];
            cellLbl.font = [UIFont systemFontOfSize:12];
            cellBg.hidden = YES;
        }
    }
    [tableView reloadData];
}

- (void)showAttributeString:(NSString *)htmlString
{
    [self.textView setContentOffset:CGPointMake(0, 0)];
    
    NSDictionary *options = @{NSDocumentTypeDocumentAttribute : NSHTMLTextDocumentType,
                              NSFontAttributeName : [UIFont systemFontOfSize:16]
    };
    NSData *data = [htmlString dataUsingEncoding:NSUnicodeStringEncoding];
    
    NSAttributedString *attr = [[NSAttributedString alloc] initWithData:data options:options documentAttributes:nil error:nil];
    
    self.textView.attributedText = attr;
    
    CGFloat height = [attr.string heightForFont:[UIFont systemFontOfSize:12] width:CGRectGetWidth(self.textView.frame)] + (RXAC ? 30 : 20);
    self.textView.contentSize = CGSizeMake(0, height);
}

#pragma mark -- <actions>
- (void)closeBtnAction
{
    [self hide];
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor whiteColor];
        _bgView.layer.masksToBounds = YES;
        _bgView.layer.cornerRadius = 6;
    }
    return _bgView;
}

//- (WKWebView *)webView
//{
//    if (!_webView) {
//        WKWebViewConfiguration *wkWebConfig = [[WKWebViewConfiguration alloc] init];
//        NSString *jSString = [NSString stringWithFormat:@"var meta = document.createElement('meta'); meta.setAttribute('name', 'viewport'); meta.setAttribute('content', 'width=%f'); document.getElementsByTagName('head')[0].appendChild(meta);", RXAC ? 1300.0f : 900.0f];
//        WKUserScript *wkUserScript = [[WKUserScript alloc] initWithSource:jSString injectionTime:WKUserScriptInjectionTimeAtDocumentEnd forMainFrameOnly:YES];
////        [wkWebConfig.userContentController addUserScript:wkUserScript];
//
//        _webView = [[WKWebView alloc] initWithFrame:CGRectZero configuration:wkWebConfig];
//        _webView.backgroundColor = [UIColor colorWithHexString:@"F4FCFB"];
//        _webView.navigationDelegate = self;
//        _webView.scrollView.delegate = self;
//        _webView.hidden = YES;
//    }
//    return _webView;
//}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.font = [UIFont boldSystemFontOfSize:15];
        _titleLbl.text = @"声明";
    }
    return _titleLbl;
}

- (UIView *)middleView
{
    if (!_middleView) {
        _middleView = [[UIView alloc] init];
        _middleView.backgroundColor = [UIColor colorWithHexString:@"F4FCFB"];
        _middleView.layer.masksToBounds = YES;
        _middleView.layer.cornerRadius = 6;
    }
    return _middleView;
}

- (UITableView *)mTableView
{
    if (!_mTableView) {
        _mTableView = [[UITableView alloc] init];
        _mTableView.backgroundColor = [UIColor whiteColor];
        _mTableView.delegate = self;
        _mTableView.dataSource = self;
        _mTableView.bounces = NO;
        _mTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
        _mTableView.showsVerticalScrollIndicator = NO;
    }
    return _mTableView;
}
 
- (UIScrollView *)desBg
{
    if (!_desBg) {
        _desBg = [[UIScrollView alloc] init];
        _desBg.showsVerticalScrollIndicator = NO;
        _desBg.backgroundColor = [UIColor colorWithHexString:@"F4FCFB"];
    }
    return _desBg;
}

- (UILabel *)desLbl
{
    if (!_desLbl) {
        _desLbl = [[UILabel alloc] init];
        _desLbl.backgroundColor = [UIColor whiteColor];
        _desLbl.textColor = [UIColor colorWithHexString:@"737373"];
        _desLbl.font = [UIFont systemFontOfSize:12];
        _desLbl.numberOfLines = 0;
    }
    return _desLbl;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_closeBtn setImage:[UIImage rxBundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

- (UIView *)line
{
    if (!_line) {
        _line = [[UIView alloc] init];
        _line.backgroundColor = [UIColor colorWithHexString:@"ECECEC"];
    }
    return _line;
}

- (UITextView *)textView
{
    if (!_textView) {
        _textView = [[UITextView alloc] init];
        _textView.backgroundColor = [UIColor colorWithHexString:@"F4FCFB"];
//        _textView.userInteractionEnabled = NO;
        _textView.editable = NO;
        _textView.font = [UIFont systemFontOfSize:16];
    }
    return _textView;
}

@end
