//
//  TestWebView.h
//  RXUIKitDemo
//
//  Created by 陈汉 on 2025/1/20.
//

#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface TestWebView : UIView

- (instancetype)initWithUrl:(NSString *)url
                      title:(NSString *)title
                    content:(NSString *)content;

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UIButton *closeBtn;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, strong) NSString *titleStr; // 标题
@property (nonatomic, strong) WKWebView *webView;
@property (nonatomic, strong) NSString *url;
@property (nonatomic, strong) NSString *content;
@property (nonatomic, strong) NSString *title;
@property (nonatomic, strong) UIView *line;

@end

NS_ASSUME_NONNULL_END
