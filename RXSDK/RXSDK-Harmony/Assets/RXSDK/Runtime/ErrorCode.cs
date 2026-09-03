
// https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V5/iap-error-code-V5#section194868144472
//0

// IAP_RESPONSE_RESULT_OK

// 成功。

// 不涉及。
// 1001880005

// IAP_APP_IAP_NOT_ACTIVATED

// App的IAP功能未打开。

// 请到AppGallery Connect打开应用内支付服务开关。

// 1001880006

// IAP_RESPONSE_RESULT_ERROR

// API操作期间发生致命错误。

// 请参见响应中的错误信息。

// 1001880008

// IAP_RESPONSE_RESULT_ITEM_NOT_OWNED

// 由于未拥有该商品，确认发货失败。

// 确认发货是在购买成功后进行的。请先确认已经拥有该商品后，再进行确认发货操作，同时检查接口传入参数是否正确。

// 1001880009

// IAP_RESPONSE_RESULT_ITEM_CONSUMED_OR_ACKNED

// 消耗型商品已经确认发货，不能再次确认发货。非消耗型商品只能购买一次，发货一次。

// 请检查为何存在重复调用，进一步优化项目逻辑，如需要流程确认和建议，请联系华为支撑人员。

// 1001880010

// IAP_RESPONSE_RESULT_HIGHTRISK

// 用户账号高风险，操作被拒绝。

// 请更换账号或重新注册。

// 1001880011

// IAP_USER_ACCOUNT_INVALID

// 用户账号异常，比如已经销户。

// 请更换账号或重新注册。

// 1001880012

// IAP_RECORD_NOT_EXIST

// 订单记录不存在，只能查询用户针对特定商品的最新一笔订单信息，当前查询可能为历史订单。

// 常规流程不需要进行历史订单的token校验，请确认接入流程符合指导要求。

// 1001880020

// IAP_RESPONSE_RESULT_REPEAT_SHIP_CONFIRM

// 自动续期订阅商品已经确认发货，不能再次确认发货。

// 请检查为何存在重复调用，进一步优化项目逻辑，如需要流程确认和建议，请联系华为支撑人员。
// 通用错误码
// https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V5/errorcode-universal-V5
// ArkTS API错误码 Game Service Kit特有错误码
// https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V5/gameservice-error-code-V5

using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;

public enum ErrorCode
{
    [ErrorDescription("成功")]
    SUCCESS,

    [ErrorDescription("支付取消")]
    IAP_CANCEL = 1001860000,



    [ErrorDescription("服务器内部错误")]
    SYSTEM_INTERNAL_ERROR = 1001860001,
    [ErrorDescription("应用未被授权访问接口")]
    APPLICATION_NOT_AUTHORIZED = 1001860002,
    [ErrorDescription("无效的商品信息")]
    INVALID_PRODUCT_INFO = 1001860003,
    [ErrorDescription("接口访问过频")]
    API_FREQUENT_CALLS = 1001860004,
    [ErrorDescription("网络连接异常")]
    NETWORK_CONNECTION_ERROR = 1001860005,

    [ErrorDescription("商品所属的应用未在指定国家/地区上架")]
    ID_NOT_SIGNEDIN = 1001860050,
    [ErrorDescription("未登录华为账号")]
    IAP_APP_IAP_NOT_ACTIVATED = 1001880005,
    [ErrorDescription("API操作期间发生致命错误")]
    IAP_RESPONSE_RESULT_ERROR = 1001880006,
    [ErrorDescription("由于未拥有该商品，确认发货失败")]
    IAP_RESPONSE_RESULT_ITEM_NOT_OWNED = 1001880008,
    [ErrorDescription("消耗型商品已经确认发货，不能再次确认发货。非消耗型商品只能购买一次，发货一次")]
    IAP_RESPONSE_RESULT_ITEM_CONSUMED_OR_ACKNED = 1001880009,
    [ErrorDescription("用户账号高风险，操作被拒绝")]
    IAP_RESPONSE_RESULT_HIGHTRISK = 1001880010,
    [ErrorDescription("用户账号异常，比如已经销户")]
    IAP_USER_ACCOUNT_INVALID = 1001880011,
    [ErrorDescription("订单记录不存在，只能查询用户针对特定商品的最新一笔订单信息，当前查询可能为历史订单")]
    IAP_RECORD_NOT_EXIST = 1001880012,
    [ErrorDescription("自动续期订阅商品已经确认发货，不能再次确认发货")]
    IAP_RESPONSE_RESULT_REPEAT_SHIP_CONFIRM = 1001880020,
    [ErrorDescription("由于已经拥有该商品，购买失败")]
    ALREADY_OWNS_PRODUCT = 1001860051,

