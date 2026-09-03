import Func from "../utils/Func";
import { RXApi } from "./RXIndex";

export class RXSDK {
  async init(args: string): Promise<string> {
    return Func.call(() => RXApi.getInstance().init(JSON.parse(args)));
  }

  async login(args: string): Promise<string> {
    return Func.call(() => RXApi.getInstance().login(JSON.parse(args)));
  }

}
