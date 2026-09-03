import { IHadoop } from '../types/Index';
import { Context } from '@kit.AbilityKit';
import BaseTracer from './BaseTracer';

const PREFERENCES_KEY: string = 'data_cache'
const RX_DATA_CACHE: string = '"rx_data_cache"'

class Hadoop extends BaseTracer implements IHadoop {
  get cacheKey(): any {
    return PREFERENCES_KEY
  }

  get preferencesName(): any {
    return RX_DATA_CACHE
  }

  constructor(context?: Context) {
    super(context)
  }
}

export default new Hadoop()

