//
//  RXIMErrorCode.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/6/7.
//

#ifndef RXIMErrorCode_h
#define RXIMErrorCode_h

/** 客户端基础错误 */
typedef NS_ENUM(NSInteger, BasicErrCode) {
    /** 参数错误 */
    BasicErrCode_Argument = 100,
    /** 网络异常 */
    BasicErrCode_Network = 101,
    /** oss操作错误 */
    BasicErrCode_OSS = 102,
    /** 暂不支持的业务 */
    BasicErrCode_Nonsupport = 103,
 };

/** IM错误 */
typedef NS_ENUM(NSInteger, IMErrCode) {
    /** 参数错误 */
    IMErrCode_Argument = 200,
    /** 数据库操作错误 */
    IMErrCode_DB = 201,
    /** 连接错误 */
    IMErrCode_Socket = 202,
 };

#endif /* RXIMErrorCode_h */
