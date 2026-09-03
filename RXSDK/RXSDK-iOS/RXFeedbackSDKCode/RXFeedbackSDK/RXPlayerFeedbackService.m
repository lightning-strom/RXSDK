//
//  RXPlayerFeedbackService.m
//  RXFeedbackSDK
//
//  Created by root11 on 2024/10/23.
//

#import "RXPlayerFeedbackService.h"
#import "RXPlayerFeedbackListView.h"
#import "RXPlayerFeedbackUploadView.h"
#import "RXFeedbackTool.h"

@interface RXPlayerFeedbackService ()
@property (nonatomic, strong) RXPlayerFeedbackListView *feedbackListView;
@property (nonatomic, strong) RXPlayerFeedbackUploadView *feedbackUploadView;

@end

@implementation RXPlayerFeedbackService

static RXPlayerFeedbackService *sharedSDK = nil;

+ (instancetype)sharedSDK {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedSDK = [[self alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        // 初始化属性
    }
    return self;
}

+ (instancetype)allocWithZone:(struct _NSZone *)zone {
    static dispatch_once_t once_Token;
    dispatch_once(&once_Token, ^{
        sharedSDK = [super allocWithZone:zone];
        
    });
    return sharedSDK;
}

- (id)copyWithZone:(NSZone *)zone {
    return sharedSDK;
}

- (id)mutableCopyWithZone:(NSZone *)zone {
    return sharedSDK;
}

/**
 * 我的意见反馈列表
 */
- (void)showFeedbackListView{
    if ([RXFeedbackTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    self.feedbackListView = [[RXPlayerFeedbackListView alloc] init];
}

/**
 * 创建意见反馈
 */
- (void)showCreateFeedbackView{
    if ([RXFeedbackTool isRTL]) {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceRightToLeft;
    } else {
        [UIView appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
        [UISearchBar appearance].semanticContentAttribute = UISemanticContentAttributeForceLeftToRight;
    }
    self.feedbackUploadView = [[RXPlayerFeedbackUploadView alloc] init];
}

@end
