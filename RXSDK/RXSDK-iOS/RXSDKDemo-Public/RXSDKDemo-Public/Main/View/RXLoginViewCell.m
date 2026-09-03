//
//  RXLoginViewCell.m
//  RXSDKDemo-Public
//
//  Created by root11 on 2024/5/21.
//

#import "RXLoginViewCell.h"
#import "CHMarco.h"

@interface RXLoginViewCell ()

@property (nonatomic, strong) UIImageView *customImageView;
@property (nonatomic, strong) UILabel *customLabel;

@end

@implementation RXLoginViewCell

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier {
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        [self setupUI];
    }
    return self;
}

- (void)setupUI{
    self.customImageView = [[UIImageView alloc] init];
    [self.contentView addSubview:self.customImageView];
    
    self.customLabel = [[UILabel alloc] init];
    self.customLabel.textAlignment = NSTextAlignmentLeft;
    [self.contentView addSubview:self.customLabel];
}

- (void)layoutSubviews{
    self.customImageView.sd_layout
        .leftSpaceToView(self.contentView, 10)
        .centerYEqualToView(self.contentView)
        .widthIs(40)
        .heightIs(40);
    
    self.customLabel.sd_layout
        .leftSpaceToView(self.customImageView, 10)
        .rightSpaceToView(self.contentView, 10)
        .centerYEqualToView(self.contentView)
        .heightRatioToView(self.contentView, 0.6);
    
    [self setupAutoHeightWithBottomView:self.customImageView bottomMargin:10];
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];
}

- (void)setModel:(CHSettingCellModel *)model{
    self.customImageView.image = kImageNamed(model.img);
    self.customImageView.contentMode = UIViewContentModeScaleAspectFill;
    self.customLabel.text = model.title;
}

@end
