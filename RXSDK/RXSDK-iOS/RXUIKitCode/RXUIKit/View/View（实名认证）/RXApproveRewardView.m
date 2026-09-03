//
//  RXApproveRewardView.m
//  RXUIKit
//
//  Created by 陈汉 on 2025/3/13.
//

#import "RXApproveRewardView.h"

@interface RXApproveRewardView ()

@property (nonatomic, strong) UIScrollView *bgView;
@property (nonatomic, strong) NSDictionary *loginData;

@end

@implementation RXApproveRewardView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.backgroundColor = [UIColor clearColor];
        
        self.loginData = [RXUIUserUtility sharedManager].loginData;
        if (!self.loginData || self.loginData.allKeys.count <= 0) {
            self.loginData = [RXUIUserUtility sharedManager].apiLoginData;
        }
        NSDictionary *loginData = [[NSUserDefaults standardUserDefaults] valueForKey:keyUser_loginData];
        if (!loginData || self.loginData.allKeys.count <= 0) {
            self.loginData = loginData[@"loginData"][@"data"];
        }
        
        if (!self.loginData) {
            self.loginData = [RXUIUserUtility sharedManager].loginData;
        }
        
        [self setUI];
    }
    return self;
}

#pragma mark -- <setUI>
- (void)setUI
{
    @try {
        [self addSubview:self.bgView];
        
        self.bgView.frame = CGRectMake(0, 0, CGRectGetWidth(self.frame), CGRectGetHeight(self.frame));
        
        if (self.loginData[@"reward"]) {
            NSDictionary *rewardInfo = self.loginData[@"reward"];
            
            if ([rewardInfo isKindOfClass:[NSDictionary class]] && rewardInfo.allKeys.count > 0) {
                NSString *kind = rewardInfo[@"kind"];
                NSArray *list = rewardInfo[@"list"];
                
                if ([kind isEqualToString:@"realauth"] && [list isKindOfClass:[NSArray class]] && list.count > 0) {
                    
                    CGFloat width = 50;
                    CGFloat height = 50;
                    CGFloat leftSpace = 0;
                    CGFloat space = 10;
                    
                    if (list.count < 6) {
                        leftSpace = (CGRectGetWidth(self.bgView.frame) - (width * list.count) - (space * (list.count - 1))) / 2;
                        self.bgView.contentSize = CGSizeMake(CGRectGetWidth(self.bgView.frame), 0);
                    } else {
                        CGFloat scrollW = width * list.count + space * (list.count - 1);
                        self.bgView.contentSize = CGSizeMake(scrollW, 0);
                    }
                    
                    for (int i = 0; i < list.count; i++) {
                        NSDictionary *rewardListInfo = list[i];
                        
                        UIView *bgView = [[UIView alloc] init];
                        bgView.backgroundColor = [UIColor clearColor];
                        
                        UIImageView *bgImgView = [[UIImageView alloc] init];
                        bgImgView.image = [UIImage rxBundleImageNamed:@"rx_reward_bg"];
                        
                        UIImageView *iconImgView = [[UIImageView alloc] init];
                        NSString *iconUrl = rewardListInfo[@"icon"];
                        // 异步下载图片
                        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                            NSData *data = [NSData dataWithContentsOfURL:[NSURL URLWithString:iconUrl]];
                            if (data) {
                                dispatch_async(dispatch_get_main_queue(), ^{
                                    iconImgView.image = [UIImage imageWithData:data];
                                });
                            }
                        });
                        
                        UIImageView *countBgImgView = [[UIImageView alloc] init];
                        countBgImgView.image = [UIImage rxBundleImageNamed:@"rx_reward_count"];
                        
                        UILabel *countLbl = [[UILabel alloc] init];
                        countLbl.text = rewardListInfo[@"num_format"];
                        countLbl.textAlignment = NSTextAlignmentCenter;
                        countLbl.textColor = [UIColor whiteColor];
                        countLbl.font = [UIFont systemFontOfSize:12.5];
                        
                        [self.bgView addSubview:bgView];
                        [bgView addSubview:bgImgView];
                        [bgView addSubview:iconImgView];
                        [bgView addSubview:countBgImgView];
                        [bgView addSubview:countLbl];
                        
                        CGFloat x = leftSpace + (width + space) * i;
                        
                        bgView.frame = CGRectMake(x, 0, width, height);
                        bgImgView.frame = CGRectMake(0, 0, CGRectGetWidth(bgView.frame), CGRectGetHeight(bgView.frame));
                        iconImgView.frame = CGRectMake(9, 9, CGRectGetWidth(bgView.frame) - 18, CGRectGetHeight(bgView.frame) - 18);
                        countBgImgView.frame = CGRectMake(0, CGRectGetHeight(bgView.frame) - 19, CGRectGetWidth(bgView.frame), 19);
                        countLbl.frame = CGRectMake(0, CGRectGetHeight(bgView.frame) - 15, CGRectGetWidth(bgView.frame), 15);
                    }
                }
            }
        }
    } @catch (NSException *exception) {
        
    } @finally {
            
    }
}

#pragma mark -- <lazy>
- (UIScrollView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIScrollView alloc] init];
        _bgView.backgroundColor = [UIColor clearColor];
        _bgView.showsHorizontalScrollIndicator = NO;
    }
    return _bgView;
}

@end
