//
//  RXSingleTextField.h
//  RXUIKit
//
//  Created by 陈汉 on 2025/6/24.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef enum : NSUInteger {
    SingleTFType_clear, // 清除
    SingleTFType_code, // 验证码
    SingleTFType_pwd,  // 登录密码样式
    SingleTFType_pwdNormal,  // 普通密码样式
    SingleTFType_loginCode,  // 登录验证码样式
    SingleTFType_default,
} SingleTFType;

typedef void(^ClearBtnBlock)(void);
typedef void(^ForgetBtnBlock)(void);
typedef void(^sendCodeBtnBlock)(void);
typedef void(^ShowPwdBtnBlock)(BOOL isSecret);

@interface RXSingleTextField : UIView

@property (nonatomic, strong) NSString *placehoder;
@property (nonatomic, strong) UITextField *tf; // 输入框
@property (nonatomic, strong) UILabel *codeLbl;
@property (nonatomic, strong) UIButton *clearBtn; // 清除按钮 默认隐藏
@property (nonatomic, strong) UIButton *showPwdBtn; // 眼睛
@property (nonatomic, strong) UIButton *forgetPwdBtn;
@property (nonatomic, strong) UIView *line;
@property (nonatomic, strong) UILabel *placeholderLbl; // 占位
@property (nonatomic, copy) ClearBtnBlock clearBlock; // 清除按钮block
@property (nonatomic, copy) ForgetBtnBlock forgetBlock; // 忘记密码按钮block
@property (nonatomic, copy) sendCodeBtnBlock sendCodeBlock; // 获取验证码按钮block
@property (nonatomic, copy) ShowPwdBtnBlock showPwdBtnBlock; // 显示/隐藏按钮block
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, assign) BOOL isFirstDelete;

/**
 * @param placeholder 占位文字
 * @param type 类型
 * @param keyboardType 键盘类型
 */
- (instancetype)initWithPlaceholder:(NSString *)placeholder
                               type:(SingleTFType)type
                       keyboardType:(UIKeyboardType)keyboardType;

- (void)changeType:(SingleTFType)type;

- (void)refreshView;

- (void)showAnimate;

- (void)showPwdBtnAction:(UIButton *)btn;

@end

NS_ASSUME_NONNULL_END
