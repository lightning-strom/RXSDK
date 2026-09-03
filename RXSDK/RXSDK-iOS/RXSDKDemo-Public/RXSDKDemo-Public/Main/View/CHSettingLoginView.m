//
//  CHSettingLoginView.m
//  RXSDKDemo-Public
//
//  Created by 陈汉 on 2024/1/3.
//

#import "CHSettingLoginView.h"
#import "CHMarco.h"
#import "CHSelectLoginBtn.h"

@interface CHSettingLoginView ()

@property (nonatomic, strong) UIImageView *imgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) CHSelectLoginBtn *selectBtn;

@end

@implementation CHSettingLoginView

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
    [self sd_addSubviews:@[self.imgView, self.titleLbl, self.selectBtn]];
    
    _imgView.sd_layout.topSpaceToView(self, 16)
    .leftSpaceToView(self, 20)
    .widthIs(22)
    .heightEqualToWidth();
    
    _titleLbl.sd_layout.topSpaceToView(self, 0)
    .leftSpaceToView(_imgView, 14)
    .bottomSpaceToView(self, 0)
    .widthIs(150);
    
    _selectBtn.sd_layout.topSpaceToView(self, 9)
    .rightSpaceToView(self, 14)
    .widthIs(36)
    .heightEqualToWidth();
}

#pragma mark -- actions
- (void)selectBtnAction:(UIButton *)btn
{
    btn.selected = !btn.selected;
    if (btn.selected) {
        _selectBtn.imageView.image = kImageNamed(@"setting_select");
    } else {
        _selectBtn.imageView.image = kImageNamed(@"setting_unSelect");
    }
    
    if (self.selectBlock) {
        self.selectBlock(btn.selected);
    }
}

#pragma mark -- setModel
- (void)setModel:(CHSettingCellModel *)model
{
    _imgView.image = kImageNamed(model.img);
    _titleLbl.text = model.title;
}

#pragma mark -- lazy
- (UIImageView *)imgView
{
    if (!_imgView) {
        _imgView = [[UIImageView alloc] init];
    }
    return _imgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.font = [UIFont boldSystemFontOfSize:15];
    }
    return _titleLbl;
}

- (CHSelectLoginBtn *)selectBtn
{
    if (!_selectBtn) {
        _selectBtn = [CHSelectLoginBtn buttonWithType:UIButtonTypeCustom];
        _selectBtn.imageView.image = kImageNamed(@"setting_unSelect");
        [_selectBtn addTarget:self action:@selector(selectBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _selectBtn;
}

@end
