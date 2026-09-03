//
//  RXPrivacyView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/29.
//

#import "RXPrivacyView.h"
#import "RXCommonTool.h"
#import <WebKit/WebKit.h>
#import "RXWebViewController.h"
#import "UIView+RXShade.h"
#import "YYModel.h"

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
@property (nonatomic, strong) WKWebView *webView;

@property (nonatomic, strong) NSMutableArray *lblArr;
@property (nonatomic, strong) NSMutableArray *lineArr;

@end

@implementation RXPrivacyView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithKey:(NSString *)key
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXCommonTool getInterfaceOrientation];
        
        RXLegalData *model = [RXLegalData yy_modelWithDictionary:[RXUserUtility sharedManager].legalModel];
        self.privacyArr = model.terms;
        self.needSet = YES;
        self.isFirst = YES;
        self.lblArr = [NSMutableArray arrayWithCapacity:self.privacyArr.count];
        self.lineArr = [NSMutableArray arrayWithCapacity:self.privacyArr.count];
        self.key = key;
        
        [self setUI];
        [self show];
        
        // 监听屏幕旋转（横竖屏）
//        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDeviceOrientationDidChange)
//                             name:UIDeviceOrientationDidChangeNotification
//                                                       object:nil];
    }
    return self;
}

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

#pragma mark -- <setUI>
- (void)setUI
{
    [self sd_addSubviews:@[self.bgView]];
    [self.bgView sd_addSubviews:@[self.titleLbl, self.mTableView, self.desBg, self.closeBtn, self.webView, self.line]];
    [self.desBg addSubview:self.desLbl];
    
    [self layoutViews];
}

- (void)layoutViews
{
    self.frame = [UIApplication sharedApplication].keyWindow.frame;
    
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    CGFloat bgW = self.orientation == 2 ? 500 : 370;
    CGFloat bgH = self.orientation == 2 ? 295 : 295;
    CGFloat bgX = window.frame.size.width / 2 - bgW / 2;
    
    _bgView.sd_layout.leftSpaceToView(self, bgX)
    .bottomSpaceToView(self, -bgH)
    .widthIs(bgW)
    .heightIs(bgH);
    
    _titleLbl.sd_layout.topSpaceToView(self.bgView, 16)
    .leftSpaceToView(self.bgView, 0)
    .rightSpaceToView(self.bgView, 0)
    .heightIs(21);
    
//    CGFloat middleW = self.orientation == 2 ? 500 : 330;
//    CGFloat middleH = self.orientation == 2 ? 295 : 188;
//
//    _middleView.sd_layout.topSpaceToView(self.titleLbl, 12)
//    .leftSpaceToView(self.bgView, 0)
//    .heightIs(middleH)
//    .widthIs(middleW);
    
    CGFloat tableW = self.orientation == 2 ? 125 : 125;
//    CGFloat tableH = self.orientation == 2 ? 280 : 188;
    
    _mTableView.sd_layout.topSpaceToView(self.titleLbl, 12)
    .leftSpaceToView(self.middleView, 0)
    .bottomSpaceToView(self.bgView, 0)
    .widthIs(tableW);
    
    RXLegalData_term *term = self.privacyArr[0];
    _desLbl.text = term.content;
    CGFloat scrollH = [term.content heightForFont:self.desLbl.font width:216] + 5;
    
    if ([term.content containsString:@"<p>"]) {
        self.desLbl.hidden = YES;
        self.webView.hidden = NO;
    } else {
        self.desLbl.hidden = NO;
        self.webView.hidden = YES;
    }
    
    _desBg.sd_layout.topEqualToView(self.mTableView)
    .leftSpaceToView(self.mTableView, 0)
    .rightSpaceToView(self.bgView, 0)
    .bottomSpaceToView(self.bgView, 0);
    
    _webView.sd_layout.topSpaceToView(self.titleLbl, 12)
    .leftSpaceToView(self.bgView, 115)
    .rightSpaceToView(self.bgView, 4)
    .bottomSpaceToView(self.bgView, 0);
    
    _desLbl.sd_layout.topSpaceToView(self.desBg, 2)
    .leftSpaceToView(self.desBg, 11)
    .rightSpaceToView(self.desBg, 0)
    .heightIs(scrollH);
    
    _closeBtn.sd_layout.topSpaceToView(self.bgView, 13)
    .rightSpaceToView(self.bgView, 9)
    .widthIs(30)
    .heightEqualToWidth();
    
    _line.sd_layout.topSpaceToView(self.bgView, 49)
    .leftSpaceToView(self.bgView, 0)
    .rightSpaceToView(self.bgView, 0)
    .heightIs(0.5);
    
    [self layoutSubviews];
    _desBg.contentSize = CGSizeMake(_desBg.width_sd, scrollH);
}

