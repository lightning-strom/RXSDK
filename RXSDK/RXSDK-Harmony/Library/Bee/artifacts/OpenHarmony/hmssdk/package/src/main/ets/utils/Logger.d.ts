import hilog from "@ohos.hilog";
type ArgType = (string | number)[];
type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
export declare class Logger {
    private static prefix;
    private static _logEnable;
    static set logEnable(z190: boolean);
    static get logEnable(): boolean;
    static setPrefix(y190: string): void;
    static d(w190: any, ...x190: ESObject): void;
    static i(u190: any, ...v190: ArgType): void;
    static w(s190: any, ...t190: ArgType): void;
    static e(q190: any, ...r190: ArgType): void;
    static log(o190: any, ...p190: ArgType): void;
    static isLoggable(m190: hilog.LogLevel | LogLevel): boolean;
    private static logMessage;
    static info(f190: any, ...g190: ArgType): void;
    static debug(y189: any, ...z189: ArgType): void;
    static warn(w189: any, ...x189: ArgType): void;
    static error(u189: any, ...v189: ArgType): void;
    static log4Json(q189: any, ...r189: ArgType): void;
    static printJsonObj(n189: any): void;
    static toString(m189: any): string;
    private static formatMessage;
}
export {};
