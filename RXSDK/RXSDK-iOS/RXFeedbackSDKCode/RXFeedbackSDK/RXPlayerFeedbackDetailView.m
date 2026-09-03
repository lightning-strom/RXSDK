//
//  RXPlayerFeedbackDetailView.m
//  RXUIKit-OS
//
//  Created by root11 on 2024/9/12.
//

#import "RXPlayerFeedbackDetailView.h"
#import "RXFeedbackTool.h"
#import <RXSDK_Pure/RX_CommonNetworkExcuteManager.h>
#import "NSString+RXFeedbackAddition.h"
#import "TZImagePickerController.h"
#import "RXPlayerFeedbackPreviewView.h"
#import "RXPlayerFeedBackItemView.h"
#import "RXPlayerEmailGiftView.h"
#import "RXPlayerGiftPopView.h"
#import "RXPlayerFeedbackUploadManager.h"
#import "UIViewController+RXFeedbackExtension.h"

@interface RXPlayerFeedbackDetailView ()
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UIButton *backBtn;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UIButton *closeBtn;
@property (nonatomic, strong) UIButton *getPropBtn;//领取礼物
@property (nonatomic, strong) UIButton *cancelBtn;//关闭按钮
@property (nonatomic, strong) UIScrollView *bgBackScrollview;

@property (nonatomic, copy) UILabel *feedbackLabel;
@property (nonatomic, copy) UIScrollView *feedbackAttachmentsScrollView;

@property (nonatomic, strong) UIView *backView;
@property (nonatomic, copy) UILabel *backTitleLabel;
@property (nonatomic, copy) UILabel *backContentLabel;
@property (nonatomic, copy) UIScrollView *backPicScrollView;

@property (nonatomic, copy) UILabel *propTitleLabel;
@property (nonatomic, copy) UIScrollView *propScrollView;

@property (nonatomic, strong) RXPlayerGiftPopView *giftPopView;

@property (nonatomic, assign) int feedbackID;
@property (nonatomic, strong) NSDictionary *dataDic;//详情

@end


@implementation RXPlayerFeedbackDetailView
- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithFeedbackID:(int)feedbackID
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        [[UIViewController currentViewController].view addSubview:self];
        [[UIViewController currentViewController].view bringSubviewToFront:self];
        [self addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapGesture)]];
        self.feedbackID = feedbackID;
        [self getfeedbackDetail];
        [self setUI];
        [self show];
        
    }
    return self;
}

#pragma mark - request
- (void)getfeedbackDetail{
    [RXFeedbackHUD showHUD];
    __weak typeof(self) weakSelf = self;
    [[RXApiService sharedSDK] getFeedbackDetailWithFeedbackID:self.feedbackID complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            [RXFeedbackHUD hideHUD];
            weakSelf.dataDic = [NSDictionary dictionaryWithDictionary:response[@"data"]];
            [weakSelf layoutViews];
        }else{
            [RXFeedbackHUD showErrorText:[RXFeedbackLocation osLaunguage:@"加载失败"]];
        }
    }];
}

//领取道具
- (void)getPropRequest{
    [RXFeedbackHUD showHUD];
    __weak typeof(self) weakSelf = self;
    [[RXApiService sharedSDK] feedbackGetpropWithFeedbackID:self.feedbackID complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            [RXFeedbackHUD showErrorText:[RXFeedbackLocation osLaunguage:@"领取成功"]];
            [weakSelf getfeedbackDetail];
        }else{
            [RXFeedbackHUD showErrorText:[RXFeedbackLocation osLaunguage:@"领取失败"]];
        }
    }];
}

#pragma mark -- <setUI>

- (void)show
{
//    [RXFeedbackTool transformWithView:self.bgView];
//    [UIView animateWithDuration:0.1 animations:^{
//        [RXFeedbackTool showWithAnimate:self.bgView];
//        [self layoutSubviews];
//    }];
}

- (void)hide
{
    [[NSNotificationCenter defaultCenter] postNotificationName:RXUINoti_refreshFeedbackList object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
}

- (void)setUI
{
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.backBtn];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.closeBtn];
    [self.bgView addSubview:self.getPropBtn];
    [self.bgView addSubview:self.cancelBtn];
    [self.bgView addSubview:self.bgBackScrollview];
    [self.bgView addSubview:self.giftPopView];
    
    [self.bgBackScrollview addSubview:self.feedbackLabel];
    [self.bgBackScrollview addSubview:self.feedbackAttachmentsScrollView];
    
    [self.bgBackScrollview addSubview:self.backView];
    [self.backView addSubview:self.backTitleLabel];
    [self.backView addSubview:self.backContentLabel];
    [self.backView addSubview:self.backPicScrollView];
    
    [self.backView addSubview:self.propTitleLabel];
    [self.backView addSubview:self.propScrollView];
    
    [self layoutViews];
}

