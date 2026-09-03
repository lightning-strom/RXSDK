import { hilog } from '@kit.PerformanceAnalysisKit';
import SDKConfig from '../sdk/SDKConfig';
import Objects from './Objects';

const LOG_DOMAIN = 0x0ffe;
type ArgType = (string | number) []
type LogLevel = "debug" | "info" | "warn" | "error" | "fatal"
const LogLevelMap: Record<string, hilog.LogLevel> = {
  debug: hilog.LogLevel.DEBUG,
  info: hilog.LogLevel.INFO,
  warn: hilog.LogLevel.WARN,
  error: hilog.LogLevel.ERROR,
  fatal: hilog.LogLevel.FATAL,
};

export  class Logger {
  private static prefix: string = SDKConfig.TAG;
  private static _logEnable: boolean = false;

  public static set logEnable(value: boolean) {
    Logger._logEnable = value;
  }

  public static get logEnable(): boolean {
    return Logger._logEnable || SDKConfig.debugEnable;
  }

  public static setPrefix(module: string) {
    this.prefix = "[RXSDK." + module + "] ";
  }

  static d(message, ...args: ESObject) {
    Logger.debug(message, ...args)
  }

  static i(message, ...args: ArgType) {
    Logger.info(message, ...args);
  }

  static w(message, ...args: ArgType) {
    Logger.warn((message), ...args)
  }

  static e(message, ...args: ArgType) {
    Logger.error(message, ...args)
  }

  public static log(message, ...args: ArgType) {
    hilog.info(LOG_DOMAIN, this.prefix, message, ...args);
  }

  public static isLoggable(level: hilog.LogLevel | LogLevel) {
    const hilogLevel = typeof level === "string" ? LogLevelMap[level] ?? null : level;
    if (hilogLevel === null) {
      return false;
    } else if ((hilogLevel < hilog.LogLevel.WARN) && !Logger.logEnable) {
      return false;
    }
    return hilog.isLoggable(LOG_DOMAIN, this.prefix, hilogLevel);
  }

  private static logMessage(level: LogLevel, message: any, ...args: ArgType) {
    if ((level === "info" || level === "debug") && !Logger.logEnable) {
      return;
    }
    const formattedMessage = Logger.formatMessage(message, args);
    args = args.map(arg => {
      if (typeof arg === "number") {
        return arg;
      } else {
        return this.toString(arg);
      }
    });
    hilog[level]?.(LOG_DOMAIN, this.prefix, formattedMessage, ...args);
  }

  public static info(message, ...args: ArgType) {
    Logger.logMessage("info", message, ...args);
  }

  public static debug(message, ...args: ArgType) {
    if (!Logger.logEnable) {
      return
    }
    const len = 3000; // 系统说明 4096，实际大约 3583
    message = this.formatMessage(message, args);
    args = args.map(arg => {
      if (typeof arg === "number") {
        return arg;
      } else {
        return this.toString(arg);
      }
    });
    if (message.length >= len) {
      const chunks = Math.ceil(message.length / len);
      for (let i = 0; i < chunks; i++) {
        const partMessage = message.slice(i * len, (i + 1) * len);
        if (i === chunks - 1) {
          hilog.debug(LOG_DOMAIN, this.prefix, partMessage, ...args);
        } else {
          hilog.debug(LOG_DOMAIN, this.prefix, partMessage);
        }
      }
    } else {
      hilog.debug(LOG_DOMAIN, this.prefix, message, ...args);
    }
  }

  public static warn(message, ...args: ArgType) {
    Logger.logMessage("warn", message, ...args);
  }

  public static error(message, ...args: ArgType) {
    Logger.logMessage("error", message, ...args);
  }


  public static log4Json(message, ...args: ArgType) {
    if (!Logger.logEnable) {
      return
    }
    let args4Json = []
    for (let arg of args) {
      args4Json.push(JSON.stringify(arg))
    }
    hilog.debug(LOG_DOMAIN, this.prefix, message + args4Json)
  }

  public static printJsonObj(obj) {
    if (!Logger.logEnable) {
      return
    }
    let str = JSON.stringify(obj, null, 4);
    for (let i = 0; i < str.length / 512; i++) {
      hilog.debug(LOG_DOMAIN, this.prefix, str.slice(i * 512, (i + 1) * 512));
    }
  }

  static toString(message: any): string {
    if (typeof message == 'object' && message !== null) {
      return Objects.stringify(message)
    } else {
      return message
    }
  }

  private static formatMessage(message: any, args: ArgType): string {
    let formattedMessage = this.toString(message) || "";
    const placeholderCount = (formattedMessage.match(/%\{(public|private)\}[sd]/g) || []).length;
    if (args.length > placeholderCount) {
      const additionalPlaceholders = args
        .slice(placeholderCount)
        .map(arg => (typeof arg === "number" ? "%{public}d" : "%{public}s"))
        .join(" ");

      formattedMessage = `${formattedMessage} ${additionalPlaceholders}`;
    }

    return formattedMessage;
  }
}


