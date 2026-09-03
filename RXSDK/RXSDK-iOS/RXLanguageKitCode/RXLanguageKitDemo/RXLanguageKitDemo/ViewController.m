//
//  ViewController.m
//  RXLanguageKitDemo
//
//  Created by 陈汉 on 2023/7/20.
//

#import "ViewController.h"
#import <RXLanguageKit/RXLanguageKit.h>

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    NSString *text = [RXLanguageService getTestWithLanguage:@"tw" text:@"@123123"];
    NSLog(@"text:%@",text);
}


@end
