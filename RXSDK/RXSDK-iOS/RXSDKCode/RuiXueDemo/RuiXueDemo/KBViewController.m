//
//  KBViewController.m
//  RuiXueDemo
//
//  Created by 陈汉 on 2025/5/26.
//

#import "KBViewController.h"
#import <RXSDK_Pure/RXSDK_Pure.h>

@interface KBViewController () <RXKeyboardPanelDelegate>

@property (nonatomic, strong) RXKeyboardPanel *keyboardPanel;

@end

@implementation KBViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    // 点击按钮弹出
    UIButton *showBtn = [UIButton buttonWithType:UIButtonTypeSystem];
    showBtn.frame = CGRectMake(100, 100, 120, 44);
    [showBtn setTitle:@"弹出键盘" forState:UIControlStateNormal];
    [showBtn addTarget:self action:@selector(showKeyboardPanel) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:showBtn];
}

- (void)showKeyboardPanel {
    if (!self.keyboardPanel) {
        self.keyboardPanel = [[RXKeyboardPanel alloc] initWithKeyboardStyle:RXKeyboardStyleDefault];
    }
    
    self.keyboardPanel.defaultText = @"123123";
    self.keyboardPanel.animationDuration = 0.25;
    [self.keyboardPanel showInView:self.view];
}

// 隐藏键盘
- (void)keyboardHide
{
    [self.keyboardPanel hide];
}

#pragma mark -- <RXKeyboardPanelDelegate>
- (void)rxKeyboardPanelDidShow
{
    NSLog(@"键盘弹出");
}

- (void)rxKeyboardPanelDidHide
{
    NSLog(@"键盘隐藏");
}

- (void)rxKeyboardPanelDidInput:(NSString *)input
{
    NSLog(@"输入内容：%@", input);
}

- (void)rxKeyboardPanelDidDelete
{
    NSLog(@"删除内容");
}

- (void)rxKeyboardPanelDidFinish:(NSString *)result
{
    NSLog(@"完成内容：%@", result);
}



@end
