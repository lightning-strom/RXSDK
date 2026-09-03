//
//  RXPlayerFeedbackUploadView.m
//  RXUIKit-OS
//
//  Created by root11 on 2024/9/11.
//

#import "RXPlayerFeedbackUploadView.h"
#import "RXFeedbackTool.h"
#import <RXSDK_Pure/RX_CommonNetworkExcuteManager.h>
#import "RXPlayerFeedBackItemView.h"
#import "TZImagePickerController.h"
#import "RXPlayerFeedbackImageModel.h"
#import "RXPlayerFeedbackUploadManager.h"
#import "RXPlayerFeedbackService.h"

@interface RXPlayerFeedbackUploadView ()<UITextFieldDelegate, UITextViewDelegate>
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UIButton *backBtn;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UIButton *closeBtn;
@property (nonatomic, strong) UIButton *submitBtn;

@property (nonatomic, strong) UITextView *textView;
@property (strong, nonatomic) UILabel *placeholderLabel;
@property (nonatomic, strong) UILabel *wordCountLabel;//计算字数

@property (nonatomic, strong) UILabel *addattachmentsLabel;//添加附件label
@property (nonatomic, strong) UIScrollView *attachmentsScrollView;//附件背景View

@property (nonatomic, strong) UILabel *phontTitleLabel;//联系电话
@property (nonatomic, strong) UITextField *phoneTextField;//输入电话

@property (nonatomic, strong) UITextField *activeTextField;
@property (nonatomic, strong) UITextView *activeTextView;

@property (nonatomic, strong) NSMutableArray *selectModelArray;//最终的oss地址数组
@property (nonatomic, strong) NSMutableArray *selectedPhotos;//选择的图片数组
@property (nonatomic, strong) NSMutableArray *selectedAssets;//选择的资源数组
@property (nonatomic, strong) NSMutableArray *picViewArray;//选择图片或视频的view数组

@property (nonatomic, strong) RXPlayerFeedBackItemView *currentItemView;

@end

@implementation RXPlayerFeedbackUploadView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)init
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        [[UIViewController currentViewController].view addSubview:self];
        [[UIViewController currentViewController].view bringSubviewToFront:self];
                
        // 注册键盘将要显示的通知
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(keyboardWillShow:)
                                                     name:UIKeyboardWillShowNotification
                                                   object:nil];
        
        // 注册键盘将要隐藏的通知
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                     selector:@selector(keyboardWillHide:)
                                                         name:UIKeyboardWillHideNotification
                                                       object:nil];
        
        [self setUI];
        [self show];
        
    }
    return self;
}

#pragma mark - request

#pragma mark -- <setUI>

