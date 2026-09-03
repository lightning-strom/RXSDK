//
//  RXErrorTool.m
//  RXSDK
//
//  Created by 陈汉 on 2023/3/29.
//

#import "RXErrorTool.h"
#import "RXCommonTool.h"

@implementation RXErrorTool

+ (NSInteger)getNetworkError:(NSInteger)code
{
    NSInteger errorCode = 0;
    
    if (code <= -1200 && code >= -1203) {
        //        errorMsg = @"证书验证错误";
        errorCode = RXNetworkError_certificateValid;
    } else if (code == -1204) {
        //        errorMsg = @"证书错误";
        errorCode = RXNetworkError_certificateBad;
    } else if (code == -1003 || code == -1004 || code == -1009) {
        //        errorMsg = @"未知主机错误，检查网络连通性";
        errorCode = RXNetworkError_noNetwork;
    } else if (code == -1005) {
        //        errorMsg = @"网络中断";
        errorCode = RXNetworkError_connectionLost;
    } else if (code == -1001) {
        //        errorMsg = @"请求超时";
        errorCode = RXNetworkError_timeOut;
    } else if (code >= 300) {
        errorCode = code + 1000;
    } else {
        //        errorMsg = @"未知网络错误";
        errorCode = RXNetworkError_default;
    }
    
    return errorCode;
}

+ (NSString *)getRXErrorMsg:(NSInteger)code
{
    NSString *msg = @"";
    
    msg = [RXErrorTool getCustomRXErrorMsg:code withNetWorkErrorMsg:@""];
    if ([NSString rx_isNullToString:msg].length > 0) {
        return msg;
    }
    
    return [RXErrorTool getRealRXErrorMsg:code];
}

+ (NSString *)getRealRXErrorMsg:(NSInteger)code{
    NSString *msg = @"";
    
    switch (code) {
            /* 初始化错误码 */
        case 2000:
            msg = @"初始化参数错误";
            break;
        case 2001:
            msg = @"初始化错误，或未初始化";
            break;
        case 2002:
            msg = @"三方初始化错误，或未初始化";
            break;
            
            /* 登录错误码 */
        case 3000:
            msg = @"登录参数错误";
            break;
        case 3001:
            msg = @"登录取消";
            break;
        case 3002:
            msg = @"三方登录错误";
            break;
        case 3100:
//            msg = @"密码正则验证错误";
            msg = @"密码输入6-32位，包含数字+字母+特殊符号";
            // 是否开启简单密码
            RXPasswordStrength passwordType = [[RXUserUtility valueForKey:keyUserData_simplePassword] longValue];
            if (passwordType == Default || passwordType == Average) {
                msg = @"请输入6-32位密码";
            } else if (passwordType == Custom) {
                msg = @"密码正则验证错误";
            }
            
            break;
        case 3101:
            msg = @"密码不能为空";
            break;
        case 3102:
            msg = @"输入密码与原密码不一致";
            break;
            
            /* iap错误码 */
        case 4000:
            msg = @"参数错误";
            break;
        case 4001:
            msg = @"支付取消";
            break;
        case 4100:
            msg = @"重复下单";
            break;
        case 4200:
            msg = @"iap异常";
            break;
        case 4201:
            msg = @"补单失败";
            break;
        case 4202:
            msg = @"没有商品";
            break;
        case 4203:
            msg = @"IAP Error";
            break;
            
        case 5000:
            msg = @"参数错误";
            break;
        case 5001:
            msg = @"取消分享";
            break;
        case 5002:
            msg = @"参数错误";
            break;
            
            /* 权限错误码 */
        case 6000:
            msg = @"隐私协议拒绝";
            break;
        case 6001:
            msg = @"权限被拒绝或未开启";
            break;
        case 6010:
            msg = @"关闭窗口";
            break;
        case 6020:
            msg = @"定位失败";
            break;
        case 6100:
            msg = @"未安装应用";
            break;
        case 6101:
            msg = @"微信未安装";
            break;
            
            /* 数据上报 */
        case 7001:
            msg = @"File size exceed limit";
            break;
            
            /* 通用错误码 */
        case 8000:
            msg = @"未知三方错误码";
            break;
        case 9000:
            msg = @"未知错误";
            break;
            
        default:
            msg = @"未知错误";
            break;
    }
    
    return [RXCommonTool osLaunguage:msg];
}

/**
 * 设置自定义错误码信息
 */
+ (void)configErrorMsg:(NSDictionary *)msgDic{
    [[RXCommonTool sharedSDK] configErrorMsg:msgDic];
}

/**
 * 获取自定义error信息, 有$code$、$msg$时替换为对应的code、msg
 * code 错误码
 * networkMsg 网络请求错误信息，仅限于网络请求场景使用此参数，其他场景此参数传空
 */
+ (NSString *)getCustomRXErrorMsg:(NSInteger)code withNetWorkErrorMsg:(NSString *)networkMsg{
    NSString *language = [RXCommonTool getCurrentLanguage];
    NSDictionary *msgDic = [[RXCommonTool sharedSDK] getCustomRXErrorMsgDic];
    
    if ([[msgDic allKeys] containsObject:language]) {
        NSDictionary *languageDic = msgDic[language];
        NSString *codeStr = [NSString stringWithFormat:@"%ld",(long)code];
        NSString *errorMsg = @"";
        if ([[languageDic allKeys] containsObject:codeStr]) {
            errorMsg = languageDic[codeStr];
            if ([errorMsg containsString:@"$code$"]) {
                errorMsg = [errorMsg stringByReplacingOccurrencesOfString:@"$code$" withString:codeStr];
            }
            if ([errorMsg containsString:@"$msg$"]) {
                if (code == RXNetworkError_default || code == RXNetworkError_certificateBad || code == RXNetworkError_certificateValid || code == RXNetworkError_noNetwork || code == RXNetworkError_connectionLost || code == RXNetworkError_timeOut) {
                    errorMsg = [errorMsg stringByReplacingOccurrencesOfString:@"$msg$" withString:networkMsg];
                }else{
                    errorMsg = [errorMsg stringByReplacingOccurrencesOfString:@"$msg$" withString:[RXErrorTool getRealRXErrorMsg:code]];
                }
            }
            return errorMsg;
        } else {
            if ([[languageDic allKeys] containsObject:@"default"]) {
                errorMsg = languageDic[@"default"];
                if ([errorMsg containsString:@"$code$"]) {
                    errorMsg = [errorMsg stringByReplacingOccurrencesOfString:@"$code$" withString:codeStr];
                }
                if ([errorMsg containsString:@"$msg$"]) {
                    if (code == RXNetworkError_default || code == RXNetworkError_certificateBad || code == RXNetworkError_certificateValid || code == RXNetworkError_noNetwork || code == RXNetworkError_connectionLost || code == RXNetworkError_timeOut) {
                        errorMsg = [errorMsg stringByReplacingOccurrencesOfString:@"$msg$" withString:networkMsg];
                    }else{
                        errorMsg = [errorMsg stringByReplacingOccurrencesOfString:@"$msg$" withString:[RXErrorTool getRealRXErrorMsg:code]];
                    }
                }
                return errorMsg;
            }
        }
    }
    return @"";
}


@end
