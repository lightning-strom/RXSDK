//
//  RXOpenUrlViewController.m
//  RXSDKDemo-Public
//
//  Created by root11 on 2024/7/31.
//

#import "RXOpenUrlViewController.h"
#import "CHMarco.h"

@interface RXOpenUrlViewController ()

@property (nonatomic, strong) UILabel *titleLabel1;
@property (nonatomic, strong) UILabel *titleLabel2;
@property (nonatomic, strong) UILabel *titleLabel3;
@property (nonatomic, strong) UILabel *titleLabel4;
@property (nonatomic, strong) UITextView *textView1;
@property (nonatomic, strong) UITextView *textView2;
@property (nonatomic, strong) UITextView *textView3;
@property (nonatomic, strong) UITextView *textView4;
@end

@implementation RXOpenUrlViewController

- (void)viewWillDisappear:(BOOL)animated{
    [super viewWillDisappear:animated];
    self.navigationController.navigationBar.hidden = YES;
}

- (void)viewWillAppear:(BOOL)animated{
    [super viewDidAppear:animated];
    self.navigationController.navigationBar.hidden = NO;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.navigationController.navigationBar.tintColor = [UIColor blackColor];
    self.title = @"记录url参数";
    self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"back_black"] style:UIBarButtonItemStylePlain target:self action:@selector(backClick)];
    self.view.backgroundColor = [UIColor whiteColor];
    
    [self setUI];
    [self setData];
}

- (void)setUI{
    [self.view sd_addSubviews:@[self.titleLabel1, self.titleLabel2, self.titleLabel3, self.titleLabel4, self.textView1, self.textView2, self.textView3, self.textView4]];
    
    _titleLabel1.sd_layout.topSpaceToView(self.view, 88)
        .leftEqualToView(self.view)
        .rightEqualToView(self.view)
        .heightIs(30);
    _textView1.sd_layout.topSpaceToView(_titleLabel1, 10)
        .leftEqualToView(self.view)
        .rightEqualToView(self.view)
        .heightIs(60);
    _titleLabel2.sd_layout.topSpaceToView(_textView1, 10)
        .leftEqualToView(self.view)
        .rightEqualToView(self.view)
        .heightIs(30);
    _textView2.sd_layout.topSpaceToView(_titleLabel2, 10)
        .leftEqualToView(self.view)
        .rightEqualToView(self.view)
        .heightIs(60);
    _titleLabel3.sd_layout.topSpaceToView(_textView2, 10)
        .leftEqualToView(self.view)
        .rightEqualToView(self.view)
        .heightIs(30);
    _textView3.sd_layout.topSpaceToView(_titleLabel3, 10)
        .leftEqualToView(self.view)
        .rightEqualToView(self.view)
        .heightIs(60);
    _titleLabel4.sd_layout.topSpaceToView(_textView3, 10)
        .leftEqualToView(self.view)
        .rightEqualToView(self.view)
        .heightIs(30);
    _textView4.sd_layout.topSpaceToView(_titleLabel4, 10)
        .leftEqualToView(self.view)
        .rightEqualToView(self.view)
        .heightIs(60);
}

- (void)setData{
    NSString *text1 = [[NSUserDefaults standardUserDefaults] objectForKey:@"openURLurl"];
    _textView1.text = text1;
    NSString *text2  = [[NSUserDefaults standardUserDefaults] objectForKey:@"openURLbolturl"];
    _textView2.text = text2;
    NSString *text3 = [[NSUserDefaults standardUserDefaults] objectForKey:@"finishURL"];
    _textView3.text = text3;
    NSString *text4 = [[NSUserDefaults standardUserDefaults] objectForKey:@"finishbolturl"];
    _textView4.text = text4;
}
#pragma mark - action
- (void)backClick{
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
    [self.textView1 endEditing:YES];
    [self.textView2 endEditing:YES];
    [self.textView3 endEditing:YES];
    [self.textView4 endEditing:YES];
}

