class UrlUtil {
  getHostFromUrl(url: string): string {
    const match = url.match(/^(?:https?:\/\/)?([^\/:?#]+)(?:[\/:?#]|$)/i);
    return match ? match[1] : "";
  }

  public toQueryString(obj: string | object | ArrayBuffer): string {
    if (obj == null) {
      return ""
    }
    if (typeof obj !== 'object') {
      return String(obj);
    }
    if (obj instanceof ArrayBuffer) {
      const uint8Array = new Uint8Array(obj);
      const hexString = Array.from(uint8Array)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
      return hexString;
    } else if (obj instanceof Map) {
      let queryString = [];
      obj.forEach((value, key) => {
        // 数组值需要特殊处理
        let valueStr = Array.isArray(value) ? value.map(item => encodeURIComponent(item)).join(',') : encodeURIComponent(value);
        queryString.push(`${encodeURIComponent(key)}=${valueStr}`);
      });
      return queryString.join('&');
    } else {

      return Object.keys(obj)
        .map(key => {
          const value = obj[key];
          // 检查值是否为 undefined，如果是则返回 null
          if (value === undefined) {
            // console.log(`ignored ${key} : ${value}`);
            return null;
          }
          let valueStr = Array.isArray(value) ? value.map(item => encodeURIComponent(item)).join(',') : encodeURIComponent(value);
          if (valueStr) {
            return `${encodeURIComponent(key)}=${valueStr}`;
          } else {
            // console.log(`ignored ${key} : ${valueStr}`);
            return null;
          }
        })
        .filter(item => item !== null)
        .join('&');
    }
  }

  public joinQuery(url: string, query: string | object | ArrayBuffer) {
    const queryString = this.toQueryString(query);
    if (queryString) {
      // 检查 URL 是否已经包含查询参数
      if (url.indexOf('?') === -1) {
        url += '?';
      } else if (!url.endsWith('&')) {
        url += '&';
      }
      url += queryString;
    }
    return url
  }

  public isHttpUrl(url: string): boolean {
    if (!url) {
      return false;
    }
    // 使用正则表达式匹配 HTTP(S) URL
    const httpRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
    return httpRegex.test(url);
  }

  // 获取 URL 的路径部分
  getPathFromUrl(url) {
    const match = url.match(/^(?:https?:\/\/[^\/]+)?([^?#]*)/i);
    return match ? match[1] : "";
  }

  // 获取 URL 的协议部分
  getProtocolFromUrl(url) {
    const match = url.match(/^([a-z]+):\/\//i);
    return match ? match[1] : "";
  }

  // 从 URL 中移除指定的查询参数
  removeQueryParam(url, paramName) {
    const urlParts = url.split('?');
    if (urlParts.length < 2) {
      return url;
    }
    const baseUrl = urlParts[0];
    const queryString = urlParts[1];
    const params = queryString.split('&');
    const newParams = params.filter(param => {
      const key = param.split('=')[0];
      return key !== paramName;
    });
    if (newParams.length === 0) {
      return baseUrl;
    }
    return `${baseUrl}?${newParams.join('&')}`;
  }

  // 从查询字符串中获取指定参数的值
  getQueryParamValue(queryString, paramName) {
    const params = queryString.split('&');
    for (const param of params) {
      const [key, value] = param.split('=');
      if (key === paramName) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }
}

export default new UrlUtil()