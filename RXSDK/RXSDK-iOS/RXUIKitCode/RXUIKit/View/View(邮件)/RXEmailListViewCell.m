//
//  RXEmailListViewCell.m
//  RXUIKit-OS
//
//  Created by root11 on 2024/7/23.
//

#import "RXEmailListViewCell.h"
#import "RXUICommonTool.h"

@implementation RXEmailListViewCell

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier {
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        [self setupSubviews];
    }
    return self;
}

- (void)setupSubviews {
    [self.contentView addSubview:self.customImageView];
    [self.contentView addSubview:self.titleLabel];
    [self.contentView addSubview:self.timeLabel];
    [self.contentView addSubview:self.lineView];
    
    if (RXAC) {
        self.customImageView.frame = CGRectMake(14, RXUScaleWidth(11), RXUScaleWidth(16), RXUScaleWidth(14));
        
        self.titleLabel.frame = CGRectMake(14 + RXUScaleWidth(16)  + 12, 0, ( RXUScaleWidth(531) - 24 - 28 - RXUScaleWidth(16) - 24 - RXUScaleWidth(100)), RXUScaleWidth(36));
        
        self.timeLabel.textAlignment = NSTextAlignmentRight;
        self.timeLabel.frame = CGRectMake(RXUScaleWidth(531) - 24 - 14 - RXUScaleWidth(100), 0, RXUScaleWidth(100), RXUScaleWidth(36));

        self.lineView.frame = CGRectMake(14, RXUScaleWidth(35), RXUScaleWidth(531) - 24 - 28, 1);
    }else{//竖屏
        self.customImageView.frame = CGRectMake(10, RXUScaleWidth(11), RXUScaleWidth(16), RXUScaleWidth(14));
        
        self.titleLabel.frame = CGRectMake(CGRectGetMaxX(self.customImageView.frame) + 8, 0, ((RXUScaleWidth(313) - 20) - 20 - 16 - RXUScaleWidth(16) - RXUScaleWidth(100)), RXUScaleWidth(36));
        
        self.timeLabel.textAlignment = NSTextAlignmentRight;
        self.timeLabel.frame = CGRectMake((RXUScaleWidth(313) - 20) - 10 - RXUScaleWidth(100), 0, RXUScaleWidth(100), RXUScaleWidth(36));

        self.lineView.frame = CGRectMake(5, RXUScaleWidth(35), (RXUScaleWidth(313) - 20) - 10, 1);
    }
}

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

#pragma mark - lazy load
- (UIImageView *)customImageView{
    if (!_customImageView) {
        _customImageView = [[UIImageView alloc] init];
        _customImageView.translatesAutoresizingMaskIntoConstraints = NO;
        _customImageView.contentMode = UIViewContentModeScaleAspectFit;
        _customImageView.backgroundColor = [UIColor clearColor];
        _customImageView.image = [UIImage rxBundleImageNamed:@"rx_mailUnRead"];
    }
    return _customImageView;
}

- (UILabel *)titleLabel{
    if (!_titleLabel) {
        _titleLabel = [[UILabel alloc] init];
        _titleLabel.font = [UIFont boldSystemFontOfSize:RXUScaleWidth(14)];
        _titleLabel.textColor = [UIColor blackColor];
        _titleLabel.backgroundColor = [UIColor clearColor];
        _titleLabel.lineBreakMode = NSLineBreakByTruncatingTail;
        _titleLabel.textAlignment = NSTextAlignmentLeft;
    }
    return _titleLabel;
}

- (UILabel *)timeLabel{
    if (!_timeLabel) {
        _timeLabel = [[UILabel alloc] init];
        _timeLabel.translatesAutoresizingMaskIntoConstraints = NO;
        _timeLabel.font = [UIFont boldSystemFontOfSize:RXUScaleWidth(12)];
        _timeLabel.textColor = [UIColor blackColor];
        _timeLabel.backgroundColor = [UIColor clearColor];
        _timeLabel.textAlignment = NSTextAlignmentRight;
    }
    return _timeLabel;
}

- (UIView *)lineView{
    if (!_lineView) {
        _lineView = [[UIView alloc] init];
        _lineView.backgroundColor = HexRGBAlpha(0xEEEEEE, 1);
    }
    return _lineView;
}

@end
