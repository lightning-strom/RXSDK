import { OssClient, OssConfigBean } from './OssClient';
export default class OssClientTencent extends OssClient {
    generateOSSHeaders(b64: OssConfigBean, c64: string, d64: ArrayBuffer): Record<string, string>;
}
