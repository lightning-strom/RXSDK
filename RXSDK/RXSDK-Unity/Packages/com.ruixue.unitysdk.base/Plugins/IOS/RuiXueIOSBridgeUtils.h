//
//  Header.h
//  Unity-iPhone
//
//  Created by lee yubo on 2023/12/9.
//

#ifndef RuiXue_IOSBridge_Utils_h
#define RuiXue_IOSBridge_Utils_h

#import <StoreKit/StoreKit.h>

@interface RuiXueIOSBridgeUtils : NSObject

// 将NSArray 转化为UIImage
+ (UIImage *)byteArryToImage:(NSArray*)obj;

+ (NSString*)toNSString:(const char*)str;

+ (NSMutableArray*)toNSArray:(const char*)json;

+ (NSMutableDictionary*) toNSDic:(const char*)json;

+ (id) toObj:(const char*)json;

+ (const char*) toJsonOut:(id)obj;

+ (const char*) toStrOut:(NSString*)str;

+ (NSInteger) toInt:(const char*)str;

+ (const char*) toErrorOut:(RX_CommonRequestError*)error;

+ (const char*) toErrorOut_NSError:(NSError*)error;

+ (const char*) createJsonOutWithCode:(NSInteger) code
                               Msg: (NSString*) msg;

+ (NSDictionary*) dictionaryWithPropertiesOfObject:(id)obj;

+ (NSMutableDictionary *)fetchDicNotNull:(const char *)jsonString;

//将苹果商品转化成jsonString
+ (const char *)jsonStringFromProductList:(NSArray<SKProduct *> *)productList;

@end

#endif
