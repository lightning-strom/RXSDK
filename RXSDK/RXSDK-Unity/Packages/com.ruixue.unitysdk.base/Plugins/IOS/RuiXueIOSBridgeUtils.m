//
//  RuiXueSdkUnityBridgeUtils.m
//  UnityFramework
//
//  Created by lee yubo on 2023/12/9.
//

#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "RuiXueIOSBridgeUtils.h"
#import "NSString+JSONCategories.h"
#import <objc/runtime.h>


static Byte* tempImgeBytes = nil;

@implementation RuiXueIOSBridgeUtils
 
+ (UIImage *)byteArryToImage:(NSArray*)arry
{
    if (arry == nil) {
        return nil;
    }
    
    if(tempImgeBytes != nil)
    {
        free(tempImgeBytes);
    }
    
    tempImgeBytes = (Byte*)calloc(arry.count, sizeof(Byte));
    [arry enumerateObjectsUsingBlock:^(NSNumber* number, NSUInteger index, BOOL* stop){
        tempImgeBytes[index] = number.integerValue;
    }];
    
    NSData* imageData = [[NSData alloc] initWithBytes:tempImgeBytes length:arry.count];
    UIImage *image = [UIImage imageWithData:imageData];
    
    return image;
}

+ (NSString*)toNSString:(const char*)str
{
    if(str == nil)
        return nil;
    
    if(!str[0])
        return nil;
    
    return [NSString stringWithUTF8String:str];
}

+ (NSMutableArray*)toNSArray:(const char*)json
{
    if(json == nil)
        return nil;
    
    if(!json[0])
        return nil;
    
    NSString* jsonStr = [NSString stringWithUTF8String:json];
    NSMutableArray* array = [NSString jsonToObject:jsonStr];
    return array;
}

+ (NSMutableDictionary*) toNSDic:(const char*)json
{
    if(json == nil)
        return nil;
    
    if(!json[0])
        return nil;
    
    NSString* jsonStr = [NSString stringWithUTF8String:json];
    NSMutableDictionary* dic = [NSString jsonToObject:jsonStr];
    return dic;
}

+ (id) toObj:(const char*)json
{
    if(json == nil)
        return nil;
    
    if(!json[0])
        return nil;
    
    NSString* jsonStr = [NSString stringWithUTF8String:json];
    id obj = [NSString jsonToObject:jsonStr];
    return obj;
    
}

+ (const char*) toJsonOut:(id)obj
{
    if(obj==nil)
        return nil;
    
    return [[NSString objectToJson:obj] UTF8String];
}

+ (const char*) toStrOut:(NSString*)str
{
    return [str UTF8String];
}

+ (NSInteger) toInt:(const char*)str
{
    NSString* nString = [RuiXueIOSBridgeUtils toNSString:str];
    if(nString == nil)
        return 0;
    
    return [nString intValue];
}

+ (const char*) toErrorOut:(RX_CommonRequestError*)error
{
    return [RuiXueIOSBridgeUtils toJsonOut:error.responesObject];
}

+ (const char*) toErrorOut_NSError:(NSError*)error
{
    NSMutableDictionary *multableDictionary = [NSMutableDictionary dictionary];
    [multableDictionary setObject:error.localizedDescription forKey:@"msg"];
    [multableDictionary setObject:@(error.code) forKey:@"code"];
    return [RuiXueIOSBridgeUtils toJsonOut:multableDictionary];
}

+ (const char*) createJsonOutWithCode:(NSInteger) code
                               Msg: (NSString*) msg
{
    NSMutableDictionary *multableDictionary = [NSMutableDictionary dictionary];
    if(msg != nil)
    {
        [multableDictionary setObject:msg forKey:@"msg"];
    }
    [multableDictionary setObject:@(code) forKey:@"code"];
    return [RuiXueIOSBridgeUtils toJsonOut:multableDictionary];
}


+ (NSDictionary *) dictionaryWithPropertiesOfObject:(id)obj
{
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];

    unsigned count;
    objc_property_t *properties = class_copyPropertyList([obj class], &count);

    for (int i = 0; i < count; i++) {
        NSString *key = [NSString stringWithUTF8String:property_getName(properties[i])];
        
        id val = [obj valueForKey:key];
        if(val != nil)
            [dict setObject:val forKey:key];
    }

    free(properties);

    return [NSDictionary dictionaryWithDictionary:dict];
}

+ (NSMutableDictionary *)fetchDicNotNull:(const char *)jsonString
{
    NSMutableDictionary* dic = [NSMutableDictionary dictionaryWithDictionary:[RuiXueIOSBridgeUtils toNSDic:jsonString]];

    for (int i = (int)(dic.allKeys.count - 1); i >= 0; i--) {
        if ([dic.allValues[i] isKindOfClass:[NSNull class]]) {
            [dic removeObjectForKey:dic.allKeys[i]];
        }
    }
    
    return dic;
}

//将苹果商品转化成jsonString
+ (const char *)jsonStringFromProductList:(NSArray<SKProduct *> *)productList{
    NSMutableArray *productArray = [NSMutableArray arrayWithCapacity:productList.count];
        
    for (SKProduct *product in productList) {
        NSDictionary *productDict = [RuiXueIOSBridgeUtils dictionaryFromProduct:product];
        [productArray addObject:productDict];
    }
        
    return [RuiXueIOSBridgeUtils toJsonOut:productArray];
}

+ (NSDictionary *)dictionaryFromProduct:(SKProduct *)product{
    
    NSNumberFormatter *formatter = [[NSNumberFormatter alloc] init];
    formatter.numberStyle = NSNumberFormatterDecimalStyle;
    NSString *priceString = [formatter stringFromNumber:product.price];
    
    NSDictionary *productDict = @{
        @"localizedTitle": product.localizedTitle ? product.localizedTitle : @"",
        @"localizedDescription": product.localizedDescription ? product.localizedDescription : @"",
        @"price": priceString ? priceString : @"",
        @"priceLocale": product.priceLocale.localeIdentifier ? product.priceLocale.localeIdentifier : @"",
        @"productIdentifier": product.productIdentifier ? product.productIdentifier : @""
    };
    
    return productDict;
}

@end