- (void)show
{
    [UIView animateWithDuration:0.15 animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.6];

        CGFloat bgH = self.orientation == 2 ? 295 : 260;
        self.bgView.sd_layout.bottomSpaceToView(self, window.frame.size.height / 2 - bgH / 2);
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [UIView animateWithDuration:0.15 animations:^{
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        CGFloat bgH = self.orientation == 2 ? 295 : 260;
        self.bgView.sd_layout.bottomSpaceToView(self, -bgH);
        [self layoutSubviews];
    }];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.15 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self removeFromSuperview];
    });
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
        [webView evaluateJavaScript:@"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '80%'" completionHandler:nil];
    } else {
        [webView evaluateJavaScript:@"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '55%'" completionHandler:nil];
    }
#pragma mark -修改背景颜色
    [webView evaluateJavaScript:@"document.body.style.backgroundColor=\"#ffffff\"" completionHandler:nil];
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView{
    //防止左右滚动
    CGPoint point = scrollView.contentOffset;
    scrollView.contentOffset = CGPointMake(0, point.y);
}

- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler {
    NSURL *URL = navigationAction.request.URL;
    NSString *scheme = [URL scheme];
    NSString *absoluteString = [navigationAction.request.URL.absoluteString stringByRemovingPercentEncoding];
    NSLog(@"URLSTRING: %@", absoluteString);
    if (navigationAction.navigationType == WKNavigationTypeLinkActivated) {
        // 通过浏览器访问
        RXWebViewController *webVC = [[RXWebViewController alloc] init];
        webVC.urlStr = absoluteString;
        webVC.modalPresentationStyle = UIModalPresentationCustom;
        [[UIViewController currentViewController] presentViewController:webVC animated:YES completion:nil];
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
    return 45;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSString *cellIdentifier = [NSString stringWithFormat:@"cell%ld", indexPath.row];
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
    
    RXLegalData_term *term = self.privacyArr[indexPath.row];
    UILabel *cellLbl = [[UILabel alloc] init];
    UIImageView *cellBg = [[UIImageView alloc] init];
    
    if (!cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier];
        
        cellBg.tag = CellLineTag + indexPath.row;
        [cell.contentView addSubview:cellBg];
        [_lineArr addObject:cellBg];
        
        cellLbl.backgroundColor = [UIColor clearColor];
        cellLbl.tag = CellLblTag + indexPath.row;
        cellLbl.text = [NSString stringWithFormat:@"%@", term.name];
        cellLbl.textColor = [UIColor colorWithHexString:@"737373"];
        cellLbl.textAlignment = NSTextAlignmentCenter;
        cellLbl.font = [UIFont systemFontOfSize:12];
        cellLbl.numberOfLines = 2;
        [cell.contentView addSubview:cellLbl];
        [_lblArr addObject:cellLbl];
        
        cellLbl.sd_layout.topSpaceToView(cell.contentView, 0)
        .leftSpaceToView(cell.contentView, 4)
        .rightSpaceToView(cell.contentView, 25)
        .bottomSpaceToView(cell.contentView, 0);
        
        cellBg.sd_layout.topSpaceToView(cell.contentView, 0)
        .leftSpaceToView(cell.contentView, 0)
        .bottomSpaceToView(cell.contentView, 0)
        .widthIs(120);
    }
    
    if ([term.key isEqualToString:self.key]) {
        cell.backgroundColor = [UIColor whiteColor];
        cellLbl.textColor = [UIColor whiteColor];
        cellLbl.font = [UIFont systemFontOfSize:13];
        cellBg.image = [UIImage bundleImageNamed:@"privacy_select"];
        
        _desLbl.text = term.content;
        [self.webView loadHTMLString:term.content baseURL:nil];
        CGFloat scrollH = [term.content heightForFont:self.desLbl.font width:216] + 5;
        _desLbl.sd_layout.heightIs(scrollH);
        _desBg.contentSize = CGSizeMake(_desBg.width_sd, scrollH);
        cellBg.sd_layout.widthIs(119);
    } else {
        cellBg.image = [UIImage bundleImageNamed:@"privacy_normal"];
        cellBg.sd_layout.widthIs(107);
    }
    
//    cell.backgroundColor = [UIColor clearColor];
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
//    cell.layer.masksToBounds = YES;
//    cell.layer.borderColor = [UIColor colorWithHexString:@"e1e1e1"].CGColor;
//    cell.layer.borderWidth = 0.5;
    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    RXLegalData_term *term = self.privacyArr[indexPath.row];
    self.key = term.key;
    for (int i = 0; i < _lblArr.count; i++) {
        NSIndexPath *indexP = [NSIndexPath indexPathForRow:i inSection:0];
        UITableViewCell *cell = [tableView cellForRowAtIndexPath:indexP];
//        if (i == indexPath.row) {
//            cell.backgroundColor = [UIColor whiteColor];
//        } else {
//            cell.backgroundColor = [UIColor colorWithHexString:@"f1f1f1"];
//        }
        
        UILabel *cellLbl = _lblArr[i];
        UIImageView *cellBg = _lineArr[i];
        if (cellLbl.tag == indexPath.row + CellLblTag) {
//            cellLbl.backgroundColor = [UIColor whiteColor];
            cellLbl.textColor = [UIColor whiteColor];
            cellLbl.font = [UIFont systemFontOfSize:13];
            cellBg.image = [UIImage bundleImageNamed:@"privacy_select"];
            
            if ([term.content containsString:@"<p>"]) {
                self.desLbl.hidden = YES;
                self.webView.hidden = NO;
                [self.webView loadHTMLString:term.content baseURL:nil];
            } else {
                self.desLbl.hidden = NO;
                self.webView.hidden = YES;
            }
            
            _desLbl.text = term.content;
            CGFloat scrollH = [term.content heightForFont:self.desLbl.font width:216] + 10;
            _desLbl.sd_layout.heightIs(scrollH);
            _desBg.contentSize = CGSizeMake(_desBg.width_sd, scrollH);
            cellBg.sd_layout.widthIs(119);
        } else {
//            cellLbl.backgroundColor = [UIColor colorWithHexString:@"f1f1f1"];
            cellLbl.textColor = [UIColor colorWithHexString:@"737373"];
            cellLbl.font = [UIFont systemFontOfSize:12];
            cellBg.image = [UIImage bundleImageNamed:@"privacy_normal"];
            cellBg.sd_layout.widthIs(107);
        }
    }
    [tableView reloadData];
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
        _bgView.backgroundColor = [UIColor colorWithHexString:@"fafafa"];
        _bgView.layer.masksToBounds = YES;
        _bgView.layer.cornerRadius = 8;
    }
    return _bgView;
}

