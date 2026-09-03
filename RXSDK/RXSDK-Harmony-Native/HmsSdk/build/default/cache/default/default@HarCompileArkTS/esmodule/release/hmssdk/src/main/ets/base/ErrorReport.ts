import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import Hadoop from "@normalized:N&&&hmssdk/src/main/ets/base/Hadoop&4.0.0";
import Passport from "@normalized:N&&&hmssdk/src/main/ets/base/Passport&4.0.0";
interface TraceBean {
    error_code: number;
    error_msg?: string;
    thirdcode?: number;
    trace_id?: string;
    error_action?: string;
    request_address?: string;
    type_tripartite?: string;
    url?: string;
    request_header?: Object;
    request_body?: Object;
    error_code_tripartite?: number;
    error_message_tripartite?: string;
}
export class ErrorReport {
    static isTraceBean(r12: any): r12 is TraceBean {
        return r12 && typeof r12 === 'object' && 'error_code' in r12 && r12.error_code != null;
    }
    static report(o12: TraceBean): void {
        if (!o12) {
            return;
        }
        if (!SDKConfig.isInit) {
            Logger.e("report error failed,rxsdk not init. ", JSON.stringify(o12));
            return;
        }
        try {
            const q12 = ErrorReport.getErrorProperties(o12);
            Hadoop.trackData("#rx_error", q12);
        }
        catch (p12) {
            Logger.e(p12);
        }
    }
    private static getErrorProperties(k12: TraceBean): Record<string, any> {
        const l12 = k12?.thirdcode ?? k12?.error_code ?? 'unknown';
        let m12 = `请前往 https://doc.ruixueyun.com/#/view?path=9e58d663-7313-498c-b95c-f8706ec09bdd 查看解决方案 error_code:${l12}  `;
        const n12: Record<string, any> = {
            error_type: "sdk",
            rx_version: SDKConfig.VERSION,
        };
        Logger.e(m12);
        Object.assign(n12, k12);
        if (k12.request_header && Object.keys(k12.request_header).length > 0) {
            n12.request_header = k12.request_header;
        }
        if (k12.request_body && Object.keys(k12.request_body).length > 0) {
            n12.request_body = k12.request_body;
        }
        n12.cp_userid ??= Passport.cpUserId;
        return n12;
    }
}
