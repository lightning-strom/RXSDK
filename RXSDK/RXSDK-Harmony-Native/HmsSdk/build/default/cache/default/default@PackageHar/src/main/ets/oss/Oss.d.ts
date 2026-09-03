import { RCallback, RXResult } from '../types/Index';
import { OssConfigBean } from './OssClient';
import { Context } from "@ohos.abilityAccessCtrl";
declare class Oss {
    config: OssConfigBean;
    getConfigData(v62?: RCallback<OssConfigBean>): Promise<RXResult<OssConfigBean>>;
    uploadData(n62: ArrayBuffer, o62: string, p62?: RCallback): Promise<RXResult<object>>;
    uploadFile(h62: Context, i62: string, j62?: string, k62?: RCallback): Promise<RXResult<object>>;
}
declare const _default: Oss;
export default _default;
