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
export declare class ErrorReport {
    static isTraceBean(r12: any): r12 is TraceBean;
    static report(o12: TraceBean): void;
    private static getErrorProperties;
}
export {};
