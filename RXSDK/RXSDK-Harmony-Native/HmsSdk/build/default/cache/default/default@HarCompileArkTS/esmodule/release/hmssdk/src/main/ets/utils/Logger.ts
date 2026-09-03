import hilog from "@ohos:hilog";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import Objects from "@normalized:N&&&hmssdk/src/main/ets/utils/Objects&4.0.0";
const LOG_DOMAIN = 0x0ffe;
type ArgType = (string | number)[];
type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
const LogLevelMap: Record<string, hilog.LogLevel> = {
    debug: hilog.LogLevel.DEBUG,
    info: hilog.LogLevel.INFO,
    warn: hilog.LogLevel.WARN,
    error: hilog.LogLevel.ERROR,
    fatal: hilog.LogLevel.FATAL,
};
export class Logger {
    private static prefix: string = SDKConfig.TAG;
    private static _logEnable: boolean = false;
    public static set logEnable(z190: boolean) {
        Logger._logEnable = z190;
    }
    public static get logEnable(): boolean {
        return Logger._logEnable || SDKConfig.debugEnable;
    }
    public static setPrefix(y190: string) {
        this.prefix = "[RXSDK." + y190 + "] ";
    }
    static d(w190, ...x190: ESObject) {
        Logger.debug(w190, ...x190);
    }
    static i(u190, ...v190: ArgType) {
        Logger.info(u190, ...v190);
    }
    static w(s190, ...t190: ArgType) {
        Logger.warn((s190), ...t190);
    }
    static e(q190, ...r190: ArgType) {
        Logger.error(q190, ...r190);
    }
    public static log(o190, ...p190: ArgType) {
        hilog.info(LOG_DOMAIN, this.prefix, o190, ...p190);
    }
    public static isLoggable(m190: hilog.LogLevel | LogLevel) {
        const n190 = typeof m190 === "string" ? LogLevelMap[m190] ?? null : m190;
        if (n190 === null) {
            return false;
        }
        else if ((n190 < hilog.LogLevel.WARN) && !Logger.logEnable) {
            return false;
        }
        return hilog.isLoggable(LOG_DOMAIN, this.prefix, n190);
    }
    private static logMessage(h190: LogLevel, i190: any, ...j190: ArgType) {
        if ((h190 === "info" || h190 === "debug") && !Logger.logEnable) {
            return;
        }
        const k190 = Logger.formatMessage(i190, j190);
        j190 = j190.map(l190 => {
            if (typeof l190 === "number") {
                return l190;
            }
            else {
                return this.toString(l190);
            }
        });
        hilog[h190]?.(LOG_DOMAIN, this.prefix, k190, ...j190);
    }
    public static info(f190, ...g190: ArgType) {
        Logger.logMessage("info", f190, ...g190);
    }
    public static debug(y189, ...z189: ArgType) {
        if (!Logger.logEnable) {
            return;
        }
        const a190 = 3000;
        y189 = this.formatMessage(y189, z189);
        z189 = z189.map(e190 => {
            if (typeof e190 === "number") {
                return e190;
            }
            else {
                return this.toString(e190);
            }
        });
        if (y189.length >= a190) {
            const b190 = Math.ceil(y189.length / a190);
            for (let c190 = 0; c190 < b190; c190++) {
                const d190 = y189.slice(c190 * a190, (c190 + 1) * a190);
                if (c190 === b190 - 1) {
                    hilog.debug(LOG_DOMAIN, this.prefix, d190, ...z189);
                }
                else {
                    hilog.debug(LOG_DOMAIN, this.prefix, d190);
                }
            }
        }
        else {
            hilog.debug(LOG_DOMAIN, this.prefix, y189, ...z189);
        }
    }
    public static warn(w189, ...x189: ArgType) {
        Logger.logMessage("warn", w189, ...x189);
    }
    public static error(u189, ...v189: ArgType) {
        Logger.logMessage("error", u189, ...v189);
    }
    public static log4Json(q189, ...r189: ArgType) {
        if (!Logger.logEnable) {
            return;
        }
        let s189 = [];
        for (let t189 of r189) {
            s189.push(JSON.stringify(t189));
        }
        hilog.debug(LOG_DOMAIN, this.prefix, q189 + s189);
    }
    public static printJsonObj(n189) {
        if (!Logger.logEnable) {
            return;
        }
        let o189 = JSON.stringify(n189, null, 4);
        for (let p189 = 0; p189 < o189.length / 512; p189++) {
            hilog.debug(LOG_DOMAIN, this.prefix, o189.slice(p189 * 512, (p189 + 1) * 512));
        }
    }
    static toString(m189: any): string {
        if (typeof m189 == 'object' && m189 !== null) {
            return Objects.stringify(m189);
        }
        else {
            return m189;
        }
    }
    private static formatMessage(g189: any, h189: ArgType): string {
        let i189 = this.toString(g189) || "";
        const j189 = (i189.match(/%\{(public|private)\}[sd]/g) || []).length;
        if (h189.length > j189) {
            const k189 = h189.slice(j189)
                .map(l189 => (typeof l189 === "number" ? "%{public}d" : "%{public}s"))
                .join(" ");
            i189 = `${i189} ${k189}`;
        }
        return i189;
    }
}
