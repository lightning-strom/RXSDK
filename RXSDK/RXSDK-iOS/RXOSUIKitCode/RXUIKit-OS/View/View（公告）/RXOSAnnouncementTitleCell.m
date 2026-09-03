//
//  RXOSAnnouncementTitleCell.m
//  RXUIKit-OS
//
//  Created by root11 on 2024/9/5.
//

#import "RXOSAnnouncementTitleCell.h"
#import "RXOSCommonTool.h"
#import "RXOSAnnouncementTitleLabel.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
@interface RXOSAnnouncementTitleCell ()

@property (nonatomic, strong) UIView *topView;
@property (nonatomic, strong) RXOSAnnouncementTitleLabel *titleLabel;
@property (nonatomic, strong) UIView *badgeView;
@property (nonatomic, strong) UIView *lineView;

@end

@implementation RXOSAnnouncementTitleCell

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier {
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        [self setupSubviews];
    }
    return self;
}

- (void)setupSubviews{
    [self.contentView addSubview:self.topView];
    [self.topView addSubview:self.titleLabel];
    [self.topView addSubview:self.badgeView];
    [self.contentView addSubview:self.lineView];
    
}

- (void)layoutSubviews{
    CGFloat cellWidth = 0;
    if (RXAC) {
        cellWidth = RXUScaleWidth(112);
    }else{
        cellWidth = RXUScaleWidth(94);
    }
    self.topView.frame = CGRectMake(0, 0, cellWidth, self.contentView.bounds.size.height - 4);
    self.titleLabel.frame = CGRectMake(9, 4, cellWidth - 18, self.topView.bounds.size.height - 4);
    self.lineView.frame = CGRectMake(0, self.bounds.size.height - 4, cellWidth, 0);
    
    if (RXOSCommonTool.isRTL) {
        self.badgeView.frame = CGRectMake(0, 0, RXUScaleWidth(8), RXUScaleWidth(8));
    }else{
        self.badgeView.frame = CGRectMake(cellWidth - RXUScaleWidth(8), 0, RXUScaleWidth(8), RXUScaleWidth(8));
    }
}



- (void)setDictionary:(NSDictionary *)dictionary{
    self.titleLabel.text = dictionary[@"title"];
    if ([dictionary[@"isClick"] isEqualToString:@"yes"]) {
        self.titleLabel.textColor = HexRGBAlpha(0x20C0B3, 1.0);
        self.topView.backgroundColor = HexRGBAlpha(0xEDFDFC, 1.0);
    }else{
        self.titleLabel.textColor = HexRGBAlpha(0x8B8B8B, 1.0);
        self.topView.backgroundColor = HexRGBAlpha(0xF8F8F8, 1.0);
    }
    NSMutableDictionary *mDic = [NSMutableDictionary dictionaryWithDictionary:[[RXApiService sharedSDK] getLocalAnnouncementReadList]];
    NSString *annouceID = [dictionary[@"id"] stringValue];
    if ([mDic[annouceID] boolValue]) {
        self.badgeView.hidden = YES;
    }else{
        self.badgeView.hidden = NO;
    }
    
}

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];
}

#pragma mark - lazy load
- (UIView *)topView{
    if (!_topView) {
        _topView = [[UIView alloc] init];
        _topView.backgroundColor = HexRGBAlpha(0xF8F8F8, 1.0);
        _topView.layer.cornerRadius = RXUScaleWidth(4);
    }
    return _topView;
}

- (UILabel *)titleLabel{
    if (!_titleLabel) {
        _titleLabel = [[RXOSAnnouncementTitleLabel alloc] init];
        _titleLabel.font = [UIFont boldSystemFontOfSize:RXUScaleWidth(12)];
        _titleLabel.textColor = HexRGBAlpha(0x8B8B8B, 1.0);
        _titleLabel.backgroundColor = [UIColor clearColor];
        _titleLabel.numberOfLines = 0;
        _titleLabel.lineBreakMode = NSLineBreakByTruncatingTail;
    }
    return _titleLabel;
}

- (UIView *)badgeView{
    if (!_badgeView) {
        _badgeView = [[UIView alloc] init];
        _badgeView.backgroundColor = [UIColor redColor];
        _badgeView.layer.masksToBounds = YES;
        _badgeView.layer.cornerRadius = RXUScaleWidth(4);
    }
    return _badgeView;
}

- (UIView *)lineView{
    if (!_lineView) {
        _lineView = [[UIView alloc] init];
        _lineView.backgroundColor = [UIColor whiteColor];
    }
    return _lineView;
}

@end
