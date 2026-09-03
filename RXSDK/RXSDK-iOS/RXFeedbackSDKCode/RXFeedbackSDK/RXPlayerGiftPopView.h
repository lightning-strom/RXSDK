//
//  RXPlayerGiftPopView.h
//  RXUIKit-OS
//
//  Created by root11 on 2024/7/24.
//

#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXPlayerGiftPopView : UIView

@property (nonatomic, strong) UIImageView *imageView;
@property (nonatomic, strong) UILabel *nameLabel;
@property (nonatomic, strong) UILabel *countLabel;
@property (nonatomic, strong) WKWebView *webView;

- (void)setPopViewDic:(NSDictionary *)dic;

//意见反馈使用的赋值
- (void)setPopViewWithInfo:(NSDictionary *)dic;
@end

NS_ASSUME_NONNULL_END