- (void)show
{
    [RXFeedbackTool transformWithView:self.bgView];
    [UIView animateWithDuration:0.1 animations:^{
        [RXFeedbackTool showWithAnimate:self.bgView];
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
}

- (void)setUI
{
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.backBtn];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.closeBtn];
    [self.bgView addSubview:self.submitBtn];
    
    [self.bgView addSubview:self.textView];
    [self.textView addSubview:self.placeholderLabel];
    [self.textView addSubview:self.wordCountLabel];
    
    [self.bgView addSubview:self.addattachmentsLabel];
    [self.bgView addSubview:self.attachmentsScrollView];
    
    [self.bgView addSubview:self.phontTitleLabel];
    [self.bgView addSubview:self.phoneTextField];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    if (RXAC) {
        self.bgView.frame = CGRectMake(0, 0, RXUScaleWidth(531), RXUScaleWidth(311));
        self.bgView.center = window.center;
        //横屏
        CGFloat bgViewWidth = self.bgView.frame.size.width;
        CGFloat bgViewHeight = self.bgView.frame.size.height;
        
        self.titleLbl.frame = CGRectMake(0, 0, bgViewWidth, RXUScaleWidth(45));
        
        self.textView.frame = CGRectMake(17, self.titleLbl.frame.size.height, bgViewWidth - 34, RXUScaleWidth(76));
        self.placeholderLabel.frame = CGRectMake(2, 5, self.textView.frame.size.width - 4, 15);
        
        
        if ([RXFeedbackTool isRTL]) {
            self.textView.textAlignment = NSTextAlignmentRight;
            
            self.backBtn.frame = CGRectMake(bgViewWidth - 12 - RXUScaleWidth(25), RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            self.closeBtn.frame = CGRectMake(17, RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            self.submitBtn.frame = CGRectMake(24, bgViewHeight - 13 - RXUScaleWidth(38), RXUScaleWidth(132), RXUScaleWidth(38));
            
            self.wordCountLabel.textAlignment = NSTextAlignmentLeft;
            self.wordCountLabel.frame = CGRectMake(0, self.textView.frame.size.height - 2 - RXUScaleWidth(15), RXUScaleWidth(60), RXUScaleWidth(15));
            
            self.addattachmentsLabel.textAlignment = NSTextAlignmentRight;
            self.addattachmentsLabel.frame = CGRectMake(bgViewWidth - 17 - RXUScaleWidth(80), CGRectGetMaxY(self.textView.frame) + 6, RXUScaleWidth(80), RXUScaleWidth(20));
            self.attachmentsScrollView.frame = CGRectMake(bgViewWidth - 17  - self.addattachmentsLabel.frame.size.width - (RXUScaleWidth(65) * 5 + 20), CGRectGetMaxY(self.textView.frame) + 6, RXUScaleWidth(65) * 5 + 20, RXUScaleWidth(65));
            
            self.phontTitleLabel.textAlignment = NSTextAlignmentRight;
            self.phontTitleLabel.frame = CGRectMake(bgViewWidth - 17 - RXUScaleWidth(80), CGRectGetMaxY(self.attachmentsScrollView.frame) + 34, RXUScaleWidth(80), RXUScaleWidth(26));
            self.phoneTextField.frame = CGRectMake(bgViewWidth - 17 - self.phontTitleLabel.frame.size.width - RXUScaleWidth(223), CGRectGetMaxY(self.attachmentsScrollView.frame) + 34, RXUScaleWidth(223), RXUScaleWidth(26));
            self.phoneTextField.textAlignment = NSTextAlignmentRight;
            self.placeholderLabel.textAlignment = NSTextAlignmentRight;
            
        }else{
            self.textView.textAlignment = NSTextAlignmentLeft;
            
            self.backBtn.frame = CGRectMake(12, RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            self.closeBtn.frame = CGRectMake(bgViewWidth - 17 - RXUScaleWidth(25), RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            self.submitBtn.frame = CGRectMake(bgViewWidth - 24 - RXUScaleWidth(132), bgViewHeight - 13 - RXUScaleWidth(38), RXUScaleWidth(132), RXUScaleWidth(38));
            
            self.wordCountLabel.textAlignment = NSTextAlignmentRight;
            self.wordCountLabel.frame = CGRectMake(self.textView.frame.size.width - RXUScaleWidth(60), self.textView.frame.size.height - 2 - RXUScaleWidth(15), RXUScaleWidth(60), RXUScaleWidth(15));
            
            self.addattachmentsLabel.textAlignment = NSTextAlignmentLeft;
            self.addattachmentsLabel.frame = CGRectMake(17, CGRectGetMaxY(self.textView.frame) + 6, RXUScaleWidth(80), RXUScaleWidth(36));
            self.attachmentsScrollView.frame = CGRectMake(CGRectGetMaxX(self.addattachmentsLabel.frame), CGRectGetMaxY(self.textView.frame) + 6, RXUScaleWidth(65) * 5 + 20, RXUScaleWidth(65));
            
            self.phontTitleLabel.textAlignment = NSTextAlignmentLeft;
            self.phontTitleLabel.frame = CGRectMake(17, CGRectGetMaxY(self.attachmentsScrollView.frame) + 29, RXUScaleWidth(80), RXUScaleWidth(36));
            self.phoneTextField.frame = CGRectMake(CGRectGetMaxX(self.phontTitleLabel.frame), CGRectGetMaxY(self.attachmentsScrollView.frame) + 34, RXUScaleWidth(223), RXUScaleWidth(26));
            self.phoneTextField.textAlignment = NSTextAlignmentLeft;
            self.placeholderLabel.textAlignment = NSTextAlignmentLeft;
        }
        
    }else{
        self.bgView.frame = CGRectMake(0, 0, RXUScaleWidth(313), RXUScaleWidth(374));
        self.bgView.center = window.center;
        
        CGFloat bgViewWidth = self.bgView.frame.size.width;
        CGFloat bgViewHeight = self.bgView.frame.size.height;
        
        self.titleLbl.frame = CGRectMake(0, 0, bgViewWidth, RXUScaleWidth(45));
        self.submitBtn.frame = CGRectMake((bgViewWidth - RXUScaleWidth(180))/2, bgViewHeight - 16 - RXUScaleWidth(33), RXUScaleWidth(180), RXUScaleWidth(33));
        
        self.textView.frame = CGRectMake(10, self.titleLbl.frame.size.height, bgViewWidth - 20, RXUScaleWidth(120));
        self.placeholderLabel.frame = CGRectMake(2, 5, self.textView.frame.size.width - 4, 15);
        
        if ([RXFeedbackTool isRTL]) {
            self.textView.textAlignment = NSTextAlignmentRight;
            
            self.backBtn.frame = CGRectMake(bgViewWidth - 12 - RXUScaleWidth(25), RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            self.closeBtn.frame = CGRectMake(17, RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            
            self.wordCountLabel.textAlignment = NSTextAlignmentLeft;
            self.wordCountLabel.frame = CGRectMake(0, self.textView.frame.size.height - 2 - RXUScaleWidth(15), RXUScaleWidth(60), RXUScaleWidth(15));
            
            self.addattachmentsLabel.textAlignment = NSTextAlignmentRight;
            self.addattachmentsLabel.frame = CGRectMake(bgViewWidth - 10 - (bgViewWidth - 10), CGRectGetMaxY(self.textView.frame) + 11, bgViewWidth - 10, RXUScaleWidth(20));
            self.attachmentsScrollView.frame = CGRectMake(bgViewWidth - 10 - (RXUScaleWidth(50) * 5 + 20), CGRectGetMaxY(self.addattachmentsLabel.frame) + 3, RXUScaleWidth(50) * 5 + 20, RXUScaleWidth(50));
            
            self.phontTitleLabel.textAlignment = NSTextAlignmentRight;
            self.phontTitleLabel.frame = CGRectMake(bgViewWidth - 10 - RXUScaleWidth(80), CGRectGetMaxY(self.attachmentsScrollView.frame) + 26, RXUScaleWidth(80), RXUScaleWidth(26));
            self.phoneTextField.frame = CGRectMake(bgViewWidth - 10 - self.phontTitleLabel.frame.size.width - (bgViewWidth - 20 - RXUScaleWidth(80)), CGRectGetMaxY(self.attachmentsScrollView.frame) + 26, bgViewWidth - 20 - RXUScaleWidth(80), RXUScaleWidth(26));
            self.phoneTextField.textAlignment = NSTextAlignmentRight;
            self.placeholderLabel.textAlignment = NSTextAlignmentRight;
            
        }else{
            self.textView.textAlignment = NSTextAlignmentLeft;
            
            self.backBtn.frame = CGRectMake(12, RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            self.closeBtn.frame = CGRectMake(bgViewWidth - 17 - RXUScaleWidth(25), RXUScaleWidth(10), RXUScaleWidth(25), RXUScaleWidth(25));
            
            self.wordCountLabel.textAlignment = NSTextAlignmentRight;
            self.wordCountLabel.frame = CGRectMake(self.textView.frame.size.width - RXUScaleWidth(60), self.textView.frame.size.height - 2 - RXUScaleWidth(15), RXUScaleWidth(60), RXUScaleWidth(15));
            
            self.addattachmentsLabel.textAlignment = NSTextAlignmentLeft;
            self.addattachmentsLabel.frame = CGRectMake(10, CGRectGetMaxY(self.textView.frame) + 11, bgViewWidth - 10, RXUScaleWidth(20));
            self.attachmentsScrollView.frame = CGRectMake(10, CGRectGetMaxY(self.addattachmentsLabel.frame) + 3, RXUScaleWidth(50) * 5 + 20, RXUScaleWidth(50));
            
            self.phontTitleLabel.textAlignment = NSTextAlignmentLeft;
            self.phontTitleLabel.frame = CGRectMake(10, CGRectGetMaxY(self.attachmentsScrollView.frame) + 21, RXUScaleWidth(80), RXUScaleWidth(36));
            self.phoneTextField.frame = CGRectMake(CGRectGetMaxX(self.phontTitleLabel.frame), CGRectGetMaxY(self.attachmentsScrollView.frame) + 26, bgViewWidth - 10 - self.phontTitleLabel.frame.size.width - 10, RXUScaleWidth(26));
            self.phoneTextField.textAlignment = NSTextAlignmentLeft;
            self.placeholderLabel.textAlignment = NSTextAlignmentLeft;
        }
    }
    [self refreshScrollView];
    [self layoutSubviews];
}

- (void)refreshScrollView{
    for (UIView *subview in self.attachmentsScrollView.subviews) {
        [subview removeFromSuperview];
    }
    
    CGFloat scrollViewTotalWidth = RXUScaleWidth(65) * 5 + 20;
    CGFloat subviewWidth = RXUScaleWidth(65);
    if (!RXAC) {//竖屏
        scrollViewTotalWidth = RXUScaleWidth(50) * 5 + 20;
        subviewWidth = RXUScaleWidth(50);
    }
    
    //TODO: 刷新调整多语言后，self.phontTitleLabel.frame、self.addattachmentsLabel.frame
    if (RXAC) {
        
    }else{
        
    }
    
    for (int i = 0; i < self.selectedPhotos.count + 1; i ++) {
        if (i == self.selectedPhotos.count) {
            if (self.selectedPhotos.count == 5) {
                return;
            }
            RXPlayerFeedBackItemView *itemView = [[RXPlayerFeedBackItemView alloc] init];
            itemView.tag = i;
            if ([RXFeedbackTool isRTL]){
                itemView.frame = CGRectMake(scrollViewTotalWidth - (i * 5 + (i + 1) * subviewWidth), 0, subviewWidth, subviewWidth);
            }else{
                itemView.frame = CGRectMake(i * subviewWidth + i * 5, 0, subviewWidth, subviewWidth);
            }
            itemView.playImageView.hidden = YES;
            itemView.countLabel.hidden = YES;
            itemView.backImageView.image = [UIImage rxFeedbackBundleImageNamed:@"rx_feedback_addImage"];
            [self.attachmentsScrollView addSubview:itemView];
            [itemView addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapClick)]];
        }else {
            RXPlayerFeedBackItemView *itemView = [[RXPlayerFeedBackItemView alloc] init];
            itemView.tag = i;
            if ([RXFeedbackTool isRTL]) {
                itemView.frame = CGRectMake(scrollViewTotalWidth - (i * 5 + (i + 1) * subviewWidth), 0, subviewWidth, subviewWidth);
            }else{
                itemView.frame = CGRectMake(i * subviewWidth + i * 5, 0, subviewWidth, subviewWidth);
            }
            RXPlayerFeedbackImageModel *model = self.selectModelArray[i];
            itemView.backImageView.image = model.screenimage;
            if ([model.type isEqualToString:@"video"]) {
                itemView.playImageView.hidden = NO;
            }else{
                itemView.playImageView.hidden = YES;
            }
            [self.attachmentsScrollView addSubview:itemView];
            [self.picViewArray addObject:itemView];
            [itemView addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapClick)]];
        }
    }
}

#pragma mark - notification
// 键盘即将显示时调用的方法
- (void)keyboardWillShow:(NSNotification *)notification {
    // 获取键盘的尺寸和动画时间
    NSDictionary *userInfo = notification.userInfo;
    CGRect keyboardFrame = [userInfo[UIKeyboardFrameEndUserInfoKey] CGRectValue];
    CGFloat keyboardHeight = keyboardFrame.size.height;
    double animationDuration = [userInfo[UIKeyboardAnimationDurationUserInfoKey] doubleValue];
    
    if (self.activeTextField) {
        UIWindow *keyWindow = [UIApplication.sharedApplication keyWindow];
        CGRect activeFieldRect = [keyWindow convertRect:self.activeTextField.frame fromView:self.activeTextField.superview];
        CGFloat bottomOfTextField = CGRectGetMaxY(activeFieldRect);
        CGFloat topOfKeyboard = keyWindow.frame.size.height - keyboardHeight;
        
        // 如果输入框被键盘遮挡，则调整视图
        if (bottomOfTextField > topOfKeyboard) {
            [UIView animateWithDuration:animationDuration animations:^{
                self.frame = CGRectMake(0, -(bottomOfTextField - topOfKeyboard + 10), self.frame.size.width, self.frame.size.height);
            }];
        }
    }
}

// 键盘即将隐藏时调用的方法
- (void)keyboardWillHide:(NSNotification *)notification {
    // 获取动画时间
    NSDictionary *userInfo = notification.userInfo;
    double animationDuration = [userInfo[UIKeyboardAnimationDurationUserInfoKey] doubleValue];
    
    // 执行动画，恢复视图到原来的位置
    [UIView animateWithDuration:animationDuration animations:^{
        self.frame = CGRectMake(0, 0, self.frame.size.width, self.frame.size.height);
    }];
}

#pragma mark -- <actions>
- (void)submitBtnAction{
    if (self.textView.text.length == 0) {
        [RXFeedbackHUD showText:[RXFeedbackLocation osLaunguage:@"请输入您的意见反馈"]];
        return;
    }
    
    [RXFeedbackHUD showHUDNotAutoHide];
    if (self.selectModelArray.count > 0) {
        [self uploadImageAndVideoWithNum:0];
    }else{
        [self submitFeedback];
    }
}
//上传oss
- (void)uploadImageAndVideoWithNum:(int)num{
    //隐藏视频播放按钮
    for (RXPlayerFeedBackItemView *subView in self.picViewArray) {
        subView.playImageView.hidden = YES;
    }
    
    __weak typeof(self) weakSelf = self;
    self.currentItemView = (RXPlayerFeedBackItemView *)self.picViewArray[num];
    RXPlayerFeedbackImageModel *uploadModel = self.selectModelArray[num];
    
    if ([uploadModel.type isEqualToString:@"image"]) {
        NSString *ossPath = [NSString stringWithFormat:@"iOS_feedback_file/%@_%@.png",[[RXService sharedSDK] getOpenID], [[NSUUID UUID] UUIDString]];
        NSData *data = UIImagePNGRepresentation(uploadModel.screenimage);
        
        [[RXOSSPutManager sharedSDK] uploadWithBodyData:data ossPath:ossPath process:^(float process) {
            dispatch_async(dispatch_get_main_queue(), ^{
                weakSelf.currentItemView.countLabel.text = [NSString stringWithFormat:@"%.0f%%", process * 100];
            });
            
        } complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            if (!error) {
                uploadModel.uploadString = response[@"url"];
                [weakSelf.selectModelArray replaceObjectAtIndex:num withObject:uploadModel];
//                weakSelf.currentItemView.countLabel.hidden = YES;
//                weakSelf.currentItemView.playImageView.hidden = YES;
                
                if (num == weakSelf.selectModelArray.count - 1) {
                    [weakSelf submitFeedback];
                }else{
                    [weakSelf uploadImageAndVideoWithNum:num + 1];
                }
            }else{
                [RXFeedbackHUD showErrorText:error.responesObject[@"msg"]];
            }
        }];
    }else{
        [[RXPlayerFeedbackUploadManager sharedSDK] exportVideoToMP4FromAsset:uploadModel.asset completion:^(NSURL * _Nonnull mp4URL, NSError * _Nonnull error) {
            if (mp4URL) {
                NSString *ossPath = [NSString stringWithFormat:@"iOS_feedback_file/%@_%@.mp4",[[RXService sharedSDK] getOpenID], [[NSUUID UUID] UUIDString]];
                NSData *data = [[RXPlayerFeedbackUploadManager sharedSDK] convertMP4URLToData:mp4URL];
                
                [[RXOSSPutManager sharedSDK] uploadWithBodyData:data ossPath:ossPath process:^(float process) {
                    dispatch_async(dispatch_get_main_queue(), ^{
                        weakSelf.currentItemView.countLabel.text = [NSString stringWithFormat:@"%.0f%%", process * 100];
                    });
                    
                } complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    if (!error) {
                        uploadModel.uploadString = response[@"url"];
                        [weakSelf.selectModelArray replaceObjectAtIndex:num withObject:uploadModel];
//                        weakSelf.currentItemView.countLabel.hidden = YES;
//                        weakSelf.currentItemView.playImageView.hidden = NO;
                        
                        if (num == weakSelf.selectModelArray.count - 1) {
                            [weakSelf submitFeedback];
                        }else{
                            [weakSelf uploadImageAndVideoWithNum:num + 1];
                        }
                    }else{
                        [RXFeedbackHUD showErrorText:error.responesObject[@"msg"]];
                    }
                }];
            } else {
                [RXFeedbackHUD showErrorText:[RXFeedbackLocation osLaunguage:@"视频文件导出失败"]];
            }
        }];
    }
    
}

- (void)submitFeedback{
    [[RXPlayerFeedbackUploadManager sharedSDK] clearFeedbackVideoDirectory];//删除本地存储的video文件
    
    NSMutableArray *mArray = [NSMutableArray array];
    if (self.selectModelArray.count > 0) {
        for (int i = 0; i < self.selectModelArray.count; i ++) {
            RXPlayerFeedbackImageModel *model = self.selectModelArray[i];
            [mArray addObject:model.uploadString];
        }
    }
    __weak typeof(self) weakSelf = self;
    [[RXApiService sharedSDK] feedbackCreateWithContent:self.textView.text attachments:mArray phone:self.phoneTextField.text tags:@[] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            [RXFeedbackHUD showSuccessText:[RXFeedbackLocation osLaunguage:@"提交成功"]];
            [weakSelf hide];
        }else{
            [RXFeedbackHUD showErrorText:error.responesObject[@"msg"]];
        }
    }];
}

