// // 示例用法：
// const url = new URL("https://example.com:8080/path?query=value#section");
// console.log(url.protocol);  // 输出: "https"
// console.log(url.host);      // 输出: "example.com"
// console.log(url.port);      // 输出: "8080"
// console.log(url.pathname);  // 输出: "/path"
// console.log(url.search);    // 输出: "?query=value"
// console.log(url.hash);      // 输出: "#section"
// console.log(url.searchParams); // 输出: { query: "value" }
// console.log(url.toString()); // 输出: "https://example.com:8080/path?query=value#section"
export default class URL {
  private urlString: string;
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  searchParams: Record<string, string>;
  hash: string;

  constructor(urlString: string) {
    this.urlString = urlString;

    // 匹配 URL 的正则表达式，支持 http 和 https
    const urlRegex = /^(https?):\/\/([^\/:?#]+)(:\d+)?(\/[^?#]*)?(\?[^#]*)?(#.*)?$/i;
    const match = urlString.match(urlRegex);

    if (!match) {
      console.log(urlString);
      throw new Error(`Invalid URL: ${urlString}`);
    }

    this.protocol = match[1]; // http 或 https
    this.host = match[2] || '';
    this.port = match[3] ? match[3].slice(1) : ''; // 去掉冒号
    this.hostname = this.host.split(':')[0]; // 去掉端口号
    this.pathname = match[4] || '/'; // 默认路径为 '/'
    this.search = match[5] || '';
    this.hash = match[6] || '';
    this.searchParams = this.parseSearchParams(this.search);
  }

  private parseSearchParams(search: string): Record<string, string> {
    const params: Record<string, string> = {};
    if (search.startsWith('?')) {
      const pairs = search.slice(1).split('&');
      for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key) {
          params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
        }
      }
    }
    return params;
  }

  toString(): string {
    let result = '';
    if (this.protocol) {
      result += `${this.protocol}://`;
    }
    if (this.host) {
      result += this.host;
    }
    if (this.port) {
      result += `:${this.port}`;
    }
    result += this.pathname;
    if (this.search) {
      result += this.search;
    }
    if (this.hash) {
      result += this.hash;
    }
    return result;
  }
}

