//
//  RXAnnouncementView.m
//  RXUIKit-OS
//
//  Created by root11 on 2024/9/5.
//

#import "RXAnnouncementView.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <WebKit/WebKit.h>
#import "RXAnnouncementTitleCell.h"
#import "NSString+RXAddition.h"

//横屏、竖屏/单个、多个/RTL/ todo:公告板、维护公告多语言 /主库联合/padding
@interface RXAnnouncementView ()<UITableViewDelegate, UITableViewDataSource, WKUIDelegate, WKNavigationDelegate, WKScriptMessageHandler>

@property (nonatomic, assign) int count;

@property (nonatomic, strong) UIView *bgView;

@property (nonatomic, strong) UIView *bgTopView;
@property (nonatomic, strong) UILabel *callBoardLabel;
//@property (nonatomic, strong) UILabel *tipLable;
@property (nonatomic, strong) UIImageView *imageView;
@property (nonatomic, strong) UIButton *closeBtn;

@property (nonatomic, strong) UITableView *tableView;
@property (nonatomic, strong) UILabel *titleLabel;
@property (nonatomic, strong) WKWebView *wkWebview;

@property (nonatomic, strong) NSMutableArray *announceArray;//公告列表
@property (nonatomic, strong) NSMutableDictionary *currentDic;//当前的公告信息
@property (nonatomic, strong) NSMutableDictionary *readRecordDic;//是否已读记录

@property (nonatomic, strong) NSMutableArray *imageUrlArr;
@end

@implementation RXAnnouncementView

- (void)dealloc
{
    
}
/**
* 展示公告
* limit 展示公告条数
* linkCallBack 如果用户点击了链接，则链接由此返回，后续可使用此链接做业务处理
* ishasCallBack 是否有公告，YES有，NO没有
*/
- (instancetype)initWithAnnouncementWithLimit:(int)limit linkCallBack:(void(^)(NSString *link))linkCallBack isHasCallBack:(void(^)(BOOL isHas))ishasCallBack
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
//        [[UIApplication sharedApplication].keyWindow addSubview:self];
        [[UIViewController currentViewController].view addSubview:self];
        [[UIViewController currentViewController].view bringSubviewToFront:self];
        
        self.count = limit;
        self.linkBlock = linkCallBack;
        self.haveBlock = ishasCallBack;
        [self loadAnnonuceList];
        [self setUI];
        [self show];
    }
    return self;
}

/**
 * 展示维护公告
 * limit 1
 * title 标题
 * linkCallBack 如果用户点击了链接，则链接由此返回，后续可使用此链接做业务处理
 */
- (instancetype)initWithAnnouncementWithLimit:(int)limit title:(NSString *)title content:(NSString *)content linkCallBack:(void(^)(NSString *link))linkCallBack{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
//        [[UIApplication sharedApplication].keyWindow addSubview:self];
        [[UIViewController currentViewController].view addSubview:self];
        [[UIViewController currentViewController].view bringSubviewToFront:self];
        
        self.count = limit;
        self.linkBlock = linkCallBack;
        //加载数据
        NSString *tempTitle = title;
        if (tempTitle.length == 0) {
            tempTitle = @"维护公告";
        }else{
            tempTitle = title;
        }
        self.currentDic = [NSMutableDictionary dictionary];
        [self.currentDic setValue:tempTitle forKey:@"title"];
        [self.currentDic setValue:content forKey:@"content"];
        
        [self setUI];
        [self show];
    }
    return self;
}

- (void)setUI{
    [self addSubview:self.bgView];
    
    [self.bgView addSubview:self.bgTopView];
    [self.bgTopView addSubview:self.callBoardLabel];
//    [self.bgTopView addSubview:self.tipLable];
    [self.bgTopView addSubview:self.imageView];
    [self.bgTopView addSubview:self.closeBtn];
    
    [self.bgView addSubview:self.tableView];
    [self.bgView addSubview:self.titleLabel];
    [self.bgView addSubview:self.wkWebview];
    
    [self layoutViews];
}

