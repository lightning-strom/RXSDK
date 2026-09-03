//
//  NSObject+RXUIAdditon.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/1/29.
//

#import "NSObject+RXUIAdditon.h"
#import <objc/runtime.h>

@implementation NSObject (RXUIAdditon)

+ (instancetype)rxu_modelWithDictionary:(NSDictionary *)dictionary {
    
    // 创建当前模型对象
    id object = [[self alloc] init];
    
    unsigned int count;
    
    // 获取当前对象的属性列表
    objc_property_t *propertyList = class_copyPropertyList([self class], &count);
    
    // 遍历 propertyList 中所有属性，以其属性名为 key，在字典中查找 value
    for (unsigned int i = 0; i < count; i++) {
        // 获取属性
        objc_property_t property = propertyList[i];
        const char *propertyName = property_getName(property);
        
        NSString *propertyNameStr = [NSString stringWithUTF8String:propertyName];
        
        // 获取 JSON 中属性值 value
        id value = [dictionary objectForKey:propertyNameStr];
        
        // 获取属性所属类名
        NSString *propertyType;
        unsigned int attrCount;
        objc_property_attribute_t *attrs = property_copyAttributeList(property, &attrCount);
        for (unsigned int i = 0; i < attrCount; i++) {
            switch (attrs[i].name[0]) {
                case 'T': { // Type encoding
                    if (attrs[i].value) {
                        propertyType = [NSString stringWithUTF8String:attrs[i].value];
                        // 去除转义字符：@\"NSString\" -> @"NSString"
                        propertyType = [propertyType stringByReplacingOccurrencesOfString:@"\"" withString:@""];
                        // 去除 @ 符号
                        propertyType = [propertyType stringByReplacingOccurrencesOfString:@"@" withString:@""];
                        
                    }
                } break;
                default: break;
            }
        }
        
        // 对特殊属性进行处理
        // 判断当前类是否实现了协议方法，获取协议方法中规定的特殊属性的处理方式
        NSDictionary *propertyTypeDic;
        propertyTypeDic = [(id<RXAddition>)self modelContainerPropertyGenericClass];
        
        // 处理：字典的 key 与模型属性不匹配的问题，如 id -> uid
        id anotherName = propertyTypeDic[propertyNameStr];
        if(anotherName && [anotherName isKindOfClass:[NSString class]]){
            value =  dictionary[anotherName];
        }

        // 处理：模型嵌套模型的情况
        if ([value isKindOfClass:[NSDictionary class]] && ![propertyType hasPrefix:@"NS"]) {
            Class modelClass = NSClassFromString(propertyType);
            if (modelClass != nil) {
                // 将被嵌套字典数据也转化成Model
                value = [modelClass rxu_modelWithDictionary:value];
            }
        }

        // 处理：模型嵌套模型数组的情况
        // 判断当前 value 是一个数组，而且存在协议方法返回了 perpertyTypeDic
        if ([value isKindOfClass:[NSArray class]] && propertyTypeDic && propertyTypeDic.allKeys.count > 0) {
            Class itemModelClass = propertyTypeDic[propertyNameStr];
            //封装数组：将每一个子数据转化为 Model
            NSMutableArray *itemArray = @[].mutableCopy;
            for (NSDictionary *itemDic  in value) {
                id model = [itemModelClass rxu_modelWithDictionary:itemDic];
                [itemArray addObject:model];
            }
            value = itemArray;
        }

        // 使用 KVC 方法将 value 更新到 object 中
        if (value != nil) {
            [object setValue:value forKey:propertyNameStr];
        }
        
    }
    free(propertyList);
    
    return object;
}

@end
