//
//  CHSettingLoginView.h
//  RXSDKDemo-Public
//
//  Created by 陈汉 on 2024/1/3.
//

#import <UIKit/UIKit.h>
#import "CHSettingCellModel.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^SelectedBlock)(BOOL isSelected);

@interface CHSettingLoginView : UIView

@property (nonatomic, copy) SelectedBlock selectBlock;

- (void)setModel:(CHSettingCellModel *)model;

@end

NS_ASSUME_NONNULL_END
