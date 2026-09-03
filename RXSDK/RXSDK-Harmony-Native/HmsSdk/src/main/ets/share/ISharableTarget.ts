import { ShareParams } from "../types/Index";
import { Context } from "@kit.AbilityKit";

export interface IShareTarget {
  doShare(params: ShareParams, context?: Context): Promise<void>

}
