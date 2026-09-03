import { gamePlayer } from "@kit.GameServiceKit";
import { RXRequest } from "../net/RXRequest";
import SDKConfig from "../sdk/SDKConfig";
import { RCallback, RXCallback, RXConfig, RXError, RXErrorCode, RXResult } from "../types/Index";

let RX_CODES: Record<number, number> = {
  [gamePlayer.GameErrorCode.UNION_LOGIN_CANCELED]: RXErrorCode.LOGIN_CANCEL,
  [1001860000]: RXErrorCode.PAY_CANCEL,
}

let RX_MESSAGE: Record<number, string> = {
  [RXErrorCode.PAY_CANCEL]: "支付取消",
  [RXErrorCode.NET_ERROR]: "网络错误",
  [RXErrorCode.PASSWORD_FORMAT_ERROR]: "密码格式验证错误",
  [RXErrorCode.PASSWORD_NULL_ERROR]: "密码不能为空",
  [RXErrorCode.INIT_PARAMS_ERROR]: "初始化参数错误",
  [RXErrorCode.INIT_ERROR]: "初始化错误,还未初始化成功",
  [RXErrorCode.THIRD_INIT_ERROR]: "初始化失败",
  [RXErrorCode.LOGIN_ERROR]: "登录失败",
  [RXErrorCode.LOGIN_CANCEL]: "登录取消",
  [RXErrorCode.THIRD_LOGIN_ERROR]: "登录错误",
  [RXErrorCode.NOT_LOGIN_ERROR]: "未登录,请先登录",
  [RXErrorCode.TOKEN_ERROR]: "token为空或正在刷新",
  [RXErrorCode.OTHER_LOGIN]: "其他登录方式",
  [RXErrorCode.UNSUPPORTED_LOGIN]: "不支持此登录方式",
  [RXErrorCode.REAL_NAME_ERROR]: "实名认证失败",
  [RXErrorCode.THIRD_REAL_NAME_ERROR]: "实名认证错误",
  [RXErrorCode.DEREGISTER_CANCEL]: "账号注销取消",
  [RXErrorCode.PAY_ERROR]: "支付参数错误",
  [RXErrorCode.PAY_CANCEL]: "支付取消",
  [RXErrorCode.THIRD_PAY_ERROR]: "支付错误",
  [RXErrorCode.ORDER_PARAMS_ERROR]: "下单失败",
  [RXErrorCode.ORDER_REPEAT_ERROR]: "重复下单，或订单请求中",
  [RXErrorCode.PAY_PARAMS_ERROR]: "购买失败",
  [RXErrorCode.SHARE_CANCEL]: "取消分享",
  [RXErrorCode.SHARE_PARAMS_ERROR]: "参数错误",
  [RXErrorCode.GPS_DATA_ERROR]: "定位失败",
  [RXErrorCode.UI_CLOSE]: "关闭窗口",
  [RXErrorCode.DISAGREE_PRIVACY]: "不同意",
  [RXErrorCode.PERMISSION_ERROR]: "请先申请权限",
  [RXErrorCode.PERMISSION_DENIED]: "权限已被永久拒绝",
  [RXErrorCode.NOT_INSTALL_WECHAT]: "请先安装微信",
  [RXErrorCode.THIRD_UNKNOWN_ERROR]: "未知三方错误",
  [RXErrorCode.UNKNOWN_ERROR]: "未知错误",
}

export class RXUtil {
  static checkRequiredParams(params: Record<string, any>, requiredFields?: string[]) {
    requiredFields ??= Object.keys(params)
    for (let field of requiredFields) {
      if (!params[field]) {
        throw new RXError(`${field} is required`, RXErrorCode.PARAMETER_ERROR);
      }
    }
  }



  public static formatResult<T extends RXResult<any>>(jsonObj: T, defaultCode: number = RXErrorCode.UNKNOWN_ERROR): T {
    if (typeof jsonObj === "object") {
      jsonObj.code ??= defaultCode
      let rxCode = RX_CODES[jsonObj.code]
      if (rxCode) {
        jsonObj["thirdcode"] = jsonObj.code
        jsonObj.code = rxCode
      }
      jsonObj.thirdmsg ??= jsonObj.message;
      jsonObj.message ??= jsonObj.msg;
      jsonObj.msg = RX_MESSAGE[jsonObj.code] ?? jsonObj.msg ?? jsonObj.message;
      // delete jsonObj.message;
    }
    return jsonObj
  }

  public static stringifyError(e: RXError): string {
    e.msg ??= e.message
    // delete e.message;
    return JSON.stringify(this.formatResult(e))
  }

  public static getRXResult(code: number = 0, message: string = "", thirdCode?: any, thirdMsg?: string): RXResult {
    let result: RXResult = {
      code: code,
      message: message,
      thirdcode: thirdCode,
      thirdmsg: thirdMsg
    }
    return this.formatResult(result)
  }

  public static getRXSuccess<T>(data: T): RXResult<T> {
    let result: RXResult<T> = {
      code: 0,
      data: data,
      message: ""
    }
    return (result)
  }

  public static getError(code: number, message: string, thirdCode?: any, thirdMsg?: string): RXError {
    let rxError: RXError = {
      message: message,
      msg: message,
      code: code,
      name: "RXError",
      thirdcode: thirdCode,
      thirdmsg: thirdMsg
    }
    return rxError
  }

  public static toRCallback<T>(callback?: RXCallback<T>): RCallback<T> | undefined {
    if (callback) {
      return (rxResult) => {
        if (rxResult?.code === 0) {
          callback?.(null, rxResult.data)
        } else {
          callback?.(rxResult as RXError, rxResult.data)
        }
      };
    }
  }

  public static toRXCallback<T>(callback?: RCallback<T>): RXCallback<RXResult<T>> | undefined {
    if (callback) {
      return (err: RXError | null, data?: RXResult<T>) => {
        callback?.({
          code: err?.code,
          message: err?.message,
          msg: err?.msg,
          name: err?.name,
          thirdcode: err?.thirdcode,
          thirdmsg: err?.thirdmsg,
          ...data
        })
      };
    }
  }


  public static apiRequest<T>(
    endpoint: string,
    data: Record<string, any> = {},
    callback: RCallback<T> | undefined
  ) {
    return RXRequest.post<T>(endpoint, data, null, callback);
  }

  static getSDKPrivacy(conf: RXConfig): string {
    if (conf.privacy) {
      return conf.privacy
    } else {
      let agreement =
        `<a href='${this.getSDKPrivacyUrl(conf, "00001")}'>《用户协议》</a >、<a href= '${this.getSDKPrivacyUrl(conf, "00002")}'>《隐私政策》</a >`;
      let content: string =
        `       在您使用我们服务前，请您务必审慎阅读、充分理解${agreement}的各条款。同时，您应特别注意前述协议中免除或者限制我们责任的条款、对您权利进行限制的条款、约定争议解决方式和司法管辖的条款。如您已详细阅读并同意${agreement}请点击“同意”开始使用我们的服务。`;

      return content;
    }
  }

  static getSDKPrivacyUrl(conf: RXConfig, key: string): string {
    let url = `${conf.baseUrls?.[0]}/static/landing/#/v1/legal/terms/${conf.productId}/${conf.channelId}/${key}`;
    return url;
  }

  static getSDKVersion(): string {
    return SDKConfig.VERSION;
  }
}