//
//  RXCountryList.m
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/19.
//

#import "RXCountryList.h"
#import "RXOSCloseBtn.h"
#import "RXOSUIKitService.h"

#define CodeTag 10000

typedef void(^SelectCountryBlock)(NSString *code);

@interface RXCountryList () <UITableViewDelegate, UITableViewDataSource, UIScrollViewDelegate, UITextFieldDelegate, UITextViewDelegate>

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UIView *searchBgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) RXOSCloseBtn *backBtn;
@property (nonatomic, strong) UITableView *mTableView;
@property (nonatomic, strong) NSMutableDictionary *sortedNameDict;
@property (nonatomic, strong) NSMutableArray *indexArray;
@property (nonatomic, strong) NSMutableArray *results;
@property (nonatomic, strong) UILabel *placeHolder;
@property (nonatomic, strong) UITextField *tf;
@property (nonatomic, copy) SelectCountryBlock block;

@end

@implementation RXCountryList

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithComplete:(void(^)(NSString *code))block
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
//        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.block = block;
        
        [self setUI];
        
        [self show];
        
        [RXOSUserUtility sharedManager].osVersible = YES;
        
        self.results = [NSMutableArray array];
        
        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapAction:)];
        [self addGestureRecognizer:tap];
    }
    return self;
}

- (void)show
{
    [RXOSCommonTool transformWithView:self.bgView];
    [UIView animateWithDuration:0.1 animations:^{
//        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        [RXOSCommonTool showWithAnimate:self.bgView];
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [RXOSUserUtility sharedManager].osVersible = NO;
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self initParams];
    
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.backBtn];
    [self.bgView addSubview:self.mTableView];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    CGFloat bgW = [RXOSCommonTool getScreenWidth];
    CGFloat bgH = RXAC ? 339 : 334;

    _bgView.frame = CGRectMake(0, CGRectGetHeight(window.frame), bgW, bgH);
//    _bgView.centerX = window.centerX;
    _bgView.center = window.center;
    
    _titleLbl.frame = CGRectMake(0, 21, CGRectGetWidth(_bgView.frame), 24);
    
    if ([RXOSCommonTool isRTL]) {
        _backBtn.frame = CGRectMake(CGRectGetWidth(self.bgView.frame) - 24 - 28, RXAC ? 16 : 17, 28, 28);
    } else {
        _backBtn.frame = CGRectMake(RXAC ? 24 : 24, RXAC ? 16 : 17, 28, 28);
    }
        
    [self.bgView addSubview:self.searchBgView];
    
    _mTableView.frame = CGRectMake(CGRectGetMinX(_searchBgView.frame), CGRectGetMaxY(_searchBgView.frame) + 2, CGRectGetWidth(_searchBgView.frame), CGRectGetHeight(_bgView.frame) - CGRectGetMaxY(_searchBgView.frame) - 2);
    
//    _mTableView.contentOffset = CGPointMake(0, 20);
    
//    [self layoutSubviews];
    
}

- (void)tapAction:(UITapGestureRecognizer *)tap
{
    [self endEditing:YES];
}

- (void)deleteBtnAction
{
    [self initParams];
    [self.mTableView reloadData];
    self.placeHolder.hidden = NO;
    self.tf.text = @"";
}

- (void)cellAction:(UITapGestureRecognizer *)tap
{
    if (self.block) {
        NSString *code = [NSString stringWithFormat:@"+%ld", (long)tap.view.tag];
        if ([RXOSCommonTool isRTL]) {
            code = [NSString stringWithFormat:@"%ld+", (long)tap.view.tag];
        } else {
            
        }
        
        self.block(code);
    }
    [self hide];
}

- (void)initParams
{
    NSBundle *bundle = [NSBundle bundleForClass:[RXOSUIKitService class]];
    NSString *plistPathEN = [bundle pathForResource:@"sortedNameEN" ofType:@"plist"];
    
    _sortedNameDict = [[NSMutableDictionary alloc] initWithContentsOfFile:plistPathEN];
    _indexArray = [[NSMutableArray alloc] initWithArray:[[_sortedNameDict allKeys] sortedArrayUsingComparator:^NSComparisonResult(id  _Nonnull obj1, id  _Nonnull obj2) {
        return [obj1 compare:obj2];
    }]];
}

#pragma mark - UITableViewDelegate && UITableViewDataSource
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 36;
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
//    if (self.placeHolder.hidden) {
//        return 1;
//    } else {
        return _sortedNameDict.allKeys.count;
//    }
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
//    if (self.placeHolder.hidden) {
//         return 10;
//    } else {
        if (_indexArray.count > section) {
            NSArray *array = [_sortedNameDict objectForKey:[_indexArray objectAtIndex:section]];
            return array.count;
        }
        return 0;