- (void)layoutViews{
    self.titleLabel.text = self.currentDic[@"title"];
    [self.wkWebview loadHTMLString:self.currentDic[@"content"] baseURL:nil];
        
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    if (RXAC) {
        self.bgView.frame = CGRectMake(0, 0, 480, 276);
        self.bgView.center = window.center;
        CGFloat bgViewWidth = self.bgView.frame.size.width;
        CGFloat bgViewHeight = self.bgView.frame.size.height;
        
        self.bgTopView.frame = CGRectMake(0, 0, self.bgView.frame.size.width, 62);
        
        self.callBoardLabel.textAlignment = NSTextAlignmentLeft;
        self.callBoardLabel.frame = CGRectMake(20, 21, 200, 20);
        self.titleLabel.textAlignment = NSTextAlignmentLeft;
//            self.tipLable.frame = CGRectMake(20, CGRectGetMaxY(self.callBoardLabel.frame), 150), 12));
//            self.tipLable.textAlignment = NSTextAlignmentLeft;
        self.imageView.frame = CGRectMake(bgViewWidth - 63 - 100, -20, 100, 100);
        self.closeBtn.frame = CGRectMake(bgViewWidth - 24 - 25, (63 - 25)/2, 25, 25);
        
        if (self.count == 1) {//单个邮件
            self.tableView.hidden = YES;
            float titleHeight = [self.currentDic[@"title"] heightForFont:[UIFont boldSystemFontOfSize:14] width:bgViewWidth - 16 - 16];
            self.titleLabel.frame = CGRectMake(16, self.bgTopView.frame.size.height + 10, bgViewWidth - 16 - 16, titleHeight);
            self.titleLabel.textAlignment = NSTextAlignmentLeft;
            self.wkWebview.frame = CGRectMake(16, CGRectGetMaxY(self.titleLabel.frame) + 10, bgViewWidth - 16 - 16, bgViewHeight - CGRectGetMaxY(self.bgTopView.frame) - 10 - self.titleLabel.frame.size.height - 10 - 16);
            
        }else{//多个邮件
            self.tableView.hidden = NO;
            self.tableView.frame = CGRectMake(16, self.bgTopView.frame.size.height + 10, 112, bgViewHeight - self.bgTopView.frame.size.height - 10 - 5);
            float titleHeight = [self.currentDic[@"title"] heightForFont:[UIFont boldSystemFontOfSize:14] width:bgViewWidth - 16 - self.tableView.frame.size.width - 16 - 16];
            self.titleLabel.frame = CGRectMake(CGRectGetMaxX(self.tableView.frame) + 16, self.bgTopView.frame.size.height + 10, bgViewWidth - 16 - self.tableView.frame.size.width - 16 - 16, titleHeight);
            self.titleLabel.textAlignment = NSTextAlignmentLeft;
            self.wkWebview.frame = CGRectMake(16 + self.tableView.frame.size.width + 16, CGRectGetMaxY(self.titleLabel.frame) + 10, bgViewWidth - 16 - self.tableView.frame.size.width - 16 - 16, bgViewHeight - self.bgTopView.frame.size.height - 10 - titleHeight - 10 - 5);
        }
        
        
    }else{
        self.bgView.frame = CGRectMake(0, 0, 303, 333);
        self.bgView.center = window.center;
        CGFloat bgViewWidth = self.bgView.frame.size.width;
        CGFloat bgViewHeight = self.bgView.frame.size.height;
        
        self.bgTopView.frame = CGRectMake(0, 0, bgViewWidth, 62);
        
        self.callBoardLabel.frame = CGRectMake(20, 21, 200, 20);
        self.callBoardLabel.textAlignment = NSTextAlignmentLeft;
//            self.tipLable.frame = CGRectMake(20, CGRectGetMaxY(self.callBoardLabel.frame), 150), 12));
//            self.tipLable.textAlignment = NSTextAlignmentLeft;
        self.imageView.frame = CGRectMake(bgViewWidth - 54 - 78, -8, 78, 78);
        self.closeBtn.frame = CGRectMake(bgViewWidth - 24 - 25, (63 - 25)/2, 25, 25);
        
        if (self.count == 1) {
            self.tableView.hidden = YES;
            float titleHeight = [self.currentDic[@"title"] heightForFont:[UIFont boldSystemFontOfSize:14] width:bgViewWidth - 12 - 12];
            self.titleLabel.frame = CGRectMake(12, self.bgTopView.frame.size.height + 10, bgViewWidth - 12 - 12, titleHeight);
            self.titleLabel.textAlignment = NSTextAlignmentLeft;
            self.wkWebview.frame = CGRectMake(12, CGRectGetMaxY(self.titleLabel.frame) + 6, bgViewWidth - 12 - 12, bgViewHeight - CGRectGetMaxY(self.bgTopView.frame) - 10 - self.titleLabel.frame.size.height - 6 - 10);
            
        }else{
            self.tableView.hidden = NO;
            self.tableView.frame = CGRectMake(12, self.bgTopView.frame.size.height + 10, 94, bgViewHeight - self.bgTopView.frame.size.height - 10 - 10);
            float titleHeight = [self.currentDic[@"title"] heightForFont:[UIFont boldSystemFontOfSize:14] width:bgViewWidth - 12 - self.tableView.frame.size.width - 8 - 12];
            self.titleLabel.frame = CGRectMake(CGRectGetMaxX(self.tableView.frame) + 8, self.bgTopView.frame.size.height + 10, bgViewWidth - 12 - self.tableView.frame.size.width - 8 - 12, titleHeight);
            self.titleLabel.textAlignment = NSTextAlignmentLeft;
            self.wkWebview.frame = CGRectMake(12 + self.tableView.frame.size.width + 8, CGRectGetMaxY(self.titleLabel.frame) + 6, bgViewWidth - 12 - self.tableView.frame.size.width - 8 - 12, bgViewHeight - self.bgTopView.frame.size.height - 10 - titleHeight - 6 - 10);
        }
        
        
    }
}