- (void)closeBtnClick{
    [self hide];
}

- (void)tapClick{
    TZImagePickerController *imagePickerVc = [[TZImagePickerController alloc] initWithMaxImagesCount:5 delegate:self];
    NSString *language = [RXFeedbackTool getLanguage];
    if ([language isEqualToString:@"en"]) {
        imagePickerVc.preferredLanguage = @"en";
    }else if ([language isEqualToString:@"ja"]) {
        imagePickerVc.preferredLanguage = @"ja";
    }else if ([language isEqualToString:@"id"]) {//印尼
        NSBundle *bundle = [NSBundle bundleForClass:[RXPlayerFeedbackService class]];
        NSURL *url = [bundle URLForResource:@"TZLanguage-id" withExtension:@"bundle"];
        NSBundle *languageBundle = [NSBundle bundleWithURL:url];
        imagePickerVc.languageBundle = languageBundle;
    }else if ([language isEqualToString:@"tc"]) {
        imagePickerVc.preferredLanguage = @"zh-Hant";
    }else if ([language isEqualToString:@"th"]) {//泰语
        NSBundle *bundle = [NSBundle bundleForClass:[RXPlayerFeedbackService class]];
        NSURL *url = [bundle URLForResource:@"TZLanguage-th" withExtension:@"bundle"];
        NSBundle *languageBundle = [NSBundle bundleWithURL:url];
        imagePickerVc.languageBundle = languageBundle;
    }else if ([language isEqualToString:@"tl"]) {//菲律宾语
        NSBundle *bundle = [NSBundle bundleForClass:[RXPlayerFeedbackService class]];
        NSURL *url = [bundle URLForResource:@"TZLanguage-tl" withExtension:@"bundle"];
        NSBundle *languageBundle = [NSBundle bundleWithURL:url];
        imagePickerVc.languageBundle = languageBundle;
    }else if ([language isEqualToString:@"vi"]) {
        imagePickerVc.preferredLanguage = @"vi";
    }else if ([language isEqualToString:@"ar"]) {
        imagePickerVc.preferredLanguage = @"ar";
    }
    
    imagePickerVc.selectedAssets = self.selectedAssets;
    imagePickerVc.alwaysEnableDoneBtn = YES;
    
    imagePickerVc.allowTakePicture = NO; //是否允许拍照
    imagePickerVc.allowCrop = YES; //是否裁剪
    
    imagePickerVc.allowPickingVideo = YES; //是否允许选择视频
    imagePickerVc.allowPickingMultipleVideo = YES;
    
    imagePickerVc.allowTakeVideo = NO; // 在内部显示拍视频按
    imagePickerVc.allowEditVideo = NO; // 允许编辑视频
    imagePickerVc.presetName = AVAssetExportPresetLowQuality; // 编辑后的视频的导出质量
    __weak typeof(self) weakSelf = self;
    [imagePickerVc setDidFinishPickingPhotosHandle:^(NSArray<UIImage *> *photos, NSArray *assets, BOOL isSelectOriginalPhoto) {
        weakSelf.selectedPhotos = [NSMutableArray arrayWithArray:photos];
        weakSelf.selectedAssets = [NSMutableArray arrayWithArray:assets];
        if (weakSelf.selectModelArray.count > 0) {
            [weakSelf.selectModelArray removeAllObjects];
        }
        for (int i = 0 ; i < weakSelf.selectedPhotos.count; i ++) {
            RXPlayerFeedbackImageModel *model = [[RXPlayerFeedbackImageModel alloc] init];
            model.screenimage = weakSelf.selectedPhotos[i];
            
            PHAsset *asset = weakSelf.selectedAssets[i];
            model.asset = asset;
            if (asset.mediaType == PHAssetMediaTypeImage) {
                model.type = @"image";
            } else if (asset.mediaType == PHAssetMediaTypeVideo) {
                model.type = @"video";
            }
            [weakSelf.selectModelArray addObject:model];
        }
        [weakSelf refreshScrollView];
    }];
    imagePickerVc.modalPresentationStyle = UIModalPresentationFullScreen;
    [[UIViewController currentViewController] presentViewController:imagePickerVc animated:YES completion:nil];
}