- (WKWebView *)webView
{
    if (!_webView) {
        WKWebViewConfiguration *wkWebConfig = [[WKWebViewConfiguration alloc] init];
        NSString *jSString = [NSString stringWithFormat:@"var meta = document.createElement('meta'); meta.setAttribute('name', 'viewport'); meta.setAttribute('content', 'width=%f'); document.getElementsByTagName('head')[0].appendChild(meta);", 280.0f];
        WKUserScript *wkUserScript = [[WKUserScript alloc] initWithSource:jSString injectionTime:WKUserScriptInjectionTimeAtDocumentEnd forMainFrameOnly:YES];
        [wkWebConfig.userContentController addUserScript:wkUserScript];
        
        _webView = [[WKWebView alloc] initWithFrame:CGRectZero configuration:wkWebConfig];
        _webView.backgroundColor = [UIColor clearColor];
        _webView.navigationDelegate = self;
        _webView.scrollView.delegate = self;
        _webView.hidden = YES;
    }
    return _webView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = @"声明";
        _titleLbl.textAlignment = NSTextAlignmentCenter;
//        _titleLbl.backgroundColor = [UIColor colorWithHexString:@"fafafa"];
        _titleLbl.font = [UIFont boldSystemFontOfSize:20];
    }
    return _titleLbl;
}

- (UIView *)middleView
{
    if (!_middleView) {
        _middleView = [[UIView alloc] init];
        _middleView.backgroundColor = [UIColor clearColor];
        _middleView.layer.masksToBounds = YES;
        _middleView.layer.cornerRadius = 4;
    }
    return _middleView;
}

- (UITableView *)mTableView
{
    if (!_mTableView) {
        _mTableView = [[UITableView alloc] init];
        _mTableView.backgroundColor = [UIColor colorWithHexString:@"f1f1f1"];
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
        _desBg.backgroundColor = [UIColor whiteColor];
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
//        _mTextView.userInteractionEnabled = NO;
//        _mTextView.showsVerticalScrollIndicator = NO;
    }
    return _desLbl;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_closeBtn setImage:[UIImage bundleImageNamed:@"close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

- (UIView *)line
{
    if (!_line) {
        _line = [[UIView alloc] init];
        _line.backgroundColor = [UIColor colorWithHexString:@"e1e1e1"];
    }
    return _line;
}

@end