- (void)show
{
//    [RXUICommonTool transformWithView:self.bgView];
//    [UIView animateWithDuration:0.1 animations:^{
//        [RXUICommonTool showWithAnimate:self.bgView];
//        [self layoutSubviews];
//    }];
}

- (void)hide
{
    [self removeFromSuperview];
}

- (void)loadAnnonuceList{
    if (self.announceArray.count > 0) {
        [self.announceArray removeAllObjects];
    }
    NSMutableArray *gainAnnounceArray = [NSMutableArray arrayWithArray:[[RXApiService sharedSDK] getLocalAnnouncement]];
    if (gainAnnounceArray.count == 0) {
        if (self.haveBlock) {
            self.haveBlock(NO);
        }
        [self hide];
        return;
    }else{
        if (self.haveBlock) {
            self.haveBlock(YES);
        }
        if (self.count > gainAnnounceArray.count) {
            self.count = (int)gainAnnounceArray.count;
        }
        
        for (int i = 0; i < self.count; i ++) {
            [self.announceArray addObject:gainAnnounceArray[i]];
        }
        self.readRecordDic = [NSMutableDictionary dictionaryWithDictionary:[[RXApiService sharedSDK] getLocalAnnouncementReadList]];
        
        for (int i = 0; i < self.announceArray.count; i ++) {
            NSMutableDictionary *mDic = [NSMutableDictionary dictionaryWithDictionary:self.announceArray[i]];
            mDic[@"isClick"] = @"no";
            [self.announceArray replaceObjectAtIndex:i withObject:mDic];
        }
        if (self.announceArray.count > 0) {
            //加载数据
            self.currentDic = [NSMutableDictionary dictionaryWithDictionary:self.announceArray[0]];
            if ([self.currentDic[@"content_type"] integerValue] == 2) {
                self.currentDic[@"content"] = [self buildHTMLWithImageURLs:self.currentDic[@"images"]];
            }
            //首位设置已点击
            self.currentDic[@"isClick"] = @"yes";
            [self.announceArray replaceObjectAtIndex:0 withObject:self.currentDic];
            //设置已读
            [self.readRecordDic setValue:@(YES) forKey:[self.currentDic[@"id"] stringValue]];
            [[RXApiService sharedSDK] syncLocalAnnouncementRecord:self.readRecordDic];
        }
        [self.tableView reloadData];
    }
    
}

