//
//  RXPlayerGiftPopView.m
//  RXUIKit-OS
//
//  Created by root11 on 2024/7/24.
//

#import "RXPlayerGiftPopView.h"
#import "RXFeedbackTool.h"
#import "RXFeedbackWKWebView.h"
#import "RXFeedbackAttributeLabel.h"

@interface RXPlayerGiftPopView ()<WKUIDelegate, WKNavigationDelegate>

@property (nonatomic, strong) NSDictionary *infoDic;

@property (nonatomic, strong) RXFeedbackAttributeLabel *priLbl;

//判断如果是文字，则用TextView加载；如果是html则使用Webview加载
@property (nonatomic, strong) UITextView *textView;

@end

@implementation RXPlayerGiftPopView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.backgroundColor = [UIColor whiteColor];
        self.layer.shadowColor = [UIColor blackColor].CGColor;
        self.layer.shadowOpacity = 0.5;
        self.layer.shadowOffset = CGSizeMake(0, 2);
        self.layer.shadowRadius = 6;
        self.layer.cornerRadius = 6;
        [self setUpView];
    }
    return self;
}

- (void)setUpView{
    [self addSubview:self.imageView];
    [self addSubview:self.nameLabel];
    [self addSubview:self.priLbl];
    [self addSubview:self.countLabel];
    [self addSubview:self.webView];
    [self addSubview:self.textView];
}

- (void)layoutSubviews{
    if ([RXFeedbackTool isRTL]) {
        self.imageView.frame = CGRectMake(self.frame.size.width - 4 - 60, 10, 60, 60);
        
        if ([self.infoDic[@"nameHeight"] floatValue] <= 16) {
            self.nameLabel.frame = CGRectMake(0, 10, self.frame.size.width - 69, 16);
        }else{
            self.nameLabel.frame = CGRectMake(0, 10, self.frame.size.width - 69, [self.infoDic[@"nameHeight"] floatValue]);
        }
        self.nameLabel.textAlignment = NSTextAlignmentRight;
        
        self.priLbl.frame = CGRectMake(0, CGRectGetMaxY(self.nameLabel.frame) , self.frame.size.width - 69, 26);
        self.priLbl.textAlignment = NSTextAlignmentRight;
        self.priLbl.verticalCenter = YES;
        
        self.countLabel.frame = CGRectMake(0, CGRectGetMaxY(self.priLbl.frame), self.frame.size.width - 69, 14);
        self.countLabel.textAlignment = NSTextAlignmentRight;
    }else{
        self.imageView.frame = CGRectMake(4, 10, 60, 60);
        
        if ([self.infoDic[@"nameHeight"] floatValue] <= 16) {
            self.nameLabel.frame = CGRectMake(CGRectGetMaxX(self.imageView.frame) + 5, 10, self.frame.size.width - 69, 16);
        }else{
            self.nameLabel.frame = CGRectMake(CGRectGetMaxX(self.imageView.frame) + 5, 10, self.frame.size.width - 69, [self.infoDic[@"nameHeight"] floatValue]);
        }
        self.nameLabel.textAlignment = NSTextAlignmentLeft;
        
        self.priLbl.frame = CGRectMake(CGRectGetMaxX(self.imageView.frame) + 5, CGRectGetMaxY(self.nameLabel.frame), self.frame.size.width - 69, 26);
        self.priLbl.textAlignment = NSTextAlignmentLeft;
        self.priLbl.textInsets = UIEdgeInsetsMake(0, -4, 0, 0);
        self.priLbl.verticalCenter = YES;
        
        self.countLabel.frame = CGRectMake(CGRectGetMaxX(self.imageView.frame) + 5, CGRectGetMaxY(self.priLbl.frame), self.frame.size.width - 69, 14);
        self.countLabel.textAlignment = NSTextAlignmentLeft;
    }
    self.webView.frame = CGRectMake(0, CGRectGetMaxY(self.countLabel.frame) + 5, self.frame.size.width, self.frame.size.height - CGRectGetMaxY(self.countLabel.frame) - 5 - 2);
    self.textView.frame = CGRectMake(0, CGRectGetMaxY(self.countLabel.frame) + 5, self.frame.size.width, self.frame.size.height - CGRectGetMaxY(self.countLabel.frame) - 5 - 2);
}

