//
//  CHSelectLanguageView.m
//  RXSDKDemo-Public
//
//  Created by 陈汉 on 2024/1/2.
//

#import "CHSelectLanguageView.h"
#import "CHMarco.h"
#import "CHSelectBtn.h"
#import <BRPickerView.h>

@interface CHSelectLanguageView ()

@property (nonatomic, strong) CHSelectBtn *selectBtn;

@end

@implementation CHSelectLanguageView

- (instancetype)init
{
    self = [super init];
    if (self) {
        [self setUI];
    }
    return self;
}

#pragma mark -- setUI
- (void)setUI
{
    UIView *bgView = [[UIView alloc] init];
    bgView.backgroundColor = [UIColor whiteColor];
    bgView.layer.cornerRadius = 15;
    
    UIImageView *imgView = [[UIImageView alloc] init];
    imgView.image = kImageNamed(@"setting_language");
    
    UILabel *titleLbl = [[UILabel alloc] init];
    titleLbl.text = @"选择语言";
    titleLbl.font = [UIFont boldSystemFontOfSize:15];
    titleLbl.textColor = [UIColor blackColor];
    
    self.selectBtn = [CHSelectBtn buttonWithType:UIButtonTypeCustom];
    [self.selectBtn setTitle:@"简体中文" forState:UIControlStateNormal];
    [self.selectBtn setImage:kImageNamed(@"rightIcon") forState:UIControlStateNormal];
    [self.selectBtn setTitleColor:[UIColor colorWithHexString:@"#AAA8AF"] forState:UIControlStateNormal];
    self.selectBtn.titleLabel.font = [UIFont systemFontOfSize:15];
    [self.selectBtn addTarget:self action:@selector(createPickerView) forControlEvents:UIControlEventTouchUpInside];
    
    [self addSubview:bgView];
    [bgView sd_addSubviews:@[imgView, titleLbl, self.selectBtn]];
    
    bgView.sd_layout.topSpaceToView(self, 0)
    .leftSpaceToView(self, 24)
    .rightSpaceToView(self, 24)
    .heightIs(64);
    
    imgView.sd_layout.topSpaceToView(bgView, 19)
    .leftSpaceToView(bgView, 20)
    .widthIs(26)
    .heightEqualToWidth();
    
    titleLbl.sd_layout.topSpaceToView(bgView, 0)
    .bottomSpaceToView(bgView, 0)
    .leftSpaceToView(imgView, 6)
    .widthIs(100);
    
    self.selectBtn.sd_layout.topSpaceToView(bgView, 25)
    .rightSpaceToView(bgView, 25)
    .bottomSpaceToView(bgView, 25)
    .widthIs(150);
}

- (void)createPickerView
{
    if (![CHUtility sharedManager].isOS) {
        [RXHUD showText:@"国内版仅支持中文"];
        return;
    }
    
    // 1.单列字符串选择器（传字符串数组）
    BRStringPickerView *stringPickerView = [[BRStringPickerView alloc] init];
    stringPickerView.pickerMode = BRStringPickerComponentSingle;
    stringPickerView.title = @"";
    stringPickerView.dataSourceArr = @[@"简体中文", @"繁体中文", @"英语", @"日语", @"印尼语", @"菲律宾语", @"泰语", @"越南语",@"阿拉伯语"];
    stringPickerView.selectIndex = 0;
    
    __weak __typeof(self)weakSelf = self;
    stringPickerView.resultModelBlock = ^(BRResultModel *resultModel) {
        NSLog(@"选择的值：%@", resultModel.value);
        [weakSelf.selectBtn setTitle:resultModel.value forState:UIControlStateNormal];
        [CHUtility sharedManager].language = [[Tool sharedSDK] getLanguage:resultModel.value];
    };

    [stringPickerView show];

//    // 设置选择器中间选中行的样式
//    BRPickerStyle *customStyle = [[BRPickerStyle alloc] init];
//    customStyle.selectRowTextFont = [UIFont boldSystemFontOfSize:20.0f];
//    customStyle.selectRowTextColor = [UIColor colorWithHexString:@"#171A1D"];
//    // 标题栏高度
//    customStyle.titleBarHeight = 52;
//    customStyle.cancelBtnImage = kImageNamed(@"picker_close");
//    customStyle.cancelBtnTitle = @"3333";
//    stringPickerView.pickerStyle = customStyle;
//
//    [stringPickerView show];
}

@end