//    }
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    NSArray *sectionArray = [_sortedNameDict valueForKey:[_indexArray objectAtIndex:indexPath.section]];
    NSString *identifier = [NSString stringWithFormat:@"identifier%@%@", [_indexArray objectAtIndex:indexPath.section], [sectionArray objectAtIndex:indexPath.row]];
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:identifier];
    if (!cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleSubtitle reuseIdentifier:identifier];
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
        
        NSString *codeItem = [sectionArray objectAtIndex:indexPath.row];
        NSArray *codeComponent = [codeItem componentsSeparatedByString:@"+"];
        
        NSString *codeStr = [NSString stringWithFormat:@"%@", codeComponent[1]];
        
        NSArray *codeArr = [codeStr componentsSeparatedByString:@"&"];
        
        codeStr = codeArr[0];
        
        NSInteger tag = [[codeStr stringByReplacingOccurrencesOfString:@" " withString:@""] integerValue];
        
        UILabel *titleLbl = [[UILabel alloc] init];
        titleLbl.text = codeComponent[0];
        titleLbl.tag = tag;
        titleLbl.textColor = [UIColor colorWithHexString:@"#131313"];
        titleLbl.font = [UIFont systemFontOfSize:16 weight:UIFontWeightMedium];
        titleLbl.userInteractionEnabled = YES;
        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(cellAction:)];
        [titleLbl addGestureRecognizer:tap];
        
        UILabel *codeLbl = [[UILabel alloc] init];
        codeLbl.text = [NSString stringWithFormat:@"+%@", [codeStr stringByReplacingOccurrencesOfString:@" " withString:@""]];
        codeLbl.tag = tag;
        codeLbl.textColor = [UIColor colorWithHexString:@"#8B8B8B"];
        codeLbl.font = [UIFont systemFontOfSize:16 weight:UIFontWeightRegular];
        codeLbl.userInteractionEnabled = YES;
        UITapGestureRecognizer *tap1 = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(cellAction:)];
        [codeLbl addGestureRecognizer:tap1];
        
        [cell.contentView addSubview:titleLbl];
        [cell.contentView addSubview:codeLbl];
        
        if ([RXOSCommonTool isRTL]) {
            codeLbl.text = [NSString stringWithFormat:@"%@+", [codeStr stringByReplacingOccurrencesOfString:@" " withString:@""]];
            
            titleLbl.textAlignment = NSTextAlignmentRight;
            codeLbl.textAlignment = NSTextAlignmentLeft;
            
            titleLbl.frame = CGRectMake(RXAC ? 2 : 2, 0, CGRectGetWidth(self.mTableView.frame) - 4, 36);
            codeLbl.frame = CGRectMake(RXAC ? 2 : 2, 0, 100, 36);
        } else {
            titleLbl.textAlignment = NSTextAlignmentLeft;
            codeLbl.textAlignment = NSTextAlignmentRight;
            titleLbl.frame = CGRectMake(RXAC ? 2 : 2, 0, 240, 36);
            codeLbl.frame = CGRectMake(RXAC ? 2 : 2, 0, CGRectGetWidth(self.mTableView.frame) - 4, 36);
            
        }
    }

    return cell;
}

- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section {
    return 20;
}

