//
//  RXPlayerFeedbackListViewCell.m
//  RXUIKit-OS
//
//  Created by root11 on 2024/7/23.
//

#import "RXPlayerFeedbackListViewCell.h"
#import "RXFeedbackTool.h"

@implementation RXPlayerFeedbackListViewCell

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier {
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        [self setupSubviews];
    }
    return self;
}

- (void)setupSubviews {
    [self.contentView addSubview:self.titleLabel];
    [self.contentView addSubview:self.timeLabel];
    [self.contentView addSubview:self.statusLabel];
    [self.contentView addSubview:self.lineView];
    
    if (RXAC) {
        if ([RXFeedbackTool isRTL]) {
            self.timeLabel.frame = CGRectMake(14, 0, RXUScaleWidth(110), RXUScaleWidth(35));
            self.statusLabel.frame = CGRectMake(CGRectGetMaxX(self.timeLabel.frame), 0, RXUScaleWidth(76), RXUScaleWidth(35));
            self.titleLabel.textAlignment = NSTextAlignmentRight;
            self.titleLabel.frame = CGRectMake(CGRectGetMaxX(self.statusLabel.frame), 0, RXUScaleWidth(300), RXUScaleWidth(35));
        }else{
            self.titleLabel.textAlignment = NSTextAlignmentLeft;
            self.titleLabel.frame = CGRectMake(14, 0, RXUScaleWidth(300), RXUScaleWidth(35));
            self.statusLabel.frame = CGRectMake(CGRectGetMaxX(self.titleLabel.frame), 0, RXUScaleWidth(76), RXUScaleWidth(35));
            self.timeLabel.frame = CGRectMake(CGRectGetMaxX(self.statusLabel.frame), 0, RXUScaleWidth(110), RXUScaleWidth(35));
        }

        self.lineView.frame = CGRectMake(14, RXUScaleWidth(35), RXUScaleWidth(531) - 24 - 28, 1);
    }else{//竖屏
        if ([RXFeedbackTool isRTL]) {
            self.timeLabel.frame = CGRectMake(4, 0, RXUScaleWidth(80), RXUScaleWidth(35));
            self.statusLabel.frame = CGRectMake(CGRectGetMaxX(self.timeLabel.frame) + 5, 0, RXUScaleWidth(70), RXUScaleWidth(35));
            self.titleLabel.textAlignment = NSTextAlignmentRight;
            self.titleLabel.frame = CGRectMake(CGRectGetMaxX(self.statusLabel.frame), 0, RXUScaleWidth(120), RXUScaleWidth(35));
            
        }else{
            self.titleLabel.textAlignment = NSTextAlignmentLeft;
            self.titleLabel.frame = CGRectMake(4, 0, RXUScaleWidth(120), RXUScaleWidth(35));
            self.statusLabel.frame = CGRectMake(CGRectGetMaxX(self.titleLabel.frame), 0, RXUScaleWidth(70), RXUScaleWidth(35));
            self.timeLabel.frame = CGRectMake(CGRectGetMaxX(self.statusLabel.frame) + 5, 0, RXUScaleWidth(80), RXUScaleWidth(36));
        }

        self.lineView.frame = CGRectMake(4, RXUScaleWidth(35), (RXUScaleWidth(313) - 20) - 8, 1);
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
- (UILabel *)titleLabel{
    if (!_titleLabel) {
        _titleLabel = [[UILabel alloc] init];
        _titleLabel.font = [UIFont boldSystemFontOfSize:RXUScaleWidth(12)];
        _titleLabel.textColor = HexRGBAlpha(0x444444, 1.0);
        _titleLabel.backgroundColor = [UIColor clearColor];
        _titleLabel.lineBreakMode = NSLineBreakByTruncatingTail;
        _titleLabel.textAlignment = NSTextAlignmentLeft;
    }
    return _titleLabel;
}

- (UILabel *)statusLabel{
    if (!_statusLabel) {
        _statusLabel = [[UILabel alloc] init];
        _statusLabel.font = [UIFont boldSystemFontOfSize:RXUScaleWidth(12)];
        _statusLabel.textColor = [UIColor blackColor];
        _statusLabel.backgroundColor = [UIColor clearColor];
        _statusLabel.lineBreakMode = NSLineBreakByWordWrapping;
        _statusLabel.textAlignment = NSTextAlignmentCenter;
        _statusLabel.numberOfLines = 0;
        
    }
    return _statusLabel;
}

- (UILabel *)timeLabel{
    if (!_timeLabel) {
        _timeLabel = [[UILabel alloc] init];
        _timeLabel.translatesAutoresizingMaskIntoConstraints = NO;
        _timeLabel.font = [UIFont boldSystemFontOfSize:RXUScaleWidth(10)];
        _timeLabel.textColor = [UIColor blackColor];
        _timeLabel.backgroundColor = [UIColor clearColor];
        _timeLabel.textAlignment = NSTextAlignmentCenter;
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
