//
//  RXAttributeLabel.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/1/29.
//

#import "RXAttributeLabel.h"
#import "RXUICommonTool.h"

@interface RXAttributeLabel () <UITextViewDelegate>

@property (nonatomic, strong) UITextView *textView;
@property (nonatomic, strong) NSMutableAttributedString *attributedString;

@end

@implementation RXAttributeLabel

- (instancetype)init
{
    self = [super init];
    if (self) {
        [self setUI];
    }
    return self;
}

- (void)setUI
{
    [self addSubview:self.textView];
}

- (void)layoutSubviews
{
    self.textView.frame = CGRectMake(0, 0, CGRectGetWidth(self.frame), CGRectGetHeight(self.frame) + 5);
    [super layoutSubviews];
}

- (void)setText:(NSString *)text
{
//    self.textView.text = text;
    self.attributedString = [[NSMutableAttributedString alloc] initWithString:text];
}

- (void)setClickTextlist:(NSArray *)clickTextlist
{
//    NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc] initWithString:self.text];
    
    // 给需要点击的部分添加关键字
    for (int i = 0; i < clickTextlist.count; i++) {
        NSString *clickStr = clickTextlist[i];
        [self.attributedString addAttribute:NSLinkAttributeName value:clickStr range:[[self.attributedString string] rangeOfString:clickStr]];
//        CGFloat size = RXAC ? 13 : (clickTextlist.count >= 3 ? 10 : 13);
        CGFloat size = RXAC ? 14 : 14;
        [self.attributedString addAttribute:NSFontAttributeName value:[UIFont systemFontOfSize:size weight:UIFontWeightRegular] range:NSMakeRange(0, self.attributedString.length)];
    }
    self.textView.attributedText = self.attributedString;
}

- (void)setClickText:(NSArray *)clickTextlist withFont:(UIFont *)font textAlignment:(NSTextAlignment)textAlignment{
    for (int i = 0; i < clickTextlist.count; i++) {
        NSString *clickStr = clickTextlist[i];
        [self.attributedString addAttribute:NSLinkAttributeName value:clickStr range:[[self.attributedString string] rangeOfString:clickStr]];
        [self.attributedString addAttribute:NSFontAttributeName value:font range:NSMakeRange(0, self.attributedString.length)];
        NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];
        paragraphStyle.alignment = textAlignment;
        [self.attributedString addAttribute:NSParagraphStyleAttributeName value:paragraphStyle range:NSMakeRange(0, self.attributedString.length)];
    }
    self.textView.attributedText = self.attributedString;
}

- (void)setVerticalCenter:(BOOL)verticalCenter{
    _verticalCenter = verticalCenter;
    if (self.verticalCenter) {
        CGFloat verticalInset = (self.textView.bounds.size.height - [self.textView.text heightForFont:self.textView.font width:self.textView.bounds.size.width]) / 2.0;
        if (verticalInset >= 0) {
            self.textView.textContainerInset = UIEdgeInsetsMake(verticalInset, -4, verticalInset, 0);
        }else{
            self.textView.textContainerInset = UIEdgeInsetsMake(0, -4, 0, 0);
        }
    }else{
        self.textView.textContainerInset = UIEdgeInsetsMake(0, -4, 0, 0);
    }
}

- (void)setClickTextColor:(NSArray *)clickTextColor
{
    //给需要点击的部分添加颜色
    self.textView.linkTextAttributes = @{NSForegroundColorAttributeName:clickTextColor};

    UITapGestureRecognizer *textTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(addGestureRecognizer:)];

    [self.textView addGestureRecognizer:textTap];
}

- (void)setFont:(UIFont *)font
{
    self.textView.font = font;
}

- (void)setTextColor:(UIColor *)textColor
{
    self.textView.textColor = textColor;
}

- (void)setBreakMode:(NSLineBreakMode)breakMode{
    self.textView.textContainer.lineBreakMode = breakMode;
}

- (void)setTextAlignment:(NSTextAlignment)textAlignment{
    self.textView.textAlignment = textAlignment;
}

- (void)setTextInsets:(UIEdgeInsets)textInsets{
    self.textView.textContainerInset = textInsets;
}

#pragma mark -- textVeiw 手势
- (void)addGestureRecognizer:(UITapGestureRecognizer *)gestureRecognizer
{
    if([gestureRecognizer isKindOfClass:[UITapGestureRecognizer class]]) {

        CGPoint topLocation = [gestureRecognizer locationInView:self.textView];

        UITextPosition *textPosition = [self.textView closestPositionToPoint:topLocation];

        UITextRange *textRange = [self.textView textRangeFromPosition:textPosition toPosition:nil];
         
        NSInteger offset = [self.textView offsetFromPosition:textRange.end toPosition:self.textView.endOfDocument];
        NSInteger offset1 = [self.textView offsetFromPosition:nil toPosition:self.textView.endOfDocument];
        
        NSInteger off = offset1 - offset;
        
        NSDictionary *attributes = [self.textView textStylingAtPosition:textPosition inDirection:UITextStorageDirectionBackward];

        NSURL *url = attributes[NSLinkAttributeName];

        if (url) {
            [self.delegate rxAttributeClick:(NSString *)url offset:off];
        } else {
            [self.delegate rxAttributeClick:(NSString *)@"" offset:off];
        }
    }
}

- (void)textViews:(UITextView *)textView shouldInteractWithURL:(NSURL *)url inRange:(NSRange)characterRange{
    if ([(NSString*)url isEqualToString:@"click"]) {

        NSLog(@"点击的是 用户协议");

    } else if ([(NSString*)url isEqualToString:@"secondmanager"]) {

        NSLog(@"点击的是 隐私政策");
    }
}

- (UITextView *)textView
{
    if (!_textView) {
        _textView = [[UITextView alloc] initWithFrame:self.frame];
        _textView.backgroundColor = [UIColor clearColor];
        _textView.editable = NO;
        _textView.delegate = self;
        _textView.scrollEnabled = NO;
        _textView.selectable = NO;
    }
    return _textView;
}

@end
