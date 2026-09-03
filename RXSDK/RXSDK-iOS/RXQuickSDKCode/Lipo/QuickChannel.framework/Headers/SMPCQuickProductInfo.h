//
//  SMPCQuickProductInfo.h
//  QuickChannel
//
//  Created by IOS-Developer on 14/12/24.
//

#import <Foundation/Foundation.h>

@interface SMPCQuickProductInfo : NSObject
@property(copy, nonatomic) NSString *goodsID;    //商品ID
@property(copy, nonatomic) NSString *productName;  //商品名称
@property(copy, nonatomic) NSString *productOrderID;  //商品订单ID
@property(assign, nonatomic) NSUInteger  count;            //商品数量
@property(assign, nonatomic) float amount;         //商品总价
@property(copy, nonatomic) NSString *callbackUrl;  //购买回调地址
@property(copy, nonatomic) NSString *extrasParams; //扩展参数,一般是服务器回调原样回传

//在QuickSDK中对应的属性已经暂停使用，但是QuickChannel使用不变。
//QuickSDK在转换参数时，仍然会使用到这些属性,QuickChannel中使用到这些属性
//在客户使用的旧版QuickSDK中仍然用到了这些属性，所以暂时不能删掉
@property(assign, nonatomic) float price;          //商品单价
@property(nonatomic,copy) NSString *quantifier;     //商品量词  停用的
@property(copy, nonatomic) NSString *productDesc;   //商品描述

@end