- (void)layoutViews{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    if (RXAC) {
        self.bgView.frame = CGRectMake(0, 0, RXUScaleWidth(531), RXUScaleWidth(311));
        self.bgView.center = window.center;
        //横屏
        CGFloat bgViewWidth = self.bgView.frame.size.width;
        CGFloat bgViewHeight = self.bgView.frame.size.height;
        
        self.titleLbl.frame = CGRectMake(0, 0, bgViewWidth, RXUScaleWidth(45));
        self.bgBackScrollview.frame = CGRectMake(20, self.titleLbl.frame.size.height + 6, bgViewWidth - 40, bgViewHeight - RXUScaleWidth(45) - RXUScaleWidth(65) - 6);
        
        self.giftPopView.frame = CGRectMake(0, 0, 160, 160);
        
        if ([RXFeedbackTool isRTL]) {
            self.backBtn.frame = CGRectMake(bgViewHeight - 12 - RXUScaleWidth(25), RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            self.closeBtn.frame = CGRectMake(17, RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            self.getPropBtn.frame = CGRectMake(20, bgViewHeight - 10 - RXUScaleWidth(38), RXUScaleWidth(132), RXUScaleWidth(38));
            self.cancelBtn.frame = CGRectMake(20, bgViewHeight - 10 - RXUScaleWidth(38), RXUScaleWidth(132), RXUScaleWidth(38));
            NSInteger is_prop = [self.dataDic[@"is_prop"] integerValue];
            NSInteger get_prop = [self.dataDic[@"get_prop"] integerValue];
            if (is_prop == 0) {
                self.getPropBtn.hidden = YES;
                self.cancelBtn.hidden = NO;
            }else{
                if (get_prop == 1) {//已领取
                    self.getPropBtn.hidden = YES;
                    self.cancelBtn.hidden = NO;
                }else{
                    self.getPropBtn.hidden = NO;
                    self.cancelBtn.hidden = YES;
                }
            }
            
            
            NSString *content = self.dataDic[@"content"];
            CGFloat contentHeight = [content heightForFont:self.feedbackLabel.font width:self.bgBackScrollview.frame.size.width];
            self.feedbackLabel.text = content;
            self.feedbackLabel.textAlignment = NSTextAlignmentRight;
            self.feedbackLabel.frame = CGRectMake(0, 0, self.bgBackScrollview.frame.size.width, contentHeight);
            
            NSObject *attachmentsObject = self.dataDic[@"attachments"];
            NSArray *attachmentsArray = @[];
            if ([attachmentsObject isKindOfClass:[NSArray class]]) {
                attachmentsArray = (NSArray *)attachmentsObject;
            }
            if (attachmentsArray.count > 0) {
                self.feedbackAttachmentsScrollView.frame = CGRectMake(self.bgBackScrollview.frame.size.width - ((RXUScaleWidth(65) * 5 + 20)), self.feedbackLabel.frame.size.height + 6, RXUScaleWidth(65) * 5 + 20, RXUScaleWidth(65));
                for (int i = 0 ; i < attachmentsArray.count; i ++) {
                    RXPlayerFeedBackItemView *itemView = [[RXPlayerFeedBackItemView alloc] init];
                    itemView.tag = i;
                    itemView.frame = CGRectMake(self.feedbackAttachmentsScrollView.frame.size.width - (i * 5 + (i + 1) * RXUScaleWidth(65)), 0, RXUScaleWidth(65), RXUScaleWidth(65));
                    NSString *type = [RXPlayerFeedbackUploadManager isImageURL:attachmentsArray[i]];
                    if ([type isEqualToString:@"image"]) {
                        itemView.backImageView.image = [RXPlayerFeedbackUploadManager getImageWithUrlString:attachmentsArray[i]];
                        itemView.playImageView.hidden = YES;
                    }else{
                        itemView.backImageView.image = [RXPlayerFeedbackUploadManager getThumbnailImage:attachmentsArray[i]];
                        itemView.playImageView.hidden = NO;
                    }
                    [self.feedbackAttachmentsScrollView addSubview:itemView];
                    [itemView addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(previewClick:)]];
                }
            }else{
                self.feedbackAttachmentsScrollView.frame = CGRectMake(self.bgBackScrollview.frame.size.width - ((RXUScaleWidth(65) * attachmentsArray.count + 20)), self.feedbackLabel.frame.size.height + 6, 0, 0);
            }
            
            NSInteger status = [self.dataDic[@"status"] integerValue];
            if (status == 1) {//未回复
                self.backView.frame = CGRectMake(0, CGRectGetMaxY(self.feedbackAttachmentsScrollView.frame) + 15, 0, 0);
            }else if (status == 2) {
                self.backView.frame = CGRectMake(0, CGRectGetMaxY(self.feedbackAttachmentsScrollView.frame) + 15, self.bgBackScrollview.frame.size.width, RXUScaleWidth(279));
                
                self.backTitleLabel.textAlignment = NSTextAlignmentRight;
                self.backTitleLabel.frame = CGRectMake(8, 6, self.backView.frame.size.width - 16, RXUScaleWidth(20));
                
                NSString *recover_content = self.dataDic[@"recover_content"];
                CGFloat recover_contentHeight = [recover_content heightForFont:self.backContentLabel.font width:self.backView.frame.size.width];
                self.backContentLabel.text = recover_content;
                self.backContentLabel.textAlignment = NSTextAlignmentRight;
                self.backContentLabel.frame = CGRectMake(8, CGRectGetMaxY(self.backTitleLabel.frame) + 6, self.backView.frame.size.width - 16, recover_contentHeight);
                
                NSObject *recover_attachmentsObject = self.dataDic[@"recover_attachments"];
                NSArray *recover_attachments = @[];
                if ([recover_attachmentsObject isKindOfClass:[NSArray class]]) {
                    recover_attachments = (NSArray *)recover_attachmentsObject;
                }
                if (recover_attachments.count > 0) {
                    self.backPicScrollView.frame = CGRectMake(self.backView.frame.size.width - 8 - (RXUScaleWidth(65) * 5 + 20), CGRectGetMaxY(self.backContentLabel.frame) + 6, RXUScaleWidth(65) * 5 + 20, RXUScaleWidth(65));
                    for (int i = 0 ; i < recover_attachments.count; i ++) {
                        RXPlayerFeedBackItemView *itemView = [[RXPlayerFeedBackItemView alloc] init];
                        itemView.tag = 100 + i;
                        itemView.frame = CGRectMake(self.backPicScrollView.frame.size.width - (i * 5 + (i + 1) * RXUScaleWidth(65)), 0, RXUScaleWidth(65), RXUScaleWidth(65));
                        
                        NSString *type = [RXPlayerFeedbackUploadManager isImageURL:recover_attachments[i]];
                        if ([type isEqualToString:@"image"]) {
                            itemView.backImageView.image = [RXPlayerFeedbackUploadManager getImageWithUrlString:recover_attachments[i]];
                            itemView.playImageView.hidden = YES;
                        }else{
                            itemView.backImageView.image = [RXPlayerFeedbackUploadManager getThumbnailImage:recover_attachments[i]];
                            itemView.playImageView.hidden = NO;
                        }
                        [self.backPicScrollView addSubview:itemView];
                        [itemView addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(previewClickOne:)]];
                    }
                }else{
                    self.backPicScrollView.frame = CGRectMake(self.backView.frame.size.width - 8 - (RXUScaleWidth(65) * recover_attachments.count + 20), CGRectGetMaxY(self.backContentLabel.frame) + 6, 0, 0);
                }
                
                if (is_prop == 1) {
                    self.propTitleLabel.textAlignment = NSTextAlignmentRight;
                    self.propTitleLabel.frame = CGRectMake(8, CGRectGetMaxY(self.backPicScrollView.frame), self.backView.frame.size.width - 16, RXUScaleWidth(20));
                    
                    NSObject *propObject = self.dataDic[@"prop"];
                    NSArray *propArray = @[];
                    if ([propObject isKindOfClass:[NSArray class]]) {
                        propArray = (NSArray *)propObject;
                    }
                    self.propScrollView.frame = CGRectMake(8, CGRectGetMaxY(self.propTitleLabel.frame) + 6, self.backView.frame.size.width - 16, RXUScaleWidth(56));
                    self.propScrollView.contentSize = CGSizeMake(RXUScaleWidth(56) * propArray.count +  5 * (propArray.count - 1), RXUScaleWidth(56));
                    if (propArray.count > 8) {
                        [self.propScrollView setContentOffset:CGPointMake((propArray.count - 8) * (RXUScaleWidth(56) + 5), 0) animated:NO];
                    }
                    for (int i = 0 ; i < propArray.count; i ++) {
                        RXPlayerEmailGiftView *itemView = [[RXPlayerEmailGiftView alloc] init];
                        itemView.tag = 1000 + i;
                        if (propArray.count > 8) {
                            itemView.frame = CGRectMake(self.propScrollView.contentSize.width - (i * 5 + (i + 1) * RXUScaleWidth(56)), 0, RXUScaleWidth(56), RXUScaleWidth(56));
                        }else{
                            itemView.frame = CGRectMake(self.propScrollView.frame.size.width - (i * 5 + (i + 1) * RXUScaleWidth(56)), 0, RXUScaleWidth(56), RXUScaleWidth(56));
                        }
                        [self.propScrollView addSubview:itemView];
                        [itemView setPropDic:propArray[i]];
                        [itemView setGet_prop:get_prop];
                        [itemView addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(previewClickTwo:)]];
                    }
                }else{
                    self.propTitleLabel.frame = CGRectMake(8, CGRectGetMaxY(self.backPicScrollView.frame), 0, 0);
                    self.propScrollView.frame = CGRectMake(8, CGRectGetMaxY(self.propTitleLabel.frame) + 6, 0, 0);
                }
                
            }
            
            
        }else{
            self.backBtn.frame = CGRectMake(12, RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            self.closeBtn.frame = CGRectMake(bgViewWidth - 17 - RXUScaleWidth(25), RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            
            self.getPropBtn.frame = CGRectMake(bgViewWidth - 20 - RXUScaleWidth(132), bgViewHeight - 10 - RXUScaleWidth(38), RXUScaleWidth(132), RXUScaleWidth(38));
            self.cancelBtn.frame = CGRectMake(bgViewWidth - 20 - RXUScaleWidth(132), bgViewHeight - 10 - RXUScaleWidth(38), RXUScaleWidth(132), RXUScaleWidth(38));
            NSInteger is_prop = [self.dataDic[@"is_prop"] integerValue];
            NSInteger get_prop = [self.dataDic[@"get_prop"] integerValue];
            if (is_prop == 0) {
                self.getPropBtn.hidden = YES;
                self.cancelBtn.hidden = NO;
            }else{
                if (get_prop == 1) {//已领取
                    self.getPropBtn.hidden = YES;
                    self.cancelBtn.hidden = NO;
                }else{
                    self.getPropBtn.hidden = NO;
                    self.cancelBtn.hidden = YES;
                }
            }
            
            NSString *content = self.dataDic[@"content"];
            CGFloat contentHeight = [content heightForFont:self.feedbackLabel.font width:self.bgBackScrollview.frame.size.width];
            self.feedbackLabel.text = content;
            self.feedbackLabel.textAlignment = NSTextAlignmentLeft;
            self.feedbackLabel.frame = CGRectMake(0, 0, self.bgBackScrollview.frame.size.width, contentHeight);
            
            NSObject *attachmentsObject = self.dataDic[@"attachments"];
            NSArray *attachmentsArray = @[];
            if ([attachmentsObject isKindOfClass:[NSArray class]]) {
                attachmentsArray = (NSArray *)attachmentsObject;
            }
            if (attachmentsArray.count > 0) {
                self.feedbackAttachmentsScrollView.frame = CGRectMake(0, self.feedbackLabel.frame.size.height + 6, RXUScaleWidth(65) * attachmentsArray.count + 20, RXUScaleWidth(65));
                for (int i = 0 ; i < attachmentsArray.count; i ++) {
                    RXPlayerFeedBackItemView *itemView = [[RXPlayerFeedBackItemView alloc] init];
                    itemView.tag = i;
                    itemView.frame = CGRectMake(i * RXUScaleWidth(65) + i * 5, 0, RXUScaleWidth(65) , RXUScaleWidth(65));
                    NSString *type = [RXPlayerFeedbackUploadManager isImageURL:attachmentsArray[i]];
                    if ([type isEqualToString:@"image"]) {
                        itemView.backImageView.image = [RXPlayerFeedbackUploadManager getImageWithUrlString:attachmentsArray[i]];
                        itemView.playImageView.hidden = YES;
                    }else{
                        itemView.backImageView.image = [RXPlayerFeedbackUploadManager getThumbnailImage:attachmentsArray[i]];
                        itemView.playImageView.hidden = NO;
                    }
                    [self.feedbackAttachmentsScrollView addSubview:itemView];
                    [itemView addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(previewClick:)]];
                }
            }else{
                self.feedbackAttachmentsScrollView.frame = CGRectMake(0, self.feedbackLabel.frame.size.height + 6, 0, 0);
            }
            
            NSInteger status = [self.dataDic[@"status"] integerValue];
            if (status == 1) {//未回复
                self.backView.frame = self.backView.frame = CGRectMake(0, CGRectGetMaxY(self.feedbackAttachmentsScrollView.frame) + 15, 0, 0);;
            }else if (status == 2) {
                self.backView.frame = CGRectMake(0, CGRectGetMaxY(self.feedbackAttachmentsScrollView.frame) + 15, self.bgBackScrollview.frame.size.width, RXUScaleWidth(279));
                
                self.backTitleLabel.textAlignment = NSTextAlignmentLeft;
                self.backTitleLabel.frame = CGRectMake(8, 6, self.backView.frame.size.width - 16, RXUScaleWidth(20));
                
                NSString *recover_content = self.dataDic[@"recover_content"];
                CGFloat recover_contentHeight = [recover_content heightForFont:self.backContentLabel.font width:self.backView.frame.size.width];
                self.backContentLabel.text = recover_content;
                self.backContentLabel.textAlignment = NSTextAlignmentLeft;
                self.backContentLabel.frame = CGRectMake(8, CGRectGetMaxY(self.backTitleLabel.frame) + 6, self.backView.frame.size.width - 16, recover_contentHeight);
                
                NSObject *recover_attachmentsObject = self.dataDic[@"recover_attachments"];
                NSArray *recover_attachments = @[];
                if ([recover_attachmentsObject isKindOfClass:[NSArray class]]) {
                    recover_attachments = (NSArray *)recover_attachmentsObject;
                }
                if (recover_attachments.count > 0) {
                    self.backPicScrollView.frame = CGRectMake(8, CGRectGetMaxY(self.backContentLabel.frame) + 6, RXUScaleWidth(65) * recover_attachments.count + 20, RXUScaleWidth(65));
                    for (int i = 0 ; i < recover_attachments.count; i ++) {
                        RXPlayerFeedBackItemView *itemView = [[RXPlayerFeedBackItemView alloc] init];
                        itemView.tag = 100 + i;
                        itemView.frame = CGRectMake(i * RXUScaleWidth(65) + i * 5, 0, RXUScaleWidth(65) , RXUScaleWidth(65));
                        
                        NSString *type = [RXPlayerFeedbackUploadManager isImageURL:recover_attachments[i]];
                        if ([type isEqualToString:@"image"]) {
                            itemView.backImageView.image = [RXPlayerFeedbackUploadManager getImageWithUrlString:recover_attachments[i]];
                            itemView.playImageView.hidden = YES;
                        }else{
                            itemView.backImageView.image = [RXPlayerFeedbackUploadManager getThumbnailImage:recover_attachments[i]];
                            itemView.playImageView.hidden = NO;
                        }
                        [self.backPicScrollView addSubview:itemView];
                        [itemView addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(previewClickOne:)]];
                    }
                }else{
                    self.backPicScrollView.frame = CGRectMake(8, CGRectGetMaxY(self.backContentLabel.frame) + 6, 0, 0);
                }
                
                if (is_prop == 1){//有道具
                    self.propTitleLabel.textAlignment = NSTextAlignmentLeft;
                    self.propTitleLabel.frame = CGRectMake(8, CGRectGetMaxY(self.backPicScrollView.frame) + 6, self.backView.frame.size.width - 16, RXUScaleWidth(20));
                    
                    NSObject *propObject = self.dataDic[@"prop"];
                    NSArray *propArray = @[];
                    if ([propObject isKindOfClass:[NSArray class]]) {
                        propArray = (NSArray *)propObject;
                    }
                    self.propScrollView.frame = CGRectMake(8, CGRectGetMaxY(self.propTitleLabel.frame) + 6, self.backView.frame.size.width - 16, RXUScaleWidth(56));
                    self.propScrollView.contentSize = CGSizeMake(RXUScaleWidth(56) * propArray.count +  5 * (propArray.count - 1), RXUScaleWidth(56));
                    for (int i = 0 ; i < propArray.count; i ++) {
                        RXPlayerEmailGiftView *itemView = [[RXPlayerEmailGiftView alloc] init];
                        itemView.tag = 1000 + i;
                        itemView.frame = CGRectMake(i * RXUScaleWidth(56) + i * 5, 0, RXUScaleWidth(56) , RXUScaleWidth(56));
                        [self.propScrollView addSubview:itemView];
                        [itemView setPropDic:propArray[i]];
                        [itemView setGet_prop:get_prop];
                        [itemView addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(previewClickTwo:)]];
                    }
                }else{
                    self.propTitleLabel.frame = CGRectMake(8, CGRectGetMaxY(self.backPicScrollView.frame) + 6, 0, 0);
                    self.propScrollView.frame = CGRectMake(8, CGRectGetMaxY(self.propTitleLabel.frame) + 6, 0, 0);
                }
                
            }
            
        }
        //获取道具控件相对于bgBackScrollview的坐标，用于计算bgBackScrollview的contentSize
        CGRect propScrollViewInBgScrollView = [self.backView convertRect:self.propScrollView.frame toView:self.bgBackScrollview];
        self.bgBackScrollview.contentSize = CGSizeMake(RXUScaleWidth(531) - 40, propScrollViewInBgScrollView.origin.y + propScrollViewInBgScrollView.size.height + 10);
        
    }else{
        self.bgView.frame = CGRectMake(0, 0, RXUScaleWidth(313), RXUScaleWidth(400));
        self.bgView.center = window.center;
        
        CGFloat bgViewWidth = self.bgView.frame.size.width;
        CGFloat bgViewHeight = self.bgView.frame.size.height;
        
        self.titleLbl.frame = CGRectMake(0, 0, bgViewWidth, RXUScaleWidth(45));
        self.bgBackScrollview.frame = CGRectMake(15, self.titleLbl.frame.size.height + 6, bgViewWidth - 30, bgViewHeight - RXUScaleWidth(45) - RXUScaleWidth(65) - 6);
        
        self.getPropBtn.frame = CGRectMake((bgViewWidth - RXUScaleWidth(154))/2, bgViewHeight - 10 - RXUScaleWidth(33), RXUScaleWidth(154), RXUScaleWidth(33));
        self.cancelBtn.frame = CGRectMake((bgViewWidth - RXUScaleWidth(154))/2, bgViewHeight - 10 - RXUScaleWidth(33), RXUScaleWidth(154), RXUScaleWidth(33));
        
        NSInteger is_prop = [self.dataDic[@"is_prop"] integerValue];
        NSInteger get_prop = [self.dataDic[@"get_prop"] integerValue];
        if (is_prop == 0) {
            self.getPropBtn.hidden = YES;
            self.cancelBtn.hidden = NO;
        }else{
            if (get_prop == 1) {//已领取
                self.getPropBtn.hidden = YES;
                self.cancelBtn.hidden = NO;
            }else{
                self.getPropBtn.hidden = NO;
                self.cancelBtn.hidden = YES;
            }
        }
        
        self.giftPopView.frame = CGRectMake(0, 0, 160, 160);
        
        if ([RXFeedbackTool isRTL]) {
            self.backBtn.frame = CGRectMake(bgViewWidth - 12 - RXUScaleWidth(25), RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            self.closeBtn.frame = CGRectMake(17, RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            
            NSString *content = self.dataDic[@"content"];
            CGFloat contentHeight = [content heightForFont:self.feedbackLabel.font width:self.bgBackScrollview.frame.size.width];
            self.feedbackLabel.text = content;
            self.feedbackLabel.textAlignment = NSTextAlignmentRight;
            self.feedbackLabel.frame = CGRectMake(0, 0, self.bgBackScrollview.frame.size.width, contentHeight);
            
            NSObject *attachmentsObject = self.dataDic[@"attachments"];
            NSArray *attachmentsArray = @[];
            if ([attachmentsObject isKindOfClass:[NSArray class]]) {
                attachmentsArray = (NSArray *)attachmentsObject;
            }
            if (attachmentsArray.count > 0) {
                self.feedbackAttachmentsScrollView.frame = CGRectMake(0, self.feedbackLabel.frame.size.height + 6, RXUScaleWidth(52) * 5 + 20, RXUScaleWidth(52));
                for (int i = 0 ; i < attachmentsArray.count; i ++) {
                    RXPlayerFeedBackItemView *itemView = [[RXPlayerFeedBackItemView alloc] init];
                    itemView.tag = i;
                    itemView.frame = CGRectMake(self.feedbackAttachmentsScrollView.frame.size.width - (i * 5 + (i + 1) * RXUScaleWidth(52)), 0, RXUScaleWidth(52), RXUScaleWidth(52));
                    NSString *type = [RXPlayerFeedbackUploadManager isImageURL:attachmentsArray[i]];
                    if ([type isEqualToString:@"image"]) {
                        itemView.backImageView.image = [RXPlayerFeedbackUploadManager getImageWithUrlString:attachmentsArray[i]];
                        itemView.playImageView.hidden = YES;
                    }else{
                        itemView.backImageView.image = [RXPlayerFeedbackUploadManager getThumbnailImage:attachmentsArray[i]];
                        itemView.playImageView.hidden = NO;
                    }
                    [self.feedbackAttachmentsScrollView addSubview:itemView];
                    [itemView addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(previewClick:)]];
                }
            }else{
                self.feedbackAttachmentsScrollView.frame = CGRectMake(0, self.feedbackLabel.frame.size.height + 6, 0, 0);
            }
            
            NSInteger status = [self.dataDic[@"status"] integerValue];
            if (status == 1) {//未回复
                self.backView.frame = self.backView.frame = CGRectMake(0, CGRectGetMaxY(self.feedbackAttachmentsScrollView.frame) + 15, 0, 0);;
            }else if (status == 2) {
                self.backView.frame = CGRectMake(0, CGRectGetMaxY(self.feedbackAttachmentsScrollView.frame) + 15, self.bgBackScrollview.frame.size.width, RXUScaleWidth(300));
                
                self.backTitleLabel.textAlignment = NSTextAlignmentRight;
                self.backTitleLabel.frame = CGRectMake(5, 4, self.backView.frame.size.width - 10, RXUScaleWidth(20));
                
                NSString *recover_content = self.dataDic[@"recover_content"];
                CGFloat recover_contentHeight = [recover_content heightForFont:self.backContentLabel.font width:self.backView.frame.size.width - 10];
                self.backContentLabel.text = recover_content;
                self.backContentLabel.textAlignment = NSTextAlignmentRight;
                self.backContentLabel.frame = CGRectMake(5, CGRectGetMaxY(self.backTitleLabel.frame) + 6, self.backView.frame.size.width - 10, recover_contentHeight);
                
                NSObject *recover_attachmentsObject = self.dataDic[@"recover_attachments"];
                NSArray *recover_attachments = @[];
                if ([recover_attachmentsObject isKindOfClass:[NSArray class]]) {
                    recover_attachments = (NSArray *)recover_attachmentsObject;
                }
                if (recover_attachments.count > 0) {
                    self.backPicScrollView.frame = CGRectMake(5, CGRectGetMaxY(self.backContentLabel.frame) + 6, RXUScaleWidth(52) * 5 + 20, RXUScaleWidth(52));
                    for (int i = 0 ; i < recover_attachments.count; i ++) {
                        RXPlayerFeedBackItemView *itemView = [[RXPlayerFeedBackItemView alloc] init];
                        itemView.tag = 100 + i;
                        itemView.frame = CGRectMake(self.backPicScrollView.frame.size.width - (i * 5 + (i + 1) * RXUScaleWidth(52)), 0, RXUScaleWidth(52), RXUScaleWidth(52));
                        
                        NSString *type = [RXPlayerFeedbackUploadManager isImageURL:recover_attachments[i]];
                        if ([type isEqualToString:@"image"]) {
                            itemView.backImageView.image = [RXPlayerFeedbackUploadManager getImageWithUrlString:recover_attachments[i]];
                            itemView.playImageView.hidden = YES;
                        }else{
                            itemView.backImageView.image = [RXPlayerFeedbackUploadManager getThumbnailImage:recover_attachments[i]];
                            itemView.playImageView.hidden = NO;
                        }
                        [self.backPicScrollView addSubview:itemView];
                        [itemView addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(previewClickOne:)]];
                    }
                }else{
                    self.backPicScrollView.frame = CGRectMake(5, CGRectGetMaxY(self.backContentLabel.frame) + 6, 0, 0);
                }
                
                if (is_prop == 1){//有道具
                    self.propTitleLabel.textAlignment = NSTextAlignmentRight;
                    self.propTitleLabel.frame = CGRectMake(5, CGRectGetMaxY(self.backPicScrollView.frame) + 6, self.backView.frame.size.width - 10, RXUScaleWidth(20));
                    
                    NSObject *propObject = self.dataDic[@"prop"];
                    NSArray *propArray = @[];
                    if ([propObject isKindOfClass:[NSArray class]]) {
                        propArray = (NSArray *)propObject;
                    }
                    self.propScrollView.frame = CGRectMake(5, CGRectGetMaxY(self.propTitleLabel.frame) + 6, self.backView.frame.size.width - 10, RXUScaleWidth(56));
                    self.propScrollView.contentSize = CGSizeMake(RXUScaleWidth(56) * propArray.count + 5 * (propArray.count - 1), RXUScaleWidth(56));
                    if (propArray.count > 4) {
                        [self.propScrollView setContentOffset:CGPointMake((propArray.count - 4.6) * (RXUScaleWidth(56) + 5), 0) animated:NO];
                    }
                    for (int i = 0 ; i < propArray.count; i ++) {
                        RXPlayerEmailGiftView *itemView = [[RXPlayerEmailGiftView alloc] init];
                        itemView.tag = 1000 + i;
                        if (propArray.count > 4) {
                            itemView.frame = CGRectMake(self.propScrollView.contentSize.width - (i * 5 + (i + 1) * RXUScaleWidth(56)), 0, RXUScaleWidth(56), RXUScaleWidth(56));
                        }else{
                            itemView.frame = CGRectMake(self.propScrollView.frame.size.width - (i * 5 + (i + 1) * RXUScaleWidth(56)), 0, RXUScaleWidth(56), RXUScaleWidth(56));
                        }
                        
                        [self.propScrollView addSubview:itemView];
                        [itemView setPropDic:propArray[i]];
                        [itemView setGet_prop:get_prop];
                        [itemView addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(previewClickTwo:)]];
                    }
                }else{
                    self.propTitleLabel.frame = CGRectMake(5, CGRectGetMaxY(self.backPicScrollView.frame) + 6, 0, 0);
                    self.propScrollView.frame = CGRectMake(5, CGRectGetMaxY(self.propTitleLabel.frame) + 6, 0, 0);
                }
                
            }
            
            
        }else{
            self.backBtn.frame = CGRectMake(12, RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            self.closeBtn.frame = CGRectMake(bgViewWidth - 17 - RXUScaleWidth(25), RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            
            NSString *content = self.dataDic[@"content"];
            CGFloat contentHeight = [content heightForFont:self.feedbackLabel.font width:self.bgBackScrollview.frame.size.width];
            self.feedbackLabel.text = content;
            self.feedbackLabel.textAlignment = NSTextAlignmentLeft;
            self.feedbackLabel.frame = CGRectMake(0, 0, self.bgBackScrollview.frame.size.width, contentHeight);
            
            NSObject *attachmentsObject = self.dataDic[@"attachments"];
            NSArray *attachmentsArray = @[];
            if ([attachmentsObject isKindOfClass:[NSArray class]]) {
                attachmentsArray = (NSArray *)attachmentsObject;
            }
            if (attachmentsArray.count > 0) {
                self.feedbackAttachmentsScrollView.frame = CGRectMake(0, self.feedbackLabel.frame.size.height + 6, RXUScaleWidth(52) * attachmentsArray.count + 20, RXUScaleWidth(52));
                for (int i = 0 ; i < attachmentsArray.count; i ++) {
                    RXPlayerFeedBackItemView *itemView = [[RXPlayerFeedBackItemView alloc] init];
                    itemView.tag = i;
                    itemView.frame = CGRectMake(i * RXUScaleWidth(52) + i * 5, 0, RXUScaleWidth(52) , RXUScaleWidth(52));
                    NSString *type = [RXPlayerFeedbackUploadManager isImageURL:attachmentsArray[i]];
                    if ([type isEqualToString:@"image"]) {
                        itemView.backImageView.image = [RXPlayerFeedbackUploadManager getImageWithUrlString:attachmentsArray[i]];
                        itemView.playImageView.hidden = YES;
                    }else{
                        itemView.backImageView.image = [RXPlayerFeedbackUploadManager getThumbnailImage:attachmentsArray[i]];
                        itemView.playImageView.hidden = NO;
                    }
                    [self.feedbackAttachmentsScrollView addSubview:itemView];
                    [itemView addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(previewClick:)]];
                }
            }else{
                self.feedbackAttachmentsScrollView.frame = CGRectMake(0, self.feedbackLabel.frame.size.height + 6, 0, 0);
            }
            
            NSInteger status = [self.dataDic[@"status"] integerValue];
            if (status == 1) {//未回复
                self.backView.frame = CGRectMake(0, CGRectGetMaxY(self.feedbackAttachmentsScrollView.frame) + 15, 0, 0);
            }else if (status == 2) {
                self.backView.frame = CGRectMake(0, CGRectGetMaxY(self.feedbackAttachmentsScrollView.frame) + 15, self.bgBackScrollview.frame.size.width, RXUScaleWidth(300));
                
                self.backTitleLabel.textAlignment = NSTextAlignmentLeft;
                self.backTitleLabel.frame = CGRectMake(5, 4, self.backView.frame.size.width - 10, RXUScaleWidth(20));
                
                NSString *recover_content = self.dataDic[@"recover_content"];
                CGFloat recover_contentHeight = [recover_content heightForFont:self.backContentLabel.font width:self.backView.frame.size.width - 10];
                self.backContentLabel.text = recover_content;
                self.backContentLabel.text = recover_content;
                self.backContentLabel.textAlignment = NSTextAlignmentLeft;
                self.backContentLabel.frame = CGRectMake(5, CGRectGetMaxY(self.backTitleLabel.frame) + 6, self.backView.frame.size.width - 10, recover_contentHeight);
                
                
                NSObject *recover_attachmentsObject = self.dataDic[@"recover_attachments"];
                NSArray *recover_attachments = @[];
                if ([recover_attachmentsObject isKindOfClass:[NSArray class]]) {
                    recover_attachments = (NSArray *)recover_attachmentsObject;
                }
                if (recover_attachments.count > 0) {
                    self.backPicScrollView.frame = CGRectMake(5, CGRectGetMaxY(self.backContentLabel.frame) + 6, RXUScaleWidth(52) * recover_attachments.count + 20, RXUScaleWidth(52));
                    for (int i = 0 ; i < recover_attachments.count; i ++) {
                        RXPlayerFeedBackItemView *itemView = [[RXPlayerFeedBackItemView alloc] init];
                        itemView.tag = 100 + i;
                        itemView.frame = CGRectMake(i * RXUScaleWidth(52) + i * 5, 0, RXUScaleWidth(52) , RXUScaleWidth(52));
                        
                        NSString *type = [RXPlayerFeedbackUploadManager isImageURL:recover_attachments[i]];
                        if ([type isEqualToString:@"image"]) {
                            itemView.backImageView.image = [RXPlayerFeedbackUploadManager getImageWithUrlString:recover_attachments[i]];
                            itemView.playImageView.hidden = YES;
                        }else{
                            itemView.backImageView.image = [RXPlayerFeedbackUploadManager getThumbnailImage:recover_attachments[i]];
                            itemView.playImageView.hidden = NO;
                        }
                        [self.backPicScrollView addSubview:itemView];
                        [itemView addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(previewClickOne:)]];
                    }
                }else{
                    self.backPicScrollView.frame = CGRectMake(5, CGRectGetMaxY(self.backContentLabel.frame) + 6, 0, 0);
                }
                
                if (is_prop == 1){//有道具
                    self.propTitleLabel.textAlignment = NSTextAlignmentLeft;
                    self.propTitleLabel.frame = CGRectMake(5, CGRectGetMaxY(self.backPicScrollView.frame) + 6, self.backView.frame.size.width - 10, RXUScaleWidth(20));
                    
                    NSObject *propObject = self.dataDic[@"prop"];
                    NSArray *propArray = @[];
                    if ([propObject isKindOfClass:[NSArray class]]) {
                        propArray = (NSArray *)propObject;
                    }
                    self.propScrollView.frame = CGRectMake(5, CGRectGetMaxY(self.propTitleLabel.frame) + 6, self.backView.frame.size.width - 10, RXUScaleWidth(56));
                    self.propScrollView.contentSize = CGSizeMake(RXUScaleWidth(56) * propArray.count + 5 * (propArray.count - 1), RXUScaleWidth(56));
                    for (int i = 0 ; i < propArray.count; i ++) {
                        RXPlayerEmailGiftView *itemView = [[RXPlayerEmailGiftView alloc] init];
                        itemView.tag = 1000 + i;
                        itemView.frame = CGRectMake(i * RXUScaleWidth(56) + i * 5, 0, RXUScaleWidth(56) , RXUScaleWidth(56));
                        [self.propScrollView addSubview:itemView];
                        [itemView setPropDic:propArray[i]];
                        [itemView setGet_prop:get_prop];
                        [itemView addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(previewClickTwo:)]];
                    }
                }else{
                    self.propTitleLabel.frame = CGRectMake(5, CGRectGetMaxY(self.backPicScrollView.frame) + 6, 0, 0);
                    self.propScrollView.frame = CGRectMake(5, CGRectGetMaxY(self.propTitleLabel.frame) + 6, 0, 0);
                }
                
            }
            
        }
        
        //获取道具控件相对于bgBackScrollview的坐标，用于计算bgBackScrollview的contentSize
        CGRect propScrollViewInBgScrollView = [self.backView convertRect:self.propScrollView.frame toView:self.bgBackScrollview];
        self.bgBackScrollview.contentSize = CGSizeMake(bgViewWidth - 30, propScrollViewInBgScrollView.origin.y + propScrollViewInBgScrollView.size.height + 10);
    }
    
    [self layoutSubviews];
}