- (void)setPopViewDic:(NSDictionary *)dic{
    self.infoDic = [[NSDictionary alloc] init];
    self.infoDic = dic;
    
    NSString *describeStr = dic[@"describe"];
    if ([describeStr rangeOfString:@"<html"].location != NSNotFound || [describeStr rangeOfString:@"<body"].location != NSNotFound) {
        [self.webView loadHTMLString:describeStr baseURL:nil];
        self.textView.hidden = YES;
    } else {
        self.webView.hidden = YES;
        self.textView.text = describeStr;
    }
    
    [self setImageWithUrlString:dic[@"icon"]];
    self.nameLabel.text = dic[@"name"];
    self.countLabel.text = [NSString stringWithFormat:@"%@",dic[@"count_format"]];
    NSInteger is_permanent = [dic[@"is_permanent"] integerValue];
    if (is_permanent == 0) {
        self.priLbl.text = [RXFeedbackLocation osLaunguage:@"永久有效"];
    }else{
        NSString *daysString = [NSString stringWithFormat:@"%@", dic[@"time_limit"]];
        NSString *text = [NSString stringWithFormat:@"%@ %@ %@",[RXFeedbackLocation osLaunguage:@"还有"], daysString, [RXFeedbackLocation osLaunguage:@"天到期"]];
        NSString *language =  [RXFeedbackTool getLanguage];
        if ([language isEqualToString:@"ja"]) {
            text = [NSString stringWithFormat:@"%@%@", daysString, [RXFeedbackLocation osLaunguage:@"天到期"]];
        }
        
        NSArray *clickTextList = @[daysString];
        self.priLbl.text = text;
        if ([RXFeedbackTool isRTL]) {
            [self.priLbl setClickText:clickTextList withFont:[UIFont systemFontOfSize:10 weight:UIFontWeightRegular] textAlignment:NSTextAlignmentRight];
        }else{
            [self.priLbl setClickText:clickTextList withFont:[UIFont systemFontOfSize:10 weight:UIFontWeightRegular] textAlignment:NSTextAlignmentLeft];
        }
        self.priLbl.clickTextColor = [UIColor colorWithHexString:@"FC5050"];
    }
    
    [self layoutSubviews];
}

- (void)setPopViewWithInfo:(NSDictionary *)dic{
   self.infoDic = [NSDictionary dictionaryWithDictionary:dic];
   
   NSString *describeStr = dic[@"describe"];
   if ([describeStr rangeOfString:@"<html"].location != NSNotFound || [describeStr rangeOfString:@"<body"].location != NSNotFound) {
       [self.webView loadHTMLString:describeStr baseURL:nil];
       self.textView.hidden = YES;
   } else {
       self.webView.hidden = YES;
       self.textView.text = describeStr;
   }
   
   [self setImageWithUrlString:dic[@"icon"]];
   self.nameLabel.text = dic[@"name"];
   self.countLabel.text = [NSString stringWithFormat:@"%@",dic[@"count"]];
   NSInteger time_limit = [dic[@"time_limit"] integerValue];
   if (time_limit == 0) {
       self.priLbl.text = [RXFeedbackLocation osLaunguage:@"永久有效"];
   }else{
       NSString *daysString = [NSString stringWithFormat:@"%@", dic[@"time_limit"]];
       NSString *text = [NSString stringWithFormat:@"%@ %@ %@",[RXFeedbackLocation osLaunguage:@"还有"], daysString, [RXFeedbackLocation osLaunguage:@"天到期"]];
       NSString *language =  [RXFeedbackTool getLanguage];
       if ([language isEqualToString:@"ja"]) {
           text = [NSString stringWithFormat:@"%@%@", daysString, [RXFeedbackLocation osLaunguage:@"天到期"]];
       }
       
       NSArray *clickTextList = @[daysString];
       self.priLbl.text = text;
       if ([RXFeedbackTool isRTL]) {
           [self.priLbl setClickText:clickTextList withFont:[UIFont systemFontOfSize:10 weight:UIFontWeightRegular] textAlignment:NSTextAlignmentRight];
       }else{
           [self.priLbl setClickText:clickTextList withFont:[UIFont systemFontOfSize:10 weight:UIFontWeightRegular] textAlignment:NSTextAlignmentLeft];
       }
       self.priLbl.clickTextColor = [UIColor colorWithHexString:@"FC5050"];
   }
   
   [self layoutSubviews];
}

