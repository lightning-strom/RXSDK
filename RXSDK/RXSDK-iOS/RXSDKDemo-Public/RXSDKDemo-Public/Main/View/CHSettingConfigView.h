//
//  CHSettingConfigView.h
//  RXSDKDemo-Public
//
//  Created by 陈汉 on 2024/1/3.
//

#import <UIKit/UIKit.h>
#import "CHSettingCellModel.h"
#import "CHSettingSelectBtn.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^SelectBlock)(NSInteger index);

@interface CHSettingConfigView : UIView

@property (nonatomic, strong) CHSettingSelectBtn *selectBtn;

@property (nonatomic, strong) CHSettingSelectBtn *selectBtn1;

@property (nonatomic, copy) SelectBlock selectBlock;

- (void)setModel:(CHSettingCellModel *)model;

@end

NS_ASSUME_NONNULL_END
