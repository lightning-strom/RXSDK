import { Logger } from "../../utils/Logger";

export class NearbyLog {
  public static info(format: ESObject, ...args: ESObject[]): void {
    Logger.info("nearby->", format, ...args)
  }

  public static error(format: ESObject, ...args: ESObject[]): void {
    Logger.error("nearby->", format, ...args)
  }
}