- (NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section {
//    if (_indexArray.count && _indexArray.count > section) {
//        return [_indexArray objectAtIndex:section];
//    }
    return [_indexArray objectAtIndex:section];
}

- (UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section
{
    UIView *secHeaderView = [[UIView alloc] init];
    secHeaderView.backgroundColor = [UIColor whiteColor];

    UILabel *titleLbl = [[UILabel alloc] init];
    titleLbl.text = [_indexArray objectAtIndex:section];
    titleLbl.textColor = [UIColor colorWithHexString:@"#A5CDCB"];
    titleLbl.font = [UIFont systemFontOfSize:14 weight:UIFontWeightRegular];

    UIView *line = [[UIView alloc] init];
    line.backgroundColor = [UIColor colorWithHexString:@"#E2F2F1"];

    [secHeaderView addSubview:titleLbl];
    [secHeaderView addSubview:line];

    titleLbl.frame = CGRectMake(2, 0, CGRectGetWidth(self.mTableView.frame) - 4, 20);
    line.frame = CGRectMake(0, 19, CGRectGetWidth(_mTableView.frame), 1);

    return secHeaderView;
}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView
{
//    CGFloat offsetY = scrollView.contentOffset.y;
//    if (offsetY <= 0) {
//        [UIView animateWithDuration:0.3 animations:^{
//            self.mTableView.contentOffset = CGPointMake(0, 20);
//        }];
//    }
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *cell = [tableView cellForRowAtIndexPath:indexPath];

    NSArray *sectionArray = [_sortedNameDict valueForKey:[_indexArray objectAtIndex:indexPath.section]];
    NSString *codeItem = [sectionArray objectAtIndex:indexPath.row];
    NSArray *codeComponent = [codeItem componentsSeparatedByString:@"+"];

    if (self.block) {
        self.block([NSString stringWithFormat:@"+%@", codeComponent[1]]);
    }
    [self hide];
}

//- (void)textFieldDidChangeSelection:(UITextField *)textField
//{
//    NSString *inputText = textField.text;
//    [self initParams];
//
//    if (inputText.length > 0) {
//        self.placeHolder.hidden = YES;
//    } else {
//        self.placeHolder.hidden = NO;
//        [self.mTableView reloadData];
//    }
//
//    dispatch_queue_t searchQueue = dispatch_queue_create("searchs", DISPATCH_QUEUE_SERIAL);
//    dispatch_async(searchQueue, ^{
//        NSMutableDictionary *searchDic = [NSMutableDictionary dictionary];
//        for (int i = 0; i < self.sortedNameDict.allKeys.count; i++) {
//            NSMutableArray *codeArr = [NSMutableArray arrayWithArray:self.sortedNameDict[self.sortedNameDict.allKeys[i]]];
//            NSMutableArray *searchArr = [NSMutableArray array];
//            for (int j = 0; j < codeArr.count; j++) {
//                NSString *code = codeArr[j];
//                if ([code rangeOfString:inputText options:NSCaseInsensitiveSearch].length > 0) {
//                    [searchArr addObject:codeArr[j]];
//                }
//            }
//            if (searchArr.count > 0) {
//                [searchDic setValue:searchArr forKey:self.sortedNameDict.allKeys[i]];
//            }
//        }
//
//        dispatch_async(dispatch_get_main_queue(), ^{
//            //刷新界面
//            if (searchDic.allKeys.count > 0) {
//                [self.sortedNameDict removeAllObjects];
//                self.sortedNameDict = searchDic;
//
//                self.indexArray = [[NSMutableArray alloc] initWithArray:[[self.sortedNameDict allKeys] sortedArrayUsingComparator:^NSComparisonResult(id  _Nonnull obj1, id  _Nonnull obj2) {
//                    return [obj1 compare:obj2];
//                }]];
//            }
//            [self.mTableView reloadData];
//            NSLog(@"");
//        });
//    });
//}

- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string
{
    NSString *inputText = [NSString stringWithFormat:@"%@%@", textField.text, string];
    [self initParams];
    
    if (string.length > 0) {
        self.placeHolder.hidden = YES;
    } else {
        if (inputText.length == 1) {
            self.placeHolder.hidden = NO;
        }
        if (inputText.length > 0) {
            inputText = [inputText substringToIndex:inputText.length - 1];
        }
        [self.mTableView reloadData];
    }
    
    dispatch_queue_t searchQueue = dispatch_queue_create("searchs", DISPATCH_QUEUE_SERIAL);
    dispatch_async(searchQueue, ^{
        NSMutableDictionary *searchDic = [NSMutableDictionary dictionary];
        for (int i = 0; i < self.sortedNameDict.allKeys.count; i++) {
            NSMutableArray *codeArr = [NSMutableArray arrayWithArray:self.sortedNameDict[self.sortedNameDict.allKeys[i]]];
            NSMutableArray *searchArr = [NSMutableArray array];
            for (int j = 0; j < codeArr.count; j++) {
                NSString *code = codeArr[j];
                if ([code rangeOfString:inputText options:NSCaseInsensitiveSearch].length > 0) {
                    [searchArr addObject:codeArr[j]];
                }
            }
            if (searchArr.count > 0) {
                [searchDic setValue:searchArr forKey:self.sortedNameDict.allKeys[i]];
            }
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            //刷新界面
            if (searchDic.allKeys.count > 0) {
                [self.sortedNameDict removeAllObjects];
                self.sortedNameDict = searchDic;
                
                self.indexArray = [[NSMutableArray alloc] initWithArray:[[self.sortedNameDict allKeys] sortedArrayUsingComparator:^NSComparisonResult(id  _Nonnull obj1, id  _Nonnull obj2) {
                    return [obj1 compare:obj2];
                }]];
            }
            [self.mTableView reloadData];
            NSLog(@"");
        });
    });
    return YES;
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor whiteColor];
//        _bgView.backgroundColor = [UIColor redColor];
        _bgView.layer.cornerRadius = 7;
    }
    return _bgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = [RXLocation osLaunguage:@"地区选择"];
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.font = [UIFont systemFontOfSize:21 weight:UIFontWeightMedium];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (RXOSCloseBtn *)backBtn
{
    if (!_backBtn) {
        _backBtn = [RXOSCloseBtn buttonWithType:UIButtonTypeCustom];
        UIImage *backImage = [UIImage rxOSBundleImageNamed:@"rx_back"];
        if ([RXOSCommonTool isRTL]) {
            UIImage *flipImage = [UIImage imageWithCGImage:backImage.CGImage scale:backImage.scale orientation:UIImageOrientationDown];
            [_backBtn setImage:flipImage forState:UIControlStateNormal];
        } else {
            [_backBtn setImage:backImage forState:UIControlStateNormal];
        }
        [_backBtn addTarget:self action:@selector(hide) forControlEvents:UIControlEventTouchUpInside];
    }
    return _backBtn;
}