- (void)setImageWithUrlString:(NSString *)imageUrlString{
    NSURL *url = [NSURL URLWithString:imageUrlString];
    NSData *data = [NSData dataWithContentsOfURL:url];
    self.imageView.image = [UIImage imageWithData:data];
}

#pragma mark - <WKWebView delegate>
// 页面开始加载时调用
- (void)webView:(WKWebView *)webView didStartProvisionalNavigation:(WKNavigation *)navigation{
//    UIWindow *window = [UIApplication sharedApplication].keyWindow;
//    [RXFeedbackHUD showHUDWithOffset:CGRectMake(CGRectGetWidth(window.frame) / 2 - 20, (CGRectGetHeight(self.frame) - CGRectGetMaxY(self.line.frame)) / 2, 40, 40)];
#pragma mark - 控制字体号
    NSString *css = @"p { font-size: 9px; }";
    NSString *fontJs = [NSString stringWithFormat:
                        @"var style = document.createElement('style');"
                        "style.innerHTML = '%@';"
                        "document.head.appendChild(style);", css];
    [webView evaluateJavaScript:fontJs completionHandler:nil];
#pragma mark - 禁止网页缩放，并且控制网页宽度应适配设备宽度（这有助于设置字体、图片宽高后，视觉与手机端保持一致）
    NSString *injectionJSString = @"var script = document.createElement('meta');"
    "script.name = 'viewport';"
    "script.content=\"width=device-width,height=device-height,user-scalable=no\";"
    "document.getElementsByTagName('head')[0].appendChild(script);";
    [webView evaluateJavaScript:injectionJSString completionHandler:nil];
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
        RXFeedbackWKWebView *webView = [[RXFeedbackWKWebView alloc] initWithUrl:absoluteString title:[RXFeedbackLocation osLaunguage:@"链接"] content:nil];
        decisionHandler(WKNavigationActionPolicyCancel);
    } else {
        decisionHandler (WKNavigationActionPolicyAllow);
    }
    return ;
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
    NSLog(@"%@",message);
    completionHandler();
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation{
    [RXFeedbackHUD hideWebHUD];
#pragma mark -禁止用户选择
    [webView evaluateJavaScript:@"document.documentElement.style.webkitUserSelect='none';" completionHandler:nil];
    [webView evaluateJavaScript:@"document.activeElement.blur();" completionHandler:nil];
#pragma mark - 只修改普通文字颜色，已设置颜色文字与链接均不受此影响
    NSString *script = @"var elements = document.body.getElementsByTagName('p'); \
                            for (var i = 0; i < elements.length; i++) { \
                                var element = elements[i]; \
                                if (element.tagName !== 'A' && !element.style.color) { \
                                    element.style.color = '#767676'; \
                                } \
                            }";
    [webView evaluateJavaScript:script completionHandler:nil];
    
#pragma mark - 计算高度
//    [webView evaluateJavaScript:@"document.body.scrollHeight" completionHandler:^(id _Nullable result, NSError * _Nullable error) {
//            if (error) {
//                NSLog(@"Error evaluating JavaScript: %@", error.localizedDescription);
//                return;
//            }
//            
//            if (result) {
//                CGFloat contentHeight = [result doubleValue];
//                // 通知视图更新布局
//                [self setNeedsLayout];
//                [self layoutIfNeeded];
//                
//                // 根据计算的高度设置自定义视图的高度
//                CGRect newFrame = self.frame;
//                CGFloat heignt = contentHeight + 67;
//                if (heignt <= 160) {
//                    newFrame.size.height = heignt;
//                }else{
//                    newFrame.size.height = 160;
//                }
//                self.frame = newFrame;
//            }
//    }];
    
    
}

