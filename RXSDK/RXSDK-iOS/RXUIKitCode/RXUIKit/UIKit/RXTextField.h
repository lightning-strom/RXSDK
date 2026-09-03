//
//  RXTextField.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/28.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef enum : NSUInteger {
    TFType_clear, // 清除
    TFType_code, // 验证码
    TFType_pwd,  // 登录密码样式
    TFType_pwdNormal,  // 普通密码样式
    TFType_loginCode,  // 登录验证码样式
    TFType_default,
} TFType;

typedef void(^ClearBtnBlock)(void);
typedef void(^ForgetBtnBlock)(void);
typedef void(^sendCodeBtnBlock)(void);

@interface RXTextField : UIView

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
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, assign) BOOL isFirstDelete;

/**
 * @param placeholder 占位文字
 * @param type 类型
 * @param keyboardType 键盘类型
 */
- (instancetype)initWithPlaceholder:(NSString *)placeholder
                               type:(TFType)type
                       keyboardType:(UIKeyboardType)keyboardType;

- (void)changeType:(TFType)type;

- (void)refreshView;

- (void)showAnimate;

@end

NS_ASSUME_NONNULL_END
