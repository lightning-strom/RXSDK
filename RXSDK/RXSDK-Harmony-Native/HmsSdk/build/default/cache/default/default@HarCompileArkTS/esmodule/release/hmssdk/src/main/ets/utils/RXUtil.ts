import gamePlayer from "@hms:core.gameservice.gameplayer";
import { RXRequest } from "@normalized:N&&&hmssdk/src/main/ets/net/RXRequest&4.0.0";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import { RXError, RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RCallback, RXCallback, RXConfig, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
let RX_CODES: Record<number, number> = {
    [gamePlayer.GameErrorCode.UNION_LOGIN_CANCELED]: RXErrorCode.LOGIN_CANCEL,
    [1001860000]: RXErrorCode.PAY_CANCEL,
};
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
};
export class RXUtil {
    static checkRequiredParams(u195: Record<string, any>, v195?: string[]) {
        v195 ??= Object.keys(u195);
        for (let w195 of v195) {
            if (!u195[w195]) {
                throw new RXError(`${w195} is required`, RXErrorCode.PARAMETER_ERROR);
            }
        }
    }
    public static formatResult<q195 extends RXResult<any>>(r195: q195, s195: number = RXErrorCode.UNKNOWN_ERROR): q195 {
        if (typeof r195 === "object") {
            r195.code ??= s195;
            let t195 = RX_CODES[r195.code];
            if (t195) {
                r195["thirdcode"] = r195.code;
                r195.code = t195;
            }
            r195.thirdmsg ??= r195.message;
            r195.message ??= r195.msg;
            r195.msg = RX_MESSAGE[r195.code] ?? r195.msg ?? r195.message;
        }
        return r195;
    }
    public static stringifyError(p195: RXError): string {
        p195.msg ??= p195.message;
        return JSON.stringify(this.formatResult(p195));
    }
    public static getRXResult(k195: number = 0, l195: string = "", m195?: any, n195?: string): RXResult {
        let o195: RXResult = {
            code: k195,
            message: l195,
            thirdcode: m195,
            thirdmsg: n195
        };
        return this.formatResult(o195);
    }
    public static getRXSuccess<h195>(i195: h195): RXResult<h195> {
        let j195: RXResult<h195> = {
            code: 0,
            data: i195,
            message: ""
        };
        return (j195);
    }
    public static getError(c195: number, d195: string, e195?: any, f195?: string): RXError {
        let g195: RXError = {
            message: d195,
            msg: d195,
            code: c195,
            name: "RXError",
            thirdcode: e195,
            thirdmsg: f195
        };
        return g195;
    }
    public static toRCallback<z194>(a195?: RXCallback<z194>): RCallback<z194> | undefined {
        if (a195) {
            return (b195) => {
                if (b195?.code === 0) {
                    a195?.(null, b195.data);
                }
                else {
                    a195?.(b195 as RXError, b195.data);
                }
            };
        }
    }
    public static toRXCallback<v194>(w194?: RCallback<v194>): RXCallback<RXResult<v194>> | undefined {
        if (w194) {
            return (x194: RXError | null, y194?: RXResult<v194>) => {
                w194?.({
                    code: x194?.code,
                    message: x194?.message,
                    msg: x194?.msg,
                    name: x194?.name,
                    thirdcode: x194?.thirdcode,
                    thirdmsg: x194?.thirdmsg,
                    ...y194
                });
            };
        }
    }
    public static apiRequest<r194>(s194: string, t194: Record<string, any> = {}, u194: RCallback<r194> | undefined) {
        return RXRequest.post<r194>(s194, t194, null, u194);
    }
    static getSDKPrivacy(o194: RXConfig): string {
        if (o194.privacy) {
            return o194.privacy;
        }
        else {
            let p194 = `<a href='${this.getSDKPrivacyUrl(o194, "00001")}'>《用户协议》</a >、<a href= '${this.getSDKPrivacyUrl(o194, "00002")}'>《隐私政策》</a >`;
            let q194: string = `       在您使用我们服务前，请您务必审慎阅读、充分理解${p194}的各条款。同时，您应特别注意前述协议中免除或者限制我们责任的条款、对您权利进行限制的条款、约定争议解决方式和司法管辖的条款。如您已详细阅读并同意${p194}请点击“同意”开始使用我们的服务。`;
            return q194;
        }
    }
    static getSDKPrivacyUrl(l194: RXConfig, m194: string): string {
        let n194 = `${l194.baseUrls?.[0]}/static/landing/#/v1/legal/terms/${l194.productId}/${l194.channelId}/${m194}`;
        return n194;
    }
    static getSDKVersion(): string {
        return SDKConfig.VERSION;
    }
}
