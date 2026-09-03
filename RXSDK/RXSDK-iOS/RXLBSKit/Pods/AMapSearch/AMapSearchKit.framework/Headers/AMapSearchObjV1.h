//
//  AMapSearchObjV1.h
//  AMapSearchKit
//
//  Created by xiaoming han on 15/7/22.
//  Copyright (c) 2015年 Amap. All rights reserved.
//

/* 该文件定义了搜索请求和返回对象。*/

#import <Foundation/Foundation.h>
#import "AMapCommonObj.h"
#import "AMapSearchObj.h"
#pragma mark - AMapPOISearchBaseRequestV1

///POI搜索请求基类
@interface AMapPOISearchBaseRequestV1 : AMapSearchObject
///类型，多个类型用“|”分割 可选值:文本分类、分类代码
@property (nonatomic, copy)   NSString  *types;
///排序规则, 0-距离排序；1-综合排序, 默认0
@property (nonatomic, assign) NSInteger  sortrule;
///每页记录数, 范围1-25, [default = 20]
@property (nonatomic, assign) NSInteger  offset;
///当前页数, 范围1-100, [default = 1]
@property (nonatomic, assign) NSInteger  page;
///建筑物POI编号，传入建筑物POI之后，则只在该建筑物之内进行搜索（since 4.5.0）
@property (nonatomic, copy) NSString *building;
///是否返回扩展信息，默认为 NO。
@property (nonatomic, assign) BOOL requireExtension;
///是否返回子POI，默认为 NO。
@property (nonatomic, assign) BOOL requireSubPOIs;
@end

///POI ID搜索请求
@interface AMapPOIIDSearchRequestV1 : AMapPOISearchBaseRequestV1
///POI全局唯一ID
@property (nonatomic, copy) NSString *uid; 
@end

///POI关键字搜索
@interface AMapPOIKeywordsSearchRequestV1 : AMapPOISearchBaseRequestV1
///查询关键字，多个关键字用“|”分割
@property (nonatomic, copy)   NSString *keywords; 
///查询城市，可选值：cityname（中文或中文全拼）、citycode、adcode.(注：台湾省的城市一律设置为【台湾】，不具体到市。)
@property (nonatomic, copy)   NSString *city;
///强制城市限制功能 默认NO，例如：在上海搜索天安门，如果citylimit为true，将不返回北京的天安门相关的POI
@property (nonatomic, assign) BOOL cityLimit;
///设置后，如果sortrule==0，则返回结果会按照距离此点的远近来排序,since 5.2.1
@property (nonatomic, strong) AMapGeoPoint *location;

@end

///POI周边搜索
@interface AMapPOIAroundSearchRequestV1 : AMapPOISearchBaseRequestV1
///查询关键字，多个关键字用“|”分割
@property (nonatomic, copy)   NSString     *keywords; 
///中心点坐标
@property (nonatomic, copy)   AMapGeoPoint *location; 
///查询半径，范围：0-50000，单位：米 [default = 1500]
@property (nonatomic, assign) NSInteger     radius;
///查询城市，可选值：cityname（中文或中文全拼）、citycode、adcode。注：当用户指定的经纬度和city出现冲突，若范围内有用户指定city的数据，则返回相关数据，否则返回为空。（since 5.7.0）
@property (nonatomic, copy)   NSString     *city;
///是否对结果进行人工干预，如火车站，原因为poi较为特殊，结果存在人工干预，干预结果优先，所以距离优先的排序未生效,默认为YES (since 7.4.0)
@property (nonatomic, assign) BOOL special;

@end

///POI多边形搜索
@interface AMapPOIPolygonSearchRequestV1 : AMapPOISearchBaseRequestV1
///查询关键字，多个关键字用“|”分割
@property (nonatomic, copy) NSString       *keywords; 
///多边形
@property (nonatomic, copy) AMapGeoPolygon *polygon; 
@end

///POI搜索返回
@interface AMapPOISearchResponseV1 : AMapSearchObject
///返回的POI数目
@property (nonatomic, assign) NSInteger       count; 
///关键字建议列表和城市建议列表
@property (nonatomic, strong) AMapSuggestion *suggestion; 
///POI结果，AMapPOI 数组
@property (nonatomic, strong) NSArray<AMapPOI *> *pois; 
@end