#pragma mark - action
- (void)cancelBtnClick{
    [self hide];
}

- (void)closeBtnClick{
    [self hide];
}

- (void)getPropBtnAction{
    self.giftPopView.hidden = YES;
    [self getPropRequest];
}

- (void)previewClick:(UITapGestureRecognizer *)tap{
    UIView *view = tap.view;
    RXPlayerFeedbackPreviewView *previewView = [[RXPlayerFeedbackPreviewView alloc] initWithPicArray:self.dataDic[@"attachments"] index:view.tag];
}

- (void)previewClickOne:(UITapGestureRecognizer *)tap{
    UIView *view = tap.view;
    RXPlayerFeedbackPreviewView *previewView = [[RXPlayerFeedbackPreviewView alloc] initWithPicArray:self.dataDic[@"recover_attachments"] index:view.tag - 100];
}

- (void)previewClickTwo:(UITapGestureRecognizer *)gesture{
    UIView *tappedView = gesture.view;
    CGRect tappedViewRectInScrollView = tappedView.frame;
    CGRect tappedViewTransferInBgView = [self.propScrollView convertRect:tappedViewRectInScrollView toView:self.bgView];
    
    if (tappedViewTransferInBgView.origin.x < self.bgView.frame.size.width/2) {
        // 将 tappedView 的坐标转换为相对于 self.bgView 的坐标
        CGRect tappedViewRectInBgView = [self.propScrollView convertRect:tappedViewRectInScrollView toView:self.bgView];
        
        CGFloat popViewX = tappedViewRectInBgView.origin.x;
        CGFloat popViewY = tappedViewRectInBgView.origin.y - self.giftPopView.frame.size.height;
        // 计算 popView 的位置，并确保它可见
        self.giftPopView.frame = CGRectMake(popViewX, popViewY, self.giftPopView.frame.size.width, self.giftPopView.frame.size.height);
    }else{
        // 将 tappedView 的坐标转换为相对于 self.bgView 的坐标
        CGRect tappedViewRectInBgView = [self.propScrollView convertRect:tappedViewRectInScrollView toView:self.bgView];
        
        CGFloat popViewX = tappedViewRectInBgView.origin.x + tappedViewRectInBgView.size.width - self.giftPopView.frame.size.width;
        CGFloat popViewY = tappedViewRectInBgView.origin.y - self.giftPopView.frame.size.height;
        // 计算 popView 的位置，并确保它可见
        self.giftPopView.frame = CGRectMake(popViewX, popViewY, self.giftPopView.frame.size.width, self.giftPopView.frame.size.height);
    }
    
    NSArray *propsArray = self.dataDic[@"prop"];
    NSDictionary *giftDic = propsArray[tappedView.tag - 1000];
    [self.giftPopView setPopViewWithInfo:giftDic];
    self.giftPopView.hidden = NO;
}

