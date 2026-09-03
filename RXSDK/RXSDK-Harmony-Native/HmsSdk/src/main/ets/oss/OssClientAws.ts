import Http from '../net/http'
import Path from '../net/Path'
import { RequestMethod } from '../net/RXRequest'
import { RCallback, RXResult } from '../types/Index'
import { CryptoUtil } from '../utils/CryptoUtil'
import { Logger } from '../utils/Logger'
import { CredentialsBean, OssClient, OssConfigBean } from './OssClient'


export default class OssClientAws extends OssClient {
  generateOSSHeaders(c: OssConfigBean, objectKey: string): Record<string, string> {
    return;
  }
}
