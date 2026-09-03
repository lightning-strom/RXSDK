import type { IHadoop } from '../types/Index';
import type { Context } from "@ohos:abilityAccessCtrl";
import BaseTracer from "@normalized:N&&&hmssdk/src/main/ets/base/BaseTracer&4.0.0";
const PREFERENCES_KEY: string = 'data_cache';
const RX_DATA_CACHE: string = '"rx_data_cache"';
class Hadoop extends BaseTracer implements IHadoop {
    get cacheKey(): any {
        return PREFERENCES_KEY;
    }
    get preferencesName(): any {
        return RX_DATA_CACHE;
    }
    constructor(b13?: Context) {
        super(b13);
    }
}
export default new Hadoop();