- (UITableView *)mTableView
{
    if (!_mTableView) {
        _mTableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStylePlain];
        _mTableView.delegate = self;
        _mTableView.dataSource = self;
        _mTableView.backgroundColor = [UIColor clearColor];
        _mTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    }
    return _mTableView;
}

- (NSMutableArray *)results
{
    if (!_results) {
        _results = [NSMutableArray array];
    }
    return _results;
}

- (UIView *)searchBgView
{
    if (!_searchBgView) {
        _searchBgView = [[UIView alloc] initWithFrame:CGRectMake(RXAC ? 29 : 25, RXAC ? 68 :  68, CGRectGetWidth(_bgView.frame) - (RXAC ? 58 : 50), RXAC ? 43 : 43)];
        _searchBgView.backgroundColor = [UIColor clearColor];
        _searchBgView.layer.borderColor = [UIColor colorWithHexString:@"#E2F2F1"].CGColor;
        _searchBgView.layer.borderWidth = 1;
        _searchBgView.layer.cornerRadius = 5;
        
        UIImageView *imgView = [[UIImageView alloc] init];
        UIImage *searchImage = [UIImage rxOSBundleImageNamed:@"rx_search"];
        if ([RXOSCommonTool isRTL]) {
            UIImage *flipImage = [UIImage imageWithCGImage:imgView.image.CGImage scale:imgView.image.scale orientation:UIImageOrientationDown];
            imgView.image = searchImage;
        } else {
            imgView.image = searchImage;
        }
        
        UIButton *delete = [[UIButton alloc] init];
        [delete setImage:[UIImage rxOSBundleImageNamed:@"rx_search_close"] forState:UIControlStateNormal];
        [delete addTarget:self action:@selector(deleteBtnAction) forControlEvents:UIControlEventTouchUpInside];
        
        UILabel *placeholder = [[UILabel alloc] init];
        self.placeHolder = placeholder;
        placeholder.text = [RXLocation osLaunguage:@"输入要搜索的地区"];
        placeholder.textColor = [UIColor colorWithHexString:@"#A5CACA"];
        
        UITextField *tf = [[UITextField alloc] init];
        self.tf = tf;
        tf.textColor = [UIColor blackColor];
        tf.tintColor = [UIColor colorWithHexString:@"#0B9E92"];
        tf.font = [UIFont systemFontOfSize:16 weight:UIFontWeightRegular];
        tf.delegate = self;
        
        [_searchBgView addSubview:imgView];
        [_searchBgView addSubview:delete];
        [_searchBgView addSubview:placeholder];
        [_searchBgView addSubview:tf];
        
        if ([RXOSCommonTool isRTL]) {
            tf.textAlignment = NSTextAlignmentRight;
            imgView.frame = CGRectMake(CGRectGetWidth(_searchBgView.frame) - (RXAC ? 16 : 16) - 14, RXAC ? 13 : 13, 18, 18);
            delete.frame = CGRectMake(10, RXAC ? 7.5 : 7.5, 28, 28);
            placeholder.frame = CGRectMake(0, 0, CGRectGetWidth(_searchBgView.frame) - CGRectGetWidth(imgView.frame) - 18, CGRectGetHeight(_searchBgView.frame));
            tf.frame = CGRectMake(30, 0, CGRectGetWidth(_searchBgView.frame) - CGRectGetWidth(imgView.frame) - 16 - 30, CGRectGetHeight(_searchBgView.frame));
        } else {
            tf.textAlignment = NSTextAlignmentLeft;
            imgView.frame = CGRectMake(RXAC ? 16 : 16, RXAC ? 13 : 13, 18, 18);
            delete.frame = CGRectMake(CGRectGetWidth(_searchBgView.frame) - 28 - 10, RXAC ? 7.5 : 7.5, 28, 28);
            placeholder.frame = CGRectMake(CGRectGetMaxX(imgView.frame) + 6, 0, CGRectGetWidth(_searchBgView.frame) - (RXAC ? 100 : 100), CGRectGetHeight(_searchBgView.frame));
            tf.frame = CGRectMake(CGRectGetMaxX(imgView.frame) + 6, 0, CGRectGetWidth(_searchBgView.frame) - (RXAC ? 100 : 100), CGRectGetHeight(_searchBgView.frame));
        }
  
        
    }
    return _searchBgView;
}

@end