- (void)tapGesture{
    self.giftPopView.hidden = YES;
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor whiteColor];
        _bgView.layer.cornerRadius = 4;
    }
    return _bgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = [RXFeedbackLocation osLaunguage:@"反馈内容"];
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.backgroundColor = [UIColor clearColor];
        _titleLbl.font = [UIFont systemFontOfSize:RXUScaleWidth(16) weight:UIFontWeightSemibold];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_closeBtn setImage:[UIImage rxFeedbackBundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(closeBtnClick) forControlEvents:UIControlEventTouchUpInside];
        [_closeBtn setImageEdgeInsets:UIEdgeInsetsMake(4, 4, 4, 4)];
    }
    return _closeBtn;
}

- (UIButton *)backBtn
{
    if (!_backBtn) {
        _backBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        UIImage *backImage = [UIImage rxFeedbackBundleImageNamed:@"rx_back"];
        if ([RXFeedbackTool isRTL]) {
            UIImage *flipImage = [UIImage imageWithCGImage:backImage.CGImage scale:backImage.scale orientation:UIImageOrientationDown];
            [_backBtn setImage:flipImage forState:UIControlStateNormal];
        } else {
            [_backBtn setImage:backImage forState:UIControlStateNormal];
        }
        [_backBtn addTarget:self action:@selector(closeBtnClick) forControlEvents:UIControlEventTouchUpInside];
        [_backBtn setImageEdgeInsets:UIEdgeInsetsMake(4, 4, 4, 4)];
    }
    return _backBtn;
}

