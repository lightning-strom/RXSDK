import { IHadoop } from '../types/Index';
import { Context } from "@ohos.abilityAccessCtrl";
import BaseTracer from './BaseTracer';
declare class Hadoop extends BaseTracer implements IHadoop {
    get cacheKey(): any;
    get preferencesName(): any;
    constructor(b13?: Context);
}
declare const _default: Hadoop;
export default _default;