//此方法暂时不调用
- (void)previewClick:(UITapGestureRecognizer *)tap{
    UIView *view = tap.view;
    TZImagePickerController *imagePickerVc = [[TZImagePickerController alloc] initWithSelectedAssets:self.selectedAssets selectedPhotos:self.selectedPhotos index:view.tag];
    imagePickerVc.maxImagesCount = 5;
    imagePickerVc.allowPickingGif = YES;
    imagePickerVc.autoSelectCurrentWhenDone = NO;
    imagePickerVc.allowPickingOriginalPhoto = YES;
    imagePickerVc.allowPickingMultipleVideo = YES;
    imagePickerVc.showSelectedIndex = YES;
    imagePickerVc.isSelectOriginalPhoto = YES;
    
    imagePickerVc.allowTakePicture = NO; //是否允许拍照
    imagePickerVc.allowCrop = YES; //是否裁剪
    imagePickerVc.allowPickingVideo = YES; //是否允许选择视频
    imagePickerVc.allowTakeVideo = NO; // 在内部显示拍视频按
    imagePickerVc.allowEditVideo = NO; // 允许编辑视频
    imagePickerVc.presetName = AVAssetExportPresetLowQuality; // 编辑后的视频的导出质量
    
    imagePickerVc.modalPresentationStyle = UIModalPresentationFullScreen;
    __weak typeof(self) weakSelf = self;
    [imagePickerVc setDidFinishPickingPhotosHandle:^(NSArray<UIImage *> *photos, NSArray *assets, BOOL isSelectOriginalPhoto) {
        weakSelf.selectedPhotos = [NSMutableArray arrayWithArray:photos];
        weakSelf.selectedAssets = [NSMutableArray arrayWithArray:assets];
        if (weakSelf.selectModelArray.count > 0) {
            [weakSelf.selectModelArray removeAllObjects];
        }
        for (int i = 0 ; i < weakSelf.selectedPhotos.count; i ++) {
            RXPlayerFeedbackImageModel *model = [[RXPlayerFeedbackImageModel alloc] init];
            model.screenimage = weakSelf.selectedPhotos[i];
            
            PHAsset *asset = weakSelf.selectedAssets[i];
            model.asset = asset;
            if (asset.mediaType == PHAssetMediaTypeImage) {
                model.type = @"image";
            } else if (asset.mediaType == PHAssetMediaTypeVideo) {
                model.type = @"video";
            }
            [weakSelf.selectModelArray addObject:model];
        }
        [weakSelf refreshScrollView];
    }];
    [[UIViewController currentViewController] presentViewController:imagePickerVc animated:YES completion:nil];
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
    [self.textView resignFirstResponder];
    [self.phoneTextField resignFirstResponder];
}

