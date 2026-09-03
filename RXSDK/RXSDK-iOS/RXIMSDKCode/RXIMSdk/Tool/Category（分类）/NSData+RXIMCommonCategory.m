//
//  NSData+RXIMCommonCategory.m
//  RXIMSdk
//
//  Created by 陈汉 on 2021/9/1.
//

#import "NSData+RXIMCommonCategory.h"

// 大端转小端
#define KKL_NTOH(z) sizeof(z) > 4 ? ntohll(z) : ntohl(z)
// 转换为小端 data
#define KKL_CONVERT_DATA(type, targetType) type length = (type)self.length; \
type difference = sizeof(type) - length; \
if (difference > sizeof(type)) { \
difference = 0; \
} \
if (length > sizeof(type)) { \
length = sizeof(type); \
} \
type zero = 0; \
NSMutableData *data = [NSMutableData dataWithBytes:&zero length:sizeof(type)]; \
[data replaceBytesInRange:NSMakeRange(difference, length) withBytes:self.bytes]; \
\
type z; \
[data getBytes:&z length:sizeof(type)]; \
type i = KKL_NTOH(z); \
data = [NSMutableData dataWithBytes:&i length:sizeof(type)]; \
targetType value; \
[data getBytes:&value length:sizeof(targetType)]; \
return value;

@implementation NSData (RXCommonCategory)

- (int)kkl_intValue {
    KKL_CONVERT_DATA(uint32_t, int);
}

- (long)kkl_longValue {
    KKL_CONVERT_DATA(uint64_t, long);
}

- (float)kkl_floatValue {
    KKL_CONVERT_DATA(uint32_t, float);
}

- (instancetype)initWithInt:(int)i {
    uint32_t z = KKL_NTOH(i);
    NSData *data = [NSData dataWithBytes:&z length:sizeof(i)];
    return data;
}

- (instancetype)initWithFloat:(float)f {
    NSData *data = [NSData dataWithBytes:&f length:sizeof(f)];
    int i = [data kkl_intValue];
    uint32_t z = KKL_NTOH(i);
    return [self initWithInt:z];
}

- (instancetype)initWithLong:(long)l {
    uint64_t z = KKL_NTOH(l);
    NSData *data = [NSData dataWithBytes:&z length:sizeof(l)];
    return data;
}

- (NSData *)kkl_subdataWithLocation:(NSInteger)location length:(NSInteger)length {
    if (location + length <= self.length) {
        // 获取长度
        NSRange range = NSMakeRange(location, length);
        NSData *subdata = [self subdataWithRange:range];
        return subdata;
    }
    return nil;
}

+ (NSData *)convertHexStrToData:(NSString *)str
{
    if (!str || [str length] == 0) {
        return nil;
    }
    
    NSMutableData *hexData = [[NSMutableData alloc] initWithCapacity:8];
    NSRange range;
    if ([str length] % 2 == 0) {
        range = NSMakeRange(0, 2);
    } else {
        range = NSMakeRange(0, 1);
    }
    for (NSInteger i = range.location; i < [str length]; i += 2) {
        unsigned int anInt;
        NSString *hexCharStr = [str substringWithRange:range];
        NSScanner *scanner = [[NSScanner alloc] initWithString:hexCharStr];
        
        [scanner scanHexInt:&anInt];
        NSData *entity = [[NSData alloc] initWithBytes:&anInt length:1];
        [hexData appendData:entity];
        
        range.location += range.length;
        range.length = 2;
    }
    
    NSLog(@"hexdata: %@", hexData);
    return hexData;
}

+ (NSString *)convertDataToHexStr:(NSData *)data
{
    if (!data || [data length] == 0) {
        return @"";
    }
    NSMutableString *string = [[NSMutableString alloc] initWithCapacity:[data length]];
    
    [data enumerateByteRangesUsingBlock:^(const void *bytes, NSRange byteRange, BOOL *stop) {
        unsigned char *dataBytes = (unsigned char*)bytes;
        for (NSInteger i = 0; i < byteRange.length; i++) {
            NSString *hexStr = [NSString stringWithFormat:@"%x", (dataBytes[i]) & 0xff];
            if ([hexStr length] == 2) {
                [string appendString:hexStr];
            } else {
                [string appendFormat:@"0%@", hexStr];
            }
        }
    }];
    
    return string;
}

+ (uint32_t)intFromData:(NSData *)data useBig:(BOOL)useBig
{
    uint32_t result = -1;
    
    if (data == nil) return result;
    
    Byte *bytes = (Byte *)[data bytes];
    
    if (useBig) {//大端模式
        
        result = CFSwapInt32BigToHost(*(int *)bytes);
        
    } else {//小端模式
        
        result = CFSwapInt32LittleToHost(*(int *)bytes);
        
    }
    
    return result;
    
}

// 计算varint
+ (NSMutableData *)encodeVarint:(UInt64)length
{
    NSMutableData *data = [NSMutableData data];
    
    NSInteger i = 0;
    while (length > 127) {
        Byte appenByte[1] = {(128|(length&127))};
        [data appendBytes:appenByte length:1];
        length >>= 7;
        i++;
    }
    Byte lastByte[1] = {(uint8_t)length};
    [data appendBytes:lastByte length:1];
    return data;
}

// 根据varint计算字节长度
+ (NSArray *)decodeVarint:(unsigned char *)buffer index:(int)index ret:(int)ret
{
    int len = index;
    while (true)
    {
        int item = buffer[len];
        len++;
        if ((item & 0x80) == 0) {
            break;
        }
    }
 
    if (len == 1) {
        ret = buffer[0];
        index++;
    }
 
    for (int i = len - 1; i >= index; i--)
    {
        int item = buffer[i];
        ret <<= 7;
 
        //这里可以直接 item &= 0x7F，高位不是1的数 & 0x7F并不会改变
        item = (item & 0x80) > 0 ? item & 0x7F : item;
        ret += item;
    }
    index += len;
    
    return @[@(len), @(ret)];
}

@end
