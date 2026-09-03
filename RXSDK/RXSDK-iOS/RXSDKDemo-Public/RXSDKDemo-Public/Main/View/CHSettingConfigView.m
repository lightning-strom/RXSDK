//
//  CHSettingConfigView.m
//  RXSDKDemo-Public
//
//  Created by 陈汉 on 2024/1/3.
//

#import "CHSettingConfigView.h"
#import "CHMarco.h"

@interface CHSettingConfigView ()

@property (nonatomic, strong) UIImageView *imgView;
@property (nonatomic, strong) UILabel *titleLbl;

@end

@implementation CHSettingConfigView

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
    [self sd_addSubviews:@[self.imgView, self.titleLbl, self.selectBtn, self.selectBtn1]];
    
    _imgView.sd_layout.topSpaceToView(self, 20)
    .leftSpaceToView(self, 20)
    .widthIs(48)
    .heightEqualToWidth();
    
    _titleLbl.sd_layout.topSpaceToView(self, 22)
    .leftSpaceToView(_imgView, 16)
    .widthIs(200)
    .heightIs(16);
    
    _selectBtn.sd_layout.topSpaceToView(_titleLbl, 10)
    .leftEqualToView(_titleLbl)
    .widthIs(150)
    .heightIs(22);
    
    _selectBtn1.sd_layout.topSpaceToView(_titleLbl, 10)
    .leftSpaceToView(_imgView, 145)
    .widthIs(150)
    .heightIs(22);
    
    [self selectBtnAction];
}

#pragma mark -- setModel
- (void)setModel:(CHSettingCellModel *)model
{
    _titleLbl.text = model.title;
    _imgView.image = kImageNamed(model.img);
    [_selectBtn setTitle:model.btntitle1 forState:UIControlStateNormal];
    [_selectBtn1 setTitle:model.btntitle2 forState:UIControlStateNormal];
}

#pragma mark -- actions
- (void)selectBtnAction
{
    _selectBtn.imageView.image = kImageNamed(@"select");
    _selectBtn1.imageView.image = kImageNamed(@"unSelect");
    
    if (_selectBlock) {
        _selectBlock(1);
    }
}

- (void)selectBtnAction1
{
    _selectBtn1.imageView.image = kImageNamed(@"select");
    _selectBtn.imageView.image = kImageNamed(@"unSelect");
    
    if (_selectBlock) {
        _selectBlock(2);
    }
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

- (CHSettingSelectBtn *)selectBtn
{
    if (!_selectBtn) {
        _selectBtn = [CHSettingSelectBtn buttonWithType:UIButtonTypeCustom];
        [_selectBtn setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
        _selectBtn.titleLabel.font = [UIFont systemFontOfSize:14];
//        [_selectBtn setImage:kImageNamed(@"select") forState:normal];
        _selectBtn.imageView.image = kImageNamed(@"unSelect");
        [_selectBtn addTarget:self action:@selector(selectBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _selectBtn;
}

- (CHSettingSelectBtn *)selectBtn1
{
    if (!_selectBtn1) {
        _selectBtn1 = [CHSettingSelectBtn buttonWithType:UIButtonTypeCustom];
        [_selectBtn1 setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
        _selectBtn1.titleLabel.font = [UIFont systemFontOfSize:14];
//        [_selectBtn1 setImage:kImageNamed(@"select") forState:normal];
        _selectBtn1.imageView.image = kImageNamed(@"unSelect");
        [_selectBtn1 addTarget:self action:@selector(selectBtnAction1) forControlEvents:UIControlEventTouchUpInside];
    }
    return _selectBtn1;
}

@end