#pragma mark - lazy load
- (UIImageView *)imageView{
    if (!_imageView) {
        _imageView = [[UIImageView alloc] init];
        _imageView.contentMode = UIViewContentModeScaleAspectFit;
        _imageView.layer.cornerRadius = 6;
        _imageView.layer.masksToBounds = YES;
        _imageView.layer.borderWidth = 1;
        _imageView.layer.borderColor = HexRGBAlpha(0xE1E1E1, 1).CGColor;
    }
    return _imageView;
}

- (UILabel *)nameLabel{
    if (!_nameLabel) {
        _nameLabel = [[UILabel alloc] init];
        _nameLabel.backgroundColor = [UIColor clearColor];
        _nameLabel.textColor = [UIColor blackColor];
        _nameLabel.text = @"--";
        _nameLabel.font = [UIFont boldSystemFontOfSize:13];
        _nameLabel.textAlignment = NSTextAlignmentLeft;
        _nameLabel.numberOfLines = 0;
        _nameLabel.lineBreakMode = NSLineBreakByWordWrapping;
    }
    return _nameLabel;
}

- (RXFeedbackAttributeLabel *)priLbl
{
    if (!_priLbl) {
        _priLbl = [[RXFeedbackAttributeLabel alloc] init];
        _priLbl.text = @"";
        _priLbl.textColor = [UIColor blackColor];
        _priLbl.backgroundColor = [UIColor clearColor];
        _priLbl.font = [UIFont systemFontOfSize:10];
        _priLbl.userInteractionEnabled = YES;
        _priLbl.breakMode = NSLineBreakByWordWrapping;
    }
    return _priLbl;
}

- (UILabel *)countLabel{
    if (!_countLabel) {
        _countLabel = [[UILabel alloc] init];
        _countLabel.backgroundColor = [UIColor clearColor];
        _countLabel.textColor = [UIColor blackColor];
        _countLabel.text = @"--";
        _countLabel.font = [UIFont systemFontOfSize:10 weight:UIFontWeightMedium];
        _countLabel.textAlignment = NSTextAlignmentLeft;
    }
    return _countLabel;
}

- (WKWebView *)webView{
    if (!_webView) {
        //以下代码适配屏幕宽度大小
       NSString *jScript = @"var meta = document.createElement('meta'); meta.setAttribute('name', 'viewport'); meta.setAttribute('content', 'width=100%'); document.getElementsByTagName('head')[0].appendChild(meta);";
       WKUserScript *wkUScript = [[WKUserScript alloc] initWithSource:jScript injectionTime:WKUserScriptInjectionTimeAtDocumentEnd forMainFrameOnly:YES];
       WKUserContentController *wkUController = [[WKUserContentController alloc] init];
       [wkUController addUserScript:wkUScript];
       
       WKWebViewConfiguration *wkWebConfig = [[WKWebViewConfiguration alloc] init];
       wkWebConfig.userContentController = wkUController;
        
        _webView = [[WKWebView alloc] initWithFrame:CGRectZero configuration:wkWebConfig];
        _webView.backgroundColor = [UIColor clearColor];
        _webView.opaque = NO;
        _webView.navigationDelegate = self;
        _webView.UIDelegate = self;
        _webView.hidden = NO;
    }
    return _webView;
}

- (UITextView *)textView{
    if (!_textView) {
        _textView = [[UITextView alloc] init];
        _textView.textColor = HexRGBAlpha(0x767676, 1.0);
        _textView.font = [UIFont systemFontOfSize:9];
        _textView.showsVerticalScrollIndicator = NO;
        _textView.showsHorizontalScrollIndicator = NO;
        _textView.editable = NO;
    }
    return _textView;
}

@end