- (UIButton *)getPropBtn{
    if (!_getPropBtn) {
        _getPropBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_getPropBtn addTarget:self action:@selector(getPropBtnAction) forControlEvents:UIControlEventTouchUpInside];
        _getPropBtn.layer.cornerRadius = 4;
        _getPropBtn.backgroundColor = HexRGBAlpha(0x20C0B3, 1);
        [_getPropBtn setTitle:[RXFeedbackLocation osLaunguage:@"领取奖励"] forState:UIControlStateNormal];
        [_getPropBtn.titleLabel setFont:[UIFont systemFontOfSize:RXUScaleWidth(14) weight:UIFontWeightSemibold]];
        [_getPropBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _getPropBtn.titleLabel.lineBreakMode = NSLineBreakByWordWrapping;
        _getPropBtn.titleLabel.numberOfLines = 0;
    }
    return _getPropBtn;
}

- (UIButton *)cancelBtn{
    if (!_cancelBtn) {
        _cancelBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_cancelBtn addTarget:self action:@selector(cancelBtnClick) forControlEvents:UIControlEventTouchUpInside];
        _cancelBtn.layer.cornerRadius = 4;
        _cancelBtn.backgroundColor = HexRGBAlpha(0xDC6E6E, 1);
        [_cancelBtn setTitle:[RXFeedbackLocation osLaunguage:@"关闭"] forState:UIControlStateNormal];
        [_cancelBtn.titleLabel setFont:[UIFont systemFontOfSize:RXUScaleWidth(14) weight:UIFontWeightSemibold]];
        [_cancelBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _cancelBtn.titleLabel.lineBreakMode = NSLineBreakByWordWrapping;
        _cancelBtn.titleLabel.numberOfLines = 0;
    }
    return _cancelBtn;
}