#pragma mark - UITextFieldDelegate
- (void)textFieldDidBeginEditing:(UITextField *)textField{
    self.activeTextField = textField;
}

- (void)textFieldDidEndEditing:(UITextField *)textField {
    self.activeTextField = nil;
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    [textField resignFirstResponder];
    return YES;
}


#pragma mark - UITextViewDelegate
- (void)textViewDidBeginEditing:(UITextView *)textView{
    self.activeTextView = textView;
}

- (void)textViewDidEndEditing:(UITextView *)textView{
    self.activeTextView = textView;
}

- (BOOL)textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text {
     if ([text isEqualToString:@"\n"]) {
         [textView resignFirstResponder];
         return NO;
     }
     return YES;
 }

- (void)textViewDidChange:(UITextView *)textView{
    self.placeholderLabel.hidden = textView.text.length > 0;
    NSInteger wordCount = textView.text.length;
    self.wordCountLabel.text = [NSString stringWithFormat:@"%ld/200", wordCount];
    
    NSInteger maxWordCount = 200;
    if (wordCount >= maxWordCount) {
        textView.text = [textView.text substringToIndex:maxWordCount];
        self.wordCountLabel.text = [NSString stringWithFormat:@"%ld/200", maxWordCount];
    }
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
        _titleLbl.text = [RXFeedbackLocation osLaunguage:@"我要反馈"];
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

- (UIButton *)submitBtn{
    if (!_submitBtn) {
        _submitBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_submitBtn addTarget:self action:@selector(submitBtnAction) forControlEvents:UIControlEventTouchUpInside];
        _submitBtn.layer.cornerRadius = 4;
        _submitBtn.backgroundColor = HexRGBAlpha(0x20C0B3, 1);
        [_submitBtn setTitle:[RXFeedbackLocation osLaunguage:@"提交"] forState:UIControlStateNormal];
        [_submitBtn.titleLabel setFont:[UIFont systemFontOfSize:RXUScaleWidth(12) weight:UIFontWeightSemibold]];
        [_submitBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _submitBtn.titleLabel.lineBreakMode = NSLineBreakByWordWrapping;
        _submitBtn.titleLabel.numberOfLines = 0;
    }
    return _submitBtn;
}

- (NSMutableArray *)selectModelArray{
    if (!_selectModelArray) {
        _selectModelArray = [[NSMutableArray alloc] init];
    }
    return _selectModelArray;
}

- (NSMutableArray *)selectedPhotos{
    if (!_selectedPhotos) {
        _selectedPhotos = [[NSMutableArray alloc] init];
    }
    return _selectedPhotos;
}

- (NSMutableArray *)selectedAssets{
    if (!_selectedAssets) {
        _selectedAssets = [[NSMutableArray alloc] init];
    }
    return _selectedAssets;
}

- (UITextView *)textView{
    if (!_textView) {
        _textView = [[UITextView alloc] init];
        _textView.backgroundColor = HexRGBAlpha(0xF4F4F4, 1.0);
        _textView.textColor = [UIColor blackColor];
        _textView.font = [UIFont systemFontOfSize:RXUScaleWidth(11)];
        _textView.layer.cornerRadius = 4;
        _textView.delegate = self;
        _textView.keyboardType = UIKeyboardTypeDefault;
    }
    return _textView;
}

- (UILabel *)placeholderLabel
{
    if (!_placeholderLabel) {
        _placeholderLabel = [[UILabel alloc] init];
        _placeholderLabel.text = [RXFeedbackLocation osLaunguage:@"请输入您的意见反馈"];
        _placeholderLabel.textColor = HexRGBAlpha(0x767676, 1.0);
        _placeholderLabel.backgroundColor = [UIColor clearColor];
        _placeholderLabel.font = [UIFont systemFontOfSize:RXUScaleWidth(11)];
        _placeholderLabel.textAlignment = NSTextAlignmentLeft;
    }
    return _placeholderLabel;
}

- (UILabel *)wordCountLabel
{
    if (!_wordCountLabel) {
        _wordCountLabel = [[UILabel alloc] init];
        _wordCountLabel.text = @"0/200";
        _wordCountLabel.textColor = HexRGBAlpha(0x767676, 1.0);
        _wordCountLabel.backgroundColor = [UIColor clearColor];
        _wordCountLabel.font = [UIFont systemFontOfSize:RXUScaleWidth(11)];
        _wordCountLabel.textAlignment = NSTextAlignmentRight;
    }
    return _wordCountLabel;
}


- (UILabel *)addattachmentsLabel
{
    if (!_addattachmentsLabel) {
        _addattachmentsLabel = [[UILabel alloc] init];
        _addattachmentsLabel.text = [RXFeedbackLocation osLaunguage:@"添加附件:"];
        _addattachmentsLabel.textColor = HexRGBAlpha(0x323232, 1.0);
        _addattachmentsLabel.backgroundColor = [UIColor clearColor];
        _addattachmentsLabel.font = [UIFont systemFontOfSize:RXUScaleWidth(13) weight:UIFontWeightSemibold];
        _addattachmentsLabel.textAlignment = NSTextAlignmentLeft;
        _addattachmentsLabel.lineBreakMode = NSLineBreakByWordWrapping;
        _addattachmentsLabel.numberOfLines = 0;
    }
    return _addattachmentsLabel;
}

- (UIScrollView *)attachmentsScrollView{
    if (!_attachmentsScrollView) {
        _attachmentsScrollView = [[UIScrollView alloc] initWithFrame:CGRectZero];
        _attachmentsScrollView.showsHorizontalScrollIndicator = NO;
        _attachmentsScrollView.showsVerticalScrollIndicator = NO;
        _attachmentsScrollView.backgroundColor = [UIColor clearColor];
//        _attachmentsScrollView.delegate = self;
    }
    return _attachmentsScrollView;
}

- (UILabel *)phontTitleLabel
{
    if (!_phontTitleLabel) {
        _phontTitleLabel = [[UILabel alloc] init];
        _phontTitleLabel.text = [RXFeedbackLocation osLaunguage:@"联系电话:"];
        _phontTitleLabel.textColor = HexRGBAlpha(0x323232, 1.0);
        _phontTitleLabel.backgroundColor = [UIColor clearColor];
        _phontTitleLabel.font = [UIFont systemFontOfSize:RXUScaleWidth(14) weight:UIFontWeightSemibold];
        _phontTitleLabel.textAlignment = NSTextAlignmentLeft;
        _phontTitleLabel.lineBreakMode = NSLineBreakByWordWrapping;
        _phontTitleLabel.numberOfLines = 0;
    }
    return _phontTitleLabel;
}

- (UITextField *)phoneTextField{
    if (!_phoneTextField) {
        _phoneTextField = [[UITextField alloc] init];
        _phoneTextField.backgroundColor = HexRGBAlpha(0xF4F4F4, 1.0);
        _phoneTextField.textColor = [UIColor blackColor];
        _phoneTextField.font = [UIFont systemFontOfSize:RXUScaleWidth(11)];
        _phoneTextField.borderStyle = UITextBorderStyleNone;
        _phoneTextField.keyboardType = UIKeyboardTypeNumbersAndPunctuation;
        _phoneTextField.layer.cornerRadius = 4;
        _phoneTextField.delegate = self;
        _phoneTextField.placeholder = [RXFeedbackLocation osLaunguage:@"请输入您的手机号方便联系您"];
    }
    return _phoneTextField;
}

- (NSMutableArray *)picViewArray{
    if (!_picViewArray) {
        _picViewArray = [NSMutableArray array];
    }
    return _picViewArray;
}

@end
