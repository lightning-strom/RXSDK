import SDKConfig from '../sdk/SDKConfig';
import { Logger } from '../utils/Logger';
import Hadoop from './Hadoop';
import Passport from './Passport';

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
  static isTraceBean(obj: any): obj is TraceBean {
    return obj && typeof obj === 'object' && 'error_code' in obj && obj.error_code != null;
  }

  static report(dat: TraceBean): void {
    if (!dat) {
      return;
    }
    if (!SDKConfig.isInit) {
      Logger.e("report error failed,rxsdk not init. ", JSON.stringify(dat));
      return;
    }
    try {
      const properties = ErrorReport.getErrorProperties(dat);
      Hadoop.trackData("#rx_error", properties);
    } catch (e) {
      Logger.e(e)
    }
  }

  private static getErrorProperties(traceBean: TraceBean): Record<string, any> {
    const errorCode = traceBean?.thirdcode ?? traceBean?.error_code ?? 'unknown';
    let m = `请前往 https://doc.ruixueyun.com/#/view?path=9e58d663-7313-498c-b95c-f8706ec09bdd 查看解决方案 error_code:${errorCode}  `
    const properties: Record<string, any> = {
      error_type: "sdk",
      rx_version: SDKConfig.VERSION,
      // error_ext: m
    };
    Logger.e(m)
    Object.assign(properties, traceBean);

    if (traceBean.request_header && Object.keys(traceBean.request_header).length > 0) {
      properties.request_header = traceBean.request_header;
    }
    if (traceBean.request_body && Object.keys(traceBean.request_body).length > 0) {
      properties.request_body = traceBean.request_body;
    }

    properties.cp_userid ??= Passport.cpUserId;

    return properties;
  }
}