//图片转html
- (NSString *)buildHTMLWithImageURLs:(NSArray *)imageURLs {
    if (imageURLs.count == 0) {
        return @""; // 或者返回一个包含错误信息的字符串
    }
    
    NSMutableString *htmlString = [NSMutableString stringWithString:@"<html><body>"];
    for (NSDictionary *imageDic in imageURLs) {
        // 假设imageURL是有效的，并且可以直接用于<img>标签的src属性
        // 在实际应用中，你可能需要对其进行URL编码或验证
        [htmlString appendFormat:@"<img src=\"%@\" alt=\"Image\" style=\"width:100%%;height:auto;\"/><br/>", imageDic[@"image_url"]];
    }
    [htmlString appendString:@"</body></html>"];
    return htmlString;
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
    NSString *css = @"p { font-size: 12px; }";
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
//    NSString *imageScript = @"var images = document.getElementsByTagName('img'); \
//                         for (var i = 0; i < images.length; i++) { \
//                             images[i].style.width = '67px'; \
//                             images[i].style.height = '57px'; \
//                         }";
//    [webView evaluateJavaScript:imageScript completionHandler:nil];
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
    if (navigationAction.navigationType == WKNavigationTypeLinkActivated) {
        // 链接返回
        if (self.linkBlock) {
            self.linkBlock(absoluteString);
        }
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

#pragma mark - wkwebview增加js交互
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
        if ([self.currentDic[@"content_type"] integerValue] == 2) {//图片则返回跳转url
            NSDictionary *imageData = (NSDictionary *)message.body;
            NSInteger clickedIndex = [imageData[@"index"] integerValue];
            NSDictionary *imageDic = self.currentDic[@"images"][clickedIndex];
            if (self.linkBlock) {
                self.linkBlock(imageDic[@"link_url"]);
            }
        }
        
    }
}

#pragma mark -- <UITableViewDelegate && UITableViewDataSource>
- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.announceArray.count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 46;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    RXAnnouncementTitleCell *cell = [tableView dequeueReusableCellWithIdentifier:@"cell"];
    if (!cell) {
        cell = [[RXAnnouncementTitleCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"cell"];
    }
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    cell.backgroundColor = [UIColor clearColor];
    if (self.announceArray.count > 0) {
        cell.dictionary = self.announceArray[indexPath.row];
    }
    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (self.announceArray.count > 0) {
        for (int i = 0; i < self.announceArray.count; i ++) {
            NSMutableDictionary *tempDic = [NSMutableDictionary dictionaryWithDictionary:self.announceArray[i]];
            if (i == indexPath.row) {
                tempDic[@"isClick"] = @"yes";
            }else{
                tempDic[@"isClick"] = @"no";
            }
            [self.announceArray replaceObjectAtIndex:i withObject:tempDic];
        }
        //加载数据
        self.currentDic = [NSMutableDictionary dictionaryWithDictionary:self.announceArray[indexPath.row]];
        if ([self.currentDic[@"content_type"] integerValue] == 2) {
            self.currentDic[@"content"] = [self buildHTMLWithImageURLs:self.currentDic[@"images"]];
        }
        //设置已读
        [self.readRecordDic setValue:@(YES) forKey:[self.currentDic[@"id"] stringValue]];
        [[RXApiService sharedSDK] syncLocalAnnouncementRecord:self.readRecordDic];
        
        [self layoutViews];
        [self.tableView reloadData];
    }
}


#pragma mark - lazy load
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor whiteColor];
        _bgView.layer.cornerRadius = 4;
    }
    return _bgView;
}

- (UIView *)bgTopView
{
    if (!_bgTopView) {
        _bgTopView = [[UIView alloc] init];
        _bgTopView.backgroundColor = HexRGBAlpha(0xCCFFFB, 1.0);
        _bgTopView.layer.cornerRadius = 4;
        _bgTopView.clipsToBounds = YES;
    }
    return _bgTopView;
}