    [ErrorDescription("用户取消授权")]
    USER_CANCELED_AUTHORIZATION = 1001502012,

    //GameErrorCode https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V5/gameservice-gameplayer-V5
    [ErrorDescription("游戏内部通用错误")]
    INTERNAL_ERROR = 1002000001,

    [ErrorDescription("网络连接错误")]
    NETWORK_ERROR = 1002000002,

    [ErrorDescription("未知错误")]
    UNKNOWN = -1,
}

public enum RXErrorCode
{
    [ErrorDescription("成功")]

    Success = 0,

    [ErrorDescription("网络错误")]

    NetError = 1000,


    [ErrorDescription("初始化错误")]
    InitError = 2001,

    [ErrorDescription("登录错误")]
    LoginError = 3000,

    [ErrorDescription("取消登录 ")]
    LoginCancel = 3001,
    [ErrorDescription("支付错误")]
    PayError = 4000,
    [ErrorDescription("取消支付")]
    PayCancel = 4001,
    [ErrorDescription("取消分享")]
    ShareCancel = 5000,
    [ErrorDescription("分享参数错误")]
    ShareParamsError = 5001,
    [ErrorDescription("分享不支持")]
    ShareNotSupport = 5002,
    [ErrorDescription("未开启碰一碰")]

    ShareKnockNotEnable = 5003,
    [ErrorDescription("解密错误")]

    DecodeError = 9010,

    [ErrorDescription("未知错误")]
    UNKNOWN = -1,
}

[AttributeUsage(AttributeTargets.Field)]
public class ErrorDescriptionAttribute : Attribute
{
    public string Description { get; }

    public ErrorDescriptionAttribute(string description)
    {
        Description = description;
    }
}
public static class Error
{
    private static readonly Dictionary<ErrorCode, int> _rxcodes = new()
    {
        { ErrorCode.SUCCESS, 0 },
        { ErrorCode.USER_CANCELED_AUTHORIZATION,3001},
        { ErrorCode.IAP_CANCEL,4001},
        { ErrorCode.SYSTEM_INTERNAL_ERROR,8000},
        { ErrorCode.APPLICATION_NOT_AUTHORIZED,8000},
        { ErrorCode.INVALID_PRODUCT_INFO,8000},
        { ErrorCode.API_FREQUENT_CALLS,8000},
        { ErrorCode.NETWORK_CONNECTION_ERROR,8000},
        { ErrorCode.ID_NOT_SIGNEDIN,8000},
        { ErrorCode.IAP_APP_IAP_NOT_ACTIVATED,8000},
        { ErrorCode.IAP_RESPONSE_RESULT_ERROR,8000},
        { ErrorCode.IAP_RESPONSE_RESULT_ITEM_NOT_OWNED,8000},
        { ErrorCode.IAP_RESPONSE_RESULT_ITEM_CONSUMED_OR_ACKNED,8000},
        { ErrorCode.IAP_RESPONSE_RESULT_HIGHTRISK,8000},
        { ErrorCode.IAP_USER_ACCOUNT_INVALID,8000},
        { ErrorCode.IAP_RECORD_NOT_EXIST,8000},
        { ErrorCode.IAP_RESPONSE_RESULT_REPEAT_SHIP_CONFIRM,8000},
        { ErrorCode.ALREADY_OWNS_PRODUCT,8000},
    };


    public static string GetMessage(ErrorCode errorCode)
    {
        var type = typeof(ErrorCode);
        var name = Enum.GetName(type, errorCode);
        if (!string.IsNullOrEmpty(name))
        {
            var memberInfo = type.GetField(name);
            if (memberInfo != null)
            {
                var attributes = memberInfo.GetCustomAttributes(typeof(ErrorDescriptionAttribute), false);
                if (attributes.Length > 0)
                {
                    return ((ErrorDescriptionAttribute)attributes[0]).Description;
                }
            }
        }
        return null;
    }

    public static string GetMessage(int errCode, JObject jsonData)
    {
        string msg = GetMessage((ErrorCode)errCode);
        if (msg != null)
        {
            return msg;
        }
        else
        {
            return jsonData.ContainsKey("message") ? jsonData["message"].ToString() : "未知错误";
        }
    }

    public static string GetMessage(int errCode, string defaultMsg)
    {
        if (errCode == 0) return "";
        string msg = GetMessage((ErrorCode)errCode);
        return msg ?? defaultMsg;
    }
    public static int GetRXCode(int errorCode)
    {
        return _rxcodes.ContainsKey((ErrorCode)errorCode) ? _rxcodes[(ErrorCode)errorCode] : errorCode;
    }
    public static int GetRXCode(ErrorCode errorCode)
    {
        if (_rxcodes.TryGetValue(errorCode, out int rxCode))
        {
            return rxCode;
        }
        return -1;
    }
}