- (UIScrollView *)bgBackScrollview{
    if (!_bgBackScrollview) {
        _bgBackScrollview = [[UIScrollView alloc] initWithFrame:CGRectZero];
        _bgBackScrollview.showsHorizontalScrollIndicator = NO;
        _bgBackScrollview.showsVerticalScrollIndicator = YES;
        _bgBackScrollview.backgroundColor = [UIColor clearColor];
//        _attachmentsScrollView.delegate = self;
    }
    return _bgBackScrollview;
}

- (UILabel *)feedbackLabel{
    if (!_feedbackLabel) {
        _feedbackLabel = [[UILabel alloc] init];
        _feedbackLabel.textColor = [UIColor blackColor];
        _feedbackLabel.backgroundColor = [UIColor clearColor];
        _feedbackLabel.font = [UIFont systemFontOfSize:RXUScaleWidth(11)];
        _feedbackLabel.textAlignment = NSTextAlignmentLeft;
        _feedbackLabel.numberOfLines = 0;
        _feedbackLabel.lineBreakMode = NSLineBreakByWordWrapping;
    }
    return _feedbackLabel;
}

- (UIScrollView *)feedbackAttachmentsScrollView{
    if (!_feedbackAttachmentsScrollView) {
        _feedbackAttachmentsScrollView = [[UIScrollView alloc] initWithFrame:CGRectZero];
        _feedbackAttachmentsScrollView.showsHorizontalScrollIndicator = NO;
        _feedbackAttachmentsScrollView.showsVerticalScrollIndicator = NO;
        _feedbackAttachmentsScrollView.backgroundColor = [UIColor clearColor];
//        _attachmentsScrollView.delegate = self;
    }
    return _feedbackAttachmentsScrollView;
}

