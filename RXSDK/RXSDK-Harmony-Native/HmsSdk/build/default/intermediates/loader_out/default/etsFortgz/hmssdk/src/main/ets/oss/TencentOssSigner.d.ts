import URL from '../utils/URL';
import { CredentialsBean } from './OssClient';
export default class TencentOssSigner {
    static generateSignature(p65: Record<string, string>, q65: Set<string>, r65: CredentialsBean, s65: URL): string;
    private static source;
    private static getSignKey;
    private static getRealHeaderList;
    private static sortAndJoinSemicolon;
    private static headersStringForKeys;
    private static sha1;
    private static hmacSha1;
}