#pragma mark - lazy load
- (UILabel *)titleLabel1{
    if (!_titleLabel1) {
        _titleLabel1 = [[UILabel alloc] init];
        _titleLabel1.text = @"跳转打开scheme记录";
        _titleLabel1.font = [UIFont systemFontOfSize:12];
        _titleLabel1.backgroundColor = [UIColor blueColor];
        _titleLabel1.textColor = [UIColor whiteColor];
    }
    return _titleLabel1;
}

- (UILabel *)titleLabel2{
    if (!_titleLabel2) {
        _titleLabel2 = [[UILabel alloc] init];
        _titleLabel2.text = @"跳转bolts记录";
        _titleLabel2.font = [UIFont systemFontOfSize:12];
        _titleLabel2.backgroundColor = [UIColor blueColor];
        _titleLabel2.textColor = [UIColor whiteColor];
    }
    return _titleLabel2;
}

- (UILabel *)titleLabel3{
    if (!_titleLabel3) {
        _titleLabel3 = [[UILabel alloc] init];
        _titleLabel3.text = @"应用启动scheme记录";
        _titleLabel3.font = [UIFont systemFontOfSize:12];
        _titleLabel3.backgroundColor = [UIColor blueColor];
        _titleLabel3.textColor = [UIColor whiteColor];
    }
    return _titleLabel3;
}

- (UILabel *)titleLabel4{
    if (!_titleLabel4) {
        _titleLabel4 = [[UILabel alloc] init];
        _titleLabel4.text = @"应用启动bolts记录";
        _titleLabel4.font = [UIFont systemFontOfSize:12];
        _titleLabel4.backgroundColor = [UIColor blueColor];
        _titleLabel4.textColor = [UIColor whiteColor];
    }
    return _titleLabel4;
}

- (UITextView *)textView1{
    if (!_textView1) {
        _textView1 = [[UITextView alloc] initWithFrame:CGRectZero];
//        _textView1.textContainerInset = UIEdgeInsetsMake(8, 8, 8, 8);
        _textView1.editable = YES;
        _textView1.dataDetectorTypes = UIDataDetectorTypeAll;
        _textView1.scrollEnabled = YES;
        _textView1.scrollsToTop = YES;
        _textView1.userInteractionEnabled = YES;
        _textView1.textColor = [UIColor whiteColor];
        _textView1.backgroundColor = [UIColor redColor];
    }
    return _textView1;
}

- (UITextView *)textView2{
    if (!_textView2) {
        _textView2 = [[UITextView alloc] initWithFrame:CGRectZero];
//        _textView2.textContainerInset = UIEdgeInsetsMake(8, 8, 8, 8);
        _textView2.editable = YES;
        _textView2.dataDetectorTypes = UIDataDetectorTypeAll;
        _textView2.scrollEnabled = YES;
        _textView2.scrollsToTop = YES;
        _textView2.userInteractionEnabled = YES;
        _textView2.textColor = [UIColor whiteColor];
        _textView2.backgroundColor = [UIColor redColor];
    }
    return _textView2;
}

- (UITextView *)textView3{
    if (!_textView3) {
        _textView3 = [[UITextView alloc] initWithFrame:CGRectZero];
//        _textView3.textContainerInset = UIEdgeInsetsMake(8, 8, 8, 8);
        _textView3.editable = YES;
        _textView3.dataDetectorTypes = UIDataDetectorTypeAll;
        _textView3.scrollEnabled = YES;
        _textView3.scrollsToTop = YES;
        _textView3.userInteractionEnabled = YES;
        _textView3.textColor = [UIColor whiteColor];
        _textView3.backgroundColor = [UIColor redColor];
    }
    return _textView3;
}

- (UITextView *)textView4{
    if (!_textView4) {
        _textView4 = [[UITextView alloc] initWithFrame:CGRectZero];
//        _textView4.textContainerInset = UIEdgeInsetsMake(8, 8, 8, 8);
        _textView4.editable = YES;
        _textView4.dataDetectorTypes = UIDataDetectorTypeAll;
        _textView4.scrollEnabled = YES;
        _textView4.scrollsToTop = YES;
        _textView4.userInteractionEnabled = YES;
        _textView4.textColor = [UIColor whiteColor];
        _textView4.backgroundColor = [UIColor redColor];
    }
    return _textView4;
}

@end