- (UIView *)backView{
    if (!_backView) {
        _backView = [[UIView alloc] init];
        _backView.backgroundColor = HexRGBAlpha(0xF7F7F7, 1.0);
        _backView.layer.cornerRadius = 4;
    }
    return _backView;
}

- (UILabel *)backTitleLabel{
    if (!_backTitleLabel) {
        _backTitleLabel = [[UILabel alloc] init];
        _backTitleLabel.textColor = [UIColor blackColor];
        _backTitleLabel.backgroundColor = [UIColor clearColor];
        _backTitleLabel.font = [UIFont systemFontOfSize:RXUScaleWidth(14) weight:UIFontWeightBold];
        _backTitleLabel.textAlignment = NSTextAlignmentLeft;
        _backTitleLabel.numberOfLines = 0;
        _backTitleLabel.lineBreakMode = NSLineBreakByWordWrapping;
        _backTitleLabel.text = [RXFeedbackLocation osLaunguage:@"回复内容:"];
    }
    return _backTitleLabel;
}

- (UILabel *)backContentLabel{
    if (!_backContentLabel) {
        _backContentLabel = [[UILabel alloc] init];
        _backContentLabel.textColor = [UIColor blackColor];
        _backContentLabel.backgroundColor = [UIColor clearColor];
        _backContentLabel.font = [UIFont systemFontOfSize:RXUScaleWidth(11)];
        _backContentLabel.textAlignment = NSTextAlignmentLeft;
        _backContentLabel.numberOfLines = 0;
        _backContentLabel.lineBreakMode = NSLineBreakByWordWrapping;
    }
    return _backContentLabel;
}