- (UILabel *)callBoardLabel{
    if (!_callBoardLabel) {
        _callBoardLabel = [[UILabel alloc] init];
        _callBoardLabel.backgroundColor = [UIColor clearColor];
        _callBoardLabel.textColor = HexRGBAlpha(0x133A37, 1.0);
        _callBoardLabel.textAlignment = NSTextAlignmentLeft;
        _callBoardLabel.font = [UIFont boldSystemFontOfSize:16];
        _callBoardLabel.text = @"公告板";
    }
    return _callBoardLabel;
}

//- (UILabel *)tipLable{
//    if (!_tipLable) {
//        _tipLable = [[UILabel alloc] init];
//        _tipLable.backgroundColor = [UIColor clearColor];
//        _tipLable.textColor = HexRGBAlpha(0x549993, 1.0);
//        _tipLable.textAlignment = NSTextAlignmentLeft;
//        _tipLable.font = [UIFont systemFontOfSize:12)];
//        _tipLable.text = [RXLocation osLaunguage:@"please read carefully"];
//    }
//    return _tipLable;
//}

- (UIImageView *)imageView{
    if (!_imageView) {
        _imageView = [[UIImageView alloc] init];
        _imageView.translatesAutoresizingMaskIntoConstraints = NO;
        _imageView.contentMode = UIViewContentModeScaleAspectFit;
        _imageView.backgroundColor = [UIColor clearColor];
        _imageView.image = [UIImage rxBundleImageNamed:@"rx_announce"];
    }
    return _imageView;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_closeBtn setImage:[UIImage rxBundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(hide) forControlEvents:UIControlEventTouchUpInside];
        [_closeBtn setImageEdgeInsets:UIEdgeInsetsMake(4, 4, 4, 4)];
    }
    return _closeBtn;
}

- (UITableView *)tableView
{
    if (!_tableView) {
        _tableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStylePlain];
        _tableView.backgroundColor = [UIColor clearColor];
        _tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
        _tableView.dataSource = self;
        _tableView.delegate = self;
        _tableView.showsVerticalScrollIndicator = NO;
        _tableView.showsHorizontalScrollIndicator = NO;
        _tableView.keyboardDismissMode = UIScrollViewKeyboardDismissModeOnDrag;
        _tableView.layer.cornerRadius = 4;
        if (@available(iOS 11.0, *)) {
            _tableView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
        }
        if (@available(iOS 15.0, *)) {
            _tableView.sectionHeaderTopPadding = 0.0;
        }
    }
    return _tableView;
}

- (UILabel *)titleLabel{
    if (!_titleLabel) {
        _titleLabel = [[UILabel alloc] init];
        _titleLabel.backgroundColor = [UIColor clearColor];
        _titleLabel.textColor = [UIColor blackColor];
        _titleLabel.textAlignment = NSTextAlignmentLeft;
        _titleLabel.numberOfLines = 0;
        _titleLabel.lineBreakMode = NSLineBreakByCharWrapping;
        _titleLabel.font = [UIFont boldSystemFontOfSize:14];
    }
    return _titleLabel;
}

- (WKWebView *)wkWebview
{
    if (!_wkWebview) {
        WKUserContentController *userContentController = [[WKUserContentController alloc] init];
        [userContentController addScriptMessageHandler:self name:@"imageClicked"];
        //将webview加载html的外边距设为0，避免webview左右两侧有留白的问题
        NSString *js = @"document.body.style.margin = '0'; document.documentElement.style.margin = '0';";
        WKUserScript *userScript = [[WKUserScript alloc] initWithSource:js injectionTime:WKUserScriptInjectionTimeAtDocumentEnd forMainFrameOnly:YES];
        [userContentController addUserScript:userScript];
        
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

- (NSMutableArray *)announceArray{
    if (!_announceArray) {
        _announceArray = [NSMutableArray array];
    }
    return _announceArray;
}

- (NSMutableArray *)imageUrlArr{
    if (!_imageUrlArr) {
        _imageUrlArr = [NSMutableArray array];
    }
    return _imageUrlArr;
}

@end
