import { CryptoUtil } from '../utils/CryptoUtil';
import URL from '../utils/URL';
import { CredentialsBean } from './OssClient';

export default class TencentOssSigner {
  static generateSignature(
    headers: Record<string, string>,
    signHeaders: Set<string>,
    credentials: CredentialsBean,
    url: URL
  ): string {
    const keyTime = `${credentials.start_unix_time};${credentials.expiration_unix_time}`;
    const authorization = [];

    const map: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(headers)) {
      map[key] = [value];
    }
    const source = this.source(map, signHeaders, url, keyTime);
    const signKey = this.getSignKey(credentials.access_key_secret, keyTime);
    const signature = this.hmacSha1(source, signKey);
    authorization.push(`q-sign-algorithm=sha1`);
    authorization.push(`q-ak=${credentials.access_key_id}`);
    authorization.push(`q-sign-time=${keyTime}`);
    authorization.push(`q-key-time=${keyTime}`);
    authorization.push(`q-header-list=${this.getRealHeaderList(signHeaders).toLowerCase()}`);
    authorization.push(`q-url-param-list=`);
    authorization.push(`q-signature=${signature}`);

    return authorization.join('&');
  }

  private static source(
    headers: Record<string, string[]>,
    signHeaders: Set<string>,
    url: URL,
    keyTime: string
  ): string {
    const formatString: string[] = [];
    formatString.push('put');
    formatString.push(decodeURIComponent(url.pathname));
    formatString.push('');
    const headerString = this.headersStringForKeys(headers, signHeaders);
    formatString.push(headerString);

    let sha1Source = formatString.join('\n') + "\n";
    const stringToSign: string[] = [];
    stringToSign.push('sha1');
    stringToSign.push(keyTime);
    stringToSign.push(this.sha1(sha1Source));

    return stringToSign.join('\n') + "\n";
  }

  private static getSignKey(secretKey: string, keyTime: string): string {
    return this.hmacSha1(keyTime, secretKey);
  }

  private static getRealHeaderList(signHeaders: Set<string>): string {
    return this.sortAndJoinSemicolon(signHeaders);
  }

  private static sortAndJoinSemicolon(values: Set<string>): string {
    if (!values) {
      return '';
    }

    const sortedValues = Array.from(values).sort();
    return sortedValues.join(';');
  }

  private static headersStringForKeys(
    headers: Record<string, string[]>,
    keys: Set<string>
  ): string {
    const orderKeys = Array.from(keys)
      .map((key) => encodeURIComponent(key).toLowerCase())
      .sort();

    const headerNames = Object.keys(headers).reduce((map, key) => {
      map[key.toLowerCase()] = key;
      return map;
    }, {} as Record<string, string>);

    const out: string[] = [];
    for (const key of orderKeys) {
      const originalKey = headerNames[key];
      const values = headers[originalKey];
      if (values) {
        for (const value of values) {
          out.push(`${key}=${encodeURIComponent(value)}`);
        }
      }
    }
    return out.join('&');
  }

  private static sha1(data: string): string {
    // return crypto.createHash('sha1').update(data).digest('hex');
    return CryptoUtil.sha1Sync(data).toLowerCase()
  }

  private static hmacSha1(data: string, key: string): string {
    return CryptoUtil.hmacSha1StringSync(data, key, 'hex')
  }
}