- (UIScrollView *)backPicScrollView{
    if (!_backPicScrollView) {
        _backPicScrollView = [[UIScrollView alloc] initWithFrame:CGRectZero];
        _backPicScrollView.showsHorizontalScrollIndicator = NO;
        _backPicScrollView.showsVerticalScrollIndicator = NO;
        _backPicScrollView.backgroundColor = [UIColor clearColor];
//        _attachmentsScrollView.delegate = self;
    }
    return _backPicScrollView;
}

- (UILabel *)propTitleLabel{
    if (!_propTitleLabel) {
        _propTitleLabel = [[UILabel alloc] init];
        _propTitleLabel.textColor = [UIColor blackColor];
        _propTitleLabel.backgroundColor = [UIColor clearColor];
        _propTitleLabel.font = [UIFont systemFontOfSize:RXUScaleWidth(14) weight:UIFontWeightBold];
        _propTitleLabel.textAlignment = NSTextAlignmentLeft;
        _propTitleLabel.numberOfLines = 0;
        _propTitleLabel.lineBreakMode = NSLineBreakByWordWrapping;
        _propTitleLabel.text = [RXFeedbackLocation osLaunguage:@"附件:"];
    }
    return _propTitleLabel;
}

- (UIScrollView *)propScrollView{
    if (!_propScrollView) {
        _propScrollView = [[UIScrollView alloc] initWithFrame:CGRectZero];
        _propScrollView.showsHorizontalScrollIndicator = NO;
        _propScrollView.showsVerticalScrollIndicator = NO;
        _propScrollView.backgroundColor = [UIColor clearColor];
//        _attachmentsScrollView.delegate = self;
    }
    return _propScrollView;
}

- (RXPlayerGiftPopView *)giftPopView{
    if (!_giftPopView) {
        _giftPopView = [[RXPlayerGiftPopView alloc] init];
        _giftPopView.hidden = YES;
    }
    return _giftPopView;
}

@end
